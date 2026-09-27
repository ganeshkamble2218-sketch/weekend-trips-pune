import {
  bookingKey, hmacSha256, json, lockKey, options, razorpay,
  redis, safeEqualHex, bookSeats
} from './_lib.mjs';

export default async function handler(request) {
  if (request.method === 'OPTIONS') return options();
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid request' }, 400); }

  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = body || {};
  if (!orderId || !paymentId || !signature) return json({ error: 'Missing payment details' }, 400);

  try {
    const bookingRaw = await redis(['GET', bookingKey(orderId)]);
    if (!bookingRaw) return json({ error: 'Booking session expired. Please start again.' }, 410);
    const booking = typeof bookingRaw === 'string' ? JSON.parse(bookingRaw) : bookingRaw;

    const expected = hmacSha256(`${orderId}|${paymentId}`, process.env.RAZORPAY_KEY_SECRET);
    if (!safeEqualHex(expected, signature)) return json({ error: 'Payment verification failed' }, 400);

    const payment = await razorpay(`payments/${encodeURIComponent(paymentId)}`);
    if (payment.order_id !== orderId || payment.status !== 'captured' || payment.amount !== booking.amount || payment.currency !== 'INR') {
      return json({ error: 'Payment is not captured for this booking.' }, 400);
    }

    const lockKeys = booking.seats.map(seat => lockKey(booking.trip, booking.date, seat));
    const locks = await redis(['MGET', ...lockKeys]);
    if (locks.some(v => v !== booking.token)) {
      return json({ error: 'Seat reservation expired or changed. Please contact us before making another payment.' }, 409);
    }

    const booked = await bookSeats(booking.trip, booking.date, booking.seats, orderId);
    if (booked !== 1) return json({ error: 'A selected seat was already booked. Please contact us immediately for payment resolution.' }, 409);

    await redis([
      'SET', bookingKey(orderId), JSON.stringify({
        ...booking,
        paymentId,
        status: 'paid',
        paidAt: new Date().toISOString()
      }), 'EX', 365 * 24 * 60 * 60
    ]);
    await redis(['DEL', ...lockKeys]);

    return json({
      success: true,
      booking: {
        trip: booking.trip,
        date: booking.date,
        seats: booking.seats,
        name: booking.name,
        phone: booking.phone,
        pickup: booking.pickup,
        amount: booking.amount / 100,
        paymentId
      }
    });
  } catch (e) {
    return json({ error: e.message || 'Could not verify payment' }, 500);
  }
}

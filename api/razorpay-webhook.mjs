import { hmacSha256, json, lockKey, options, redis, seatKey } from './_lib.mjs';

export async function POST(request) {
  const raw = await request.text();
  const signature = request.headers.get('x-razorpay-signature') || '';
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
  if (!secret || !signature || hmacSha256(raw, secret) !== signature) {
    return json({ error: 'Invalid webhook signature' }, 401);
  }

  try {
    const event = JSON.parse(raw);
    if (event?.event !== 'payment.captured') return json({ received: true });

    const payment = event.payload?.payment?.entity;
    const orderId = payment?.order_id;
    if (!orderId) return json({ received: true });

    const bookingRaw = await redis(['GET', `wtp:booking:${orderId}`]);
    if (!bookingRaw) return json({ received: true });

    const booking = typeof bookingRaw === 'string' ? JSON.parse(bookingRaw) : bookingRaw;
    if (booking.status === 'paid') return json({ received: true });

    if (payment.amount !== booking.amount || payment.currency !== 'INR') return json({ received: true });

    const locks = await redis(['MGET', ...booking.seats.map(seat => lockKey(booking.trip, booking.date, seat))]);
    if (locks.some(v => v !== booking.token)) return json({ received: true });

    const bookedKeys = booking.seats.map(seat => seatKey(booking.trip, booking.date, seat));
    const command = ['MSETEX', bookedKeys.length];
    for (const key of bookedKeys) command.push(key, orderId);
    command.push('NX');
    const result = await redis(command);

    if (result === 1) {
      await redis(['DEL', ...booking.seats.map(seat => lockKey(booking.trip, booking.date, seat))]);
      await redis(['SET', `wtp:booking:${orderId}`, JSON.stringify({
        ...booking,
        paymentId: payment.id,
        status: 'paid',
        paidAt: new Date().toISOString()
      }), 'EX', 365 * 24 * 60 * 60]);
    }

    return json({ received: true });
  } catch (e) {
    return json({ error: e.message || 'Webhook processing failed' }, 500);
  }
}

export async function OPTIONS() {
  return options();
}

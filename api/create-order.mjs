import {
  TRIP_PRICES, bookingKey, json, options, razorpay, redis,
  reserveSeats, seatKey, validateBookingInput
} from './_lib.mjs';

export async function POST(request) {
  let input;
  try {
    input = validateBookingInput(await request.json());
  } catch (e) {
    return json({ error: e.message || 'Invalid booking' }, 400);
  }

  const token = crypto.randomUUID();
  try {
    const reserved = await reserveSeats(input.trip, input.date, input.seats, token);
    if (reserved !== 1) return json({ error: 'One or more selected seats were just taken. Please choose again.' }, 409);

    const amount = input.seats.length * TRIP_PRICES[input.trip] * 100;
    let order;
    try {
      order = await razorpay('orders', {
        method: 'POST',
        body: {
          amount,
          currency: 'INR',
          receipt: `WTP-${Date.now()}`,
          notes: {
            trip: input.trip,
            date: input.date,
            seats: input.seats.join(','),
            name: input.name,
            phone: input.phone
          }
        }
      });
    } catch (e) {
      await redis(['DEL', ...input.seats.map(seat => `wtp:lock:${encodeURIComponent(input.trip)}:${input.date}:${seat}`)]);
      throw e;
    }

    await redis(['SET', bookingKey(order.id), JSON.stringify({
      ...input,
      orderId: order.id,
      amount,
      token,
      status: 'created',
      createdAt: new Date().toISOString()
    }), 'EX', 45 * 60]);

    return json({
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount,
      currency: 'INR',
      trip: input.trip,
      date: input.date,
      seats: input.seats
    });
  } catch (e) {
    return json({ error: e.message || 'Could not create payment order' }, 500);
  }
}

export async function OPTIONS() {
  return options();
}

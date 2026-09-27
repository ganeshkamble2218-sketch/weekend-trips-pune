import crypto from 'node:crypto';
import {
  TRIP_PRICES, bookingKey, json, options, razorpay, redis,
  reserveSeats, validateBookingInput
} from './_lib.mjs';

export default async function handler(request) {
  if (request.method === 'OPTIONS') return options();
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let input;
  try {
    input = validateBookingInput(await request.json());
    const day = new Date(input.date + 'T00:00:00').getDay();
    if (day !== 0 && day !== 6) throw new Error('Trips are available Saturday and Sunday only');
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

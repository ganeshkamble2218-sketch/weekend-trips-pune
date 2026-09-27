import crypto from 'node:crypto';

export const TRIP_PRICES = {
  'Kaas Pathar': 1499,
  'Kokan': 1050,
  'Matheran': 999,
  'Mahabaleshwar': 1000
};
export const MAX_SEAT = 19;
export const LOCK_SECONDS = 30 * 60;

export function corsHeaders(extra = {}) {
  return {
    'Access-Control-Allow-Origin': 'https://ganeshkamble2218-sketch.github.io',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Razorpay-Signature',
    'Cache-Control': 'no-store',
    ...extra
  };
}

export function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(extra) }
  });
}

export function options() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export function requireEnv(...names) {
  for (const name of names) {
    if (!process.env[name]) throw new Error(`Missing environment variable: ${name}`);
  }
}

export async function redis(command) {
  requireEnv('UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN');
  const r = await fetch(process.env.UPSTASH_REDIS_REST_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(command)
  });
  const data = await r.json();
  if (!r.ok || data.error) throw new Error(data.error || 'Redis request failed');
  return data.result;
}

export function seatKey(trip, date, seat) {
  return `wtp:booked:${encodeURIComponent(trip)}:${date}:${seat}`;
}
export function lockKey(trip, date, seat) {
  return `wtp:lock:${encodeURIComponent(trip)}:${date}:${seat}`;
}
export function bookingKey(orderId) {
  return `wtp:booking:${orderId}`;
}

export function validateBookingInput(body) {
  const trip = String(body?.trip || '');
  const date = String(body?.date || '');
  const name = String(body?.name || '').trim().slice(0, 80);
  const phone = String(body?.phone || '').replace(/\\D/g, '').slice(0, 15);
  const pickup = String(body?.pickup || '').trim().slice(0, 160);
  const seats = Array.isArray(body?.seats)
    ? [...new Set(body.seats.map(Number).filter(Number.isInteger))].sort((a,b)=>a-b)
    : [];

  if (!TRIP_PRICES[trip]) throw new Error('Invalid destination');
  if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(date)) throw new Error('Invalid travel date');
  if (!name || phone.length < 10 || !pickup) throw new Error('Name, mobile number and pickup are required');
  if (!seats.length || seats.some(n => n < 1 || n > MAX_SEAT)) throw new Error('Invalid seat selection');

  return { trip, date, name, phone, pickup, seats };
}

export function hmacSha256(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

export function safeEqualHex(a, b) {
  try {
    const aa = Buffer.from(a, 'hex');
    const bb = Buffer.from(b, 'hex');
    return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
  } catch {
    return false;
  }
}

export async function razorpay(path, { method = 'GET', body } = {}) {
  requireEnv('RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET');
  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
  const r = await fetch(`https://api.razorpay.com/v1/${path}`, {
    method,
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error?.description || 'Razorpay request failed');
  return data;
}

export async function reserveSeats(trip, date, seats, token) {
  const keys = seats.map(seat => lockKey(trip, date, seat));
  const script = "for i,key in ipairs(KEYS) do if redis.call('EXISTS',key) == 1 then return 0 end end for i,key in ipairs(KEYS) do redis.call('SET',key,ARGV[1],'EX',ARGV[2]) end return 1";
  return redis(['EVAL', script, String(keys.length), ...keys, token, String(LOCK_SECONDS)]);
}

export async function bookSeats(trip, date, seats, orderId) {
  const keys = seats.map(seat => seatKey(trip, date, seat));
  const script = "for i,key in ipairs(KEYS) do if redis.call('EXISTS',key) == 1 then return 0 end end for i,key in ipairs(KEYS) do redis.call('SET',key,ARGV[1],'EX',ARGV[2]) end return 1";
  return redis(['EVAL', script, String(keys.length), ...keys, orderId, String(365 * 24 * 60 * 60)]);
}

export async function bookedAndLockedSeats(trip, date) {
  const bookedKeys = Array.from({length: MAX_SEAT}, (_,i)=>seatKey(trip,date,i+1));
  const lockKeys = Array.from({length: MAX_SEAT}, (_,i)=>lockKey(trip,date,i+1));
  const [booked, locked] = await Promise.all([
    redis(['MGET', ...bookedKeys]),
    redis(['MGET', ...lockKeys])
  ]);
  return {
    bookedSeats: booked.map((v,i)=>v ? i+1 : null).filter(Boolean),
    lockedSeats: locked.map((v,i)=>v ? i+1 : null).filter(Boolean)
  };
}

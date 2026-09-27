import { bookedAndLockedSeats, json, options } from './_lib.mjs';

export default async function handler(request) {
  if (request.method === 'OPTIONS') return options();
  if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405);

  try {
    const url = new URL(request.url);
    const trip = url.searchParams.get('trip') || '';
    const date = url.searchParams.get('date') || '';
    if (!trip || !date) return json({ error: 'trip and date are required' }, 400);
    return json(await bookedAndLockedSeats(trip, date));
  } catch (e) {
    return json({ error: e.message || 'Could not load seats' }, 500);
  }
}

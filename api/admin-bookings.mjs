import crypto from 'node:crypto';
import { json, options, redis } from './_lib.mjs';

function secret() {
  if (!process.env.ADMIN_PASSWORD) throw new Error('Missing environment variable: ADMIN_PASSWORD');
  return process.env.ADMIN_PASSWORD;
}

function cookieToken() {
  const raw = 'weekend-trips-admin';
  return crypto.createHmac('sha256', secret()).update(raw).digest('hex');
}

function isAuthed(request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|;\\s*)wtp_admin=([^;]+)/);
  return match && crypto.timingSafeEqual(Buffer.from(match[1]), Buffer.from(cookieToken()));
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (body?.username !== (process.env.ADMIN_USERNAME || 'admin') || body?.password !== secret()) {
      return json({ error: 'Invalid username or password' }, 401);
    }
    return json({ success: true }, 200, {
      'Set-Cookie': `wtp_admin=${cookieToken()}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
    });
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }
}

export async function GET(request) {
  if (!isAuthed(request)) return json({ error: 'Unauthorized' }, 401);
  try {
    let cursor = '0';
    const bookings = [];
    do {
      const scan = await redis(['SCAN', cursor, 'MATCH', 'wtp:booking:*', 'COUNT', '100']);
      cursor = String(scan?.[0] ?? '0');
      const keys = scan?.[1] || [];
      if (keys.length) {
        const values = await redis(['MGET', ...keys]);
        for (let i = 0; i < values.length; i++) {
          if (!values[i]) continue;
          try {
            const item = typeof values[i] === 'string' ? JSON.parse(values[i]) : values[i];
            bookings.push(item);
          } catch {}
        }
      }
    } while (cursor !== '0');

    bookings.sort((a,b) => String(b.paidAt || b.createdAt || '').localeCompare(String(a.paidAt || a.createdAt || '')));
    return json({ bookings });
  } catch (e) {
    return json({ error: e.message || 'Could not load bookings' }, 500);
  }
}

export async function OPTIONS() {
  return options();
}

import crypto from 'node:crypto';
import { redis } from './_lib.mjs';

function secret() {
  if (!process.env.ADMIN_PASSWORD) throw new Error('Missing environment variable: ADMIN_PASSWORD');
  return process.env.ADMIN_PASSWORD;
}

function cookieToken() {
  return crypto.createHmac('sha256', secret()).update('weekend-trips-admin').digest('hex');
}

function isAuthed(req) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/(?:^|;\s*)wtp_admin=([^;]+)/);
  if (!match) return false;
  const expected = cookieToken();
  return match[1].length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(match[1]), Buffer.from(expected));
}

function send(res, data, status=200, headers={}) {
  res.statusCode = status;
  for (const [k,v] of Object.entries(headers)) res.setHeader(k,v);
  res.setHeader('Content-Type','application/json');
  res.setHeader('Cache-Control','no-store');
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve,reject)=>{
    let raw='';
    req.on('data', chunk => raw += chunk);
    req.on('end', ()=>{
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  try {
    if (req.method === 'OPTIONS') return send(res, {}, 204);
    if (req.method === 'POST') {
      const body = await readBody(req);
      if (body?.username !== (process.env.ADMIN_USERNAME || 'admin') || body?.password !== secret()) {
        return send(res, { error: 'Invalid username or password' }, 401);
      }
      res.setHeader('Set-Cookie', `wtp_admin=${cookieToken()}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`);
      return send(res, { success: true });
    }
    if (req.method === 'GET') {
      if (!isAuthed(req)) return send(res, { error: 'Unauthorized' }, 401);
      let cursor='0';
      const bookings=[];
      do {
        const scan=await redis(['SCAN',cursor,'MATCH','wtp:booking:*','COUNT','100']);
        cursor=String(scan?.[0] ?? '0');
        const keys=scan?.[1] || [];
        if(keys.length){
          const values=await redis(['MGET',...keys]);
          for(let i=0;i<values.length;i++){
            if(!values[i]) continue;
            try { bookings.push(typeof values[i]==='string' ? JSON.parse(values[i]) : values[i]); } catch {}
          }
        }
      } while(cursor!=='0');
      bookings.sort((a,b)=>String(b.paidAt||b.createdAt||'').localeCompare(String(a.paidAt||a.createdAt||'')));
      return send(res,{bookings});
    }
    return send(res,{error:'Method not allowed'},405);
  } catch(e) {
    return send(res,{error:e.message||'Server error'},500);
  }
}

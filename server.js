const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

const PORT = Number(process.env.PORT || 3000);
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Wtp@2026#Pune';
const SESSION_SECRET = process.env.SESSION_SECRET || 'change-this-session-secret';
const MERCHANT_UPI = process.env.MERCHANT_UPI || 'ganeshk1234567amble-2@oksbi';
const HOLD_MINUTES = Number(process.env.HOLD_MINUTES || 15);

const TRIPS = {
  'Kaas Pathar': 1499,
  'Kokan': 1050,
  'Mahabaleshwar': 999,
  'Matheran': 999
};
const SEATS = 19;
const dataDir = path.join(__dirname, 'data');
const dbFile = path.join(dataDir, 'db.json');
const publicDir = path.join(__dirname, 'public');
fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify({ bookings: [], blockedSeats: {} }, null, 2));

function loadDb(){ return JSON.parse(fs.readFileSync(dbFile, 'utf8')); }
function saveDb(db){ const tmp=dbFile+'.tmp'; fs.writeFileSync(tmp, JSON.stringify(db,null,2)); fs.renameSync(tmp,dbFile); }
function now(){ return new Date(); }
function bookingId(){ return 'WTP' + Date.now().toString().slice(-9) + crypto.randomBytes(2).toString('hex').toUpperCase(); }
function json(res,status,obj){ const body=JSON.stringify(obj); res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}); res.end(body); }
function readBody(req){ return new Promise((resolve,reject)=>{ let b=''; req.on('data',c=>{b+=c;if(b.length>1e6) req.destroy();}); req.on('end',()=>{try{resolve(b?JSON.parse(b):{})}catch(e){reject(e)}}); req.on('error',reject); }); }
function parseCookies(req){ const out={}; (req.headers.cookie||'').split(';').forEach(x=>{const i=x.indexOf('=');if(i>0)out[x.slice(0,i).trim()]=decodeURIComponent(x.slice(i+1).trim())}); return out; }
function sign(v){ return crypto.createHmac('sha256',SESSION_SECRET).update(v).digest('hex'); }
function adminOk(req){ const c=parseCookies(req).admin_session; if(!c)return false; const [v,s]=c.split('.'); return !!v && !!s && crypto.timingSafeEqual(Buffer.from(s),Buffer.from(sign(v))) && v==='admin'; }
function cleanup(db){ const t=Date.now(); let changed=false; for(const b of db.bookings){ if(b.status==='pending' && b.holdUntil && new Date(b.holdUntil).getTime() < t){ b.status='expired'; b.updatedAt=now().toISOString(); changed=true; } } if(changed)saveDb(db); }
function unavailable(db,trip){ cleanup(db); const set=new Set((db.blockedSeats[trip]||[])); for(const b of db.bookings){if(b.trip===trip && (b.status==='pending'||b.status==='confirmed')) set.add(Number(b.seat));} return [...set].sort((a,b)=>a-b); }
function requireTripSeat(trip,seat){ if(!TRIPS[trip]) throw new Error('Invalid trip'); if(!Number.isInteger(seat)||seat<1||seat>SEATS) throw new Error('Invalid seat'); }
async function razor(pathname, options={}){
  const auth=Buffer.from(RAZORPAY_KEY_ID+':'+RAZORPAY_KEY_SECRET).toString('base64');
  const r=await fetch('https://api.razorpay.com/v1'+pathname,{...options,headers:{Authorization:'Basic '+auth,'Content-Type':'application/json',...(options.headers||{})}});
  const text=await r.text(); let data; try{data=JSON.parse(text)}catch{data={raw:text}}; if(!r.ok){const e=new Error(data.error?.description||'Razorpay API error');e.status=r.status;throw e;} return data;
}
function hmacHex(secret,raw){return crypto.createHmac('sha256',secret).update(raw).digest('hex');}
function same(a,b){return typeof a==='string'&&typeof b==='string'&&a.length===b.length&&crypto.timingSafeEqual(Buffer.from(a),Buffer.from(b));}
function publicBooking(b){ const {phone,...rest}=b; return {...rest, phone: phone}; }

async function route(req,res){
  const u=new URL(req.url,'http://localhost');
  if(req.method==='GET' && u.pathname==='/api/trips') return json(res,200,{trips:Object.entries(TRIPS).map(([name,price])=>({name,price}))});
  if(req.method==='GET' && u.pathname==='/api/seats'){
    const trip=u.searchParams.get('trip'); if(!TRIPS[trip])return json(res,400,{error:'Invalid trip'});
    const db=loadDb(); return json(res,200,{trip,unavailable:unavailable(db,trip),seats:SEATS});
  }
  if(req.method==='GET' && u.pathname.startsWith('/api/bookings/')){
    const id=decodeURIComponent(u.pathname.split('/').pop()); const db=loadDb(); cleanup(db); const b=db.bookings.find(x=>x.id===id); if(!b)return json(res,404,{error:'Booking not found'}); return json(res,200,{booking:publicBooking(b)});
  }
  if(req.method==='POST' && u.pathname==='/api/bookings/create'){
    if(!RAZORPAY_KEY_ID||!RAZORPAY_KEY_SECRET)return json(res,503,{error:'Payment gateway is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on the server.'});
    let body; try{body=await readBody(req)}catch{return json(res,400,{error:'Invalid JSON'})}
    const {trip,seat,name,phone,paymentType,amount}=body; try{requireTripSeat(trip,Number(seat));}catch(e){return json(res,400,{error:e.message})}
    if(typeof name!=='string'||name.trim().length<2)return json(res,400,{error:'Enter a valid full name'});
    if(!/^\d{10}$/.test(String(phone||'')))return json(res,400,{error:'Enter a valid 10-digit mobile number'});
    const expected=Math.ceil(TRIPS[trip]*(paymentType==='half'?.5:1)); if(Number(amount)!==expected)return json(res,400,{error:'Payment amount mismatch'});
    const db=loadDb(); cleanup(db); if(unavailable(db,trip).includes(Number(seat)))return json(res,409,{error:'That seat is no longer available. Please choose another seat.'});
    const id=bookingId();
    try{
      const order=await razor('/orders',{method:'POST',body:JSON.stringify({amount:expected*100,currency:'INR',receipt:id,notes:{booking_id:id,trip,seat:String(seat)}})});
      const b={id,trip,seat:Number(seat),name:name.trim(),phone:String(phone),amount:expected,paymentType:paymentType==='full'?'full':'half',status:'pending',orderId:order.id,paymentId:null,holdUntil:new Date(Date.now()+HOLD_MINUTES*60000).toISOString(),createdAt:now().toISOString(),updatedAt:now().toISOString()};
      db.bookings.push(b); saveDb(db);
      return json(res,201,{keyId:RAZORPAY_KEY_ID,merchantUpi:MERCHANT_UPI,booking:publicBooking(b),order:{id:order.id,amount:order.amount,currency:order.currency}});
    }catch(e){return json(res,502,{error:e.message})}
  }
  if(req.method==='POST' && u.pathname==='/api/payments/verify'){
    let body;try{body=await readBody(req)}catch{return json(res,400,{error:'Invalid JSON'})}
    const {bookingId,razorpay_order_id,razorpay_payment_id,razorpay_signature}=body; const db=loadDb(); cleanup(db); const b=db.bookings.find(x=>x.id===bookingId);
    if(!b)return json(res,404,{error:'Booking not found'}); if(b.orderId!==razorpay_order_id)return json(res,400,{error:'Order mismatch'});
    const expected=hmacHex(RAZORPAY_KEY_SECRET,razorpay_order_id+'|'+razorpay_payment_id); if(!same(expected,razorpay_signature))return json(res,400,{error:'Payment signature verification failed'});
    try{const p=await razor('/payments/'+encodeURIComponent(razorpay_payment_id)); if(p.order_id!==b.orderId||p.status!=='captured'||Number(p.amount)!==b.amount*100)return json(res,400,{error:'Payment is not captured for the expected amount'}); b.status='confirmed';b.paymentId=p.id;b.paidAt=now().toISOString();b.updatedAt=now().toISOString();saveDb(db);return json(res,200,{confirmed:true,booking:publicBooking(b)});}catch(e){return json(res,502,{error:e.message})}
  }
  if(req.method==='POST' && u.pathname==='/api/webhooks/razorpay'){
    const raw=await new Promise((resolve,reject)=>{let b='';req.on('data',c=>b+=c);req.on('end',()=>resolve(b));req.on('error',reject)});
    if(!RAZORPAY_WEBHOOK_SECRET)return json(res,503,{error:'Webhook secret not configured'});
    const sig=req.headers['x-razorpay-signature']; if(!same(hmacHex(RAZORPAY_WEBHOOK_SECRET,raw),sig))return json(res,400,{error:'Invalid webhook signature'});
    let payload;try{payload=JSON.parse(raw)}catch{return json(res,400,{error:'Invalid webhook JSON'})}; const db=loadDb();
    const p=payload.payload?.payment?.entity; if(p){const b=db.bookings.find(x=>x.orderId===p.order_id); if(b){if(payload.event==='payment.captured' || (payload.event==='order.paid' && p.status==='captured')){if(Number(p.amount)===b.amount*100){b.status='confirmed';b.paymentId=p.id;b.paidAt=now().toISOString();b.updatedAt=now().toISOString();}}else if(payload.event==='payment.failed'){b.status='failed';b.updatedAt=now().toISOString();}saveDb(db)}}
    return json(res,200,{received:true});
  }
  if(req.method==='POST' && u.pathname==='/api/admin/login'){
    let body;try{body=await readBody(req)}catch{return json(res,400,{error:'Invalid JSON'})}; if(body.username!==ADMIN_USERNAME||body.password!==ADMIN_PASSWORD)return json(res,401,{error:'Invalid login'}); const value='admin'; const token=value+'.'+sign(value); res.writeHead(200,{'Content-Type':'application/json','Set-Cookie':`admin_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800`});return res.end(JSON.stringify({ok:true}));
  }
  if(req.method==='POST' && u.pathname==='/api/admin/logout'){res.writeHead(200,{'Content-Type':'application/json','Set-Cookie':'admin_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0'});return res.end(JSON.stringify({ok:true}))}
  if(u.pathname.startsWith('/api/admin/')){
    if(!adminOk(req))return json(res,401,{error:'Admin login required'});
    if(req.method==='GET' && u.pathname==='/api/admin/bookings'){const db=loadDb();cleanup(db);return json(res,200,{bookings:db.bookings})}
    if(req.method==='POST' && u.pathname==='/api/admin/seats/toggle'){let body;try{body=await readBody(req)}catch{return json(res,400,{error:'Invalid JSON'})};try{requireTripSeat(body.trip,Number(body.seat))}catch(e){return json(res,400,{error:e.message})};const db=loadDb();const arr=db.blockedSeats[body.trip]||[];const n=Number(body.seat);db.blockedSeats[body.trip]=arr.includes(n)?arr.filter(x=>x!==n):[...arr,n];saveDb(db);return json(res,200,{ok:true})}
    if(req.method==='POST' && u.pathname==='/api/admin/bookings/clear'){const db=loadDb();db.bookings=[];saveDb(db);return json(res,200,{ok:true})}
  }
  if(req.method==='GET'){
    let file=u.pathname==='/'?path.join(publicDir,'index.html'):path.join(publicDir,u.pathname.replace(/^\//,'')); if(!file.startsWith(publicDir))return json(res,403,{error:'Forbidden'}); if(fs.existsSync(file)&&fs.statSync(file).isFile()){const ext=path.extname(file);const types={'.html':'text/html; charset=utf-8','.png':'image/png','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'};res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream'});return fs.createReadStream(file).pipe(res)}
  }
  return json(res,404,{error:'Not found'});
}

http.createServer((req,res)=>route(req,res).catch(e=>{console.error(e);json(res,500,{error:'Server error'})})).listen(PORT,()=>console.log(`Weekend Trips Pune server running on http://localhost:${PORT}`));

const cors={"Access-Control-Allow-Origin":"https://ganeshkamble2218-sketch.github.io","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Content-Type":"application/json"};
const prices={"Kaas Pathar":1499,"Kokan":1050,"Matheran":999,"Mahabaleshwar":1000,"Harihareshwar – Diveagar":1200,"Kaas Pathar + Mahabaleshwar Stay":3199};
const out=(x,s=200)=>new Response(JSON.stringify(x),{status:s,headers:cors});
async function hmac(secret,msg){const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);const x=await crypto.subtle.sign('HMAC',k,new TextEncoder().encode(msg));return [...new Uint8Array(x)].map(v=>v.toString(16).padStart(2,'0')).join('')}
Deno.serve(async req=>{if(req.method==='OPTIONS')return new Response('ok',{headers:cors});if(req.method!=='POST')return out({error:'Method not allowed'},405);
const id=Deno.env.get('RAZORPAY_KEY_ID'),secret=Deno.env.get('RAZORPAY_KEY_SECRET');if(!id||!secret)return out({error:'Razorpay secrets are not configured.'},503);
let b;try{b=await req.json()}catch{return out({error:'Invalid request'},400)}
const {razorpayOrderId,razorpayPaymentId,razorpaySignature,trip,date,name,phone,pickup,seats,plan}=b,ss=Array.isArray(seats)?seats.map(Number):[];
if(!razorpayOrderId||!razorpayPaymentId||!razorpaySignature||!prices[trip]||!date||!name||!/^\d{10}$/.test(phone)||!pickup||!ss.length)return out({error:'Incomplete booking information.'},400);
if(await hmac(secret,razorpayOrderId+'|'+razorpayPaymentId)!==razorpaySignature)return out({paid:false,status:'FAILED',message:'Payment signature verification failed.'},400);
const base=ss.length*prices[trip],gst=Math.round(base*.05),total=base+gst,expected=(plan==='50'?Math.round(total/2):total),auth=btoa(id+':'+secret);
const pr=await fetch('https://api.razorpay.com/v1/payments/'+encodeURIComponent(razorpayPaymentId),{headers:{Authorization:'Basic '+auth}});
const payment=await pr.json().catch(()=>({}));
if(!pr.ok||payment.order_id!==razorpayOrderId||payment.status!=='captured'||Number(payment.amount)!==expected*100)return out({paid:false,status:payment.status||'FAILED',message:'Payment was not completed for the expected amount.'});
const url=Deno.env.get('SUPABASE_URL'),sk=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}').default||Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
if(url&&sk){const rows=ss.map(seat=>({trip,travel_date:date,seat_number:seat}));await fetch(url+'/rest/v1/seat_blocks',{method:'POST',headers:{apikey:sk,Authorization:'Bearer '+sk,'Content-Type':'application/json',Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify(rows)})}
return out({paid:true,status:'SUCCESS',booking:{name,phone,trip,date,pickup,seats:ss,pricing:{base,gst,total,amountPaid:expected,balance:total-expected,plan}}});
});
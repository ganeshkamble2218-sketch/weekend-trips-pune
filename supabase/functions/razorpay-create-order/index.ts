const cors={"Access-Control-Allow-Origin":"https://ganeshkamble2218-sketch.github.io","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Content-Type":"application/json"};
const prices={"Kaas Pathar":1499,"Kokan":1050,"Matheran":999,"Mahabaleshwar":1000,"Harihareshwar – Diveagar":1200,"Kaas Pathar + Mahabaleshwar Stay":3199};
const out=(x,s=200)=>new Response(JSON.stringify(x),{status:s,headers:cors});
Deno.serve(async req=>{if(req.method==='OPTIONS')return new Response('ok',{headers:cors});if(req.method!=='POST')return out({error:'Method not allowed'},405);
const id=Deno.env.get('RAZORPAY_KEY_ID'),secret=Deno.env.get('RAZORPAY_KEY_SECRET');if(!id||!secret)return out({error:'Razorpay secrets are not configured.'},503);
let b;try{b=await req.json()}catch{return out({error:'Invalid request'},400)}
const {trip,date,name,phone,pickup,seats,plan}=b;const ss=Array.isArray(seats)?seats.map(Number):[];
if(!prices[trip]||!date||!name||!/^\d{10}$/.test(phone)||!pickup||!ss.length||ss.some(n=>n<1||n>19)||new Set(ss).size!==ss.length||(plan!=='50'&&plan!=='100'))return out({error:'Please check booking details.'},400);
const base=ss.length*prices[trip],gst=Math.round(base*.05),total=base+gst,payNow=plan==='50'?Math.round(total/2):total;
const auth=btoa(id+':'+secret),r=await fetch('https://api.razorpay.com/v1/orders',{method:'POST',headers:{Authorization:'Basic '+auth,'Content-Type':'application/json'},body:JSON.stringify({amount:payNow*100,currency:'INR',receipt:'PWG-'+Date.now(),notes:{trip,travel_date:date,seats:ss.join(','),payment_plan:plan,pickup}})});
const d=await r.json().catch(()=>({}));if(!r.ok)return out({error:d?.error?.description||'Razorpay order creation failed.'},502);
return out({orderId:d.id,keyId:id,amount:payNow*100,pricing:{base,gst,total,payNow,plan}});
});
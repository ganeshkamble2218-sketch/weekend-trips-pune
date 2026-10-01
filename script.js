
function populateWeekendDates(){
 const el=document.getElementById('seatDate');
 if(!el)return;
 const tripEl=document.getElementById('tripSeat');
 const trip=tripEl?tripEl.value:'Kaas Pathar';
 const sundayTrips=['Kaas Pathar','Kokan'];
 const saturdayTrips=['Harihareshwar – Diveagar','Matheran','Mahabaleshwar','Kaas Pathar + Mahabaleshwar Stay'];
 const wantedDay=sundayTrips.includes(trip)?0:saturdayTrips.includes(trip)?6:null;
 el.innerHTML='';
 const first=document.createElement('option');
 first.value='';
 first.textContent=wantedDay===0?'Select Sunday':wantedDay===6?'Select Saturday':'Select date';
 el.appendChild(first);
 if(wantedDay===null)return;
 const today=new Date();
 today.setHours(0,0,0,0);
 for(let i=0;i<370;i++){
   const d=new Date(today);
   d.setDate(today.getDate()+i);
   if(d.getDay()!==wantedDay)continue;
   const value=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
   const option=document.createElement('option');
   option.value=value;
   option.textContent=(wantedDay===0?'Sunday':'Saturday')+' — '+d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
   el.appendChild(option);
 }
}
function isWeekendDate(value){
 if(!value)return false;
 const d=new Date(value+'T00:00:00');
 const trip=document.getElementById('tripSeat')?.value||'';
 if(trip==='Kaas Pathar'||trip==='Kokan')return d.getDay()===0;
 if(trip==='Harihareshwar – Diveagar'||trip==='Matheran'||trip==='Mahabaleshwar'||trip==='Kaas Pathar + Mahabaleshwar Stay')return d.getDay()===6;
 return false;
}
document.querySelectorAll('[data-trip]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const trip=a.dataset.trip;const select=document.getElementById('trip');[...select.options].forEach(o=>{if(o.text.startsWith(trip))select.value=o.value});const seatTrip=document.getElementById('tripSeat');const seatBooking=document.getElementById('seatBooking');const selectedTitle=document.getElementById('selectedTripTitle');if(seatTrip){seatTrip.value=trip;fillPickupSelect('seatPickup',trip);fillPickupSelect('pickup',trip);selectedTitle.textContent=trip;populateWeekendDates();seatBooking.hidden=false;seatBooking.classList.add('open');setTimeout(()=>seatBooking.scrollIntoView({behavior:'smooth',block:'start'}),80);}}));
document.getElementById('closeSeatBooking')?.addEventListener('click',()=>{const box=document.getElementById('seatBooking');box.hidden=true;box.classList.remove('open');document.getElementById('trips')?.scrollIntoView({behavior:'smooth'});});
const form=document.getElementById('bookingForm');
form?.addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('name').value.trim(),phone=document.getElementById('phone').value.trim(),trip=document.getElementById('trip').value,seats=document.getElementById('seats').value,date=document.getElementById('date').value,pickup=document.getElementById('pickup').value,request=document.getElementById('request').value.trim();const msg='Hello Weekend Trips Pune!%0A%0A*Booking Request*%0AName: '+encodeURIComponent(name)+'%0AMobile: '+encodeURIComponent(phone)+'%0ATrip: '+encodeURIComponent(trip)+'%0ASeats: '+encodeURIComponent(seats)+'%0ATravel Date: '+encodeURIComponent(date)+'%0APickup Location: '+encodeURIComponent(pickup)+'%0ASpecial Request: '+encodeURIComponent(request||'None')+'%0A%0APlease confirm my booking.';window.open('https://wa.me/918983416827?text='+msg,'_blank');});

const SEAT_ROWS=[[1],[2,3,4],[5,6,7],[8,9,10],[11,12,13],[14,15,16],[17,18,19]];
const SEAT_PRICES={'Kaas Pathar':1499,'Kokan':1050,'Matheran':999,'Mahabaleshwar':1000,'Harihareshwar – Diveagar':1200,'Kaas Pathar + Mahabaleshwar Stay':3199};
const PICKUP_POINTS={
  'Kaas Pathar':[
    'Noble Hospital — 04:45 AM',
    'Sainath Nagar — 04:55 AM',
    'Chandan Nagar — 05:05 AM',
    'Viman Nagar — 05:15 AM',
    'Yerwada — 05:20 AM',
    'Jehangir Hospital — 05:30 AM',
    'JM Road — 05:35 AM',
    'Bremen Chowk — 05:45 AM',
    'Jagtap Dairy — 05:50 AM',
    'Dange Chowk — 06:00 AM',
    'Bhujbal Chowk / Wakad — 06:55 AM',
    'Warje — 06:20 AM',
    'Navale Bridge — 06:50 AM'
  ],
  'Kaas Pathar + Mahabaleshwar Stay':[
    'Noble Hospital — 04:45 AM',
    'Sainath Nagar — 04:55 AM',
    'Chandan Nagar — 05:05 AM',
    'Viman Nagar — 05:15 AM',
    'Yerwada — 05:20 AM',
    'Jehangir Hospital — 05:30 AM',
    'JM Road — 05:35 AM',
    'Bremen Chowk — 05:45 AM',
    'Jagtap Dairy — 05:50 AM',
    'Dange Chowk — 06:00 AM',
    'Bhujbal Chowk / Wakad — 06:55 AM',
    'Warje — 06:20 AM',
    'Navale Bridge — 06:50 AM'
  ],
  'Kokan':[
    'Noble Hospital — Pickup time to be confirmed',
    'Sainath Nagar Chowk — 06:00 AM',
    'Kharadi – Chandan Nagar — 06:05 AM',
    'Viman Nagar — 06:15 AM',
    'Yerwada — 06:20 AM',
    'Jehangir Hospital — 06:25 AM',
    'JM Road Kalaniketan — 06:30 AM',
    'Aundh Brehman Chowk — 06:40 AM',
    'Jagtap Dairy — 06:50 AM',
    'Dange Chowk — 07:00 AM',
    'Bhujbal Chowk — 07:15 AM',
    'Shri Chhatrapati Shivaji Maharaj Chowk — 07:30 AM',
    'Ghotawade Phata — 07:45 AM'
  ],
  'Harihareshwar – Diveagar':[
    'Noble Hospital — Pickup time to be confirmed','Sainath Nagar Chowk — 06:00 AM','Kharadi – Chandan Nagar — 06:05 AM','Viman Nagar — 06:15 AM','Yerwada — 06:20 AM','Jehangir Hospital — 06:25 AM','JM Road Kalaniketan — 06:30 AM','Aundh Brehman Chowk — 06:40 AM','Jagtap Dairy — 06:50 AM','Dange Chowk — 07:00 AM','Bhujbal Chowk — 07:15 AM','Shri Chhatrapati Shivaji Maharaj Chowk — 07:30 AM','Ghotawade Phata — 07:45 AM'
  ],
  'Matheran':[
    'Noble Hospital — 05:35 AM (On Request)',
    'Sainath Nagar Chowk — 06:00 AM',
    'Kharadi - Chandan Nagar — 06:05 AM',
    'Viman Nagar — 06:05 AM',
    'Yerwada — 06:15 AM',
    'Jehangir Hospital — 06:20 AM',
    'JM Road Kalaniketan — 06:30 AM',
    'Aundh Brehman Chowk — 06:40 AM',
    'Jagtap Dairy — 06:50 AM',
    'Dange Chowk — 07:00 AM',
    'Bhujbal Chowk — 07:15 AM',
    'Warje Chowk — 07:30 AM',
    'Katraj Navale Bridge — 07:40 AM'
  ],
  'Mahabaleshwar':[
    'Noble Hospital — 05:35 AM (On Request)',
    'Sainath Nagar Chowk — 06:00 AM',
    'Kharadi - Chandan Nagar — 06:05 AM',
    'Viman Nagar — 06:05 AM',
    'Yerwada — 06:15 AM',
    'Jehangir Hospital — 06:20 AM',
    'JM Road Kalaniketan — 06:30 AM',
    'Aundh Brehman Chowk — 06:40 AM',
    'Jagtap Dairy — 06:50 AM',
    'Dange Chowk — 07:00 AM',
    'Bhujbal Chowk — 07:15 AM',
    'Warje Chowk — 07:30 AM',
    'Katraj Navale Bridge — 07:40 AM'
  ]
};
const PICKUP_ADDRESSES={
 'Noble Hospital':'Noble Hospital, Hadapsar, Pune, Maharashtra',
 'Sainath Nagar Chowk':'Sainath Nagar Chowk, Pune, Maharashtra',
 'Chandan Nagar':'Chandan Nagar, Pune, Maharashtra',
 'Kharadi – Chandan Nagar':'Kharadi, Pune, Maharashtra',
 'Kharadi - Chandan Nagar':'Kharadi, Pune, Maharashtra',
 'Viman Nagar':'Viman Nagar, Pune, Maharashtra',
 'Yerwada':'Yerwada, Pune, Maharashtra',
 'Jehangir Hospital':'Jehangir Hospital, Pune, Maharashtra',
 'JM Road':'JM Road, Pune, Maharashtra',
 'JM Road Kalaniketan':'JM Road, Pune, Maharashtra',
 'Bremen Chowk':'Bremen Chowk, Pune, Maharashtra',
 'Aundh Brehman Chowk':'Aundh Brehman Chowk, Pune, Maharashtra',
 'Jagtap Dairy':'Jagtap Dairy, Pune, Maharashtra',
 'Dange Chowk':'Dange Chowk, Pune, Maharashtra',
 'Bhujbal Chowk / Wakad':'Bhujbal Chowk, Wakad, Pune, Maharashtra',
 'Bhujbal Chowk':'Bhujbal Chowk, Pune, Maharashtra',
 'Warje':'Warje, Pune, Maharashtra',
 'Warje Chowk':'Warje Chowk, Pune, Maharashtra',
 'Navale Bridge':'Katraj Navale Bridge, Pune, Maharashtra',
 'Katraj Navale Bridge':'Katraj Navale Bridge, Pune, Maharashtra',
 'Shri Chhatrapati Shivaji Maharaj Chowk':'Shri Chhatrapati Shivaji Maharaj Chowk, Pune, Maharashtra',
 'Ghotawade Phata':'Ghotawade Phata, Pune, Maharashtra'
};
function updatePickupAddress(value){
 const box=document.getElementById('pickupAddress'); if(!box)return;
 if(!value){box.innerHTML='';return;}
 const name=value.split(' — ')[0].replace(' (On Request)','');
 const address=PICKUP_ADDRESSES[name]||name+', Pune, Maharashtra';
 const mapUrl='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(address);
 box.innerHTML='<strong>📍 Pickup point:</strong> '+address+'<br><a href="'+mapUrl+'" target="_blank" rel="noopener">Open in Google Maps →</a>';
}
function fillPickupSelect(id,trip){
  const el=document.getElementById(id); if(!el)return;
  const points=PICKUP_POINTS[trip]||[];
  el.innerHTML='<option value="">Select pickup location</option>'+points.map(p=>'<option>'+p+'</option>').join('');
}

let bookedSeats=[], selectedSeats=[];
const seatMap=document.getElementById('seatMap'),seatTrip=document.getElementById('tripSeat'),seatDate=document.getElementById('seatDate'),seatTotal=document.getElementById('seatTotal'),seatStatus=document.getElementById('seatStatus');
function drawSeats(){if(!seatMap)return;seatMap.innerHTML='';SEAT_ROWS.forEach((row,i)=>{const div=document.createElement('div');div.className='seat-row '+(i>0&&i<6?'wide':'');row.filter(n=>n<=19).forEach(n=>{const b=document.createElement('button');const isBooked=bookedSeats.includes(n),isSelected=selectedSeats.includes(n);b.type='button';b.className='seat '+(isBooked?'booked':isSelected?'selected':'');b.disabled=isBooked;b.innerHTML='<span>'+(isBooked?'×':'▣')+'</span><b>'+n+'</b>';b.onclick=()=>{if(isBooked)return;selectedSeats=selectedSeats.includes(n)?selectedSeats.filter(x=>x!==n):[...selectedSeats,n].sort((a,b)=>a-b);drawSeats();updateSeatTotal()};div.appendChild(b)});seatMap.appendChild(div)});}
function updateSeatTotal(){seatTotal.textContent='₹'+(selectedSeats.length*(SEAT_PRICES[seatTrip.value]||0)).toLocaleString('en-IN');}
async function loadBookedSeats(){if(!seatDate.value)return;seatStatus.textContent='Loading seat status…';try{const q='https://kbistbtecmazmkhmgowq.supabase.co/rest/v1/seat_blocks?select=seat_number&trip=eq.'+encodeURIComponent(seatTrip.value)+'&travel_date=eq.'+seatDate.value;const r=await fetch(q,{headers:{apikey:'sb_publishable_LccIloPnyFIfSiFY58Jzyg_xQ4Dm22s',Authorization:'Bearer sb_publishable_LccIloPnyFIfSiFY58Jzyg_xQ4Dm22s'}});if(!r.ok)throw new Error();const blocked=await r.json();bookedSeats=blocked.map(x=>Number(x.seat_number));selectedSeats=selectedSeats.filter(n=>!bookedSeats.includes(n));fillPickupSelect('seatPickup',seatTrip?.value||'Kaas Pathar');fillPickupSelect('pickup',seatTrip?.value||'Kaas Pathar');drawSeats();updateSeatTotal();seatStatus.textContent='';}catch(e){seatStatus.textContent='Could not load live seats. Please try again.';}}
seatTrip?.addEventListener('change',()=>{selectedSeats=[];fillPickupSelect('seatPickup',seatTrip.value);populateWeekendDates();loadBookedSeats();updateSeatTotal()});seatDate?.addEventListener('change',()=>{if(seatDate.value&&!isWeekendDate(seatDate.value)){const currentTrip=seatTrip?.value||'';seatStatus.textContent=(currentTrip==='Kaas Pathar'||currentTrip==='Kokan')?'Please select a Sunday.':(currentTrip==='Harihareshwar – Diveagar'||currentTrip==='Matheran'||currentTrip==='Mahabaleshwar'||currentTrip==='Kaas Pathar + Mahabaleshwar Stay')?'Please select a Saturday.':'Please select a valid trip date.';seatDate.value='';selectedSeats=[];drawSeats();updateSeatTotal();return;}selectedSeats=[];loadBookedSeats();updateSeatTotal()});
function updateOldPickupAddress(value){
 const box=document.getElementById('pickupAddressOld'); if(!box)return;
 if(!value){box.innerHTML='';return;}
 const name=value.split(' — ')[0].replace(' (On Request)','');
 const address=PICKUP_ADDRESSES[name]||name+', Pune, Maharashtra';
 const mapUrl='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(address);
 box.innerHTML='<strong>📍 Pickup point:</strong> '+address+'<br><a href="'+mapUrl+'" target="_blank" rel="noopener">Open in Google Maps →</a>';
}
function populateOldBookingDates(){
 const el=document.getElementById('date'); if(!el)return;
 const today=new Date(); today.setHours(0,0,0,0);
 el.innerHTML='<option value="">Select Saturday or Sunday</option>';
 for(let i=0;i<370;i++){
  const d=new Date(today); d.setDate(today.getDate()+i);
  if(d.getDay()===0||d.getDay()===6){
   const value=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
   const label=(d.getDay()===6?'Saturday':'Sunday')+' — '+d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
   el.insertAdjacentHTML('beforeend','<option value="'+value+'">'+label+'</option>');
  }
 }
}
document.getElementById('trip')?.addEventListener('change',e=>{const trip=e.target.value.split(' — ')[0];fillPickupSelect('pickup',trip);updateOldPickupAddress('');});
document.getElementById('pickup')?.addEventListener('change',e=>updateOldPickupAddress(e.target.value));
document.getElementById('seatPickup')?.addEventListener('change',e=>updatePickupAddress(e.target.value));
populateOldBookingDates();
const paymentAmount=document.getElementById('paymentAmount'),payNowBtn=document.getElementById('payNowBtn');
let paymentMethod='razorpay';
const SUPABASE_FUNCTION_URL='https://kbistbtecmazmkhmgowq.supabase.co/functions/v1';
const SUPABASE_ANON_KEY='sb_publishable_LccIloPnyFIfSiFY58Jzyg_xQ4Dm22s';

function openSelectedUPIApp(method){paymentMethod='razorpay';updatePaymentUI();}
function getPaymentTotals(){
 const base=selectedSeats.length*(SEAT_PRICES[seatTrip.value]||0);
 const gst=Math.round(base*0.05),total=base+gst;
 const plan=document.querySelector('input[name="paymentPlan"]:checked')?.value||'50';
 const payNow=plan==='50'?Math.round(total/2):total;
 return{base,gst,total,plan,payNow};
}
function updatePaymentUI(){
 const x=getPaymentTotals();
 if(paymentAmount)paymentAmount.textContent='₹'+x.total.toLocaleString('en-IN');
 document.getElementById('basePaymentAmount')?.replaceChildren(document.createTextNode('₹'+x.base.toLocaleString('en-IN')));
 document.getElementById('gstPaymentAmount')?.replaceChildren(document.createTextNode('₹'+x.gst.toLocaleString('en-IN')));
 document.getElementById('advancePaymentAmount')?.replaceChildren(document.createTextNode('₹'+Math.round(x.total/2).toLocaleString('en-IN')));
 document.getElementById('fullPaymentAmount')?.replaceChildren(document.createTextNode('₹'+x.total.toLocaleString('en-IN')));
 document.getElementById('payNowAmount')?.replaceChildren(document.createTextNode('₹'+x.payNow.toLocaleString('en-IN')));
 if(payNowBtn)payNowBtn.textContent='Pay securely with Razorpay →';
}
async function startPayment(){
 const name=document.getElementById('seatName')?.value.trim(),phone=document.getElementById('seatPhone')?.value.trim();
 const trip=seatTrip?.value,date=seatDate?.value,pickup=document.getElementById('seatPickup')?.value,payment=getPaymentTotals();
 if(!date||!name||!phone||!pickup||!selectedSeats.length){seatStatus.textContent='Please complete date, seats, name, mobile and pickup first.';return;}
 if(!/^\\d{10}$/.test(phone)){seatStatus.textContent='Please enter a valid 10-digit mobile number.';return;}
 if(!isWeekendDate(date)||!payment.total){seatStatus.textContent='Please select the correct trip day and at least one seat.';return;}
 if(!window.Razorpay){seatStatus.textContent='Secure payment is loading. Please try again.';return;}
 seatStatus.textContent='Creating secure Razorpay payment…';payNowBtn.disabled=true;
 try{
  const r=await fetch(SUPABASE_FUNCTION_URL+'/razorpay-create-order',{method:'POST',headers:{'Content-Type':'application/json','apikey':SUPABASE_ANON_KEY},body:JSON.stringify({tripName:trip,paymentType:payment.plan})});
  const data=await r.json().catch(()=>({}));
  if(!r.ok||!data.order_id)throw new Error(data.error||'Could not create Razorpay order.');
  const pricing={base:data.base_price,gst:data.gst,total:data.total,payNow:data.amount/100,plan:data.payment_type};
  sessionStorage.setItem('pwg_razorpay_pending',JSON.stringify({orderId:data.order_id,trip,date,name,phone,pickup,seats:[...selectedSeats],plan:payment.plan,pricing}));
  const options={key:data.key_id,amount:data.amount,currency:data.currency||'INR',name:'Pune Weekend Getaways',description:trip+' | '+date,order_id:data.order_id,prefill:{name,contact:phone},notes:{trip,travel_date:date,seats:selectedSeats.join(','),payment_plan:payment.plan,pickup},theme:{color:'#111827'},handler:verifyRazorpayPayment,modal:{ondismiss:()=>{seatStatus.textContent='Payment window closed. Your seats are not confirmed.';payNowBtn.disabled=false;}}};
  seatStatus.textContent='Opening secure Razorpay checkout…';new window.Razorpay(options).open();
 }catch(e){console.error(e);seatStatus.textContent='Payment could not be started. '+(e?.message||'Please try again.');payNowBtn.disabled=false;}
}
async function verifyRazorpayPayment(result){
 const raw=sessionStorage.getItem('pwg_razorpay_pending');if(!raw)return;
 let p;try{p=JSON.parse(raw)}catch{return;}
 seatStatus.textContent='Verifying your payment securely…';
 try{
  const r=await fetch(SUPABASE_FUNCTION_URL+'/razorpay-verify-payment',{method:'POST',headers:{'Content-Type':'application/json','apikey':SUPABASE_ANON_KEY},body:JSON.stringify({razorpay_payment_id:result.razorpay_payment_id,razorpay_order_id:result.razorpay_order_id,razorpay_signature:result.razorpay_signature,amount:Math.round((p.pricing?.payNow||0)*100)})});
  const data=await r.json().catch(()=>({}));
  if(!r.ok||!data.success||!data.verified){
   seatStatus.textContent=data.error||data.message||'Payment could not be verified. No seat has been confirmed.';payNowBtn.disabled=false;return;
  }

  // Confirm the selected seats only after payment verification.
  const rows=p.seats.map(seat=>({trip:p.trip,travel_date:p.date,seat_number:seat}));
  const seatResponse=await fetch('https://kbistbtecmazmkhmgowq.supabase.co/rest/v1/seat_blocks',{
   method:'POST',
   headers:{'Content-Type':'application/json','apikey':SUPABASE_ANON_KEY,'Authorization':'Bearer '+SUPABASE_ANON_KEY,'Prefer':'resolution=ignore-duplicates,return=representation'},
   body:JSON.stringify(rows)
  });
  const seatRows=await seatResponse.json().catch(()=>[]);
  if(!seatResponse.ok||!Array.isArray(seatRows)||seatRows.length!==p.seats.length){
   seatStatus.textContent='Payment succeeded, but the seats could not be confirmed automatically. Please contact us with Booking ID '+result.razorpay_order_id+'.';
   payNowBtn.disabled=false;return;
  }

  sessionStorage.removeItem('pwg_razorpay_pending');
  bookedSeats=[...new Set([...bookedSeats,...p.seats])];
  selectedSeats=[];drawSeats();updateSeatTotal();
  seatStatus.innerHTML='✓ Payment successful! Your selected seats are confirmed. Booking ID: <strong>'+result.razorpay_order_id+'</strong>';
  const amountPaid=data.amount?Number(data.amount)/100:(p.pricing?.payNow||0);
  const msg='Hello Pune Weekend Getaways!%0A%0A*Razorpay Payment Successful*%0ABooking ID: '+encodeURIComponent(result.razorpay_order_id)+'%0APayment ID: '+encodeURIComponent(result.razorpay_payment_id)+'%0AName: '+encodeURIComponent(p.name)+'%0AMobile: '+encodeURIComponent(p.phone)+'%0ATrip: '+encodeURIComponent(p.trip)+'%0ATravel Date: '+encodeURIComponent(p.date)+'%0ASeats: '+encodeURIComponent(p.seats.join(', '))+'%0APickup: '+encodeURIComponent(p.pickup)+'%0AAmount Paid: ₹'+encodeURIComponent(amountPaid);
  window.open('https://wa.me/918983416827?text='+msg,'_blank');
 }catch(e){console.error(e);seatStatus.textContent='Payment was verified, but booking confirmation needs attention. Please contact us with Booking ID '+result.razorpay_order_id+'.';payNowBtn.disabled=false;}
}
document.querySelectorAll('.pay-method').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.pay-method').forEach(b=>b.classList.remove('active'));btn.classList.add('active');paymentMethod='razorpay';updatePaymentUI();}));
payNowBtn?.addEventListener('click',startPayment);
document.getElementById('seatBookBtn')?.addEventListener('click',()=>{const paymentSection=document.getElementById('payment'),status=document.getElementById('seatStatus'),missing=[];if(!seatDate?.value)missing.push('travel date');if(!selectedSeats.length)missing.push('at least one seat');if(!document.getElementById('seatName')?.value.trim())missing.push('name');if(!document.getElementById('seatPhone')?.value.trim())missing.push('mobile number');if(!document.getElementById('seatPickup')?.value)missing.push('pickup location');if(missing.length){status.textContent='Please complete: '+missing.join(', ')+'.';return;}updatePaymentUI();paymentSection?.scrollIntoView({behavior:'smooth',block:'start'});setTimeout(()=>document.getElementById('payNowBtn')?.focus(),650);});
populateWeekendDates();drawSeats();updateSeatTotal();updatePaymentUI();
document.querySelectorAll('input[name="paymentPlan"]').forEach(r=>r.addEventListener('change',updatePaymentUI));

function buildInvoicePdf(invoice){
  if(!window.jspdf?.jsPDF) throw new Error('Invoice PDF library is not available.');
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({unit:'mm',format:'a4'});
  const money=n=>'INR '+Number(n||0).toLocaleString('en-IN');
  doc.setFontSize(20); doc.text('Pune Weekend Getaways',20,22);
  doc.setFontSize(10); doc.text('Booking Payment Receipt / Invoice',20,29);
  doc.text('Booking ID: '+invoice.bookingId,20,37);
  doc.text('Created: '+new Date(invoice.createdAt).toLocaleString('en-IN'),20,43);
  doc.line(20,48,190,48);
  doc.setFontSize(12); doc.text('Customer Details',20,58);
  doc.setFontSize(10);
  doc.text('Name: '+invoice.customer.name,20,66);
  doc.text('Mobile: '+invoice.customer.phone,20,72);
  doc.text('Trip: '+invoice.trip,20,82);
  doc.text('Travel Date: '+invoice.date,20,88);
  doc.text('Pickup: '+invoice.pickup,20,94);
  doc.text('Seat(s): '+invoice.seats.join(', '),20,100);
  doc.line(20,106,190,106);
  doc.setFontSize(12); doc.text('Payment Details',20,116);
  doc.setFontSize(10);
  doc.text('Trip Amount: '+money(invoice.pricing.base),20,124);
  doc.text('GST (5%): '+money(invoice.pricing.gst),20,130);
  doc.text('Total: '+money(invoice.pricing.total),20,136);
  doc.text('Amount Paid: '+money(invoice.pricing.amountPaid),20,142);
  doc.text('Balance: '+money(invoice.pricing.balance),20,148);
  doc.text('Payment Plan: '+invoice.payment.plan,20,156);
  doc.text('Payment App: '+invoice.payment.method,20,162);
  doc.text('UTR / Reference: '+invoice.payment.utr,20,168);
  doc.line(20,175,190,175);
  doc.setFontSize(9);
  doc.text('Payment status: UTR submitted — pending verification.',20,184);
  doc.text('WhatsApp: 8983416827',20,194);
  return doc;
}

document.getElementById('paidBtn')?.addEventListener('click',()=>{
 const name=document.getElementById('seatName')?.value.trim();
 const phone=document.getElementById('seatPhone')?.value.trim();
 const trip=seatTrip?.value;
 const date=seatDate?.value;
 const pickup=document.getElementById('seatPickup')?.value;
 const utr=document.getElementById('paymentUtr')?.value.trim();
 const payment=getPaymentTotals();
 if(!name||!phone||!pickup||!date||!selectedSeats.length||!utr){
   seatStatus.textContent='Please complete your booking details, pay, and enter the UTR/reference number.';
   return;
 }
 const methodLabel=paymentMethod==='gpay'?'Google Pay':paymentMethod==='phonepe'?'PhonePe':paymentMethod==='paytm'?'Paytm':'UPI';
 const msg='Hello Pune Weekend Getaways!%0A%0A*Payment Confirmation*%0AName: '+encodeURIComponent(name)+'%0AMobile: '+encodeURIComponent(phone)+'%0ATrip: '+encodeURIComponent(trip)+'%0ATravel Date: '+encodeURIComponent(date)+'%0ASeats: '+encodeURIComponent(selectedSeats.join(', '))+'%0APickup: '+encodeURIComponent(pickup)+'%0AFull Amount incl. GST: ₹'+encodeURIComponent(payment.total)+'%0AAmount Paid: ₹'+encodeURIComponent(payment.payNow)+'%0APayment Plan: '+encodeURIComponent(payment.plan==='50'?'50% Advance':'Full Payment')+'%0APayment App: '+encodeURIComponent(methodLabel)+'%0AUTR / Reference: '+encodeURIComponent(utr)+'%0A%0APlease verify my payment and confirm my seats.';
 const invoiceData={bookingId:'PWG'+Date.now(),customer:{name,phone},trip,date,pickup,seats:[...selectedSeats],pricing:{base:payment.base,gst:payment.gst,total:payment.total,amountPaid:payment.payNow,balance:Math.max(0,payment.total-payment.payNow)},payment:{plan:payment.plan==='50'?'50% Advance':'Full Payment',method:methodLabel,utr},createdAt:new Date().toISOString()};
 sessionStorage.setItem('pwg_invoice_data',JSON.stringify(invoiceData));
 try{
   const doc=buildInvoicePdf(invoiceData);
   const blob=doc.output('blob');
   const url=URL.createObjectURL(blob);
   const link=document.createElement('a');
   link.href=url; link.download=invoiceData.bookingId+'.pdf'; link.textContent='Download Invoice PDF';
   link.style.display='inline-block'; link.style.marginTop='10px'; link.style.fontWeight='700';
   seatStatus.innerHTML='✓ Payment details saved. Your invoice is ready below.';
   seatStatus.appendChild(document.createElement('br')); seatStatus.appendChild(link);
 }catch(error){
   console.error('Invoice error:',error);
   seatStatus.textContent='Payment confirmation prepared. Please send the UTR on WhatsApp.';
 }
 window.open('https://wa.me/918983416827?text='+msg,'_blank');
});

document.querySelectorAll('.pay-method').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.pay-method').forEach(b=>b.classList.remove('active'));btn.classList.add('active');paymentMethod=btn.dataset.method||'upi';updatePaymentUI();}));
payNowBtn?.addEventListener('click',startPayment);
document.getElementById('seatBookBtn')?.addEventListener('click',()=>{
 const paymentSection=document.getElementById('payment');
 const status=document.getElementById('seatStatus');
 const missing=[];
 if(!seatDate?.value) missing.push('travel date');
 if(!selectedSeats.length) missing.push('at least one seat');
 if(!document.getElementById('seatName')?.value.trim()) missing.push('name');
 if(!document.getElementById('seatPhone')?.value.trim()) missing.push('mobile number');
 if(!document.getElementById('seatPickup')?.value) missing.push('pickup location');
 if(missing.length){
   if(status) status.textContent='Please complete: '+missing.join(', ')+'.';
   const firstMissing=missing[0];
   const target=firstMissing==='travel date'?seatDate:firstMissing==='at least one seat'?document.getElementById('seatMap'):firstMissing==='name'?document.getElementById('seatName'):firstMissing==='mobile number'?document.getElementById('seatPhone') :document.getElementById('seatPickup');
   target?.scrollIntoView({behavior:'smooth',block:'center'});
   target?.focus?.();
   return;
 }
 updatePaymentUI();
 if(paymentSection){
   paymentSection.scrollIntoView({behavior:'smooth',block:'start'});
 }
 startPayment();
});
populateWeekendDates();drawSeats();updateSeatTotal();updatePaymentUI();

document.querySelectorAll('input[name="paymentPlan"]').forEach(r=>r.addEventListener('change',updatePaymentUI));

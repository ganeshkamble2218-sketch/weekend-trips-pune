
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
function setTripDates(){
 const t=seatTrip?.value||'';
 const day=(t==='Kaas Pathar'||t==='Kokan')?0:(t==='Matheran'||t==='Mahabaleshwar'||t==='Harihareshwar – Diveagar'||t==='Kaas Pathar + Mahabaleshwar Stay')?6:null;
 if(!seatDate)return;
 seatDate.innerHTML='<option value="">'+(day===0?'Select Sunday':day===6?'Select Saturday':'Select trip first')+'</option>';
 if(day===null)return;
 const today=new Date(); today.setHours(0,0,0,0);
 for(let i=0;i<=370;i++){
   const d=new Date(today); d.setDate(today.getDate()+i);
   if(d.getDay()!==day)continue;
   const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),dd=String(d.getDate()).padStart(2,'0');
   const o=document.createElement('option');
   o.value=y+'-'+m+'-'+dd;
   o.textContent=(day===0?'Sunday':'Saturday')+' — '+d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
   seatDate.appendChild(o);
 }
}
seatTrip?.addEventListener('change',()=>{setTripDates();selectedSeats=[];bookedSeats=[];drawSeats();updateSeatTotal();});
setTripDates();
function drawSeats(){if(!seatMap)return;seatMap.innerHTML='';[[1],[2,3,4],[5,6,7],[8,9,10],[11,12,13],[14,15,16],[17,18,19]].forEach((row,i)=>{const div=document.createElement('div');div.className='seat-row '+(i>0&&i<6?'wide':'');row.filter(n=>n<=19).forEach(n=>{const b=document.createElement('button');const isBooked=bookedSeats.includes(n),isSelected=selectedSeats.includes(n);b.type='button';b.className='seat '+(isBooked?'booked':isSelected?'selected':'');b.disabled=isBooked;b.innerHTML='<span>'+(isBooked?'×':'▣')+'</span><b>'+n+'</b>';b.onclick=()=>{if(isBooked)return;selectedSeats=selectedSeats.includes(n)?selectedSeats.filter(x=>x!==n):[...selectedSeats,n].sort((a,b)=>a-b);drawSeats();updateSeatTotal()};div.appendChild(b)});seatMap.appendChild(div)});}
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
let paymentMethod='upi';
function openSelectedUPIApp(method){paymentMethod=method;updatePaymentUI();}
function getPaymentTotals(){const base=selectedSeats.length*(SEAT_PRICES[seatTrip.value]||0);const gst=Math.round(base*0.05);const total=base+gst;const plan=document.querySelector('input[name="paymentPlan"]:checked')?.value||'50';const payNow=plan==='50'?Math.round(total/2):total;return{base,gst,total,plan,payNow};}
function updatePaymentUI(){const x=getPaymentTotals();const nativePay=document.getElementById('payNowBtn');if(nativePay){const ref='WTP'+Date.now();nativePay.href='upi://pay?pa='+encodeURIComponent('ganeshk1234567amble-2@oksbi')+'&pn='+encodeURIComponent('Pune Weekend Getaways')+'&am='+encodeURIComponent(x.payNow)+'&cu=INR&tr='+encodeURIComponent(ref)+'&tn='+encodeURIComponent((seatTrip?.value||'Trip')+' '+x.plan+' payment');}if(paymentAmount)paymentAmount.textContent='₹'+x.total.toLocaleString('en-IN');document.getElementById('basePaymentAmount')?.replaceChildren(document.createTextNode('₹'+x.base.toLocaleString('en-IN')));document.getElementById('gstPaymentAmount')?.replaceChildren(document.createTextNode('₹'+x.gst.toLocaleString('en-IN')));document.getElementById('advancePaymentAmount')?.replaceChildren(document.createTextNode('₹'+Math.round(x.total/2).toLocaleString('en-IN')));document.getElementById('fullPaymentAmount')?.replaceChildren(document.createTextNode('₹'+x.total.toLocaleString('en-IN')));document.getElementById('payNowAmount')?.replaceChildren(document.createTextNode('₹'+x.payNow.toLocaleString('en-IN')));if(payNowBtn)payNowBtn.textContent='Pay with '+({upi:'UPI',gpay:'Google Pay',phonepe:'PhonePe',paytm:'Paytm'}[paymentMethod]||'UPI')+' →';}}
function startPayment(){
 const name=document.getElementById('seatName')?.value.trim();
 const phone=document.getElementById('seatPhone')?.value.trim();
const trip=seatTrip?.value,date=seatDate?.value,pickup=document.getElementById('seatPickup')?.value;
 const payment=getPaymentTotals();
 if(!date||!name||!phone||!pickup||!selectedSeats.length){seatStatus.textContent='Please complete date, seats, name, mobile and pickup first.';return;}
 if(!isWeekendDate(date)){seatStatus.textContent='Please select the correct trip day.';return;}
 if(!payment.total){seatStatus.textContent='Please select at least one seat.';return;}
 const transactionRef='WTP'+Date.now();
 const params='pa='+encodeURIComponent('ganeshk1234567amble-2@oksbi')+'&pn='+encodeURIComponent('Pune Weekend Getaways')+'&am='+encodeURIComponent(payment.payNow)+'&cu=INR&tr='+encodeURIComponent(transactionRef)+'&tn='+encodeURIComponent(trip+' '+payment.plan+' payment');
 const upiUrl='upi://pay?'+params;
 const labels={gpay:'Google Pay',phonepe:'PhonePe',paytm:'Paytm',upi:'UPI'};
 const intentUrls={
   gpay:'intent://pay?'+params+'#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end',
   phonepe:'intent://pay?'+params+'#Intent;scheme=upi;package=com.phonepe.app;end',
   paytm:'intent://pay?'+params+'#Intent;scheme=upi;package=net.one97.paytm;end',
   upi:upiUrl
 };
 const directUrls={
   gpay:upiUrl,
   phonepe:upiUrl,
   paytm:upiUrl,
   upi:upiUrl
 };
 const target=intentUrls[paymentMethod]||upiUrl;
 const directTarget=directUrls[paymentMethod]||upiUrl;
 const qr=document.querySelector('.qr-box img');
 if(qr) qr.src='https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data='+encodeURIComponent(upiUrl);
 seatStatus.innerHTML='Opening '+labels[paymentMethod]+'…';
 // Launch directly from the real button tap. Programmatic hidden-link clicks are blocked
 // by many mobile browsers, while an intent URI preserves the user gesture.
 let leftPage=false;
 const onVisibility=()=>{if(document.visibilityState==='hidden')leftPage=true;};
 document.addEventListener('visibilitychange',onVisibility,{once:false});
 try{
   window.location.href=target;
 }catch(e){
   window.location.href=directTarget;
 }
 setTimeout(()=>{
   document.removeEventListener('visibilitychange',onVisibility);
   if(document.visibilityState==='visible'&&!leftPage){
     seatStatus.innerHTML='Payment app did not open. <a href="'+directTarget+'" style="display:inline-block;margin-top:8px;font-weight:800;text-decoration:underline">Tap here to open '+labels[paymentMethod]+'</a><br><a href="'+upiUrl+'" style="display:inline-block;margin-top:6px;font-weight:800;text-decoration:underline">Open with any UPI app</a><br><small>You can also scan the QR code below.</small>';
   }
 },1800);
}

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
   setTimeout(()=>document.getElementById('payNowBtn')?.focus(),650);
 }
});
populateWeekendDates();drawSeats();updateSeatTotal();updatePaymentUI();

document.querySelectorAll('input[name="paymentPlan"]').forEach(r=>r.addEventListener('change',updatePaymentUI));


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
function drawSeats(){if(!seatMap)return;seatMap.innerHTML='';SEAT_ROWS.forEach((row,i)=>{const div=document.createElement('div');div.className='seat-row '+(i>0&&i<6?'wide':'');row.forEach(n=>{const b=document.createElement('button');const isBooked=bookedSeats.includes(n),isSelected=selectedSeats.includes(n);b.type='button';b.className='seat '+(isBooked?'booked':isSelected?'selected':'');b.disabled=isBooked;b.innerHTML='<span>'+(isBooked?'×':'▣')+'</span><b>'+n+'</b>';b.onclick=()=>{if(isBooked)return;selectedSeats=selectedSeats.includes(n)?selectedSeats.filter(x=>x!==n):[...selectedSeats,n].sort((a,b)=>a-b);drawSeats();updateSeatTotal()};div.appendChild(b)});seatMap.appendChild(div)});}
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
function updatePaymentUI(){const x=getPaymentTotals();if(paymentAmount)paymentAmount.textContent='₹'+x.total.toLocaleString('en-IN');document.getElementById('basePaymentAmount')?.replaceChildren(document.createTextNode('₹'+x.base.toLocaleString('en-IN')));document.getElementById('gstPaymentAmount')?.replaceChildren(document.createTextNode('₹'+x.gst.toLocaleString('en-IN')));document.getElementById('advancePaymentAmount')?.replaceChildren(document.createTextNode('₹'+Math.round(x.total/2).toLocaleString('en-IN')));document.getElementById('fullPaymentAmount')?.replaceChildren(document.createTextNode('₹'+x.total.toLocaleString('en-IN')));document.getElementById('payNowAmount')?.replaceChildren(document.createTextNode('₹'+x.payNow.toLocaleString('en-IN')));if(payNowBtn)payNowBtn.textContent='Pay with '+({upi:'UPI',gpay:'Google Pay',phonepe:'PhonePe',paytm:'Paytm'}[paymentMethod]||'UPI')+' →';}
function startPayment(){
 const name=document.getElementById('seatName')?.value.trim(),phone=document.getElementById('seatPhone')?.value.trim(),email=document.getElementById('seatEmail')?.value.trim(),trip=seatTrip?.value,date=seatDate?.value,pickup=document.getElementById('seatPickup')?.value;
 const payment=getPaymentTotals();
 if(!date||!name||!phone||!email||!pickup||!selectedSeats.length){seatStatus.textContent='Please choose date, seats, name, mobile number, email and pickup first.';return;}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){seatStatus.textContent='Please enter a valid email address for your invoice.';return;}
 if(!isWeekendDate(date)){seatStatus.textContent=(trip==='Kokan'||trip==='Kaas Pathar')?'Please select a Sunday.':(trip==='Mahabaleshwar'||trip==='Harihareshwar – Diveagar'||trip==='Kaas Pathar + Mahabaleshwar Stay')?'Please select a Saturday.':'Please select a Saturday or Sunday.';return;}
 if(!payment.total){seatStatus.textContent='Please select at least one seat.';return;}
 const transactionRef='WTP'+Date.now();
 const params='pa='+encodeURIComponent('ganeshk1234567amble-2@oksbi')+'&pn='+encodeURIComponent('Pune Weekend Getaways')+'&am='+encodeURIComponent(payment.payNow)+'&cu=INR&tr='+encodeURIComponent(transactionRef)+'&tn='+encodeURIComponent(trip+' '+payment.plan+' payment');
 const upiUrl='upi://pay?'+params;
 const appUrls={gpay:'tez://upi/pay?'+params,phonepe:'phonepe://pay?'+params,paytm:'paytmmp://pay?'+params,upi:upiUrl};
 const labels={gpay:'Google Pay',phonepe:'PhonePe',paytm:'Paytm',upi:'UPI'};
 const target=appUrls[paymentMethod]||upiUrl;
 const qr=document.querySelector('.qr-box img');
 if(qr)qr.src='https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data='+encodeURIComponent(upiUrl);
 seatStatus.innerHTML='Opening '+labels[paymentMethod]+'…';
 // Use a real anchor click for Android/iOS deep-link handling, then provide a generic UPI fallback.
 const launcher=document.createElement('a');
 launcher.href=target;
 launcher.target='_self';
 launcher.rel='noopener';
 launcher.style.display='none';
 document.body.appendChild(launcher);
 launcher.click();
 setTimeout(()=>launcher.remove(),500);
 setTimeout(()=>{
   if(document.visibilityState==='visible'){
     seatStatus.innerHTML='Payment app did not open. <a href="'+upiUrl+'" style="font-weight:700">Tap here to open UPI</a> or scan the QR code below.';
   }
 },1800);
}

// EmailJS invoice delivery — fill these 3 public dashboard values after creating the template.
const EMAILJS_PUBLIC_KEY='XRqHC6_SUnYf_D9BI';
const EMAILJS_SERVICE_ID='service_i9abvxs';
const EMAILJS_TEMPLATE_ID='template_2vuz8wr';
if(window.emailjs && EMAILJS_PUBLIC_KEY!=='YOUR_EMAILJS_PUBLIC_KEY'){
  emailjs.init({publicKey:EMAILJS_PUBLIC_KEY, blockHeadless:true, limitRate:{id:'pwg-invoice',throttle:1200}});
}

function buildInvoicePdf(invoice){
  if(!window.jspdf?.jsPDF) throw new Error('Invoice PDF library is not available.');
  const {jsPDF}=window.jspdf;
  const doc=new jsPDF({unit:'mm',format:'a4'});
  const money=n=> 'INR '+Number(n||0).toLocaleString('en-IN');
  const lines=[];
  doc.setFontSize(20); doc.text('Pune Weekend Getaways',20,22);
  doc.setFontSize(10); doc.text('Booking Payment Receipt / Invoice',20,29);
  doc.text('Booking ID: '+invoice.bookingId,20,37);
  doc.text('Created: '+new Date(invoice.createdAt).toLocaleString('en-IN'),20,43);
  doc.line(20,48,190,48);
  doc.setFontSize(12); doc.text('Customer Details',20,58);
  doc.setFontSize(10);
  doc.text('Name: '+invoice.customer.name,20,66);
  doc.text('Mobile: '+invoice.customer.phone,20,72);
  doc.text('Email: '+invoice.customer.email,20,78);
  doc.text('Trip: '+invoice.trip,20,88);
  doc.text('Travel Date: '+invoice.date,20,94);
  doc.text('Pickup: '+invoice.pickup,20,100);
  doc.text('Seat(s): '+invoice.seats.join(', '),20,106);
  doc.line(20,112,190,112);
  doc.setFontSize(12); doc.text('Payment Details',20,122);
  doc.setFontSize(10);
  doc.text('Trip Amount: '+money(invoice.pricing.base),20,130);
  doc.text('GST (5%): '+money(invoice.pricing.gst),20,136);
  doc.text('Total: '+money(invoice.pricing.total),20,142);
  doc.text('Amount Paid: '+money(invoice.pricing.amountPaid),20,148);
  doc.text('Balance: '+money(invoice.pricing.balance),20,154);
  doc.text('Payment Plan: '+invoice.payment.plan,20,162);
  doc.text('Payment App: '+invoice.payment.method,20,168);
  doc.text('UTR / Reference: '+invoice.payment.utr,20,174);
  doc.line(20,181,190,181);
  doc.setFontSize(9);
  doc.text('Payment status: UTR submitted — pending verification.',20,190);
  doc.text('Please keep this receipt for your records.',20,196);
  doc.text('WhatsApp: 8983416827',20,207);
  return doc;
}

function invoiceEmailConfigured(){
  return !!(window.emailjs && EMAILJS_PUBLIC_KEY!=='YOUR_EMAILJS_PUBLIC_KEY' && EMAILJS_SERVICE_ID!=='YOUR_EMAILJS_SERVICE_ID' && EMAILJS_TEMPLATE_ID!=='YOUR_EMAILJS_TEMPLATE_ID');
}

async function sendInvoiceEmailTo(invoice,toEmail,pdfDataUri){
  const attachmentBase64=pdfDataUri;
  const params={
    to_email:toEmail,
    reply_to:invoice.ownerEmail,
    customer_name:invoice.customer.name,
    customer_email:invoice.customer.email,
    booking_id:invoice.bookingId,
    trip:invoice.trip,
    travel_date:invoice.date,
    pickup:invoice.pickup,
    seats:invoice.seats.join(', '),
    base_amount:invoice.pricing.base,
    gst:invoice.pricing.gst,
    total_amount:invoice.pricing.total,
    amount_paid:invoice.pricing.amountPaid,
    balance:invoice.pricing.balance,
    payment_plan:invoice.payment.plan,
    payment_method:invoice.payment.method,
    utr:invoice.payment.utr,
    payment_status:'UTR submitted — pending verification',
    invoice_pdf:attachmentBase64
  };
  return emailjs.send(EMAILJS_SERVICE_ID,EMAILJS_TEMPLATE_ID,params);
}

async function sendInvoiceEmails(invoice){
  const doc=buildInvoicePdf(invoice);
  const pdfDataUri=doc.output('datauristring');
  // Always save a local copy so the customer can retrieve the receipt even if email delivery fails.
  const blob=doc.output('blob');
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url; link.download=invoice.bookingId+'.pdf'; link.textContent='Download Invoice PDF';
  link.style.display='inline-block'; link.style.marginTop='10px'; link.style.fontWeight='700';
  seatStatus.appendChild(document.createElement('br')); seatStatus.appendChild(link);
  if(!invoiceEmailConfigured()) throw new Error('EmailJS is not configured yet.');
  await sendInvoiceEmailTo(invoice,invoice.customer.email,pdfDataUri);
  await new Promise(resolve=>setTimeout(resolve,1200));
  await sendInvoiceEmailTo(invoice,invoice.ownerEmail,pdfDataUri);
  return true;
}

document.getElementById('paidBtn')?.addEventListener('click',()=>{
 const name=document.getElementById('seatName').value.trim(),phone=document.getElementById('seatPhone').value.trim(),email=document.getElementById('seatEmail').value.trim(),trip=seatTrip.value,date=seatDate.value,pickup=document.getElementById('seatPickup').value,utr=document.getElementById('paymentUtr').value.trim(),payment=getPaymentTotals(),total=payment.total;
 if(!name||!phone||!email||!pickup||!date||!selectedSeats.length||!utr){seatStatus.textContent='Please complete your booking details including email, select seats, pay, and enter the UTR/reference number.';return;} if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){seatStatus.textContent='Please enter a valid email address for your invoice.';return;}
 const msg='Hello Weekend Trips Pune!%0A%0A*Payment Confirmation*%0AName: '+encodeURIComponent(name)+'%0AMobile: '+encodeURIComponent(phone)+'%0ATrip: '+encodeURIComponent(trip)+'%0ATravel Date: '+encodeURIComponent(date)+'%0ASeats: '+encodeURIComponent(selectedSeats.join(', '))+'%0APickup: '+encodeURIComponent(pickup)+'%0AFull Amount incl. GST: ₹'+encodeURIComponent(payment.total)+'%0AAmount Paid: ₹'+encodeURIComponent(payment.payNow)+'%0APayment Plan: '+encodeURIComponent(payment.plan==='50'?'50% Advance':'Full Payment')+'%0APayment App: '+encodeURIComponent(paymentMethod==='gpay'?'Google Pay':paymentMethod==='phonepe'?'PhonePe':paymentMethod==='paytm'?'Paytm':'UPI')+'%0AUTR / Reference: '+encodeURIComponent(utr)+'%0A%0APlease verify my payment and confirm my seats.';
 const invoiceData={bookingId:'WTP'+Date.now(),customer:{name,phone,email},trip,date,pickup,seats:[...selectedSeats],pricing:{base:payment.base,gst:payment.gst,total:payment.total,amountPaid:payment.payNow,balance:Math.max(0,payment.total-payment.payNow)},payment:{plan:payment.plan==='50'?'50% Advance':'Full Payment',method:paymentMethod,utr},ownerEmail:'ganeshkamble2218@gmail.com',createdAt:new Date().toISOString()};
 sessionStorage.setItem('pwg_invoice_data',JSON.stringify(invoiceData));
 seatStatus.textContent='Creating your invoice PDF…';
 sendInvoiceEmails(invoiceData).then(()=>{
   seatStatus.insertAdjacentHTML('afterbegin','✓ Invoice emailed to you and the booking owner. ');
   window.open('https://wa.me/918983416827?text='+msg,'_blank');
 }).catch(error=>{
   console.error('Invoice email error:',error);
   seatStatus.insertAdjacentHTML('afterbegin','Payment confirmation saved, but automatic email is not configured yet. ');
   window.open('https://wa.me/918983416827?text='+msg,'_blank');
 });
});
document.querySelectorAll('.pay-method').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.pay-method').forEach(b=>b.classList.remove('active'));btn.classList.add('active');paymentMethod=btn.dataset.method||'upi';updatePaymentUI();}));
payNowBtn?.addEventListener('click',startPayment);
document.getElementById('seatBookBtn')?.addEventListener('click',()=>{document.getElementById('payment')?.scrollIntoView({behavior:'smooth'});updatePaymentUI();});
populateWeekendDates();drawSeats();updateSeatTotal();updatePaymentUI();

document.querySelectorAll('input[name="paymentPlan"]').forEach(r=>r.addEventListener('change',updatePaymentUI));

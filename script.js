
function isWeekendDate(value){if(!value)return false;const d=new Date(value+'T00:00:00');return d.getDay()===0||d.getDay()===6;}
document.querySelectorAll('[data-trip]').forEach(a=>a.addEventListener('click',()=>{const trip=a.dataset.trip;const select=document.getElementById('trip');[...select.options].forEach(o=>{if(o.text.startsWith(trip))select.value=o.value});const seatTrip=document.getElementById('tripSeat');if(seatTrip){seatTrip.value=trip;fillPickupSelect('seatPickup',trip);fillPickupSelect('pickup',trip);}}));
const form=document.getElementById('bookingForm');
form.addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('name').value.trim(),phone=document.getElementById('phone').value.trim(),trip=document.getElementById('trip').value,seats=document.getElementById('seats').value,date=document.getElementById('date').value,pickup=document.getElementById('pickup').value,request=document.getElementById('request').value.trim();const msg='Hello Weekend Trips Pune!%0A%0A*Booking Request*%0AName: '+encodeURIComponent(name)+'%0AMobile: '+encodeURIComponent(phone)+'%0ATrip: '+encodeURIComponent(trip)+'%0ASeats: '+encodeURIComponent(seats)+'%0ATravel Date: '+encodeURIComponent(date)+'%0APickup Location: '+encodeURIComponent(pickup)+'%0ASpecial Request: '+encodeURIComponent(request||'None')+'%0A%0APlease confirm my booking.';window.open('https://wa.me/918983416827?text='+msg,'_blank');});

const SEAT_ROWS=[[1],[2,3],[4,5,6],[7,8,9],[10,11,12],[13,14,15],[16,17,18,19]];
const SEAT_PRICES={'Kaas Pathar':1499,'Kokan':1050,'Matheran':999,'Mahabaleshwar':1000};
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
function fillPickupSelect(id,trip){
  const el=document.getElementById(id); if(!el)return;
  const points=PICKUP_POINTS[trip]||[];
  el.innerHTML='<option value="">Select pickup location</option>'+points.map(p=>'<option>'+p+'</option>').join('');
}

let bookedSeats=[], selectedSeats=[];
const seatMap=document.getElementById('seatMap'),seatTrip=document.getElementById('tripSeat'),seatDate=document.getElementById('seatDate'),seatTotal=document.getElementById('seatTotal'),seatStatus=document.getElementById('seatStatus');
function drawSeats(){if(!seatMap)return;seatMap.innerHTML='';SEAT_ROWS.forEach((row,i)=>{const div=document.createElement('div');div.className='seat-row '+(i>0&&i<6?'wide':'');row.forEach(n=>{const b=document.createElement('button');const isBooked=bookedSeats.includes(n),isSelected=selectedSeats.includes(n);b.type='button';b.className='seat '+(isBooked?'booked':isSelected?'selected':'');b.disabled=isBooked;b.innerHTML='<span>'+(isBooked?'×':'▣')+'</span><b>'+n+'</b>';b.onclick=()=>{if(isBooked)return;selectedSeats=selectedSeats.includes(n)?selectedSeats.filter(x=>x!==n):[...selectedSeats,n].sort((a,b)=>a-b);drawSeats();updateSeatTotal()};div.appendChild(b)});seatMap.appendChild(div)});}
function updateSeatTotal(){seatTotal.textContent='₹'+(selectedSeats.length*(SEAT_PRICES[seatTrip.value]||0)).toLocaleString('en-IN');}
async function loadBookedSeats(){if(!seatDate.value)return;seatStatus.textContent='Loading seat status…';try{const r=await fetch(PAYMENT_API+'/api/seats?trip='+encodeURIComponent(seatTrip.value)+'&date='+seatDate.value);if(!r.ok)throw new Error();const d=await r.json();bookedSeats=[...(d.bookedSeats||[]),...(d.lockedSeats||[])];selectedSeats=selectedSeats.filter(n=>!bookedSeats.includes(n));fillPickupSelect('seatPickup',seatTrip?.value||'Kaas Pathar');fillPickupSelect('pickup',seatTrip?.value||'Kaas Pathar');drawSeats();updateSeatTotal();seatStatus.textContent='';}catch(e){seatStatus.textContent='Could not load live seats. Please try again.';}}
seatTrip?.addEventListener('change',()=>{selectedSeats=[];fillPickupSelect('seatPickup',seatTrip.value);loadBookedSeats();updateSeatTotal()});seatDate?.addEventListener('change',()=>{if(seatDate.value&&!isWeekendDate(seatDate.value)){seatStatus.textContent='Please select a Saturday or Sunday.';seatDate.value='';selectedSeats=[];drawSeats();updateSeatTotal();return;}selectedSeats=[];loadBookedSeats();updateSeatTotal()});
document.getElementById('trip')?.addEventListener('change',e=>{fillPickupSelect('pickup',e.target.value.split(' — ')[0]);});
const paymentAmount=document.getElementById('paymentAmount'),payNowBtn=document.getElementById('payNowBtn');
let paymentMethod='upi';
function openSelectedUPIApp(method){
  paymentMethod=method;
  updatePaymentUI();
  startPayment();
  return true;
}
function updatePaymentUI(){const total=selectedSeats.length*(SEAT_PRICES[seatTrip.value]||0);if(paymentAmount)paymentAmount.textContent='₹'+total.toLocaleString('en-IN');if(payNowBtn)payNowBtn.textContent=(paymentMethod==='card'||paymentMethod==='netbanking')?'Pay Securely →':'Pay with '+({upi:'UPI',gpay:'Google Pay',phonepe:'PhonePe',paytm:'Paytm'}[paymentMethod]||'UPI')+' →';}
async function startPayment(){
 const name=document.getElementById('seatName').value.trim(),phone=document.getElementById('seatPhone').value.trim(),trip=seatTrip.value,date=seatDate.value,pickup=document.getElementById('seatPickup').value,total=selectedSeats.length*(SEAT_PRICES[trip]||0);
 if(!date||!name||!phone||!pickup||!selectedSeats.length){seatStatus.textContent='Please choose a date, seats, name, mobile number and pickup location.';return;}
 if(!isWeekendDate(date)){seatStatus.textContent='Please select a Saturday or Sunday.';return;}
 if(!total){seatStatus.textContent='Please select at least one seat.';return;}
 if(typeof window.Razorpay!=='function'){seatStatus.textContent='Razorpay Checkout could not load. Please refresh and try again.';return;}
 seatStatus.textContent='Razorpay Checkout is loaded. Secure order creation will start after the payment backend is connected.';
}
document.querySelectorAll('.pay-method').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.pay-method').forEach(b=>b.classList.remove('active'));btn.classList.add('active');paymentMethod=btn.dataset.method||'upi';updatePaymentUI();}));
payNowBtn?.addEventListener('click',startPayment);
document.getElementById('seatBookBtn')?.addEventListener('click',()=>{document.getElementById('payment')?.scrollIntoView({behavior:'smooth'});updatePaymentUI();});
drawSeats();updateSeatTotal();updatePaymentUI();

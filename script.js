document.querySelectorAll('[data-trip]').forEach(a=>a.addEventListener('click',()=>{const trip=a.dataset.trip;const select=document.getElementById('trip');[...select.options].forEach(o=>{if(o.text.startsWith(trip))select.value=o.value});const seatTrip=document.getElementById('tripSeat');if(seatTrip)seatTrip.value=trip;}));
const form=document.getElementById('bookingForm');
form.addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('name').value.trim(),phone=document.getElementById('phone').value.trim(),trip=document.getElementById('trip').value,seats=document.getElementById('seats').value,date=document.getElementById('date').value,pickup=document.getElementById('pickup').value,request=document.getElementById('request').value.trim();const msg='Hello Weekend Trips Pune!%0A%0A*Booking Request*%0AName: '+encodeURIComponent(name)+'%0AMobile: '+encodeURIComponent(phone)+'%0ATrip: '+encodeURIComponent(trip)+'%0ASeats: '+encodeURIComponent(seats)+'%0ATravel Date: '+encodeURIComponent(date)+'%0APickup Location: '+encodeURIComponent(pickup)+'%0ASpecial Request: '+encodeURIComponent(request||'None')+'%0A%0APlease confirm my booking.';window.open('https://wa.me/918983416827?text='+msg,'_blank');});

const SEAT_ROWS=[[1],[2,3],[4,5,6],[7,8,9],[10,11,12],[13,14,15],[16,17,18,19]];
const SEAT_PRICES={'Kaas Pathar':1499,'Kokan':1050,'Matheran':999,'Mahabaleshwar':1000};
const PICKUP_POINTS={
  'Kaas Pathar':['Pickup points will be announced on WhatsApp'],
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
  'Matheran':['Pickup points will be announced on WhatsApp'],
  'Mahabaleshwar':['Pickup points will be announced on WhatsApp']
};
function fillPickupSelect(id,trip){
  const el=document.getElementById(id); if(!el)return;
  const points=PICKUP_POINTS[trip]||[];
  el.innerHTML='<option value="">Select pickup location</option>'+points.map(p=>'<option>'+p+'</option>').join('');
}

const FLOOT_BOOKING_URL='https://weekend-trips-pune-booking.floot.app';
let bookedSeats=[], selectedSeats=[];
const seatMap=document.getElementById('seatMap'),seatTrip=document.getElementById('tripSeat'),seatDate=document.getElementById('seatDate'),seatTotal=document.getElementById('seatTotal'),seatStatus=document.getElementById('seatStatus');
function drawSeats(){if(!seatMap)return;seatMap.innerHTML='';SEAT_ROWS.forEach((row,i)=>{const div=document.createElement('div');div.className='seat-row '+(i>0&&i<6?'wide':'');row.forEach(n=>{const b=document.createElement('button');const isBooked=bookedSeats.includes(n),isSelected=selectedSeats.includes(n);b.type='button';b.className='seat '+(isBooked?'booked':isSelected?'selected':'');b.disabled=isBooked;b.innerHTML='<span>'+(isBooked?'×':'▣')+'</span><b>'+n+'</b>';b.onclick=()=>{if(isBooked)return;selectedSeats=selectedSeats.includes(n)?selectedSeats.filter(x=>x!==n):[...selectedSeats,n].sort((a,b)=>a-b);drawSeats();updateSeatTotal()};div.appendChild(b)});seatMap.appendChild(div)});}
function updateSeatTotal(){seatTotal.textContent='₹'+(selectedSeats.length*(SEAT_PRICES[seatTrip.value]||0)).toLocaleString('en-IN');}
async function loadBookedSeats(){if(!seatDate.value)return;seatStatus.textContent='Loading seat status…';try{const r=await fetch(FLOOT_BOOKING_URL+'/_api/seats?trip='+encodeURIComponent(seatTrip.value)+'&date='+seatDate.value);if(!r.ok)throw new Error();const d=await r.json();bookedSeats=d.bookedSeats||[];selectedSeats=selectedSeats.filter(n=>!bookedSeats.includes(n));fillPickupSelect('seatPickup',seatTrip?.value||'Kaas Pathar'); fillPickupSelect('pickup',seatTrip?.value||'Kaas Pathar'); drawSeats();updateSeatTotal();seatStatus.textContent='';}catch(e){seatStatus.textContent='Could not load live seats. Please try again.';}}
seatTrip?.addEventListener('change',()=>{selectedSeats=[];fillPickupSelect('seatPickup',seatTrip.value);loadBookedSeats();updateSeatTotal()});seatDate?.addEventListener('change',()=>{selectedSeats=[];loadBookedSeats();updateSeatTotal()});
const seatBookBtn=document.getElementById('seatBookBtn');seatBookBtn?.addEventListener('click',async()=>{const name=document.getElementById('seatName').value.trim(),phone=document.getElementById('seatPhone').value.trim(),trip=seatTrip.value,date=seatDate.value,pickup=document.getElementById('seatPickup').value,total=selectedSeats.length*(SEAT_PRICES[trip]||0);if(!date||!name||!phone||!pickup||!selectedSeats.length){seatStatus.textContent='Please choose a date, seats, name and mobile number.';return;}seatBookBtn.disabled=true;seatStatus.textContent='Booking seats…';try{const r=await fetch(FLOOT_BOOKING_URL+'/_api/book-seats',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({trip,date,seats:selectedSeats,name,phone,pickup,totalAmount:total})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Some seats were just booked by another customer.');bookedSeats=[...bookedSeats,...d.bookedSeats];const seats=d.bookedSeats.join(', ');seatStatus.textContent='Booked successfully — Seat(s) '+seats+'. Total ₹'+total.toLocaleString('en-IN');drawSeats();selectedSeats=[];updateSeatTotal();const msg='Hello Weekend Trips Pune!%0A%0A*Confirmed Seat Booking*%0AName: '+encodeURIComponent(name)+'%0AMobile: '+encodeURIComponent(phone)+'%0ATrip: '+encodeURIComponent(trip)+'%0ADate: '+date+'%0ASeat(s): '+encodeURIComponent(seats)+'%0APickup Location: '+encodeURIComponent(pickup)+'%0ATotal: ₹'+total;window.open('https://wa.me/918983416827?text='+msg,'_blank');}catch(e){seatStatus.textContent=e.message;await loadBookedSeats();}finally{seatBookBtn.disabled=false;}});
drawSeats();updateSeatTotal();
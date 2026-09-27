# Weekend Trips Pune — Complete Website

This package combines the professional customer website with the real server-side payment verification flow and professional admin dashboard.

## Customer features
- 4 October trips
- Kaas Pathar ₹1,499
- Kokan ₹1,050
- Mahabaleshwar ₹999
- Matheran ₹999
- 19 seats per trip
- Half/full payment
- Supplied merchant QR and UPI ID
- Razorpay checkout
- Server-side payment signature + captured-payment verification
- Seat confirmation only after verified payment

## Admin
Open `/admin` after starting the server. Login credentials are controlled by `.env`.

## Start locally
1. Install Node.js 18+.
2. Copy `.env.example` to `.env`.
3. Add your Razorpay Key ID, Key Secret, and Webhook Secret.
4. Change the admin password and session secret.
5. Run `npm install`.
6. Run `npm start`.
7. Open `http://localhost:3000`.
8. Admin: `http://localhost:3000/admin`

## Important
The static `PREVIEW.html` is for viewing the customer design only. Real payment confirmation requires the Node.js server and valid Razorpay credentials. Do not put the Razorpay secret in frontend HTML.

<!-- Deployment trigger: Vercel environment variables are configured. -->

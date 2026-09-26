# Weekend Trips Pune — Real Payment + Admin Dashboard

This version changes the booking flow so a seat is **not confirmed until the server verifies a successful Razorpay payment**.

## What it includes

- Kaas Pathar ₹1,499
- Kokan ₹1,050
- Mahabaleshwar ₹999
- Matheran ₹999
- 19 seats per trip
- Half or full payment
- Server-side Razorpay order creation
- Server-side payment signature verification
- Server-side captured-payment verification
- Razorpay webhook verification
- Temporary 15-minute seat hold while payment is pending
- Seat becomes `confirmed` only after verified payment
- Failed/expired payments do not become confirmed bookings
- Admin login and server-side booking dashboard
- Admin seat block/unblock controls
- Customer booking status lookup
- Supplied merchant QR image and UPI ID

## Important: this is ready for real payment, but you must connect your Razorpay account

The package intentionally does **not** contain your Razorpay secret key. Add your own live/test credentials in `.env`.

Razorpay's documentation says API secrets must stay on the server and webhook requests should be HMAC-validated. See the official security guidance: https://razorpay.com/security/checklist

## Run locally

1. Install Node.js 18+.
2. Copy `.env.example` to `.env`.
3. Put your Razorpay credentials in `.env`.
4. Change `ADMIN_PASSWORD` and `SESSION_SECRET`.
5. Run:

   npm install
   npm start

6. Open http://localhost:3000

The current project has no third-party npm dependency, so `npm install` is optional.

## Razorpay setup

Use Test Mode first. Create API keys in your Razorpay Dashboard and put them in `.env`.

Configure a Razorpay webhook pointing to:

https://YOUR-DOMAIN.example/api/webhooks/razorpay

Use the same `RAZORPAY_WEBHOOK_SECRET` in the dashboard and `.env`.

For a production deployment, use HTTPS and a persistent server/database. Do not expose `RAZORPAY_KEY_SECRET` in browser code or an Android APK.

## Admin

Open the website and use the Admin button. The username/password come from `.env`.

The admin dashboard displays booking status, payment ID, customer, trip, seat and amount, and allows manual seat blocking.

## Payment behavior

A customer selecting a seat first creates a server-side Razorpay order and a temporary hold. The hold is not a confirmed booking. After checkout, the server verifies the Razorpay signature and then checks that the payment is actually captured for the expected order and amount. Only then is the booking marked `confirmed`.

The supplied static UPI QR is still displayed for your business information, but a static QR scan by itself cannot safely prove to this website which booking was paid. For automatic confirmation, customers should use the secure Razorpay checkout in this version. If you want dynamic QR payments that are tied to each booking, that can be added with Razorpay's QR API as a next step.

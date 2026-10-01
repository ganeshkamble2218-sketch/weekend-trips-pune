const corsHeaders = {
  "Access-Control-Allow-Origin": "https://ganeshkamble2218-sketch.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

const TRIP_PRICES: Record<string, number> = {
  "Kaas Pathar": 1499, "Kokan": 1050, "Matheran": 999, "Mahabaleshwar": 1000,
  "Harihareshwar – Diveagar": 1200, "Kaas Pathar + Mahabaleshwar Stay": 3199
};

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return response({ error: "Method not allowed" }, 405);

  const clientId = Deno.env.get("CASHFREE_CLIENT_ID");
  const clientSecret = Deno.env.get("CASHFREE_CLIENT_SECRET");
  const environment = (Deno.env.get("CASHFREE_ENV") || "sandbox").toLowerCase();
  if (!clientId || !clientSecret) return response({ error: "Cashfree is not configured on the payment server yet." }, 503);

  let body: any;
  try { body = await req.json(); } catch { return response({ error: "Invalid JSON" }, 400); }

  const trip = String(body.trip || ""), date = String(body.date || "");
  const name = String(body.name || "").trim(), phone = String(body.phone || "").trim();
  const pickup = String(body.pickup || "").trim();
  const seats = Array.isArray(body.seats) ? body.seats.map(Number).filter(Number.isInteger) : [];
  const plan = String(body.plan || "50");

  if (!TRIP_PRICES[trip]) return response({ error: "Invalid trip" }, 400);
  if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(date)) return response({ error: "Invalid travel date" }, 400);
  if (name.length < 2) return response({ error: "Enter a valid full name" }, 400);
  if (!/^\\d{10}$/.test(phone)) return response({ error: "Enter a valid 10-digit mobile number" }, 400);
  if (!pickup) return response({ error: "Select a pickup location" }, 400);
  if (!seats.length || seats.length > 19 || seats.some((n: number) => n < 1 || n > 19)) return response({ error: "Select valid seats" }, 400);
  if (new Set(seats).size !== seats.length) return response({ error: "Duplicate seats selected" }, 400);
  if (plan !== "50" && plan !== "100") return response({ error: "Invalid payment plan" }, 400);

  const base = seats.length * TRIP_PRICES[trip];
  const gst = Math.round(base * 0.05);
  const total = base + gst;
  const payNow = plan === "50" ? Math.round(total / 2) : total;
  const orderId = "PWG_" + Date.now() + "_" + crypto.randomUUID().slice(0, 8);
  const apiBase = environment === "production" ? "https://api.cashfree.com" : "https://sandbox.cashfree.com";
  const siteUrl = "https://ganeshkamble2218-sketch.github.io/weekend-trips-pune/";

  const cfBody = {
    order_amount: payNow, order_currency: "INR", order_id: orderId,
    customer_details: {
      customer_id: "PWG_" + phone, customer_name: name,
      customer_email: "booking@weekendtripspune.com", customer_phone: phone
    },
    order_meta: { return_url: siteUrl + "?cashfree=return&order_id={order_id}" },
    order_note: "Pune Weekend Getaways | " + trip + " | " + date + " | Seats " + seats.join(",") + " | " + plan + "% payment | Pickup " + pickup,
    order_tags: { trip, travel_date: date, seats: seats.join(","), payment_plan: plan, pickup }
  };

  const cfResponse = await fetch(apiBase + "/pg/orders", {
    method: "POST",
    headers: {
      "x-client-id": clientId, "x-client-secret": clientSecret,
      "x-api-version": "2025-01-01", "Content-Type": "application/json", "Accept": "application/json"
    },
    body: JSON.stringify(cfBody)
  });

  const raw = await cfResponse.text();
  let data: any; try { data = JSON.parse(raw); } catch { data = { raw }; }
  if (!cfResponse.ok) return response({ error: data?.message || data?.error_description || "Cashfree order creation failed", details: data }, 502);

  return response({
    ok: true, orderId: data.order_id || orderId, paymentSessionId: data.payment_session_id,
    amount: payNow, pricing: { base, gst, total, payNow, plan }, environment
  });
});

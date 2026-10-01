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

  let body: any; try { body = await req.json(); } catch { return response({ error: "Invalid JSON" }, 400); }

  const orderId = String(body.orderId || ""), trip = String(body.trip || "");
  const date = String(body.date || ""), name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim(), pickup = String(body.pickup || "").trim();
  const seats = Array.isArray(body.seats) ? body.seats.map(Number).filter(Number.isInteger) : [];
  const plan = String(body.plan || "50");

  if (!orderId || !TRIP_PRICES[trip] || !date || !name || !/^\\d{10}$/.test(phone) || !pickup || !seats.length) {
    return response({ error: "Incomplete booking information" }, 400);
  }
  const base = seats.length * TRIP_PRICES[trip], gst = Math.round(base * 0.05), total = base + gst;
  if (plan !== "50" && plan !== "100") return response({ error: "Invalid payment plan" }, 400);
  const expectedAmount = plan === "50" ? Math.round(total / 2) : total;
  const apiBase = environment === "production" ? "https://api.cashfree.com" : "https://sandbox.cashfree.com";

  const paymentResponse = await fetch(apiBase + "/pg/orders/" + encodeURIComponent(orderId) + "/payments", {
    headers: { "x-client-id": clientId, "x-client-secret": clientSecret, "x-api-version": "2025-01-01", "Accept": "application/json" }
  });
  const raw = await paymentResponse.text();
  let payments: any; try { payments = JSON.parse(raw); } catch { payments = []; }
  if (!paymentResponse.ok) return response({ error: "Could not verify payment with Cashfree", details: payments }, 502);

  const list = Array.isArray(payments) ? payments : [];
  const successful = list.find((p: any) => p?.payment_status === "SUCCESS" && Number(p?.payment_amount) === expectedAmount);
  if (!successful) {
    const pending = list.some((p: any) => p?.payment_status === "PENDING");
    return response({ paid: false, status: pending ? "PENDING" : "FAILED", message: pending ? "Payment is still pending." : "Payment was not completed for the expected amount." });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const secretKeysRaw = Deno.env.get("SUPABASE_SECRET_KEYS");
  const serviceKey = secretKeysRaw ? JSON.parse(secretKeysRaw).default : Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (supabaseUrl && serviceKey) {
    const rows = seats.map((seat: number) => ({ trip, travel_date: date, seat_number: seat }));
    const insertResponse = await fetch(supabaseUrl + "/rest/v1/seat_blocks", {
      method: "POST",
      headers: { apikey: serviceKey, Authorization: "Bearer " + serviceKey, "Content-Type": "application/json", Prefer: "resolution=ignore-duplicates,return=minimal" },
      body: JSON.stringify(rows)
    });
    if (!insertResponse.ok) {
      return response({ paid: true, status: "SUCCESS", warning: "Payment succeeded, but automatic seat confirmation needs admin review." });
    }
  }

  return response({
    paid: true, status: "SUCCESS", orderId,
    booking: { name, phone, trip, date, pickup, seats, pricing: { base, gst, total, amountPaid: expectedAmount, balance: total - expectedAmount, plan } }
  });
});

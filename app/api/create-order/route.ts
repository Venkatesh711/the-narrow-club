import { getRazorpay } from "../../../lib/razorpay";
import { PRODUCTS, calcTotals, type OrderLine } from "../../../lib/products";

export const runtime = "nodejs";

const MIN_AMOUNT_PAISE = 100;

interface CustomerInput {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export async function POST(request: Request) {
  let body: { items?: OrderLine[]; customer?: CustomerInput };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const items = body.items;
  const customer = body.customer ?? {};

  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return Response.json({ error: "Cart is empty or invalid" }, { status: 400 });
  }

  // Validate every line against the server-side catalog.
  for (const line of items) {
    const product = PRODUCTS.find((p) => p.id === line?.id);
    if (
      !product ||
      !Number.isInteger(line.qty) ||
      line.qty < 1 ||
      line.qty > 10 ||
      !product.sizes.includes(line.size)
    ) {
      return Response.json({ error: "Invalid item in cart" }, { status: 400 });
    }
  }

  const name = String(customer.name ?? "").trim();
  const phone = String(customer.phone ?? "").trim();
  const email = String(customer.email ?? "").trim();
  const address = String(customer.address ?? "").trim();
  if (!name || !phone || !email || !address) {
    return Response.json({ error: "Name, phone, email and address are required" }, { status: 400 });
  }

  // Amount is calculated on the server, never trusted from the browser.
  const { total } = calcTotals(items);
  const amount = Math.round(total * 100); // paise
  if (amount < MIN_AMOUNT_PAISE) {
    return Response.json({ error: "Amount must be at least 100 paise" }, { status: 400 });
  }

  const razorpay = getRazorpay();
  if (!razorpay) {
    return Response.json({ error: "Payment gateway is not configured" }, { status: 500 });
  }

  const itemsSummary = items
    .map((l) => `${PRODUCTS.find((p) => p.id === l.id)!.name} (${l.size}) x${l.qty}`)
    .join(", ");

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `tnc_${Date.now()}`,
      // Visible on the payment in your Razorpay dashboard so you know what to ship.
      notes: {
        customer_name: name.slice(0, 250),
        customer_phone: phone.slice(0, 250),
        customer_email: email.slice(0, 250),
        shipping_address: address.slice(0, 250),
        items: itemsSummary.slice(0, 250),
      },
    });

    return Response.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      // The Key ID is public by design (the secret is never sent to the browser).
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err: unknown) {
    const e = err as { statusCode?: number; error?: { description?: string } };
    if (e?.statusCode === 401) {
      return Response.json({ error: "Payment gateway authentication failed" }, { status: 401 });
    }
    console.error("Razorpay create order failed:", e?.error?.description ?? err);
    return Response.json({ error: "Could not create payment order" }, { status: 500 });
  }
}

import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, error: "Invalid request body" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return Response.json({ success: false, error: "Missing payment fields" }, { status: 400 });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return Response.json({ success: false, error: "Payment gateway is not configured" }, { status: 500 });
  }

  // HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(String(razorpay_signature));
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!valid) {
    return Response.json({ success: false, error: "Payment verification failed" }, { status: 400 });
  }

  return Response.json({
    success: true,
    order_id: razorpay_order_id,
    payment_id: razorpay_payment_id,
  });
}

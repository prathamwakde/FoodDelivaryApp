const crypto = require("crypto");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createPaymentOrder = async (req, res) => {
  const { amount, currency = "INR", receipt } = req.body;
  const amountInPaise = Number(amount);

  if (!Number.isInteger(amountInPaise) || amountInPaise < 100) {
    return res.status(400).json({
      success: false,
      message: "Amount must be at least 100 paise",
    });
  }

  try {
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    });

    return res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    const statusCode = error.statusCode === 401 ? 401 : 500;
    return res.status(statusCode).json({
      success: false,
      message: statusCode === 401
        ? "Razorpay authentication failed"
        : "Unable to create payment order",
    });
  }
};

const verifyPayment = (req, res) => {
  const {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
  } = req.body;

  if (!orderId || !paymentId || !signature) {
    return res.status(400).json({
      success: false,
      message: "Payment verification fields are required",
    });
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (
    generatedSignature.length !== signature.length ||
    !crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(signature)
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "Payment signature verification failed",
    });
  }

  return res.json({ success: true, message: "Payment verified successfully" });
};

module.exports = { createPaymentOrder, verifyPayment };

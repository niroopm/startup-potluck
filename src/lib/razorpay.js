import { sheetPost } from './sheet.js';

// Public key only (rzp_test_... or rzp_live_...). The secret lives in Apps Script properties.
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

function loadCheckout() {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise(resolve => {
    const s = document.createElement('script');
    s.src = CHECKOUT_SRC;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

// Resolves { ok: true, paymentId, orderId } | { ok: false, reason }.
// The amount is decided server-side (Apps Script), never by the browser.
export async function payForSession({ member, date }) {
  if (!RAZORPAY_KEY_ID) return { ok: false, reason: 'not-configured' };
  if (!(await loadCheckout())) return { ok: false, reason: 'script-blocked' };

  const order = await sheetPost({ type: 'createOrder', mobile: member.mobile, date });
  if (!order?.ok || !order.orderId) return { ok: false, reason: 'order-failed' };

  return new Promise(resolve => {
    const rzp = new window.Razorpay({
      key: RAZORPAY_KEY_ID,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'Startup Potluck',
      description: `Closed-Door Pass · ${date}`,
      prefill: { name: member.name, contact: member.mobile, email: member.email || undefined },
      theme: { color: '#5b21b6' },
      handler: async resp => {
        const verified = await sheetPost({
          type: 'verifyPayment',
          orderId: resp.razorpay_order_id,
          paymentId: resp.razorpay_payment_id,
          signature: resp.razorpay_signature,
          mobile: member.mobile,
          date
        });
        resolve(verified?.ok
          ? { ok: true, paymentId: resp.razorpay_payment_id, orderId: resp.razorpay_order_id }
          : { ok: false, reason: 'verify-failed' });
      },
      modal: { ondismiss: () => resolve({ ok: false, reason: 'dismissed' }) }
    });
    rzp.on('payment.failed', () => resolve({ ok: false, reason: 'failed' }));
    rzp.open();
  });
}

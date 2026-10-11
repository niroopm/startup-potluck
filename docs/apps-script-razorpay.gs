/**
 * Razorpay support for the existing Apps Script web app.
 *
 * Setup:
 * 1. Project Settings -> Script Properties, add:
 *      RAZORPAY_KEY_ID      = rzp_test_xxxxx
 *      RAZORPAY_KEY_SECRET  = xxxxx
 * 2. Paste these functions into your script.
 * 3. In your existing doPost(e), after parsing the JSON body into `data`, add:
 *
 *      if (data.type === 'createOrder')   return json_(createOrder_(data));
 *      if (data.type === 'verifyPayment') return json_(verifyPayment_(data));
 *
 *    (json_ = whatever helper you already use to return ContentService JSON.)
 * 4. Deploy -> Manage deployments -> edit -> New version (needed for changes to go live).
 */

var PASS_AMOUNT_PAISE = 15000; // ₹150, fixed server-side so clients can't change the price

function razorpayAuth_() {
  var p = PropertiesService.getScriptProperties();
  return {
    id: p.getProperty('RAZORPAY_KEY_ID'),
    secret: p.getProperty('RAZORPAY_KEY_SECRET')
  };
}

function createOrder_(data) {
  var k = razorpayAuth_();
  var res = UrlFetchApp.fetch('https://api.razorpay.com/v1/orders', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Basic ' + Utilities.base64Encode(k.id + ':' + k.secret) },
    muteHttpExceptions: true,
    payload: JSON.stringify({
      amount: PASS_AMOUNT_PAISE,
      currency: 'INR',
      receipt: ('pass_' + data.mobile + '_' + Date.now()).slice(0, 40),
      notes: { mobile: data.mobile, date: data.date }
    })
  });
  var body = JSON.parse(res.getContentText());
  if (res.getResponseCode() !== 200) return { ok: false, error: body.error && body.error.description };
  return { ok: true, orderId: body.id, amount: body.amount, currency: body.currency };
}

function verifyPayment_(data) {
  var k = razorpayAuth_();
  var raw = Utilities.computeHmacSha256Signature(data.orderId + '|' + data.paymentId, k.secret);
  var expected = raw.map(function (b) { return ('0' + (b & 0xff).toString(16)).slice(-2); }).join('');
  if (expected !== data.signature) return { ok: false, error: 'bad-signature' };

  // Optional: record the payment in a "Payments" sheet.
  // SpreadsheetApp.getActive().getSheetByName('Payments')
  //   .appendRow([new Date(), data.mobile, data.date, data.orderId, data.paymentId, PASS_AMOUNT_PAISE / 100]);
  return { ok: true };
}

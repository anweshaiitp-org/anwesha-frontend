export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const backendUrl = (
    process.env.NEXT_PUBLIC_HOST ||
    process.env.BACKEND_URL ||
    'http://localhost:4566/restapis/rd2pitqke0/prod/_user_request_'
  ).replace(/\/+$/, '');

  try {
    // AtomPay usually sends data via POST. We capture it and send it to our backend to verify and store in DB.
    // The encrypted response is usually in `req.body` as form-urlencoded.
    
    // Forward the request to the backend `/payment/verify` route
    const verifyRes = await fetch(`${backendUrl}/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Pass the AtomPay response payload to the backend
      body: JSON.stringify(req.body)
    });

    const verifyData = await verifyRes.json().catch(() => ({}));

    // Redirect user to frontend payment-status page with the result
    // Extract order_id, success status, and payment status from the backend response
    const orderId = verifyData.order_id || req.body.order_id || 'UNKNOWN';
    const isSuccess = verifyData.success || verifyData.status === 'PAID';
    const status = verifyData.status || (isSuccess ? 'PAID' : 'FAILED');

    // 302 redirect to /payment-status?order=xxx&success=true&status=PAID
    const redirectUrl = `/payment-status?order=${orderId}&success=${isSuccess}&status=${status}`;
    
    res.redirect(302, redirectUrl);

  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.redirect(302, '/payment-status?success=false&status=FAILED&error=verification_error');
  }
}

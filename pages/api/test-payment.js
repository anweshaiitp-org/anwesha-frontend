export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const backendUrl = (
    process.env.BACKEND_URL ||
    'http://localhost:4566/restapis/rd2pitqke0/prod/_user_request_'
  ).replace(/\/+$/, '');

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'No authorization token provided. Please log in.' });
    }

    const { event_id, team_id } = req.body;
    if (!event_id) {
      return res.status(400).json({ success: false, error: 'event_id is required' });
    }

    const isTeam = !!team_id;
    const paymentPayload = {
      domain: isTeam ? 'TEAM_EVENT' : 'SOLO_EVENT',
      reference_id: event_id,
      event_id: event_id
    };
    if (isTeam) {
      paymentPayload.team_id = team_id;
    }

    // INITIATE PAYMENT
    const initiateRes = await fetch(`${backendUrl}/payment/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(paymentPayload)
    });

    const initiateData = await initiateRes.json().catch(() => ({}));

    if (!initiateRes.ok) {
      return res.status(initiateRes.status).json({
        success: false,
        error: `Payment initiate failed (${initiateRes.status}): ${initiateData.message || JSON.stringify(initiateData)}`
      });
    }

    return res.status(200).json(initiateData);
  } catch (error) {
    console.error('Test Payment Error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
  }
}

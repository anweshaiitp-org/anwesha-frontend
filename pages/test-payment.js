import React, { useState, useEffect, useContext } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AuthContext } from '../components/authContext';

function AtomPayCheckout({ paymentData }) {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (scriptLoaded && paymentData?.success && paymentData?.atomTokenId) {
      const options = {
        atomTokenId: String(paymentData.atomTokenId),
        merchId: String(paymentData.merchId || '564719'),
        custEmail: paymentData.custEmail || '',
        custMobile: paymentData.custMobile || '',
        returnUrl: paymentData.returnUrl || ''
      };
      if (typeof window !== 'undefined' && window.AtomPaynetz) {
        new window.AtomPaynetz(options, 'prod');
      }
    }
  }, [scriptLoaded, paymentData]);

  if (!paymentData || !paymentData.success) return null;

  return (
    <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.5rem', textAlign: 'center' }}>
      <Script
        src="https://psa.atomtech.in/staticdata/ots/js/atomcheckout.js"
        onLoad={() => setScriptLoaded(true)}
      />
      <div style={{ width: '2rem', height: '2rem', border: '2px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }}></div>
      <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e40af' }}>Opening Secure Payment Gateway...</p>
    </div>
  );
}

export default function TestPaymentPage() {
  const router = useRouter();
  const { event, team } = router.query;
  const auth = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const user = auth?.state?.user;
  const contextToken = auth?.token;
  const [token, setToken] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [autoRun, setAutoRun] = useState(false);

  useEffect(() => {
    setMounted(true);
    setToken(contextToken || localStorage.getItem('anwesha_token'));
  }, [contextToken]);

  const addLog = (msg) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const runTestFlow = async () => {
    setIsLoading(true);
    setLogs([]);
    setPaymentData(null);

    try {
      const currentToken = token || localStorage.getItem('anwesha_token');

      if (!currentToken) {
        throw new Error('No login token found. Please log in first at /userLogin.');
      }

      addLog(`User session active: ${user?.email_id || user?.email || 'Logged In'}. Token ready.`);
      addLog(`Calling Next.js API Route /api/test-payment to initiate payment for ${event || 'EVT-003'}...`);

      const res = await fetch('/api/test-payment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event_id: event || 'EVT-003',
          team_id: team || undefined
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to initiate payment');
      }

      addLog(`✅ Payment Initiated! Token: ${data.atomTokenId || data.merchTxnId || 'ATOM_TOKEN_OK'}`);
      setPaymentData(data);

    } catch (error) {
      addLog(`❌ ERROR: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (event && token && !autoRun && !paymentData && !isLoading) {
      setAutoRun(true);
      runTestFlow();
    }
  }, [event, token, autoRun, paymentData, isLoading]);

  return (
    <div style={{ maxWidth: '42rem', margin: '3rem auto', padding: '2rem', fontFamily: 'system-ui, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', borderRadius: '0.75rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '1.5rem', color: '#38bdf8' }}>Secure Payment Gateway</h1>

      <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#1e293b', borderRadius: '0.5rem' }}>
        <p><strong>Status:</strong> {mounted ? (token ? 'Logged In' : 'Not Logged In') : 'Loading...'}</p>
        <p><strong>Email:</strong> {mounted ? (user?.email_id || user?.email || 'N/A') : 'Loading...'}</p>
        <p><strong>Event:</strong> {event || 'N/A'}</p>
        {team && <p><strong>Team:</strong> {team}</p>}
        {mounted && !token && (
          <p style={{ marginTop: '0.5rem' }}>
            <Link href="/userLogin" style={{ color: '#38bdf8', textDecoration: 'underline' }}>
              Click here to Login first
            </Link>
          </p>
        )}
      </div>

      <button
        onClick={runTestFlow}
        disabled={isLoading || paymentData || !token}
        style={{
          width: '100%',
          backgroundColor: isLoading || paymentData || !token ? '#64748b' : '#0284c7',
          color: '#ffffff',
          fontWeight: 600,
          padding: '0.875rem 1rem',
          borderRadius: '0.5rem',
          border: 'none',
          cursor: isLoading || paymentData || !token ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s'
        }}
      >
        {isLoading ? 'Processing Payment Request...' : `Pay for ${event || 'EVT-003'}`}
      </button>

      <div style={{ marginTop: '1.5rem', backgroundColor: '#020617', borderRadius: '0.5rem', padding: '1rem', fontFamily: 'monospace', fontSize: '0.875rem', height: '16rem', overflowY: 'auto', border: '1px solid #334155' }}>
        {logs.length === 0 && <p style={{ color: '#64748b' }}>Waiting to start payment flow...</p>}
        {logs.map((log, i) => (
          <div key={i} style={{ color: log.includes('ERROR') ? '#f87171' : log.includes('✅') ? '#4ade80' : '#cbd5e1', marginBottom: '0.25rem' }}>
            {log}
          </div>
        ))}
      </div>

      {paymentData && <AtomPayCheckout paymentData={paymentData} />}
    </div>
  );
}

import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function PaymentStatusPage() {
  const router = useRouter();
  const { order, success, status } = router.query;

  const isSuccess = success === 'true';

  return (
    <div style={{ maxWidth: '36rem', margin: '4rem auto', padding: '2rem', fontFamily: 'system-ui, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', borderRadius: '0.75rem', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
      <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', backgroundColor: isSuccess ? '#166534' : '#991b1b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem' }}>
        {isSuccess ? '✓' : '✕'}
      </div>

      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', color: isSuccess ? '#4ade80' : '#f87171' }}>
        {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
      </h1>

      <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
        {isSuccess 
          ? 'Your transaction has been confirmed and registered successfully.' 
          : 'Your payment could not be processed. Please try again.'}
      </p>

      {order && (
        <div style={{ padding: '1rem', backgroundColor: '#1e293b', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', fontFamily: 'monospace' }}>
          <p><strong>Order ID:</strong> {order}</p>
          {status && <p style={{ marginTop: '0.5rem' }}><strong>Status:</strong> {status}</p>}
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link href="/events" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#0284c7', color: '#ffffff', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600 }}>
          Back to Events
        </Link>
        <Link href="/profile" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#334155', color: '#ffffff', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600 }}>
          Go to Profile
        </Link>
      </div>
    </div>
  );
}

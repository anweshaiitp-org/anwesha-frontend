import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from '../../styles/profile.module.css'

const host = process.env.NEXT_PUBLIC_HOST

export default function VerifyEmail() {
    const router = useRouter()
    const { token } = router.query
    const [loading, setLoading] = useState(false)
    const [verified, setVerified] = useState(false)
    const [error, setError] = useState('')

    const handleVerify = async () => {
        if (!token) {
            setError('Invalid or missing token')
            return
        }

        setLoading(true)
        try {
            const response = await fetch(
                `${host}/auth/verify/${token}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )

            if (response.status === 200) {
                setVerified(true)
                toast.success('Email verified successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                })
                setTimeout(() => {
                    router.push('/userLogin')
                }, 2000)
            } else if (response.status === 400) {
                const data = await response.json()
                setError(data.message || 'Invalid or expired token')
                toast.error(data.message || 'Verification failed', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                })
            } else {
                const data = await response.json()
                setError(data.message || 'Verification failed')
                toast.error(data.message || 'Verification failed', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                })
            }
        } catch (err) {
            console.error('Verification error:', err)
            setError('An error occurred. Please try again.')
            toast.error('An error occurred. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div style={{ textAlign: 'center', padding: '20px', maxWidth: '500px' }}>
                <h1 style={{ color: '#ffcc00', marginBottom: '20px' }}>
                    Email Verification
                </h1>

                {verified ? (
                    <div>
                        <p style={{ color: '#00ff00', fontSize: '1.1rem', marginBottom: '20px' }}>
                            ✅ Email verified successfully!
                        </p>
                        <p style={{ color: '#ccc', marginBottom: '20px' }}>
                            Redirecting to login page...
                        </p>
                    </div>
                ) : error ? (
                    <div>
                        <p style={{ color: '#ff4444', fontSize: '1.1rem', marginBottom: '20px' }}>
                            ❌ {error}
                        </p>
                        <button
                            onClick={() => router.push('/userLogin')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#ffcc00',
                                color: '#000',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                            }}
                        >
                            Back to Login
                        </button>
                    </div>
                ) : (
                    <div>
                        <p style={{ color: '#ccc', marginBottom: '30px', fontSize: '1rem' }}>
                            Click the button below to verify your email address
                        </p>
                        <button
                            onClick={handleVerify}
                            disabled={loading}
                            style={{
                                padding: '12px 30px',
                                backgroundColor: loading ? '#666' : '#ffcc00',
                                color: '#000',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                            }}
                        >
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

// Required for dynamic routes in Next.js
export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking',
    }
}

export async function getStaticProps() {
    return {
        props: {},
    }
}

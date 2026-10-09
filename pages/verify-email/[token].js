import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion } from 'framer-motion'
import styles from '../../components/UserRegister-Login/style.module.css'

const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'

const cn = (...classes) => {
    return classes.filter(Boolean).join(' ')
}

export default function VerifyEmailDynamicPage() {
    const router = useRouter()
    const [status, setStatus] = useState('checking') // 'checking' | 'verifying' | 'success' | 'error' | 'missing_token'
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const verificationAttempted = useRef(false)

    const verifyToken = async (tokenToVerify) => {
        if (!tokenToVerify) {
            setStatus('missing_token')
            setMessage('Verification token is missing. Please check the link from your email.')
            return
        }

        setLoading(true)
        setStatus('verifying')

        try {
            const response = await fetch(`${host}/auth/verify/${encodeURIComponent(tokenToVerify)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            const data = await response.json()
            setLoading(false)

            if (response.status === 200 || data.success) {
                setStatus('success')
                const successMsg = data.message || 'Email verified successfully!'
                setMessage(successMsg)
                toast.success(successMsg, {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: 'light',
                })
                setTimeout(() => {
                    router.push('/userLogin')
                }, 3000)
            } else {
                setStatus('error')
                const errorMsg = data.message || 'Email verification failed or link has expired.'
                setMessage(errorMsg)
                toast.error(errorMsg, {
                    position: 'top-right',
                    autoClose: 5000,
                    theme: 'light',
                })
            }
        } catch (err) {
            console.error('[VerifyEmail] Error:', err)
            setLoading(false)
            setStatus('error')
            const netErrMsg = 'Network error while verifying email. Please check your connection.'
            setMessage(netErrMsg)
            toast.error(netErrMsg, {
                position: 'top-right',
                autoClose: 5000,
                theme: 'light',
            })
        }
    }

    useEffect(() => {
        if (router.isReady && !verificationAttempted.current) {
            const pathToken = router.query.token || (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '')
            if (pathToken && pathToken !== '[token]') {
                verificationAttempted.current = true
                verifyToken(pathToken)
            } else {
                const urlParams = new URLSearchParams(window.location.search)
                const queryToken = urlParams.get('token')
                if (queryToken) {
                    verificationAttempted.current = true
                    verifyToken(queryToken)
                } else {
                    setStatus('missing_token')
                    setMessage('Verification token is missing. Please check your email link or request a new one.')
                }
            }
        }
    }, [router.isReady, router.query])

    return (
        <>
            <Head>
                <title>Email Verification - Anwesha 2027</title>
                <meta name="description" content="Verify your email address for Anwesha 2027" />
                <link rel="icon" href="/logo_no_bg.svg" />
            </Head>

            <div className={styles.container_login}>
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

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                    <div
                        style={{
                            position: 'relative',
                            bottom: '30px',
                        }}
                        className={styles.container}
                    >
                        <div className={styles.form_reset} style={{ textAlign: 'center' }}>
                            <h2
                                style={{
                                    fontSize: '2rem',
                                    fontFamily: 'Anavio Small Capitals W01 Bold',
                                    margin: '-1rem 0 1.5rem 0',
                                    textAlign: 'center',
                                }}
                            >
                                Email Verification
                            </h2>

                            {status === 'checking' && (
                                <div style={{ padding: '20px 0', color: '#ffffff' }}>
                                    <p style={{ fontSize: '1rem', color: '#dddddd' }}>
                                        Initializing verification...
                                    </p>
                                </div>
                            )}

                            {status === 'verifying' && (
                                <div style={{ padding: '20px 0', color: '#ffffff' }}>
                                    <p style={{ fontSize: '1.1rem', color: '#ffcc00', marginBottom: '10px' }}>
                                        ⏳ Verifying your email address...
                                    </p>
                                    <p style={{ fontSize: '0.85rem', color: '#aaaaaa' }}>
                                        Please wait a moment.
                                    </p>
                                </div>
                            )}

                            {status === 'success' && (
                                <div style={{ padding: '10px 0' }}>
                                    <div
                                        style={{
                                            backgroundColor: 'rgba(0, 255, 100, 0.15)',
                                            border: '1px solid #00ff66',
                                            borderRadius: '8px',
                                            padding: '16px',
                                            marginBottom: '25px',
                                        }}
                                    >
                                        <p style={{ color: '#00ff66', fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
                                            ✓ {message}
                                        </p>
                                        <p style={{ color: '#cccccc', fontSize: '0.85rem', marginTop: '8px', marginBottom: 0 }}>
                                            Redirecting to login page in a few seconds...
                                        </p>
                                    </div>

                                    <div className={styles.hero_button}>
                                        <Link href="/userLogin">
                                            <button className={cn(styles.register_button)}>
                                                LOGIN NOW
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {status === 'missing_token' && (
                                <div style={{ padding: '10px 0' }}>
                                    <div
                                        style={{
                                            backgroundColor: 'rgba(255, 68, 68, 0.15)',
                                            border: '1px solid #ff4444',
                                            borderRadius: '8px',
                                            padding: '16px',
                                            marginBottom: '25px',
                                        }}
                                    >
                                        <p style={{ color: '#ff4444', fontSize: '1rem', fontWeight: 600, margin: 0 }}>
                                            ⚠ Verification Token Missing
                                        </p>
                                        <p style={{ color: '#dddddd', fontSize: '0.85rem', marginTop: '8px', marginBottom: 0 }}>
                                            {message}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                                        <div className={styles.hero_button}>
                                            <Link href="/">
                                                <button className={cn(styles.register_button)}>
                                                     Home page
                                                </button>
                                            </Link>
                                        </div>

                                        <Link
                                            href="/userLogin"
                                            style={{ color: '#ffffff', fontSize: '0.85rem', textDecoration: 'underline' }}
                                        >
                                            Back to Login
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {status === 'error' && (
                                <div style={{ padding: '10px 0' }}>
                                    <div
                                        style={{
                                            backgroundColor: 'rgba(255, 68, 68, 0.15)',
                                            border: '1px solid #ff4444',
                                            borderRadius: '8px',
                                            padding: '16px',
                                            marginBottom: '25px',
                                        }}
                                    >
                                        <p style={{ color: '#ff4444', fontSize: '1rem', fontWeight: 600, margin: 0 }}>
                                            ✕ Verification Failed
                                        </p>
                                        <p style={{ color: '#dddddd', fontSize: '0.85rem', marginTop: '8px', marginBottom: 0 }}>
                                            {message}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                                        <div className={styles.hero_button}>
                                            <Link href="/send-verification">
                                                <button className={cn(styles.register_button)}>
                                                    RESEND VERIFICATION
                                                </button>
                                            </Link>
                                        </div>

                                        <Link
                                            href="/userLogin"
                                            style={{ color: '#ffffff', fontSize: '0.85rem', textDecoration: 'underline' }}
                                        >
                                            Back to Login
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    )
}

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

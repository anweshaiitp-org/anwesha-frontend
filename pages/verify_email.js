import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from '../components/UserRegister-Login/style.module.css'

const cn = (...classes) => classes.filter(Boolean).join(' ')

export default function VerifyEmail() {
    const router = useRouter()
    const { token, email } = router.query
    const [status, setStatus] = useState('LOADING')
    const [resendStatus, setResendStatus] = useState('NORMAL')
    const [cooldown, setCooldown] = useState(0)
    const [inputEmail, setInputEmail] = useState('')

    useEffect(() => {
        if (email) setInputEmail(email)
    }, [email])

    useEffect(() => {
        if (!router.isReady) return

        const activeToken = token || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('token') : null)

        if (router.query.preview === 'success' || activeToken === 'demo_success') {
            setStatus('SUCCESS')
            return
        }
        if (router.query.preview === 'expired') {
            setStatus('EXPIRED')
            return
        }
        if (router.query.preview === 'error') {
            setStatus('ERROR')
            return
        }
        if (!activeToken) {
            setStatus('MISSING_TOKEN')
            return
        }

        const verifyToken = async () => {
            try {
                const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'
                const response = await fetch(`${host}/auth/verify/${encodeURIComponent(activeToken)}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                })
                const data = await response.json().catch(() => ({}))
                const message = (data.message || '').toLowerCase()

                if ((response.ok && data.success === true) || message.includes('success')) {
                    setStatus(message.includes('already verified') ? 'ALREADY_VERIFIED' : 'SUCCESS')
                } else if (response.status === 409 || message.includes('already verified')) {
                    setStatus('ALREADY_VERIFIED')
                } else if (response.status === 410 || message.includes('expired')) {
                    setStatus('EXPIRED')
                } else if ([400, 404].includes(response.status) || message.includes('invalid')) {
                    setStatus('INVALID')
                } else {
                    setStatus('ERROR')
                }
            } catch {
                setStatus('ERROR')
            }
        }

        verifyToken()
    }, [router.isReady, token])

    useEffect(() => {
        if (!cooldown) return
        const timer = setInterval(() => setCooldown(v => v - 1), 1000)
        return () => clearInterval(timer)
    }, [cooldown])

    const handleResend = async (e) => {
        e.preventDefault()
        const targetEmail = inputEmail.trim()

        if (cooldown) return
        if (!targetEmail) {
            toast.error('Please enter your email address', {
                position: 'top-right', theme: 'light'
            })
            return
        }

        setResendStatus('SENDING')

        try {
            const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'
            const response = await fetch(`${host}/auth/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email_id: targetEmail })
            })
            const data = await response.json().catch(() => ({}))

            if (response.ok) {
                setResendStatus('SENT')
                setCooldown(45)
                toast.success('✓ Verification email sent! Please check your inbox.', {
                    position: 'top-right', theme: 'light'
                })
                setTimeout(() => setResendStatus('NORMAL'), 3000)
            } else {
                setResendStatus('NORMAL')
                toast.error(data.message || 'Failed to resend email', {
                    position: 'top-right', theme: 'light'
                })
            }
        } catch {
            setResendStatus('NORMAL')
            toast.error('Network error. Please try again.', {
                position: 'top-right', theme: 'light'
            })
        }
    }

    const success = ['SUCCESS', 'ALREADY_VERIFIED'].includes(status)
    const warning = ['EXPIRED', 'INVALID', 'MISSING_TOKEN'].includes(status)

    const icon = status === 'LOADING' ? '⏳' : success ? '✓' : warning ? '⚠' : '✕'
    const iconColor = status === 'LOADING' ? '#ccc' : success ? '#4ade80' : warning ? '#facc15' : '#f87171'
    const titleColor = iconColor

    return (
        <>
            <Head>
                <title>Email Verification - Anwesha 2026</title>
            </Head>

            <div className={styles.container_login}
                style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>

                <ToastContainer position="top-right" autoClose={3000}
                    newestOnTop closeOnClick pauseOnFocusLoss
                    draggable pauseOnHover theme="light" />

                <motion.div initial={{ opacity: 0, x: '-20%' }}
                    whileInView={{ opacity: 1, x: '0%' }}
                    transition={{ duration: 1 }}
                    style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>

                    <div className={styles.container}
                        style={{ maxWidth: '500px', width: '100%', padding: '20px' }}>

                        <div className={styles.form_login}
                            style={{
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', textAlign: 'center'
                            }}>

                            <div style={{
                                width: '65px', height: '65px', borderRadius: '50%',
                                backgroundColor: `${iconColor}26`,
                                border: `2px solid ${iconColor}`, color: iconColor,
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontSize: '2rem',
                                marginBottom: '20px', fontWeight: 'bold'
                            }}>
                                {icon}
                            </div>

                            {status === 'LOADING' && (
                                <>
                                    <h1 className={styles.register_page_heading}
                                        style={{ marginBottom: '20px', color: '#ccc' }}>
                                        Verifying Email...
                                    </h1>
                                    <p style={{
                                        color: '#ccc', marginBottom: '15px',
                                        fontSize: '1rem', lineHeight: '1.5'
                                    }}>
                                        Please wait while we verify your verification link.
                                    </p>
                                </>
                            )}

                            {success && (
                                <>
                                    <h1 className={styles.register_page_heading}
                                        style={{ marginBottom: '20px', color: titleColor }}>
                                        {status === 'SUCCESS'
                                            ? 'Email Verified Successfully!'
                                            : 'Email Already Verified'}
                                    </h1>

                                    <p style={{
                                        color: '#ddd', marginBottom: '35px',
                                        fontSize: '1rem', lineHeight: '1.5'
                                    }}>
                                        {status === 'SUCCESS'
                                            ? 'Your email has been successfully verified. You can now log in to your Anwesha account.'
                                            : 'Your email has already been verified. You can log in to your Anwesha account.'}
                                    </p>

                                    <div className={styles.hero_button} style={{ width: '100%' }}>
                                        <button onClick={() => router.push('/userLogin')}
                                            className={cn(styles.register_button)}
                                            style={{ width: '100%' }}>
                                            GO TO LOGIN
                                        </button>
                                    </div>
                                </>
                            )}

                            {warning && (
                                <>
                                    <h1 className={styles.register_page_heading}
                                        style={{ marginBottom: '20px', color: '#facc15' }}>
                                        {status === 'EXPIRED'
                                            ? 'Verification Link Expired'
                                            : 'Verification Link Invalid'}
                                    </h1>

                                    <p style={{
                                        color: '#ddd', marginBottom: '25px',
                                        fontSize: '1rem', lineHeight: '1.5'
                                    }}>
                                        {status === 'EXPIRED'
                                            ? 'This verification link has expired or is no longer valid.'
                                            : 'This verification link is missing or invalid.'}
                                        <br />
                                        Please request a new verification email to verify your account.
                                    </p>

                                    <input type="email"
                                        placeholder="Enter your registered email"
                                        value={inputEmail}
                                        onChange={e => setInputEmail(e.target.value)}
                                        style={{
                                            width: '100%', padding: '12px', marginBottom: '20px',
                                            borderRadius: '5px',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            color: '#fff', fontSize: '1rem'
                                        }} />

                                    <div className={styles.hero_button}
                                        style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                        <button onClick={handleResend}
                                            className={cn(styles.register_button)}
                                            disabled={resendStatus === 'SENDING' || cooldown > 0}
                                            style={{
                                                width: 'auto', padding: '12px 30px',
                                                whiteSpace: 'nowrap', fontWeight: 'bold',
                                                fontSize: '1rem', letterSpacing: '0.5px'
                                            }}>
                                            {resendStatus === 'SENDING' ? 'SENDING...' :
                                                resendStatus === 'SENT' ? 'EMAIL SENT ✓' :
                                                    'RESEND VERIFICATION EMAIL'}
                                        </button>
                                    </div>

                                    {cooldown > 0 && (
                                        <p style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '15px' }}>
                                            You can request another email in {cooldown} seconds.
                                        </p>
                                    )}
                                </>
                            )}

                            {status === 'ERROR' && (
                                <>
                                    <h1 className={styles.register_page_heading}
                                        style={{ marginBottom: '20px', color: '#f87171' }}>
                                        Something Went Wrong
                                    </h1>
                                    <p style={{
                                        color: '#ccc', marginBottom: '35px',
                                        fontSize: '1rem', lineHeight: '1.5'
                                    }}>
                                        We couldn&apos;t verify your email right now. Please try again later.
                                    </p>
                                    <div className={styles.hero_button} style={{ width: '100%' }}>
                                        <button onClick={() => window.location.reload()}
                                            className={cn(styles.register_button)}
                                            style={{ width: '100%' }}>
                                            TRY AGAIN
                                        </button>
                                    </div>
                                </>
                            )}

                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    )
}
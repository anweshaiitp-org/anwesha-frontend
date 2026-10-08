import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from '../components/UserRegister-Login/style.module.css'

const cn = (...classes) => {
    return classes.filter(Boolean).join(' ')
}

function maskEmail(email) {
    if (!email) return ''
    const parts = email.split('@')
    if (parts.length !== 2) return email
    const name = parts[0]
    const domain = parts[1]
    if (name.length <= 3) return `${name}***@${domain}`
    return `${name.substring(0, Math.min(name.length, 7))}***@${domain}`
}

export default function CheckEmail() {
    const router = useRouter()
    const { email } = router.query
    const [resendStatus, setResendStatus] = useState('NORMAL')
    const [cooldown, setCooldown] = useState(0)

    const maskedEmail = email ? maskEmail(email) : ''

    useEffect(() => {
        let timer
        if (cooldown > 0) {
            timer = setInterval(() => {
                setCooldown(prev => prev - 1)
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [cooldown])

    const handleResend = async (e) => {
        e.preventDefault()

        if (cooldown > 0 || !email) {
            if (!email) {
                toast.error('Email address not found', {
                    position: 'top-right',
                    theme: 'light'
                })
            }
            return
        }

        setResendStatus('SENDING')

        try {
            const host = process.env.NEXT_PUBLIC_HOST || 'https://backend.anwesha.live'

            const response = await fetch(`${host}/auth/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email_id: email })
            })

            if (response.ok) {
                setResendStatus('SENT')
                setCooldown(45)

                toast.success('✓ Verification email sent!', {
                    position: 'top-right',
                    theme: 'light'
                })

                setTimeout(() => setResendStatus('NORMAL'), 3000)
            } else {
                const data = await response.json().catch(() => ({}))
                setResendStatus('NORMAL')

                toast.error(data.message || 'Failed to resend email', {
                    position: 'top-right',
                    theme: 'light'
                })
            }
        } catch (err) {
            setResendStatus('NORMAL')

            toast.error('Network error. Please try again.', {
                position: 'top-right',
                theme: 'light'
            })
        }
    }

    return (
        <>
            <Head>
                <title>Check Your Email - Anwesha 2026</title>
            </Head>

            <div
                className={styles.container_login}
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
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
                    initial={{ opacity: 0, x: '-20%' }}
                    whileInView={{ opacity: 1, x: '0%' }}
                    transition={{ duration: 1 }}
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <div
                        className={styles.container}
                        style={{
                            maxWidth: '500px',
                            width: '100%',
                            padding: '20px'
                        }}
                    >
                        <div
                            className={styles.form_login}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center'
                            }}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '5px' }}>
                                📩
                            </div>

                            <h1
                                className={styles.register_page_heading}
                                style={{ marginBottom: '15px' }}
                            >
                                Check Your Email
                            </h1>

                            <p
                                style={{
                                    color: '#ccc',
                                    marginBottom: '15px',
                                    fontSize: '1.05rem',
                                    lineHeight: '1.5'
                                }}
                            >
                                We&apos;ve sent a verification link to{' '}
                                {email ? (
                                    <strong style={{ color: '#fff' }}>
                                        {maskedEmail}
                                    </strong>
                                ) : (
                                    'your registered email address'
                                )}
                                .
                            </p>

                            <p
                                style={{
                                    color: '#ccc',
                                    marginBottom: '25px',
                                    fontSize: '1.05rem',
                                    lineHeight: '1.5'
                                }}
                            >
                                Click the link in the email to verify your
                                account and complete your registration.
                            </p>

                            <div
                                style={{
                                    width: '100%',
                                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                                    paddingTop: '20px'
                                }}
                            >
                                <p
                                    style={{
                                        color: '#aaa',
                                        marginBottom: '20px',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.5'
                                    }}
                                >
                                    Can&apos;t find the email? Check your Spam
                                    or Junk folder, or request a new
                                    verification email.
                                </p>

                                <div
                                    className={styles.hero_button}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <button
                                        onClick={handleResend}
                                        className={cn(styles.register_button)}
                                        disabled={
                                            resendStatus === 'SENDING' ||
                                            cooldown > 0
                                        }
                                        style={{
                                            width: 'auto',
                                            padding: '12px 30px',
                                            whiteSpace: 'nowrap',
                                            fontWeight: 'bold',
                                            fontSize: '1rem',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        {resendStatus === 'NORMAL' &&
                                            'RESEND VERIFICATION EMAIL'}
                                        {resendStatus === 'SENDING' &&
                                            'SENDING...'}
                                        {resendStatus === 'SENT' &&
                                            'EMAIL SENT ✓'}
                                    </button>
                                </div>

                                {cooldown > 0 && (
                                    <p
                                        style={{
                                            fontSize: '0.85rem',
                                            color: '#aaa',
                                            marginTop: '15px'
                                        }}
                                    >
                                        You can request another email in{' '}
                                        {cooldown} seconds.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    )
}
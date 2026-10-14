import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from '../styles/send-verification.module.css' // Update path to your CSS module
import { ButtonLoader } from '../components/Loader'

const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'

const MAX_EMAILS = 3
const WINDOW_MS = 30 * 60 * 1000 // matches backend: 30 minutes
const COOLDOWN_MS = 60 * 1000 // 60s between sends (UI only)

const EMPTY_RECORD = { count: 0, windowStart: 0, cooldownUntil: 0 }
const storageKey = (email) => `verify-email-record:${email.toLowerCase()}`

const loadRecord = (email) => {
    try {
        const raw = window.localStorage.getItem(storageKey(email))
        if (!raw) return { ...EMPTY_RECORD }
        const rec = { ...EMPTY_RECORD, ...JSON.parse(raw) }
        // Window expired -> reset the counter (keep nothing)
        if (rec.windowStart && Date.now() - rec.windowStart >= WINDOW_MS) {
            return { ...EMPTY_RECORD }
        }
        return rec
    } catch {
        return { ...EMPTY_RECORD }
    }
}

const saveRecord = (email, rec) => {
    try {
        window.localStorage.setItem(storageKey(email), JSON.stringify(rec))
    } catch {
        /* storage unavailable, ignore */
    }
}

const SendVerification = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [isValidating, setIsValidating] = useState(true)
    const [record, setRecord] = useState({ ...EMPTY_RECORD })
    const [now, setNow] = useState(Date.now())

    // Read email strictly from the URL query
    useEffect(() => {
        if (!router.isReady) return

        const raw = router.query.email 
        const queryEmail = Array.isArray(raw) ? raw[0] : raw

        if (queryEmail) {
            setEmail(queryEmail)
            setRecord(loadRecord(queryEmail))
            setIsValidating(false)
        } else {
            toast.error('No email provided. Redirecting...', {
                position: 'top-right',
                theme: 'light',
                autoClose: 2000,
            })
            router.push('/userRegister')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady, router.query.email])

    // One ticking clock drives the cooldown and the 30-minute window
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000)
        return () => clearInterval(timer)
    }, [])

    // When the 30-minute window ends, reset the counter
    useEffect(() => {
        if (email && record.windowStart && now - record.windowStart >= WINDOW_MS) {
            const fresh = { ...EMPTY_RECORD }
            setRecord(fresh)
            saveRecord(email, fresh)
        }
    }, [now, record.windowStart, email])

    const update = (next) => {
        setRecord(next)
        saveRecord(email, next)
    }

    const attemptsLeft = Math.max(0, MAX_EMAILS - record.count)
    const limitReached = attemptsLeft === 0
    const cooldown = Math.max(0, Math.ceil((record.cooldownUntil - now) / 1000))
    const emailSent = record.count > 0
    const minutesLeft = record.windowStart
        ? Math.max(1, Math.ceil((record.windowStart + WINDOW_MS - now) / 60000))
        : 30
    const disabled = loading || limitReached || cooldown > 0

    const handleResend = async (e) => {
        e.preventDefault()

        if (!email) {
            toast.error('Email address is missing.', { position: 'top-right', theme: 'light' })
            return
        }
        if (disabled) return

        setLoading(true)

        try {
            const response = await fetch(`${host}/auth/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email_id: email }),
            })

            const data = await response.json().catch(() => ({}))
            setLoading(false)

            const t = Date.now()
            const message = data.message || ''

            if (response.status === 200) {
                const count = record.count + 1
                const next = {
                    count,
                    windowStart: record.windowStart || t,
                    cooldownUntil: count >= MAX_EMAILS ? 0 : t + COOLDOWN_MS,
                }
                update(next)
                toast.success('Verification email sent! Check your inbox and spam folder.', {
                    position: 'top-right',
                    theme: 'light',
                })
            } else if (response.status === 429) {
                // Backend's per-user limit message vs. the generic IP rate limiter
                if (/limit exceeded|30 minutes/i.test(message)) {
                    update({
                        count: MAX_EMAILS,
                        windowStart: record.windowStart || t,
                        cooldownUntil: 0,
                    })
                    toast.error(
                        'You have used all 3 verification emails. Please try again after 30 minutes.',
                        { position: 'top-right', theme: 'light' }
                    )
                } else {
                    update({ ...record, cooldownUntil: t + COOLDOWN_MS })
                    toast.error(message || 'Too many requests. Please wait a minute and try again.', {
                        position: 'top-right',
                        theme: 'light',
                    })
                }
            } else if (response.status === 400 && /already verified/i.test(message)) {
                toast.info('Your email is already verified. Redirecting to login...', {
                    position: 'top-right',
                    theme: 'light',
                    autoClose: 2000,
                })
                setTimeout(() => router.push('/userLogin'), 2000)
            } else if (response.status === 404) {
                toast.error('Account not found. Please register again.', {
                    position: 'top-right',
                    theme: 'light',
                })
            } else {
                toast.error(message || 'Failed to send email. Please try again.', {
                    position: 'top-right',
                    theme: 'light',
                })
            }
        } catch (err) {
            setLoading(false)
            toast.error('Network error. Check your connection.', {
                position: 'top-right',
                theme: 'light',
            })
        }
    }

    if (isValidating) {
        return (
            <div>
                <ToastContainer />
                <div style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>
                    Loading...
                </div>
            </div>
        )
    }

    return (
        <div>
            <ToastContainer />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className={styles.container}>
                    <div className={styles.form}>
                        <div className={styles.register_page_heading}>
                            Verify Your Email
                            <p className={styles.register_page_subheading}>
                                {emailSent ? (
                                    <>
                                        Verification link sent! Check your inbox (and spam folder).
                                        The link is valid for 15 minutes.
                                    </>
                                ) : (
                                    <>
                                        Click SEND EMAIL below and we&apos;ll send a verification
                                        link to your address. You can request up to {MAX_EMAILS}{' '}
                                        verification emails every 30 minutes.
                                    </>
                                )}
                            </p>
                        </div>

                        <div
                            className={styles.field}
                            style={{ marginTop: '10px', textAlign: 'left', width: '100%' }}
                        >
                            <label htmlFor="email">Email Address</label>
                            <br />
                            <input
                                type="email"
                                value={email}
                                readOnly
                                style={{
                                    opacity: 0.6,
                                    cursor: 'not-allowed',
                                    outline: 'none',
                                    pointerEvents: 'none',
                                }}
                            />
                        </div>

                        <p style={{ marginTop: 14, fontSize: '0.85rem', textAlign: 'center' }}>
                            {limitReached
                                ? `You've used all ${MAX_EMAILS} verification emails. Please try again in about ${minutesLeft} minute${minutesLeft === 1 ? '' : 's'}.`
                                : `Emails remaining: ${attemptsLeft} of ${MAX_EMAILS}`}
                        </p>

                        <div className={styles.hero_button} style={{ marginTop: '20px' }}>
                            <button
                                onClick={handleResend}
                                disabled={disabled}
                                className={styles.register_button}
                                style={{
                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                    filter: disabled
                                        ? 'opacity(60%) grayscale(100%)'
                                        : 'drop-shadow(0px 0px 0px #ffffff)',
                                }}
                            >
                                {loading
                                    ? <ButtonLoader loading label="SENDING" />
                                    : limitReached
                                        ? 'LIMIT REACHED'
                                        : cooldown > 0
                                            ? `RESEND IN ${cooldown}s`
                                            : emailSent
                                                ? 'RESEND EMAIL'
                                                : 'SEND EMAIL'}
                            </button>
                        </div>

                        <p style={{ marginTop: '30px', fontSize: '0.9rem', textAlign: 'center' }}>
                            Verified your account? &nbsp;
                            <Link href="/userLogin" style={{ color: '#ffffff', fontWeight: 600 }}>
                                Login here.
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default SendVerification
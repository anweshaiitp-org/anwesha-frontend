import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from '../styles/send-verification.module.css' // Update path to your CSS module

const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'

const SendVerification = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [cooldown, setCooldown] = useState(0)
    const [isValidating, setIsValidating] = useState(true)

    // Strictly retrieve email from URL query
    useEffect(() => {
        if (router.isReady) {
            const queryEmail = router.query.email;
            if (queryEmail) {
                setEmail(queryEmail)
                setIsValidating(false)
            } else {
                toast.error('No email provided. Redirecting...', {
                    position: 'top-right',
                    theme: 'light',
                    autoClose: 2000
                })
                router.push('/userRegister') 
            }
        }
    }, [router.isReady, router.query, router])

    // Handle 60-second cooldown timer
    useEffect(() => {
        let timer
        if (cooldown > 0) {
            timer = setInterval(() => {
                setCooldown((prev) => prev - 1)
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [cooldown])

    const handleResend = async (e) => {
        e.preventDefault()

        if (!email) {
            toast.error('Email address is missing.', { position: 'top-right', theme: 'light' })
            return
        }

        setLoading(true)

        try {
            const response = await fetch(`${host}/auth/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email_id: email }),
            })

            const data = await response.json()
            setLoading(false)

            if (response.status === 200) {
                toast.success('Verification email sent successfully!', {
                    position: 'top-right',
                    theme: 'light',
                })
                setCooldown(60)
            } else if (response.status === 429) {
                toast.error(data.message || 'Rate limit exceeded. Please wait.', {
                    position: 'top-right',
                    theme: 'light',
                })
                setCooldown(60)
            } else {
                toast.error(data.message || 'Failed to resend email.', {
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
                                We've sent a verification link to your email address. 
                                Please check your inbox (and spam folder).
                            </p>
                        </div>

                        <div className={styles.field} style={{ marginTop: '10px', textAlign: 'left', width: '100%' }}>
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
                                    pointerEvents: 'none'
                                }}
                            />
                        </div>

                        <div className={styles.hero_button} style={{ marginTop: '20px' }}>
                            <button
                                onClick={handleResend}
                                disabled={cooldown > 0 || loading}
                                className={styles.register_button}
                                style={{
                                    cursor: cooldown > 0 || loading ? 'not-allowed' : 'pointer',
                                    filter: cooldown > 0 || loading ? 'opacity(60%) grayscale(100%)' : 'drop-shadow(0px 0px 0px #ffffff)'
                                }}
                            >
                                {loading 
                                    ? 'SENDING...' 
                                    : cooldown > 0 
                                        ? `RESEND IN ${cooldown}s` 
                                        : 'RESEND'}
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
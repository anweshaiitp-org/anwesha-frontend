import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from '../../components/UserRegister-Login/style.module.css'
import { motion } from 'framer-motion'
import Link from 'next/link'

const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'

const cn = (...classes) => {
    return classes.filter(Boolean).join(' ')
}

const ResetPassword = () => {
    const router = useRouter()
    const { token } = router.query
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        const resetToken = token || (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '')

        if (!resetToken) {
            toast.error('Reset token is missing from the URL.', {
                position: 'top-right',
                theme: 'light',
            })
            return
        }

        // Validation
        if (!password || !confirmPassword) {
            toast.warning('Please fill in all password fields', {
                position: 'top-right',
                autoClose: 3000,
                theme: 'light',
            })
            return
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match', {
                position: 'top-right',
                autoClose: 3000,
                theme: 'light',
            })
            return
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long', {
                position: 'top-right',
                autoClose: 3000,
                theme: 'light',
            })
            return
        }

        setLoading(true)

        try {
            const response = await fetch(`${host}/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: resetToken,
                    password: password,
                    new_password: password,
                }),
            })

            const data = await response.json()
            setLoading(false)

            if (response.status === 200 || data.success) {
                toast.success(data.message || 'Password reset successfully! Redirecting to login...', {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: 'light',
                })
                setTimeout(() => {
                    router.push('/userLogin')
                }, 2000)
            } else {
                toast.error(data.message || 'Unable to reset password. The link may have expired.', {
                    position: 'top-right',
                    autoClose: 4000,
                    theme: 'light',
                })
            }
        } catch (err) {
            console.error('[ResetPassword] Error:', err)
            setLoading(false)
            toast.error('Password reset failed. Check your internet connection.', {
                position: 'top-right',
                theme: 'light',
            })
        }
    }

    return (
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

            <motion.form
                initial={{ opacity: 0, x: '-20%' }}
                whileInView={{ opacity: 1, x: '0%' }}
                transition={{ duration: 1 }}
            >
                <div
                    style={{
                        position: 'relative',
                        bottom: '70px',
                    }}
                    className={styles.container}
                >
                    <div className={styles.form_reset}>
                        <h2
                            style={{
                                fontSize: '2rem',
                                fontFamily: 'Anavio Small Capitals W01 Bold',
                                margin: '-1rem 0 2rem 0',
                                textAlign: 'center',
                            }}
                        >
                            Set New Password
                        </h2>

                        <div className={styles.field}>
                            <label htmlFor="password">New Password</label>
                            <br />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <br />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <br />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <br />
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: '10px',
                                gap: '8px',
                                color: '#ffffff',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                            }}
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={(e) => setShowPassword(e.target.checked)}
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    cursor: 'pointer',
                                }}
                            />
                            <label style={{ cursor: 'pointer' }}>Show Password</label>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <br />
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                            >
                                <Link
                                    href="/userLogin"
                                    style={{
                                        color: '#ffffff',
                                        fontSize: '0.8rem',
                                        marginBottom: 15,
                                        textAlign: 'center',
                                    }}
                                >
                                    Back to Login
                                </Link>
                            </div>
                        </div>

                        <div className={styles.hero_button}>
                            <button
                                className={cn(styles.register_button)}
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'RESETTING...' : 'RESET PASSWORD'}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.form>
        </div>
    )
}

export default ResetPassword

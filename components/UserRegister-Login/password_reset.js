import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from './style.module.css'
import { motion } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'

const cn = (...classes) => {
    return classes.filter(Boolean).join(' ')
}

const ChangePassword = () => {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [cnfPassword, setCnfPassword] = useState('')
    const [passwordShown, setPasswordShown] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        const resetToken =
            router.query.token ||
            router.query.slug ||
            (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '')

        if (!resetToken) {
            toast.error('Reset token is missing.', {
                position: 'top-right',
                theme: 'light',
            })
            return
        }

        if (!password || !cnfPassword) {
            toast.warning('Please fill all password fields', {
                position: 'top-right',
                theme: 'light',
            })
            return
        } else if (password !== cnfPassword) {
            toast.warning('Passwords do not match', {
                position: 'top-right',
                theme: 'light',
            })
            return
        } else if (password.length < 6) {
            toast.error('Password must be at least 6 characters long', {
                position: 'top-right',
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
                toast.success('Password reset successfully! Redirecting to login...', {
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
        <div
            style={{
                position: 'relative',
                marginTop: '120px',
                overflow: 'hidden',
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

            <div className={styles.form}>
                <motion.form
                    className={styles.mainForm}
                    initial={{ opacity: 0, x: '-20%' }}
                    whileInView={{ opacity: 1, x: '0%' }}
                    transition={{ duration: 1 }}
                >
                    <h2 className={styles.register_page_heading}>
                        Password Reset
                    </h2>
                    <hr />
                    <div className={styles.form_row}>
                        <div className={styles.field}>
                            <label htmlFor="password">Password</label>
                            <br />
                            <input
                                type={passwordShown ? 'text' : 'password'}
                                name="Password"
                                placeholder="New password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <br />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="confirm_password">Confirm Password</label>
                            <br />
                            <input
                                type={passwordShown ? 'text' : 'password'}
                                name="confirm_password"
                                placeholder="Confirm password"
                                value={cnfPassword}
                                onChange={(e) => setCnfPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <br />
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                        }}
                        onClick={() => setPasswordShown((prev) => !prev)}
                    >
                        <input
                            type="checkbox"
                            checked={passwordShown}
                            onChange={(e) => setPasswordShown(e.target.checked)}
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
                        <Link
                            href="/userLogin"
                            style={{ color: '#ffffff', fontWeight: 300 }}
                        >
                            Back to Login
                        </Link>
                    </div>
                    <div className={styles.hero_button}>
                        <button
                            type="submit"
                            className={cn(styles.register_button)}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'RESETTING...' : 'SUBMIT'}
                        </button>
                    </div>
                </motion.form>
            </div>
        </div>
    )
}

export default ChangePassword

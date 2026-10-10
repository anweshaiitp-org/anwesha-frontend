import React, { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from './style.module.css'
import { motion } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import { AuthContext } from '../authContext'
import 'react-toastify/dist/ReactToastify.css'

const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'

const cn = (...classes) => {
    return classes.filter(Boolean).join(' ')
}

const ChangePasswordForm = () => {
    const router = useRouter()
    const context = useContext(AuthContext)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.warning('Please fill in all password fields', {
                position: 'top-right',
                autoClose: 3000,
                theme: 'light',
            })
            return
        }

        if (newPassword.length < 8) {
            toast.error('New password must be at least 8 characters long', {
                position: 'top-right',
                autoClose: 3000,
                theme: 'light',
            })
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error('New password and confirm password do not match', {
                position: 'top-right',
                autoClose: 3000,
                theme: 'light',
            })
            return
        }

        if (currentPassword === newPassword) {
            toast.error('New password must be different from current password', {
                position: 'top-right',
                autoClose: 3000,
                theme: 'light',
            })
            return
        }

        setLoading(true)

        try {
            const authHeaders = context?.getAuthHeaders ? context.getAuthHeaders() : {}
            const response = await fetch(`${host}/users/change-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders,
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            })

            const data = await response.json().catch(() => ({}))
            setLoading(false)

            if (response.ok && data.success !== false) {
                toast.success(data.message || 'Password changed successfully! Redirecting to profile...', {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: 'light',
                })
                setTimeout(() => {
                    router.push('/profile')
                }, 1500)
                return
            }

            toast.error(
                data.message ||
                data.error ||
                'Unable to change password. Please check your current password.',
                {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: 'light',
                }
            )
        } catch (err) {
            console.error('[ChangePassword] Error:', err)
            setLoading(false)
            toast.error('Failed to change password. Check your connection.', {
                position: 'top-right',
                autoClose: 3000,
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
                onSubmit={handleSubmit}
            >
                <div className={styles.container}>
                    <div className={styles.form_login}>
                        <h1 className={styles.register_page_heading}>
                            Change Password
                        </h1>

                        <div className={styles.field}>
                            <label htmlFor="current_password">Current Password</label>
                            <br />
                            <input
                                type="password"
                                id="current_password"
                                name="current_password"
                                placeholder="Enter your current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                            <br />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="new_password">New Password</label>
                            <br />
                            <input
                                type="password"
                                id="new_password"
                                name="new_password"
                                placeholder="Enter your new password (min 8 characters)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <br />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="confirm_password">Confirm New Password</label>
                            <br />
                            <input
                                type="password"
                                id="confirm_password"
                                name="confirm_password"
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <br />
                        </div>

                        <br />

                        <div className={styles.hero_button}>
                            <button
                                type="submit"
                                className={cn(styles.register_button)}
                                disabled={loading}
                            >
                                {loading ? 'CHANGING...' : 'CHANGE PASSWORD'}
                            </button>
                        </div>

                        <p
                            style={{
                                fontSize: '0.9rem',
                                marginTop: 24,
                                textAlign: 'center',
                            }}
                        >
                            <Link
                                href="/profile"
                                style={{
                                    color: '#ffffff',
                                    fontWeight: 600,
                                    textDecoration: 'underline',
                                }}
                            >
                                ← Back to Profile
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.form>
        </div>
    )
}

export default ChangePasswordForm

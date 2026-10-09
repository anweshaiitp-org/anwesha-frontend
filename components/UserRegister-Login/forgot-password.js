import React, { useContext } from 'react'
import Image from 'next/image'
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

const ForgotPassword = () => {
    const [email, setEmail] = React.useState('')
    const [loading, setLoading] = React.useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        const trimmedEmail = email.trim().toLowerCase()
        if (!trimmedEmail) {
            toast.warning('Please enter your email address', {
                position: 'top-right',
                theme: 'light',
            })
            return
        }

        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!emailRegex.test(trimmedEmail)) {
            toast.warning('Please provide a valid email address', {
                position: 'top-right',
                theme: 'light',
            })
            return
        }

        setLoading(true)

        try {
            const response = await fetch(`${host}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email_id: trimmedEmail }),
            })

            const data = await response.json()
            setLoading(false)

            if (response.status === 200 || response.status === 201 || data.success) {
                toast.success(
                    data.message || 'Please check your email for the password reset link. Make sure to check your spam folder.',
                    {
                        position: 'top-right',
                        autoClose: 5000,
                        theme: 'light',
                    }
                )
            } else {
                toast.error(data.message || 'Unable to request password reset. Please try again.', {
                    position: 'top-right',
                    autoClose: 4000,
                    theme: 'light',
                })
            }
        } catch (err) {
            console.error('[ForgotPassword] Error:', err)
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
                <div style={{ 
                    position: "relative",
                    bottom: "70px", 

                 }} className={styles.container}>
                    <div className={styles.form_reset}>
                        <h2
                            style={{
                                fontSize: '2rem',
                                fontFamily: 'Anavio Small Capitals W01 Bold',
                                margin: ' -1rem 0 2rem 0',
                                textAlign: 'center',
                            }}
                        >
                            Password Reset
                        </h2>
                        <div className={styles.field}>
                            <label htmlFor="email_id">Email ID</label>
                            <br />
                            <input
                                type="email"
                                name="Email_Id"
                                placeholder="Eg: mohit.sharma@gmail.com"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <br />
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
                                    Login Here
                                </Link>
                            </div>
                        </div>
                        {/* <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.8 }}
                        >
                            <button className={styles.fancyButton}>
                                <span>SUBMIT</span>
                                <Image
                                    src={'/assets/Subtract.svg'}
                                    className={styles.memberImage}
                                    height={220}
                                    width={220}
                                    alt="register"
                                />
                            </button>
                        </motion.div> */}

                        <div className={styles.hero_button}>
                            <button
                                className={cn(styles.register_button)}
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'SENDING...' : 'SUBMIT'}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.form>
        </div>
    )
}

export default ForgotPassword

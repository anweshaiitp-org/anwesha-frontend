import React, { useContext, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './style.module.css'
import { motion } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import { AuthContext } from '../authContext'
import 'react-toastify/dist/ReactToastify.css'
import Image from 'next/image'

const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'

const cn = (...classes) => {
    return classes.filter(Boolean).join(' ')
}

const UserLoginForm = () => {
    const router = useRouter()
    const context = useContext(AuthContext)
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [passwordShown, setPasswordShown] = React.useState(false)
    const [loaded, setloaded] = React.useState(false)

    useEffect(() => {
        const checkIOS = () => {
            const iOSDevice =
                /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                (navigator.userAgent.includes('Mac') &&
                    'ontouchend' in document)

            if (iOSDevice) {
                toast(
                    'Disable prevent cross site tracking in safari->settings',
                    {
                        position: 'top-right',
                        autoClose: 7000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    }
                )
            }
        }

        checkIOS()
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (email.length === 0 || password.length === 0) {
            toast.warning('Please fill email and password', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            })
            return
        }

        setloaded(true)

        try {
            const response = await fetch(`${host}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email_id: email,
                    password: password,
                }),
            })

            const data = await response.json().catch(() => ({}))

            setloaded(false)

            if (response.ok && data.success === true) {
                const token = data.token || data.access_token

                if (!token) {
                    toast.error('Login response missing token', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    })
                    return
                }

                context.persistToken(token)

                toast.success('You are successfully logged in', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                })

                const callbackUrl =
                    router.query.callbackUrl ||
                    router.query.redirect ||
                    router.query.returnUrl ||
                    '/profile'

                setTimeout(() => {
                    context.getUser()
                    router.push(callbackUrl)
                }, 150)

                return
            }

            if (response.status === 403) {
                toast.error(
                    `${data.message || 'Email verification required'} (check in Spam folder)`,
                    {
                        position: 'top-right',
                        autoClose: 6000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    }
                )
                return
            }

            toast.error(
                data.message ||
                data.error ||
                'Unable to login. Please check your credentials.',
                {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                }
            )
        } catch (err) {
            console.error('[Login] Error:', err)
            setloaded(false)

            toast.error(
                'Login failed. Check your internet connection',
                {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                }
            )
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
                <div className={styles.container}>
                    <div className={styles.form_login}>
                        <h1
                            className={styles.register_page_heading}
                        >
                            Welcome Back!
                        </h1>

                        <div className={styles.field}>
                            <label htmlFor="email_id">Email ID</label>
                            <br />
                            <input
                                type="email"
                                name="Email_Id"
                                placeholder="Enter your email address"
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />
                            <br />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="password">Password</label>
                            <br />
                            <input
                                type="password"
                                id="pwd"
                                name="Password"
                                placeholder="Enter your password"
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />
                            <br />

                            <br />

                            <div className={styles.passwd_box}>
                                <Link
                                    href="/password-reset"
                                    style={{
                                        color: '#ffffff',
                                        marginTop: -8,
                                        textAlign: 'right',
                                    }}
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <br />

                        <div className={styles.hero_button}>
                            <button
                                onClick={handleSubmit}
                                className={cn(
                                    styles.register_button
                                )}
                                disabled={loaded}
                            >
                                {loaded ? 'LOGGING..' : 'LOGIN'}
                            </button>
                        </div>

                        <p
                            style={{
                                fontSize: '0.8rem',
                                marginTop: 18,
                                textAlign: 'center',
                            }}
                        >
                            Don&apos;t have an account? &nbsp;
                            <Link
                                href="/userRegister"
                                style={{
                                    color: '#ffffff',
                                    fontWeight: 600,
                                }}
                            >
                                Register here.
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.form>
        </div>
    )
}

export default UserLoginForm
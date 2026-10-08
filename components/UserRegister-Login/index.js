import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'
import details from '../prof_staff_details'
import styles from './style.module.css'

const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'

const cn = (...classes) => {
    return classes.filter(Boolean).join(' ')
}

const UserRegisterForm = () => {
    const router = useRouter()
    const [phone, setPhone] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [cnfPassword, setCnfPassword] = useState('')
    const [gender, setGender] = useState('MALE')
    const [dob, setDob] = useState('')
    const [referralCode, setReferralCode] = useState('')
    const [passwordShown, setPasswordShown] = useState(false)
    const [usertype, setUserType] = useState('IITP_STUDENT')
    const [college_name, setCollegeName] = useState('IIT Patna')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (name.length < 5) {
            toast.warning('Username is too short', { position: 'top-right', theme: 'light' })
            return
        } else if ((usertype === 'iitp_student' || usertype === 'IITP_STUDENT') && email.match(/\dres\d/)) {
            toast.error('Online IITP students fall under the standard "student" type', { position: 'top-right', theme: 'light' })
            return
        } else if (password !== cnfPassword) {
            toast.warning('Passwords do not match', { position: 'top-right', theme: 'light' })
            return
        } else if (
            email
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                ) == null
        ) {
            toast.warning('Please provide a valid email address', { position: 'top-right', theme: 'light' })
            return
        } else if (phone.match(/^[0-9]{10}$/) == null) {
            toast.warning('Please provide a valid 10-digit phone number', { position: 'top-right', theme: 'light' })
            return
        }

        let isproff = ''
        for (let i = 0; i < details.length; i++) {
            if (details[i].webmail === email) {
                isproff = 'FACULTY'
                setCollegeName('IIT Patna')
            }
        }

        let body = {
            phone_number: phone,
            full_name: name,
            email_id: email.toLowerCase(),
            password: password,
            college_name: (usertype === 'iitp_student' || usertype === 'IITP_STUDENT' || isproff) ? 'IIT Patna' : college_name,
            gender: gender,
            dob: dob,
            user_type: isproff ? isproff : (usertype === 'iitp_student' || usertype === 'IITP_STUDENT' ? 'STUDENT' : usertype),
            referral_code: referralCode ? referralCode : undefined,
        }

        try {
            setLoading(true)
            const response = await fetch(`${host}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            if (response.status === 201 || response.status === 200) {
                setLoading(false)
                toast.success('Verify your email to complete registration! Redirecting...', {
                    position: 'top-right',
                    autoClose: 2000,
                    theme: 'light',
                })
                router.push(email ? `/check_email?email=${encodeURIComponent(email)}` : '/check_email')
            } else if (response.status === 409) {
                const data = await response.json()
                setLoading(false)
                const errorMessage = data.message || 'Unable to register'
                toast.error(errorMessage, {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: 'light',
                })
            } else {
                const data = await response.json()
                setLoading(false)
                const errorMessage = data.message || 'Registration failed. Please try again.'
                toast.error(errorMessage, {
                    position: 'top-right',
                    autoClose: 3000,
                    theme: 'light',
                })
            }
        } catch (err) {
            setLoading(false)
            console.error("Registration Request Error:", err)
            toast.error('Unable to register. Check your internet connection.', {
                position: 'top-right',
                autoClose: 3000,
                theme: 'light',
            })
        }
    }

    return (
        <div>
            <ToastContainer />
            <motion.form
                initial={{ opacity: 0, x: '-20%' }}
                whileInView={{ opacity: 1, x: '0%' }}
                transition={{ duration: 1 }}
                onSubmit={handleSubmit}
            >
                <div className={styles.container}>
                    <div className={styles.form}>
                        <div className={styles.register_page_heading}>
                            Create Your Account
                            <p className={styles.register_page_subheading}>
                                Non IITP Students register with their personal email
                            </p>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="full_name">Name</label>
                            <br />
                            <input
                                type="text"
                                name="Full_Name"
                                placeholder="Enter your name"
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <br />
                        </div>

                        <div className={styles.field}>
                            <label>Select user type:</label>
                            <br />
                            <select
                                name="userType"
                                id="userType"
                                value={usertype}
                                onChange={(e) => {
                                    const selectedType = e.target.value
                                    setUserType(selectedType)
                                    if (selectedType === 'iitp_student' || selectedType === 'IITP_STUDENT') {
                                        setEmail('')
                                        setCollegeName('IIT Patna')
                                    } else {
                                        setCollegeName('')
                                    }
                                }}
                                required
                                style={{ color: 'white', padding: '0px 20px' }}
                            >
                                <option value="IITP_STUDENT">IITP Student</option>
                                <option value="STUDENT">Student</option>
                                <option value="NON_STUDENT">Non-Student</option>
                                <option value="ALUMNI">Alumni</option>
                                <option value="FACULTY">Faculty</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="email_id">Email ID</label>
                            <br />
                            <input
                                type={(usertype === 'iitp_student' || usertype === 'IITP_STUDENT') ? 'text' : 'email'}
                                name="Email_Id"
                                placeholder={
                                    (usertype === 'iitp_student' || usertype === 'IITP_STUDENT')
                                        ? 'Eg: anish_2301mc40'
                                        : 'Eg: aniskum59431@gmail.com'
                                }
                                onChange={(e) => {
                                    if (usertype === 'iitp_student' || usertype === 'IITP_STUDENT') {
                                        setEmail(e.target.value.toLowerCase() + '@iitp.ac.in')
                                    } else {
                                        setEmail(e.target.value)
                                    }
                                }}
                                required
                                value={
                                    (usertype === 'iitp_student' || usertype === 'IITP_STUDENT') && email
                                        ? email.replace('@iitp.ac.in', '')
                                        : email
                                }
                            />
                            {(usertype === 'iitp_student' || usertype === 'IITP_STUDENT') && (
                                <span className={styles.iitp_email_ext}>@iitp.ac.in</span>
                            )}
                        </div>

                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label htmlFor="password">Password</label>
                                <br />
                                <input
                                    type={passwordShown ? 'text' : 'password'}
                                    name="Password"
                                    placeholder="Create a password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <br />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="cnfPassword">Confirm Password</label>
                                <br />
                                <input
                                    type={passwordShown ? 'text' : 'password'}
                                    name="cnfPassword"
                                    placeholder="Confirm your Password"
                                    onChange={(e) => setCnfPassword(e.target.value)}
                                    required
                                />
                                <br />
                            </div>
                        </div>
                        <br />

                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label htmlFor="Phone_number">Phone Number</label>
                                <br />
                                <input
                                    type="text"
                                    name="Phone_Number"
                                    placeholder="Enter your phone number"
                                    required
                                    maxLength="10"
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                <br />
                            </div>
                        </div>
                        <br />

                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label htmlFor="College">College</label>
                                <br />
                                {college_name === 'IIT Patna' ? (
                                    <input name="College" value="IIT Patna" readOnly />
                                ) : (
                                    <input
                                        name="College"
                                        placeholder="Enter your College name"
                                        value={college_name}
                                        onChange={(e) => setCollegeName(e.target.value)}
                                        required
                                    />
                                )}
                                <br />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="Gender">Gender</label>
                                <br />
                                <select
                                    name="Gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    required
                                    style={{ color: 'white', padding: '0px 20px', width: '100%' }}
                                >
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                                </select>
                                <br />
                            </div>
                        </div>
                        <br />

                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label htmlFor="DOB">Date of Birth</label>
                                <br />
                                <input
                                    type="date"
                                    name="DOB"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '0px 20px', color: 'white' }}
                                />
                                <br />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="Referral">Referral Code (Optional)</label>
                                <br />
                                <input
                                    type="text"
                                    name="Referral"
                                    placeholder="Enter CA Referral Code"
                                    value={referralCode}
                                    onChange={(e) => setReferralCode(e.target.value)}
                                />
                                <br />
                            </div>
                        </div>
                        <br />

                        <div className={styles.hero_button}>
                            <button
                                type="submit"
                                disabled={loading}
                                className={cn(styles.register_button)}
                                style={loading ? { letterSpacing: '-0.1ch' } : {}}
                            >
                                {!loading ? 'REGISTER' : 'REGISTERING...'}
                            </button>
                        </div>
                        <br />

                        <p style={{ marginTop: 18, textAlign: 'center', fontSize: '0.8rem' }}>
                            Already registered? &nbsp;
                            <Link href="/userLogin" className="login_link" style={{ color: '#ffffff', fontWeight: 600 }}>
                                Login here.
                            </Link>
                        </p>
                        <br />
                    </div>
                </div>
            </motion.form>
        </div>
    )
}

export default UserRegisterForm
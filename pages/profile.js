import React, { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import styles from '../styles/profile.module.css'
import { AuthContext } from '../components/authContext'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'
import MyEvents from '../components/Profile/myEvents'

const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'

export default function Profile() {
    const userData = useContext(AuthContext)

    const [profDetails, setProfDetails] = useState(
        userData?.state?.user || {}
    )

    const [formData, setFormData] = useState(profDetails)
    const [isEditing, setIsEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [myntraStatus, setMyntraStatus] = useState(null)
    const [myntraLoading, setMyntraLoading] = useState(true)

    // Sync formData when profDetails updates
    useEffect(() => {
        if (userData?.state?.user) {
            setProfDetails(userData.state.user)
            setFormData(userData.state.user)
        }
    }, [userData?.state?.user])

    // Calculate Profile Completion based on the 8 required fields
    const checkCompletionFields = (user) => {
        const u = user || {}
        return [
            { id: 'email_id', label: 'Email ID', completed: Boolean(u.email_id && String(u.email_id).trim() !== '') },
            { id: 'phone_number', label: 'Phone Number', completed: Boolean(u.phone_number && String(u.phone_number).trim() !== '') },
            { id: 'full_name', label: 'Full Name', completed: Boolean(u.full_name && String(u.full_name).trim() !== '') },
            { id: 'college_name', label: 'College Name', completed: Boolean((u.college_name || u.collage_name) && String(u.college_name || u.collage_name).trim() !== '') },
            { id: 'dob', label: 'Date of Birth (DOB)', completed: Boolean(u.dob && String(u.dob).trim() !== '') },
            { id: 'gender', label: 'Gender', completed: Boolean(u.gender && String(u.gender).trim() !== '') },
            { id: 'profile_photo', label: 'Profile Photo', completed: Boolean(u.profile_photo && String(u.profile_photo).trim() !== '') },
            { id: 'is_email_verified', label: 'Email Verified', completed: Boolean(u.is_email_verified === true) },
        ]
    }

    const fieldsList = checkCompletionFields(profDetails)
    const completedCount = fieldsList.filter((f) => f.completed).length
    const completionPercentage = Math.round((completedCount / 8) * 100)

    // Save profile updates to backend
    const saveProfileChanges = async () => {
        setSaving(true)
        try {
            const authHeaders = userData?.getAuthHeaders ? userData.getAuthHeaders() : {}
            const headers = new Headers({ 'Content-Type': 'application/json' })
            Object.entries(authHeaders).forEach(([k, v]) => headers.append(k, v))

            const bodyData = {
                full_name: formData.full_name,
                college_name: formData.college_name,
                dob: formData.dob,
                gender: formData.gender,
                profile_photo: formData.profile_photo,
                phone_number: formData.phone_number,
            }

            const response = await fetch(`${host}/user/editprofile`, {
                method: 'POST',
                headers,
                body: JSON.stringify(bodyData),
            })

            const result = await response.json().catch(() => ({}))

            if (response.ok || result.success) {
                const updatedUser = { ...profDetails, ...bodyData }
                setProfDetails(updatedUser)
                setIsEditing(false)
                toast.success('Profile updated successfully!', { theme: 'light' })
            } else {
                toast.error(result.message || 'Failed to update profile', { theme: 'light' })
            }
        } catch (error) {
            console.error('Error saving profile:', error)
            toast.error('An error occurred while saving profile.', { theme: 'light' })
        } finally {
            setSaving(false)
        }
    }

    // Fetch Myntra registration status
    useEffect(() => {
        const fetchMyntraStatus = async () => {
            if (!userData?.state?.user) return
            try {
                const authHeaders = userData?.getAuthHeaders ? userData.getAuthHeaders() : {}
                const myHeaders = new Headers({ 'Content-Type': 'application/json' })
                Object.entries(authHeaders).forEach(([k, v]) => myHeaders.append(k, v))

                const response = await fetch(`${host}/sponsors/myntra-status/`, {
                    method: 'GET',
                    headers: myHeaders,
                })

                if (response.ok) {
                    const data = await response.json()
                    setMyntraStatus(data)
                }
            } catch (error) {
                console.error('[Profile] Failed to fetch Myntra status:', error)
            } finally {
                setMyntraLoading(false)
            }
        }
        fetchMyntraStatus()
    }, [userData?.state?.user])

    if (!userData?.state?.user) {
        return null
    }

    return (
        <>
            <Head>
                <title>Profile - Anwesha 2026</title>
                <meta name="description" content="Anwesha 2026 User Profile" />
                <link rel="icon" href="./logo_no_bg.svg" />
            </Head>
            <ToastContainer position="top-right" autoClose={3000} theme="light" />

            <div className={styles.mainContainer}>
                <div className={styles.welcome}>WELCOME BACK!</div>

                <div className={styles.subContainer}>
                    {/* Myntra Notice */}
                    {!myntraLoading && myntraStatus && myntraStatus.is_myntra_registered === false && (
                        <div
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                border: '1px solid #F2BF51',
                                borderRadius: '8px',
                                padding: '20px',
                                margin: '20px auto',
                                maxWidth: '800px',
                                textAlign: 'center',
                                fontFamily: "'Cormorant Garamond', serif",
                            }}
                        >
                            <h3 style={{ color: '#F2BF51', marginBottom: '10px', fontSize: '24px', fontWeight: 'bold' }}>
                                ⚠️ Myntra Registration Required for Pronite Entry
                            </h3>
                            <p style={{ color: '#ffffff', marginBottom: '15px', fontSize: '20px' }}>
                                You have not registered on Myntra yet. This is mandatory for pronite entry.
                            </p>
                            <a
                                href="https://myntra.onelink.me/dNYC/psb0vkzt?af_qr=true"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-block',
                                    color: '#F2BF51',
                                    padding: '10px 24px',
                                    borderRadius: '5px',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                    fontSize: '18px',
                                    border: '1px solid #F2BF51',
                                }}
                            >
                                Register on Myntra App
                            </a>
                        </div>
                    )}

                    {/* Profile Header Block */}
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justify: 'space-between',
                            maxWidth: '900px',
                            margin: '0 auto 20px auto',
                            padding: '20px',
                            width: '100%',
                            gap: '20px',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                            {/* User Profile Photo */}
                            <div className={styles.userImage} style={{ width: '130px', height: '130px', position: 'relative' }}>
                                <img
                                    src={'/home/circle.png'}
                                    width={130}
                                    height={130}
                                    alt="border"
                                    style={{ borderRadius: '50%' }}
                                />
                                <img
                                    src={profDetails.profile_photo || '/home/mascott.png'}
                                    width={105}
                                    height={105}
                                    alt="Profile Photo"
                                    onError={(e) => {
                                        e.target.src = '/home/mascott.png'
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>

                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    <h1 className={styles.anwesha_username} style={{ margin: 0 }}>
                                        {profDetails.full_name || 'Anwesha User'}
                                    </h1>

                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className={styles.copy}
                                        title="Edit Profile"
                                    >
                                        <motion.div whileTap={{ scale: 0.8 }} style={{ cursor: 'pointer' }}>
                                            <img
                                                src={isEditing ? '/assets/tick.svg' : '/edit.svg'}
                                                width={22}
                                                height={22}
                                                alt="edit"
                                                onClick={isEditing ? saveProfileChanges : undefined}
                                            />
                                        </motion.div>
                                    </button>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                                    <h1 className={styles.anwesha_id} style={{ margin: 0 }}>
                                        {profDetails.anwesha_id}
                                    </h1>
                                    <button
                                        className={styles.copy}
                                        onClick={() => {
                                            navigator.clipboard.writeText(profDetails.anwesha_id || '')
                                            toast.success('Anwesha ID copied to clipboard!', { theme: 'light' })
                                        }}
                                    >
                                        <motion.div whileTap={{ scale: 0.8 }} style={{ cursor: 'pointer' }}>
                                            <Image src="/copy.svg" width={18} height={18} alt="copy" />
                                        </motion.div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            style={{
                                padding: '10px 22px',
                                backgroundColor: isEditing ? '#4ade80' : '#ffcc00',
                                color: '#000',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '0.95rem',
                            }}
                        >
                            {isEditing ? (saving ? 'Saving...' : 'Save Changes ✓') : 'Edit Profile ✎'}
                        </button>
                    </div>

                    {/* Progress Bar to Complete Profile */}
                    <div
                        style={{
                            maxWidth: '900px',
                            margin: '0 auto 30px auto',
                            padding: '24px',
                            backgroundColor: 'rgba(20, 20, 30, 0.8)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 204, 0, 0.35)',
                            borderRadius: '16px',
                            width: '100%',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.5), 0 0 15px rgba(255, 204, 0, 0.1)',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <h2 style={{ color: '#ffcc00', fontSize: '1.25rem', margin: 0, fontWeight: '700', letterSpacing: '0.5px' }}>
                                Profile Completion Progress
                            </h2>
                            <span
                                style={{
                                    backgroundColor: completionPercentage === 100 ? '#4ade80' : '#ffcc00',
                                    color: '#000',
                                    padding: '4px 14px',
                                    borderRadius: '20px',
                                    fontWeight: 'bold',
                                    fontSize: '0.95rem',
                                }}
                            >
                                {completionPercentage}% ({completedCount}/8)
                            </span>
                        </div>

                        {/* Animated Track */}
                        <div
                            style={{
                                width: '100%',
                                height: '14px',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                marginBottom: '20px',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                            }}
                        >
                            <div
                                style={{
                                    width: `${completionPercentage}%`,
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #ffcc00 0%, #4ade80 100%)',
                                    borderRadius: '10px',
                                    transition: 'width 0.6s ease-in-out',
                                    boxShadow: '0 0 10px rgba(255, 204, 0, 0.6)',
                                }}
                            />
                        </div>

                        {/* Checklist of 8 Required Fields */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '12px',
                                paddingTop: '10px',
                                borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
                            }}
                        >
                            {fieldsList.map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '0.9rem',
                                        color: item.completed ? '#4ade80' : '#ff7777',
                                    }}
                                >
                                    <span>{item.completed ? '✓' : '✕'}</span>
                                    <span style={{ color: item.completed ? '#ddd' : '#ffaaaa' }}>{item.label}</span>
                                    {item.id === 'is_email_verified' && !item.completed && (
                                        <Link href={`/check-email?email=${encodeURIComponent(profDetails.email_id || '')}`} style={{ color: '#ffcc00', fontSize: '0.8rem', marginLeft: 'auto' }}>
                                            [Verify]
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Edit Profile Form OR Profile Details View */}
                    <div className={styles.userDetails} style={{ flexDirection: 'column', gap: '25px', width: '100%', maxWidth: '900px' }}>
                        {isEditing ? (
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                <h2 style={{ color: '#ffcc00', fontSize: '1.4rem', borderBottom: '1px solid rgba(255, 204, 0, 0.3)', paddingBottom: '10px' }}>
                                    Edit Profile Information
                                </h2>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                                    <div>
                                        <label style={{ color: '#aaa', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Full Name *</label>
                                        <input
                                            type="text"
                                            value={formData.full_name || ''}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                                border: '1px solid rgba(255, 204, 0, 0.4)',
                                                borderRadius: '6px',
                                                color: '#fff',
                                                fontSize: '1rem',
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: '#aaa', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Phone Number *</label>
                                        <input
                                            type="text"
                                            value={formData.phone_number || ''}
                                            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                            maxLength={10}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                                border: '1px solid rgba(255, 204, 0, 0.4)',
                                                borderRadius: '6px',
                                                color: '#fff',
                                                fontSize: '1rem',
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: '#aaa', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>College / Institute Name *</label>
                                        <input
                                            type="text"
                                            value={formData.college_name || formData.collage_name || ''}
                                            onChange={(e) => setFormData({ ...formData, college_name: e.target.value, collage_name: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                                border: '1px solid rgba(255, 204, 0, 0.4)',
                                                borderRadius: '6px',
                                                color: '#fff',
                                                fontSize: '1rem',
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: '#aaa', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Date of Birth (YYYY-MM-DD) *</label>
                                        <input
                                            type="date"
                                            value={formData.dob || ''}
                                            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                                border: '1px solid rgba(255, 204, 0, 0.4)',
                                                borderRadius: '6px',
                                                color: '#fff',
                                                fontSize: '1rem',
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ color: '#aaa', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Gender *</label>
                                        <select
                                            value={formData.gender || 'MALE'}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                backgroundColor: 'rgba(20, 20, 30, 0.95)',
                                                border: '1px solid rgba(255, 204, 0, 0.4)',
                                                borderRadius: '6px',
                                                color: '#fff',
                                                fontSize: '1rem',
                                            }}
                                        >
                                            <option value="MALE">MALE</option>
                                            <option value="FEMALE">FEMALE</option>
                                            <option value="OTHER">OTHER</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ color: '#aaa', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Profile Photo URL / S3 Key *</label>
                                        <input
                                            type="text"
                                            placeholder="Enter photo URL or S3 image path"
                                            value={formData.profile_photo || ''}
                                            onChange={(e) => setFormData({ ...formData, profile_photo: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                                border: '1px solid rgba(255, 204, 0, 0.4)',
                                                borderRadius: '6px',
                                                color: '#fff',
                                                fontSize: '1rem',
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '15px' }}>
                                    <button
                                        onClick={saveProfileChanges}
                                        disabled={saving}
                                        style={{
                                            padding: '12px 28px',
                                            backgroundColor: saving ? '#666' : '#4ade80',
                                            color: '#000',
                                            border: 'none',
                                            borderRadius: '6px',
                                            fontWeight: 'bold',
                                            fontSize: '1rem',
                                            cursor: saving ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        {saving ? 'Saving...' : 'Save Profile'}
                                    </button>

                                    <button
                                        onClick={() => setIsEditing(false)}
                                        style={{
                                            padding: '12px 24px',
                                            backgroundColor: 'transparent',
                                            color: '#aaa',
                                            border: '1px solid #666',
                                            borderRadius: '6px',
                                            fontSize: '1rem',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px' }}>
                                <div>
                                    <h3 className={styles.userDetailsHeading}>Email Address</h3>
                                    <p className={styles.userDetailsContent} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {profDetails.email_id || 'Not set'}
                                        {profDetails.is_email_verified ? (
                                            <span style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 'bold' }}>[ Verified ✓ ]</span>
                                        ) : (
                                            <Link href={`/check-email?email=${encodeURIComponent(profDetails.email_id || '')}`} style={{ color: '#ffcc00', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                                [ Unverified - Verify Now ]
                                            </Link>
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <h3 className={styles.userDetailsHeading}>Phone Number</h3>
                                    <p className={styles.userDetailsContent}>{profDetails.phone_number || 'Not set'}</p>
                                </div>

                                <div>
                                    <h3 className={styles.userDetailsHeading}>Institute / College</h3>
                                    <p className={styles.userDetailsContent}>{profDetails.college_name || profDetails.collage_name || 'Not set'}</p>
                                </div>

                                <div>
                                    <h3 className={styles.userDetailsHeading}>Date of Birth (DOB)</h3>
                                    <p className={styles.userDetailsContent}>{profDetails.dob || 'Not set'}</p>
                                </div>

                                <div>
                                    <h3 className={styles.userDetailsHeading}>Gender</h3>
                                    <p className={styles.userDetailsContent}>{profDetails.gender || 'Not set'}</p>
                                </div>

                                <div>
                                    <h3 className={styles.userDetailsHeading}>Profile Photo</h3>
                                    <p className={styles.userDetailsContent}>
                                        {profDetails.profile_photo ? 'Uploaded ✓' : 'Default Avatar'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <MyEvents />

                    <div className={styles.bottomDesign}>
                        <img src={'/profile/bottom.png'} width={800} height={350} alt="decor" />
                    </div>
                </div>
            </div>
        </>
    )
}

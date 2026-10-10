import React, { useState, useEffect, useContext } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import Details from '../components/Profile/details'
import MyEvents from '../components/Profile/myEvents'
import MyMerch from '../components/Profile/myMerch'
import Head from 'next/head'
import styles from '../styles/profile.module.css'

import { AuthContext } from '../components/authContext'
import Image from 'next/image'
import { motion, wrap } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'

const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'

function Profile() {
    const userData = useContext(AuthContext)


    const [tabIndex, setTabIndex] = useState(0)
    // const profDetails = userData.state.user;

    const [profDetails, setProfDetails] = useState(
        userData?.state?.user || {}
    )


    const [formData, setFormData] = useState(profDetails)
    const [qrcode, setQrcode] = useState(
        userData ? userData.state.user?.qr_code : ''
    )
    const [qrLoading, setQrLoading] = useState(false)

    // Sync formData when profDetails updates
    useEffect(() => {
        if (profDetails && Object.keys(profDetails).length > 0) {
            setFormData(profDetails)
        }
    }, [profDetails])

    const [edit, setEdit] = useState(false)

    const [isEditing, setIsEditing] = useState(false) // Toggle edit mode
    const [name, setName] = useState('John Doe') // Default name
    const [myntraStatus, setMyntraStatus] = useState(null)
    const [myntraLoading, setMyntraLoading] = useState(true)

    const [showEditProfile, setShowEditProfile] = useState(false)
    const [editFormData, setEditFormData] = useState({})
    const [uploadingPhoto, setUploadingPhoto] = useState(false)
    const [profileSaving, setProfileSaving] = useState(false)

    useEffect(() => {
        if (showEditProfile && profDetails) {
            setEditFormData({
                full_name: profDetails.full_name || '',
                phone_number: profDetails.phone_number || '',
                collage_name: profDetails.collage_name || profDetails.college_name || '',
                dob: profDetails.dob || '',
                gender: profDetails.gender || ''
            })
        }
    }, [showEditProfile, profDetails])


    
    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        if (profDetails.id_card_status === 'VERIFIED') {
             toast.error('Profile update is blocked as ID card is VERIFIED.')
             return
        }

        setUploadingPhoto(true)
        try {
            const authHeaders = userData?.getAuthHeaders ? userData.getAuthHeaders() : {}
            
            // 1. Get presigned URL
            const urlRes = await fetch(`${host}/users/profile/upload-url?fileName=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`, {
                method: 'GET',
                headers: { ...authHeaders }
            })
            const urlData = await urlRes.json()
            
            if (!urlData.success) throw new Error(urlData.message || 'Failed to get upload URL')

            // 2. Upload to S3
            const s3Res = await fetch(urlData.uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type
                }
            })
            if (!s3Res.ok) throw new Error('Failed to upload to S3')

            // 3. Save to profile
            const profileRes = await fetch(`${host}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders
                },
                body: JSON.stringify({ profile_photo: urlData.fileKey })
            })
            const profileData = await profileRes.json()
            if (!profileData.success) throw new Error(profileData.message || 'Failed to update profile photo')

            toast.success('Profile photo updated successfully!')
            if (userData.getUser) userData.getUser()
        } catch (error) {
            console.error(error)
            toast.error(error.message || 'Error uploading photo')
        } finally {
            setUploadingPhoto(false)
        }
    }

    const saveProfile = async (e) => {
        e.preventDefault()
        setProfileSaving(true)
        try {
            const authHeaders = userData?.getAuthHeaders ? userData.getAuthHeaders() : {}
            const res = await fetch(`${host}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders
                },
                body: JSON.stringify(editFormData)
            })
            const data = await res.json()
            if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update profile')
            toast.success('Profile updated successfully!')
            setShowEditProfile(false)
            if (userData.getUser) userData.getUser()
        } catch (error) {
            console.error(error)
            toast.error(error.message || 'Error updating profile')
        } finally {
            setProfileSaving(false)
        }
    }

    const handleSave = () => {
        setIsEditing(false) // Exit edit mode
        // Add logic to update the name in the backend here, if needed
        console.log('Saved Name:', name)
    }

    function editProfile() {
        setIsEditing(false)
        var myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')
        const authHeaders = userData?.getAuthHeaders
            ? userData.getAuthHeaders()
            : {}
        Object.entries(authHeaders).forEach(([k, v]) =>
            myHeaders.append(k, v)
        )

        var raw = JSON.stringify({
            full_name: formData.full_name,
            college_name: formData.college_name,
        })

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
        }

        fetch(`${host}/user/editprofile`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.log('error', error))
    }

    useEffect(() => {
        // Just use data from authContext instead of fetching again
        if (userData?.state?.user) {
            setProfDetails(userData.state.user)
            if (userData.state.user.qr_code) {
                setQrcode(userData.state.user.qr_code)
            }
        }
    }, [userData?.state?.user])

    // Fetch Myntra registration status
    useEffect(() => {
        const fetchMyntraStatus = async () => {
            if (!userData?.state?.user) return

            try {
                const authHeaders = userData?.getAuthHeaders
                    ? userData.getAuthHeaders()
                    : {}

                console.log('[Profile] Auth headers object:', authHeaders)
                console.log('[Profile] Has Authorization header:', !!authHeaders.Authorization)

                var myHeaders = new Headers()
                myHeaders.append('Content-Type', 'application/json')
                Object.entries(authHeaders).forEach(([k, v]) =>
                    myHeaders.append(k, v)
                )

                const response = await fetch(`${host}/sponsors/myntra-status/`, {
                    method: 'GET',
                    headers: myHeaders
                })

                if (response.ok) {
                    const data = await response.json()
                    console.log('[Profile] Myntra status received:', data)
                    setMyntraStatus(data)
                } else {
                    console.log('[Profile] Myntra status API returned non-OK:', response.status)
                    // Only set status on success, don't show warning on API errors
                    setMyntraStatus(null)
                }
            } catch (error) {
                console.error('[Profile] Failed to fetch Myntra status:', error)
                // Don't show warning if API fails
                setMyntraStatus(null)
            } finally {
                setMyntraLoading(false)
            }
        }

        fetchMyntraStatus()
    }, [userData?.state?.user])

    function regenrateqr() {
        const authHeaders = userData.getAuthHeaders()
        fetch(`${host}/user/regenerateqr/`, {
            method: 'GET',
            headers: {
                ...authHeaders,
            },
            redirect: 'follow',
        })
            .then((response) => response.json())
            .then((result) => {
                console.log('[Profile] Regenerated QR:', result)
                // Result should contain signed URL
                if (result.qr_code) {
                    console.log('QR Link (regenerated):', result.qr_code)
                    setQrcode(result.qr_code)
                    toast.success('QR code regenerated successfully', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    })
                }
            })
            .catch((error) => {
                console.error('[Profile] QR regeneration failed:', error)
                toast.error('Failed to regenerate QR code', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                })
            })
    }

    if (!userData?.state?.user) {
        return null
    }


    return (
        <>
            <Head>
                <title>Profile - Anwesha 2027</title>
                <meta name="description" content="Anwesha 2027" />
                <link rel="icon" href="./logo_no_bg.svg" />
            </Head>
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
            <div className={styles.mainContainer}>
                <div className={styles.welcome}>WELCOME BACK!</div>

                <div className={styles.subContainer}>
                    {/* Myntra Registration Notice */}
                    {!myntraLoading && myntraStatus && myntraStatus.is_myntra_registered === false && (
                        <div style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            border: '1px solid #F2BF51',
                            borderRadius: '8px',
                            padding: '20px',
                            margin: '20px auto',
                            maxWidth: '800px',
                            textAlign: 'center',
                            fontFamily: "'Cormorant Garamond', serif"
                        }}>
                            <h3 style={{
                                color: '#F2BF51',
                                marginBottom: '10px',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                fontFamily: "'Cormorant Garamond', serif"
                            }}>
                                ⚠️ Myntra Registration Required for Pronite Entry
                            </h3>
                            <p style={{
                                color: '#ffffff',
                                marginBottom: '15px',
                                fontSize: '20px',
                                fontFamily: "'Cormorant Garamond', serif"
                            }}>
                                You have not registered on Myntra yet. This is mandatory for pronite entry.
                            </p>
                            <a
                                href="https://myntra.onelink.me/dNYC/psb0vkzt?af_qr=true"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-block',
                                    backgroundColor: 'transparent',
                                    color: '#F2BF51',
                                    padding: '10px 24px',
                                    borderRadius: '5px',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                    fontSize: '18px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    border: '1px solid #F2BF51'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#F2BF51';
                                    e.target.style.color = '#000';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = '#F2BF51';
                                }}
                            >
                                Register on Myntra App
                            </a>
                        </div>
                    )}
                    <div className={styles.idandqr}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <div className={styles.userImage} style={{ position: 'relative' }}>
                                <img
                                    src={'/home/circle.png'}
                                    width={180}
                                    height={180}
                                    alt="userImage"
                                />
                                <img
                                    src={profDetails.profile_photo_url || '/home/mascott.png'}
                                    width={150}
                                    height={150}
                                    alt="userImage"
                                    style={{ borderRadius: '50%', objectFit: 'cover', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}
                                />
                                {profDetails.id_card_status !== 'VERIFIED' && (
                                    <>
                                        <input 
                                            type="file" 
                                            id="photo-upload" 
                                            accept="image/*" 
                                            style={{ display: 'none' }} 
                                            onChange={handlePhotoUpload}
                                            disabled={uploadingPhoto}
                                        />
                                        <label htmlFor="photo-upload" style={{ position: 'absolute', bottom: 10, right: 30, background: 'white', borderRadius: '50%', padding: '5px', cursor: 'pointer', zIndex: 20 }}>
                                            {uploadingPhoto ? '⏳' : '📷'}
                                        </label>
                                    </>
                                )}
                            </div>
                            <div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center', // Ensures alignment
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <h1
                                        className={styles.anwesha_username}
                                        style={{ fontWeight: 'normal' }}
                                    >
                                        {profDetails.full_name}
                                    </h1>

                                    <button
                                        onClick={() => {
                                            if (profDetails.id_card_status === 'VERIFIED') {
                                                toast.error('Profile update is blocked as ID card is VERIFIED.')
                                                return
                                            }
                                            setShowEditProfile(true)
                                        }}
                                        className={styles.copy}
                                    >
                                        <motion.div
                                            style={{ cursor: 'pointer' }}
                                            whileTap={{ scale: 0.8 }}
                                        >
                                            {!isEditing ? (
                                                <img
                                                    src="/edit.svg"
                                                    width={20}
                                                    height={20}
                                                    alt="edit"
                                                />
                                            ) : (
                                                <img
                                                    onClick={editProfile}
                                                    src="/assets/tick.svg"
                                                    width={20}
                                                    height={20}
                                                    alt="edit"
                                                />
                                            )}
                                        </motion.div>
                                    </button>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <h1
                                        className={styles.anwesha_id}
                                        style={{ fontWeight: 'normal' }}
                                    >
                                        {profDetails.anwesha_id}
                                    </h1>
                                    <button
                                        className={styles.copy}
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                profDetails.anwesha_id
                                            )
                                            toast.success(
                                                'Copied to clipboard',
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
                                        }}
                                    >
                                        <motion.div
                                            style={{ cursor: 'pointer' }}
                                            whileTap={{ scale: 0.8 }}
                                        >
                                            <Image
                                                src="/copy.svg"
                                                width={20}
                                                height={20}
                                                alt="copy"
                                            />
                                        </motion.div>
                                    </button>
                                </div>
                                <div style={{ marginTop: '12px' }}>
                                    <Link href="/change-password" style={{ textDecoration: 'none' }}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            style={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                                                border: '1px solid rgba(255, 255, 255, 0.4)',
                                                color: '#ffffff',
                                                padding: '7px 16px',
                                                borderRadius: '6px',
                                                fontSize: '15px',
                                                cursor: 'pointer',
                                                fontFamily: "'Cormorant Garamond', serif",
                                                fontWeight: '600',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                transition: 'all 0.2s',
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'
                                                e.currentTarget.style.borderColor = '#F2BF51'
                                                e.currentTarget.style.color = '#F2BF51'
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'
                                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
                                                e.currentTarget.style.color = '#ffffff'
                                            }}
                                        >
                                            Change Password
                                        </motion.button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        </div>

                    {/* <h1 className={styles.anwesha_id}>{profDetails.anwesha_id}</h1> */}
                    <div className={styles.userDetails}>
                        <div>
                            <div>
                                <h1 className={styles.userDetailsHeading}>
                                    Mail ID
                                </h1>
                                <h1 className={styles.userDetailsContent}>
                                    {profDetails.email_id}
                                </h1>
                            </div>
                            <div>
                                <h1 className={styles.userDetailsHeading}>
                                    Mobile Number
                                </h1>
                                <h1 className={styles.userDetailsContent}>
                                    {profDetails.phone_number}
                                </h1>
                            </div>
                        </div>
                        <div>
                            {/* <div>
                                <h1 className={styles.userDetailsHeading}>
                                    Gender
                                </h1>
                                <h1 className={styles.userDetailsContent}>
                                    Male
                                </h1>
                            </div> */}

                            <div>
                                <h1 className={styles.userDetailsHeading}>
                                    Gender
                                </h1>
                                <h1 className={styles.userDetailsContent}>
                                    {profDetails.gender || 'Not specified'}
                                </h1>
                            </div>
                            <div>
                                <h1 className={styles.userDetailsHeading}>
                                    DOB
                                </h1>
                                <h1 className={styles.userDetailsContent}>
                                    {profDetails.dob || 'Not specified'}
                                </h1>
                            </div>
                            <div>
                                <h1 className={styles.userDetailsHeading}>
                                    Institute/Organization
                                </h1>
                                <h1 className={styles.userDetailsContent}>
                                    {profDetails.collage_name || profDetails.college_name || 'Not specified'}
                                </h1>
                            </div>
                        </div>
                    </div>
                                        {/* Modals */}
                    {showEditProfile && (
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                                backdropFilter: 'blur(8px)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 1000,
                                padding: '20px',
                            }}
                            onClick={() => setShowEditProfile(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                                style={{
                                    background: 'linear-gradient(145deg, rgba(22, 22, 28, 0.98), rgba(12, 12, 16, 0.98))',
                                    border: '1px solid rgba(242, 191, 81, 0.45)',
                                    borderRadius: '16px',
                                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(242, 191, 81, 0.12)',
                                    width: '100%',
                                    maxWidth: '520px',
                                    maxHeight: '90vh',
                                    overflowY: 'auto',
                                    padding: '30px 28px',
                                    position: 'relative',
                                    color: '#ffffff',
                                    fontFamily: "'Cormorant Garamond', serif",
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '10px',
                                    }}
                                >
                                    <h2
                                        style={{
                                            color: '#F2BF51',
                                            margin: 0,
                                            fontFamily: "'Cinzel Decorative', 'DM Serif Display', serif",
                                            fontSize: '24px',
                                            letterSpacing: '1px',
                                        }}
                                    >
                                        Edit Profile
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => setShowEditProfile(false)}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.06)',
                                            border: '1px solid rgba(242, 191, 81, 0.3)',
                                            color: '#F2BF51',
                                            borderRadius: '50%',
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '16px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(242, 191, 81, 0.2)'
                                            e.currentTarget.style.transform = 'scale(1.1)'
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'
                                            e.currentTarget.style.transform = 'scale(1)'
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div
                                    style={{
                                        width: '100%',
                                        height: '1px',
                                        background: 'linear-gradient(90deg, transparent, rgba(242, 191, 81, 0.5), transparent)',
                                        marginBottom: '22px',
                                    }}
                                />

                                {/* Form */}
                                <form
                                    onSubmit={saveProfile}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '16px',
                                    }}
                                >
                                    <div>
                                        <label
                                            style={{
                                                color: '#F2BF51',
                                                display: 'block',
                                                marginBottom: '6px',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                letterSpacing: '0.5px',
                                            }}
                                        >
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editFormData.full_name || ''}
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    full_name: e.target.value,
                                                })
                                            }
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                backgroundColor: 'rgba(10, 10, 14, 0.8)',
                                                border: '1px solid rgba(242, 191, 81, 0.3)',
                                                borderRadius: '8px',
                                                color: '#ffffff',
                                                fontSize: '16px',
                                                fontFamily: "'Cormorant Garamond', serif",
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                transition: 'border-color 0.2s',
                                            }}
                                            onFocus={(e) =>
                                                (e.target.style.borderColor = '#F2BF51')
                                            }
                                            onBlur={(e) =>
                                                (e.target.style.borderColor = 'rgba(242, 191, 81, 0.3)')
                                            }
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            style={{
                                                color: '#F2BF51',
                                                display: 'block',
                                                marginBottom: '6px',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                letterSpacing: '0.5px',
                                            }}
                                        >
                                            Phone Number
                                        </label>
                                        <input
                                            type="text"
                                            value={editFormData.phone_number || ''}
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    phone_number: e.target.value,
                                                })
                                            }
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                backgroundColor: 'rgba(10, 10, 14, 0.8)',
                                                border: '1px solid rgba(242, 191, 81, 0.3)',
                                                borderRadius: '8px',
                                                color: '#ffffff',
                                                fontSize: '16px',
                                                fontFamily: "'Cormorant Garamond', serif",
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                transition: 'border-color 0.2s',
                                            }}
                                            onFocus={(e) =>
                                                (e.target.style.borderColor = '#F2BF51')
                                            }
                                            onBlur={(e) =>
                                                (e.target.style.borderColor = 'rgba(242, 191, 81, 0.3)')
                                            }
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            style={{
                                                color: '#F2BF51',
                                                display: 'block',
                                                marginBottom: '6px',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                letterSpacing: '0.5px',
                                            }}
                                        >
                                            Institute / College Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editFormData.collage_name || ''}
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    collage_name: e.target.value,
                                                })
                                            }
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                backgroundColor: 'rgba(10, 10, 14, 0.8)',
                                                border: '1px solid rgba(242, 191, 81, 0.3)',
                                                borderRadius: '8px',
                                                color: '#ffffff',
                                                fontSize: '16px',
                                                fontFamily: "'Cormorant Garamond', serif",
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                transition: 'border-color 0.2s',
                                            }}
                                            onFocus={(e) =>
                                                (e.target.style.borderColor = '#F2BF51')
                                            }
                                            onBlur={(e) =>
                                                (e.target.style.borderColor = 'rgba(242, 191, 81, 0.3)')
                                            }
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            style={{
                                                color: '#F2BF51',
                                                display: 'block',
                                                marginBottom: '6px',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                letterSpacing: '0.5px',
                                            }}
                                        >
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            value={editFormData.dob || ''}
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    dob: e.target.value,
                                                })
                                            }
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                backgroundColor: 'rgba(10, 10, 14, 0.8)',
                                                border: '1px solid rgba(242, 191, 81, 0.3)',
                                                borderRadius: '8px',
                                                color: '#ffffff',
                                                colorScheme: 'dark',
                                                fontSize: '16px',
                                                fontFamily: "'Cormorant Garamond', serif",
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                transition: 'border-color 0.2s',
                                            }}
                                            onFocus={(e) =>
                                                (e.target.style.borderColor = '#F2BF51')
                                            }
                                            onBlur={(e) =>
                                                (e.target.style.borderColor = 'rgba(242, 191, 81, 0.3)')
                                            }
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            style={{
                                                color: '#F2BF51',
                                                display: 'block',
                                                marginBottom: '6px',
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                letterSpacing: '0.5px',
                                            }}
                                        >
                                            Gender
                                        </label>
                                        <select
                                            value={editFormData.gender || ''}
                                            onChange={(e) =>
                                                setEditFormData({
                                                    ...editFormData,
                                                    gender: e.target.value,
                                                })
                                            }
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                backgroundColor: 'rgba(10, 10, 14, 0.95)',
                                                border: '1px solid rgba(242, 191, 81, 0.3)',
                                                borderRadius: '8px',
                                                color: '#ffffff',
                                                fontSize: '16px',
                                                fontFamily: "'Cormorant Garamond', serif",
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                transition: 'border-color 0.2s',
                                            }}
                                            onFocus={(e) =>
                                                (e.target.style.borderColor = '#F2BF51')
                                            }
                                            onBlur={(e) =>
                                                (e.target.style.borderColor = 'rgba(242, 191, 81, 0.3)')
                                            }
                                            required
                                        >
                                            <option value="" style={{ backgroundColor: '#141418', color: '#888' }}>Select Gender</option>
                                            <option value="Male" style={{ backgroundColor: '#141418', color: '#fff' }}>Male</option>
                                            <option value="Female" style={{ backgroundColor: '#141418', color: '#fff' }}>Female</option>
                                            <option value="Other" style={{ backgroundColor: '#141418', color: '#fff' }}>Other</option>
                                        </select>
                                    </div>

                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                            gap: '12px',
                                            marginTop: '16px',
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setShowEditProfile(false)}
                                            style={{
                                                padding: '10px 20px',
                                                background: 'transparent',
                                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                                color: '#cccccc',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontFamily: "'Cormorant Garamond', serif",
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                transition: 'all 0.2s',
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)'
                                                e.currentTarget.style.color = '#ffffff'
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                                                e.currentTarget.style.color = '#cccccc'
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            type="submit"
                                            disabled={profileSaving}
                                            style={{
                                                padding: '10px 26px',
                                                background: 'linear-gradient(135deg, #F2BF51, #C39B54)',
                                                border: 'none',
                                                color: '#0a0a0c',
                                                borderRadius: '8px',
                                                cursor: profileSaving ? 'not-allowed' : 'pointer',
                                                fontFamily: "'Cormorant Garamond', serif",
                                                fontSize: '17px',
                                                fontWeight: '700',
                                                letterSpacing: '0.5px',
                                                boxShadow: '0 4px 15px rgba(242, 191, 81, 0.35)',
                                                opacity: profileSaving ? 0.7 : 1,
                                            }}
                                        >
                                            {profileSaving ? 'Saving...' : 'Save Changes'}
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                    <MyEvents />
                    {/* <h2
                        style={{
                            color: 'white',
                            fontWeight: 'normal',
                            textAlign: 'center',
                            letterSpacing: '1px',
                        }}
                    >
                        To seek accomodation Fill this &nbsp;
                        <a
                            href="https://forms.gle/WjTuyC2gR8mHYGzA6"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontWeight: 'normal', color: 'skyblue' }}
                        >
                            FORM
                        </a>
                    </h2> */}

                    {/* <Tabs className={styles.tabs}>
                        <TabList
                            className={styles.tabList}
                            selectedIndex={tabIndex}
                            onSelect={(index) => setTabIndex(index)}
                        >
                            <Tab
                                className={styles.tab}
                                selectedClassName={styles.tabActive}
                            >
                                DETAILS
                            </Tab>
                            <Tab
                                className={styles.tab}
                                selectedClassName={styles.tabActive}
                            >
                                MY EVENTS
                            </Tab>
                            <Tab className={styles.tab}>MY MERCHANDISE</Tab>
                        </TabList>

                        <TabPanel className={styles.tabPanel}>
                            <Details />
                        </TabPanel>
                        <TabPanel className={styles.tabPanel}>
                                                <MyEvents />
                        </TabPanel>
                        <TabPanel className={styles.tabPanel}>
                            <MyMerch />
                        </TabPanel>
                    </Tabs> */}

                    {/* design for the bottom pngs */}
                    <div className={styles.bottomDesign}>
                        <img
                            src={'/profile/bottom.png'}
                            width={800}
                            height={350}
                            alt="userImage"
                        />
                    </div>

                </div>
            </div>
        </>
    )
}

export default Profile

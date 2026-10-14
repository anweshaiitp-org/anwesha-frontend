import React, { useState, useEffect, useContext } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import Details from '../components/Profile/details'
import MyEvents from '../components/Profile/myEvents'
import IdSubmissionCard from '../components/Profile/IdSubmissionCard'
import MyAccommodation from '../components/Accommodation/MyAccommodation'
import MyMerch from '../components/Profile/myMerch'
import Head from 'next/head'
import styles from '../styles/profile.module.css'

import { AuthContext } from '../components/authContext'
import Image from 'next/image'
import { motion, wrap } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'
import Loader, { ButtonLoader } from '../components/Loader'
import { BadgeCheck, Building2, Cake, Camera, Check, Copy, ExternalLink, KeyRound, Mail, Pencil, Phone, ShieldAlert, ShoppingBag, User } from 'lucide-react'
import ui from '../styles/profile-page.module.css'

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
    const [copied, setCopied] = useState(false)

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

    const idVerified = profDetails.id_card_status === 'VERIFIED'
    const collegeName = profDetails.collage_name || profDetails.college_name || ''

    const copyAnweshaId = async () => {
        try {
            await navigator.clipboard.writeText(profDetails.anwesha_id)
            setCopied(true)
            toast.success('Anwesha ID copied', { autoClose: 2000 })
            setTimeout(() => setCopied(false), 2000)
        } catch {
            toast.error('Could not copy. Please copy it manually.')
        }
    }

    if (!userData?.state?.user) {
        return (
            <div className={ui.page}>
                <Loader label="Loading your profile…" fullPage />
            </div>
        )
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
            <div className={ui.page}>
                <div className={ui.shell}>
                    <section className={`${ui.panel} ${ui.hero}`} aria-label="Your profile">
                        <div className={ui.avatarWrap}>
                            <img
                                src={profDetails.profile_photo_url || '/home/mascott.png'}
                                alt={`${profDetails.full_name || 'Your'} profile photo`}
                                className={ui.avatar}
                            />
                            {!idVerified && (
                                <>
                                    <input
                                        type="file"
                                        id="photo-upload"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handlePhotoUpload}
                                        disabled={uploadingPhoto}
                                    />
                                    <label htmlFor="photo-upload" className={ui.avatarUpload} title="Change profile photo">
                                        <ButtonLoader loading={uploadingPhoto} label="">
                                            <Camera size={17} aria-hidden="true" />
                                        </ButtonLoader>
                                        <span className="sr-only">Change profile photo</span>
                                    </label>
                                </>
                            )}
                        </div>

                        <div className={ui.identity}>
                            <p className={ui.greeting}>Welcome back,</p>
                            <h1 className={ui.name}>{profDetails.full_name}</h1>
                            <div className={ui.metaRow}>
                                <span className={ui.idPill}>
                                    {profDetails.anwesha_id}
                                    <button
                                        type="button"
                                        className={ui.copyButton}
                                        onClick={copyAnweshaId}
                                        aria-label="Copy Anwesha ID"
                                    >
                                        {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
                                    </button>
                                </span>
                                <span className={`${ui.statusChip} ${idVerified ? ui.chipVerified : ui.chipPending}`}>
                                    {idVerified ? <BadgeCheck size={15} aria-hidden="true" /> : <ShieldAlert size={15} aria-hidden="true" />}
                                    {idVerified ? 'ID verified' : 'ID not verified'}
                                </span>
                            </div>
                            {collegeName && (
                                <p className={ui.college}>
                                    <Building2 size={16} aria-hidden="true" />
                                    {collegeName}
                                </p>
                            )}
                        </div>

                        <div className={ui.heroActions}>
                            <button
                                type="button"
                                className={ui.primaryButton}
                                onClick={() => setShowEditProfile(true)}
                                disabled={idVerified}
                                title={idVerified ? 'Profile is locked after ID verification' : undefined}
                            >
                                <Pencil size={16} aria-hidden="true" />
                                Edit profile
                            </button>
                            <Link href="/change-password" className={ui.secondaryButton}>
                                <KeyRound size={16} aria-hidden="true" />
                                Change password
                            </Link>
                            {idVerified && <p className={ui.lockNote}>Details are locked after ID verification.</p>}
                        </div>
                    </section>

                    <div className={ui.notices}>
                        <IdSubmissionCard
                            status={profDetails.id_card_status}
                            getAuthHeaders={userData?.getAuthHeaders}
                        />
                        {!myntraLoading && myntraStatus && myntraStatus.is_myntra_registered === false && (
                            <section className={ui.notice}>
                                <span className={ui.noticeIcon} aria-hidden="true">
                                    <ShoppingBag size={22} />
                                </span>
                                <div className={ui.noticeBody}>
                                    <h3>Register on Myntra for Pronite entry</h3>
                                    <p>Myntra registration is mandatory for Pronite entry and you have not registered yet.</p>
                                </div>
                                <a
                                    href="https://myntra.onelink.me/dNYC/psb0vkzt?af_qr=true"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={ui.primaryButton}
                                >
                                    Open Myntra app
                                    <ExternalLink size={15} aria-hidden="true" />
                                </a>
                            </section>
                        )}
                    </div>

                    <section className={ui.panel} aria-labelledby="profile-details-title">
                        <h2 id="profile-details-title" className={ui.sectionTitle}>Personal details</h2>
                        <dl className={ui.details}>
                            {[
                                { label: 'Email', value: profDetails.email_id, Icon: Mail },
                                { label: 'Mobile number', value: profDetails.phone_number, Icon: Phone },
                                { label: 'Gender', value: profDetails.gender, Icon: User },
                                { label: 'Date of birth', value: profDetails.dob, Icon: Cake },
                                { label: 'Institute / organisation', value: collegeName, Icon: Building2 },
                            ].map(({ label, value, Icon }) => (
                                <div key={label} className={ui.detail}>
                                    <span className={ui.detailIcon} aria-hidden="true">
                                        <Icon size={18} />
                                    </span>
                                    <div>
                                        <dt>{label}</dt>
                                        <dd>{value || 'Not specified'}</dd>
                                    </div>
                                </div>
                            ))}
                        </dl>
                    </section>
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
                                zIndex: 100000,
                                padding: '24px 16px',
                                overflowY: 'auto',
                            }}
                            onClick={() => setShowEditProfile(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                style={{
                                    background: '#131318',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    borderRadius: '16px',
                                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(104, 51, 255, 0.25)',
                                    width: '100%',
                                    maxWidth: '520px',
                                    maxHeight: 'calc(100vh - 48px)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden',
                                    margin: 'auto',
                                    color: '#ffffff',
                                    fontFamily: "'Cormorant Garamond', serif",
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Fixed Header - Always Visible */}
                                <div
                                    style={{
                                        padding: '18px 24px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                                        background: '#181822',
                                        flexShrink: 0,
                                    }}
                                >
                                    <h2
                                        style={{
                                            color: '#ffffff',
                                            margin: 0,
                                            fontFamily: "'DM Serif Display', serif",
                                            fontSize: '22px',
                                            fontWeight: 'normal',
                                            letterSpacing: '1px',
                                        }}
                                    >
                                        Edit Profile
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => setShowEditProfile(false)}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.08)',
                                            border: 'none',
                                            color: '#e2e8f0',
                                            borderRadius: '50%',
                                            width: '30px',
                                            height: '30px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s',
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)'
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Scrollable Form Body */}
                                <div
                                    style={{
                                        padding: '22px 24px',
                                        overflowY: 'auto',
                                        flex: 1,
                                    }}
                                >
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
                                                    color: '#ffffff',
                                                    display: 'block',
                                                    marginBottom: '6px',
                                                    fontSize: '18px',
                                                    fontWeight: '600',
                                                    fontFamily: "'Cormorant Garamond', serif",
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
                                                    backgroundColor: '#1b1b22',
                                                    border: '1px solid rgba(255, 255, 255, 0.16)',
                                                    borderRadius: '8px',
                                                    color: '#ffffff',
                                                    fontSize: '17px',
                                                    fontFamily: "'Cormorant Garamond', serif",
                                                    fontVariantNumeric: 'lining-nums',
                                                    outline: 'none',
                                                    boxSizing: 'border-box',
                                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#6833ff'
                                                    e.target.style.boxShadow = '0 0 0 2px rgba(104, 51, 255, 0.25)'
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)'
                                                    e.target.style.boxShadow = 'none'
                                                }}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label
                                                style={{
                                                    color: '#ffffff',
                                                    display: 'block',
                                                    marginBottom: '6px',
                                                    fontSize: '18px',
                                                    fontWeight: '600',
                                                    fontFamily: "'Cormorant Garamond', serif",
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
                                                    backgroundColor: '#1b1b22',
                                                    border: '1px solid rgba(255, 255, 255, 0.16)',
                                                    borderRadius: '8px',
                                                    color: '#ffffff',
                                                    fontSize: '17px',
                                                    fontFamily: "'Cormorant Garamond', serif",
                                                    fontVariantNumeric: 'lining-nums',
                                                    outline: 'none',
                                                    boxSizing: 'border-box',
                                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#6833ff'
                                                    e.target.style.boxShadow = '0 0 0 2px rgba(104, 51, 255, 0.25)'
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)'
                                                    e.target.style.boxShadow = 'none'
                                                }}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label
                                                style={{
                                                    color: '#ffffff',
                                                    display: 'block',
                                                    marginBottom: '6px',
                                                    fontSize: '18px',
                                                    fontWeight: '600',
                                                    fontFamily: "'Cormorant Garamond', serif",
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
                                                    backgroundColor: '#1b1b22',
                                                    border: '1px solid rgba(255, 255, 255, 0.16)',
                                                    borderRadius: '8px',
                                                    color: '#ffffff',
                                                    fontSize: '17px',
                                                    fontFamily: "'Cormorant Garamond', serif",
                                                    fontVariantNumeric: 'lining-nums',
                                                    outline: 'none',
                                                    boxSizing: 'border-box',
                                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#6833ff'
                                                    e.target.style.boxShadow = '0 0 0 2px rgba(104, 51, 255, 0.25)'
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)'
                                                    e.target.style.boxShadow = 'none'
                                                }}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label
                                                style={{
                                                    color: '#ffffff',
                                                    display: 'block',
                                                    marginBottom: '6px',
                                                    fontSize: '18px',
                                                    fontWeight: '600',
                                                    fontFamily: "'Cormorant Garamond', serif",
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
                                                    backgroundColor: '#1b1b22',
                                                    border: '1px solid rgba(255, 255, 255, 0.16)',
                                                    borderRadius: '8px',
                                                    color: '#ffffff',
                                                    colorScheme: 'dark',
                                                    fontSize: '17px',
                                                    fontFamily: "'Cormorant Garamond', serif",
                                                    fontVariantNumeric: 'lining-nums',
                                                    outline: 'none',
                                                    boxSizing: 'border-box',
                                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#6833ff'
                                                    e.target.style.boxShadow = '0 0 0 2px rgba(104, 51, 255, 0.25)'
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)'
                                                    e.target.style.boxShadow = 'none'
                                                }}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label
                                                style={{
                                                    color: '#ffffff',
                                                    display: 'block',
                                                    marginBottom: '6px',
                                                    fontSize: '18px',
                                                    fontWeight: '600',
                                                    fontFamily: "'Cormorant Garamond', serif",
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
                                                    backgroundColor: '#1b1b22',
                                                    border: '1px solid rgba(255, 255, 255, 0.16)',
                                                    borderRadius: '8px',
                                                    color: '#ffffff',
                                                    fontSize: '17px',
                                                    fontFamily: "'Cormorant Garamond', serif",
                                                    outline: 'none',
                                                    boxSizing: 'border-box',
                                                    transition: 'border-color 0.2s, box-shadow 0.2s',
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = '#6833ff'
                                                    e.target.style.boxShadow = '0 0 0 2px rgba(104, 51, 255, 0.25)'
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.16)'
                                                    e.target.style.boxShadow = 'none'
                                                }}
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
                                                marginTop: '14px',
                                                paddingTop: '8px',
                                            }}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => setShowEditProfile(false)}
                                                style={{
                                                    padding: '10px 22px',
                                                    background: 'transparent',
                                                    border: '1.5px solid rgba(255, 255, 255, 0.25)',
                                                    color: '#cbd5e1',
                                                    cursor: 'pointer',
                                                    fontSize: '16px',
                                                    fontWeight: '600',
                                                    fontFamily: "'Cormorant Garamond', serif",
                                                    transition: 'all 0.2s',
                                                    height: '48px',
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)'
                                                    e.currentTarget.style.color = '#ffffff'
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)'
                                                    e.currentTarget.style.color = '#cbd5e1'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <motion.button
                                                whileHover={{ scale: profileSaving ? 1 : 1.05 }}
                                                whileTap={{ scale: profileSaving ? 1 : 0.97 }}
                                                type="submit"
                                                disabled={profileSaving}
                                                className={styles.saveChangesBtn}
                                                style={{
                                                    opacity: profileSaving ? 0.7 : 1,
                                                    cursor: profileSaving ? 'not-allowed' : 'pointer',
                                                }}
                                            >
                                                {profileSaving ? 'Saving...' : 'Save Changes'}
                                            </motion.button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                    <div className={ui.accommodation}>
                        <MyAccommodation getAuthHeaders={userData?.getAuthHeaders} />
                    </div>

                    <section className={`${ui.panel} ${ui.eventsPanel}`} aria-label="My events">
                        <MyEvents />
                    </section>
                </div>
            </div>
        </>
    )
}

export default Profile

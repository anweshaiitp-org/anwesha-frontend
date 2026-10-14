import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthContext } from '../components/authContext'
import styles from '../styles/profile.module.css'
import { ButtonLoader } from '../components/Loader'
import {
    requestUploadUrl,
    submitIdCard,
    uploadFileToS3,
    validateIdFile,
} from '../lib/idVerification'

/**
 * Task 4 — Student Dual Document Verification (College ID + Aadhar ID).
 * Route: /submit-id?token=xxx (token comes from verification email).
 */
export default function SubmitId() {
    const router = useRouter()
    const auth = useContext(AuthContext)

    const [emailToken, setEmailToken] = useState('')

    // College ID state
    const [collegeIdNumber, setCollegeIdNumber] = useState('')
    const [collegeIdFile, setCollegeIdFile] = useState(null)
    const [dragActiveCollege, setDragActiveCollege] = useState(false)

    // Aadhar ID state
    const [aadharIdNumber, setAadharIdNumber] = useState('')
    const [aadharIdFile, setAadharIdFile] = useState(null)
    const [dragActiveAadhar, setDragActiveAadhar] = useState(false)

    const [submitting, setSubmitting] = useState(false)
    const [submittingStep, setSubmittingStep] = useState('')
    const [submitted, setSubmitted] = useState(false) // UPLOADED / pending-review
    const [verifiedStatus, setVerifiedStatus] = useState(null)
    const [formError, setFormError] = useState('')

    // Ensure user is logged in before allowing access to this page
    useEffect(() => {
        if (!router.isReady) return
        const storedToken =
            typeof window !== 'undefined'
                ? localStorage.getItem('anwesha_token')
                : null
        if (!auth?.token && !storedToken) {
            router.replace(
                `/userLogin?callbackUrl=${encodeURIComponent(router.asPath)}`
            )
        }
    }, [router.isReady, auth?.token, router.asPath, router])

    // Step 1: read verification token from query params
    useEffect(() => {
        if (!router.isReady) return
        const t = router.query?.token
        if (typeof t === 'string' && t) {
            setEmailToken(t)
        }
    }, [router.isReady, router.query?.token, router])

    // Surface existing verification state from profile (UPLOADED / VERIFIED)
    useEffect(() => {
        const u = auth?.state?.user
        const s = u?.id_card_status || u?.idCardStatus || u?.id_card?.status
        if (s) setVerifiedStatus(String(s).toUpperCase())
    }, [auth?.state?.user])

    const handleFileChangeCollege = (e) => {
        const f = e.target.files?.[0] || null
        setCollegeIdFile(f)
        setFormError('')
    }

    const handleDragCollege = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActiveCollege(true)
        } else if (e.type === 'dragleave') {
            setDragActiveCollege(false)
        }
    }

    const handleDropCollege = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActiveCollege(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setCollegeIdFile(e.dataTransfer.files[0])
            setFormError('')
        }
    }

    const handleFileChangeAadhar = (e) => {
        const f = e.target.files?.[0] || null
        setAadharIdFile(f)
        setFormError('')
    }

    const handleDragAadhar = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActiveAadhar(true)
        } else if (e.type === 'dragleave') {
            setDragActiveAadhar(false)
        }
    }

    const handleDropAadhar = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActiveAadhar(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setAadharIdFile(e.dataTransfer.files[0])
            setFormError('')
        }
    }

    const notify = (type, msg) => {
        if (type === 'success') toast.success(msg)
        else if (type === 'warn') toast.warning(msg)
        else toast.error(msg)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (submitting || submitted) return // prevent duplicates
        setFormError('')

        if (!emailToken) {
            const msg = 'Invalid token. Please use the link from your email.'
            setFormError(msg)
            notify('error', msg)
            return
        }
        if (!auth?.token) {
            const msg = 'Please login to submit your ID.'
            setFormError(msg)
            notify('error', msg)
            router.push(`/userLogin?callbackUrl=${encodeURIComponent(router.asPath)}`)
            return
        }

        // College ID Validation
        if (!collegeIdNumber.trim()) {
            const msg = 'Please enter your College / Student ID number.'
            setFormError(msg)
            notify('error', msg)
            return
        }
        const collegeFileErr = validateIdFile(collegeIdFile, 'college_id')
        if (collegeFileErr) {
            const msg = `College ID: ${collegeFileErr}`
            setFormError(msg)
            notify('error', msg)
            return
        }

        // Aadhar ID Validation
        const cleanAadhar = aadharIdNumber.replace(/[\s-]/g, '')
        if (!cleanAadhar) {
            const msg = 'Please enter your Aadhar Card number.'
            setFormError(msg)
            notify('error', msg)
            return
        }
        if (!/^\d{12}$/.test(cleanAadhar)) {
            const msg = 'Aadhar number must be a valid 12-digit number.'
            setFormError(msg)
            notify('error', msg)
            return
        }
        const aadharFileErr = validateIdFile(aadharIdFile, 'aadhar_id')
        if (aadharFileErr) {
            const msg = `Aadhar Card: ${aadharFileErr}`
            setFormError(msg)
            notify('error', msg)
            return
        }

        if (verifiedStatus === 'VERIFIED') {
            const msg = 'ID already verified. Profile updates are blocked.'
            setFormError(msg)
            notify('warn', msg)
            return
        }

        setSubmitting(true)
        try {
            // Step 1: Upload College ID
            setSubmittingStep('Uploading College ID (1/2)...')
            const collegeUrlData = await requestUploadUrl({
                file: collegeIdFile,
                jwt: auth.token,
                emailToken,
                doc_type: 'college_id',
            })
            await uploadFileToS3({
                uploadUrl: collegeUrlData.uploadUrl,
                file: collegeIdFile,
            })

            // Step 2: Upload Aadhar ID
            setSubmittingStep('Uploading Aadhar Card (2/2)...')
            const aadharUrlData = await requestUploadUrl({
                file: aadharIdFile,
                jwt: auth.token,
                emailToken,
                doc_type: 'aadhar_id',
            })
            await uploadFileToS3({
                uploadUrl: aadharUrlData.uploadUrl,
                file: aadharIdFile,
            })

            // Step 3: Final submit
            setSubmittingStep('Submitting verification documents...')
            await submitIdCard({
                emailToken,
                college_id_number: collegeIdNumber.trim(),
                college_id_file_key: collegeUrlData.fileKey,
                aadhar_id_number: cleanAadhar,
                aadhar_id_file_key: aadharUrlData.fileKey,
                jwt: auth.token,
            })

            setSubmitted(true)
            setVerifiedStatus('UPLOADED')
            notify('success', 'Document submitted successfully. Verification is under process.')
            if (auth?.getUser) auth.getUser()
        } catch (err) {
            const msg = err?.message || 'Submission failed. Please try again.'
            setFormError(msg)
            notify('error', msg)
            if (err?.code === 401) {
                router.push(`/userLogin?callbackUrl=${encodeURIComponent(router.asPath)}`)
            }
        } finally {
            setSubmitting(false)
            setSubmittingStep('')
        }
    }

    const isTokenMissingOrInvalid = (!emailToken && router.isReady) || formError === 'Invalid token.'

    // ---------- UI-only style helpers ----------
    const sectionStyle = {
        background: '#fdfcff',
        border: '1px solid #ede9fe',
        borderRadius: 14,
        padding: '22px 20px',
    }
    const labelStyle = { fontSize: '0.8rem', fontWeight: 600, color: '#4c1d95', letterSpacing: '0.2px' }
    const inputStyle = {
        width: '100%',
        padding: '12px 14px 12px 38px',
        background: '#faf8ff',
        color: '#1e1b4b',
        border: '1.5px solid #e8e4f9',
        borderRadius: 10,
        fontSize: '0.95rem',
        outline: 'none',
        fontFamily: 'inherit',
    }
    const inputIconStyle = {
        position: 'absolute',
        left: 13,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 16,
        height: 16,
        color: '#c4b5fd',
        pointerEvents: 'none',
    }
    const dropStyle = (active) => ({
        border: active ? '1.5px dashed #7c3aed' : '1.5px dashed #d8b4fe',
        borderRadius: 12,
        padding: '28px 20px',
        textAlign: 'center',
        background: active ? '#f5f3ff' : '#ffffff',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        boxShadow: active ? '0 0 0 3px rgba(124,58,237,0.07)' : 'none',
    })
    const hiddenFileInputStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0,
        cursor: 'pointer',
    }
    const stepBadgeStyle = {
        background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
        color: '#fff',
        fontWeight: 700,
        borderRadius: '50%',
        width: 28,
        height: 28,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.85rem',
        flexShrink: 0,
    }
    const uploadIconBoxStyle = {
        width: 44,
        height: 44,
        background: '#f3f0ff',
        border: '1px solid #ddd6fe',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 12px',
    }

    return (
        <>
            <Head>
                <title>Submit Verification Documents - Anwesha 2k27</title>
                <meta name="description" content="Student ID & Aadhar Verification - Anwesha 2k27" />
            </Head>
            {/* Toasts render via the global ToastContainer in _app.js */}
            <div className={styles.mainContainer}>
                <div className={styles.subContainer}>

                    {/* Page wrapper */}
                    <div style={{ maxWidth: 680, margin: '40px auto', padding: '0 16px' }}>

                        {/* Top label */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                            <div style={{ flex: 1, height: 1, background: '#ede9fe' }} />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#8b5cf6', whiteSpace: 'nowrap' }}>
                                Identity Verification
                            </span>
                            <div style={{ flex: 1, height: 1, background: '#ede9fe' }} />
                        </div>

                        {/* Card */}
                        <div style={{ background: '#ffffff', borderRadius: 18, border: '1px solid #ede9fe', boxShadow: '0 1px 3px rgba(109,40,217,0.05), 0 8px 24px rgba(109,40,217,0.08), 0 32px 56px rgba(109,40,217,0.05)', overflow: 'hidden' }}>

                            {/* Purple accent bar */}
                            <div style={{ height: 4, background: 'linear-gradient(90deg, #7c3aed, #a78bfa, #7c3aed)' }} />

                            {/* Card body */}
                            <div style={{ padding: '40px 40px 44px' }}>

                                {/* Header */}
                                <div style={{ marginBottom: 24 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
                                        <div style={{ width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}>
                                            <svg style={{ width: 22, height: 22, color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#1e1b4b', letterSpacing: '-0.3px', margin: 0 }}>
                                            Document Verification
                                        </h1>
                                    </div>
                                    <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.5, margin: 0, paddingLeft: 60 }}>
                                        {submitted || verifiedStatus === 'UPLOADED'
                                            ? 'Document submitted successfully. Verification is under process.'
                                            : verifiedStatus === 'VERIFIED'
                                                ? 'Your documents have been verified.'
                                                : 'Please provide both your College ID and Aadhar ID for identity verification.'}
                                    </p>
                                </div>

                                {/* Divider */}
                                <div style={{ height: 1, background: '#f3f0ff', marginBottom: 28 }} />

                                {/* TOKEN MISSING */}
                                {isTokenMissingOrInvalid ? (
                                    <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fff5f5', borderRadius: 12, border: '1px solid #fecaca' }}>
                                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fee2e2', border: '1px solid #fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                            <svg style={{ width: 26, height: 26, color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h2 style={{ color: '#b91c1c', fontSize: '1.05rem', fontWeight: 700, marginBottom: 8 }}>Verification Link Required</h2>
                                        <p style={{ color: '#6b7280', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                                            Please use the secure link sent to your registered email address to access this page.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Error alert */}
                                        {formError && (
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: '#fef2f2', border: '1px solid #fecaca', padding: '13px 16px', borderRadius: 10, marginBottom: 18 }}>
                                                <svg style={{ width: 17, height: 17, color: '#b91c1c', flexShrink: 0, marginTop: 1 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p style={{ color: '#b91c1c', margin: 0, fontWeight: 500, fontSize: '0.88rem' }}>{formError}</p>
                                            </div>
                                        )}

                                        {/* Success alert */}
                                        {submitted && !formError && (
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '13px 16px', borderRadius: 10, marginBottom: 18 }}>
                                                <svg style={{ width: 17, height: 17, color: '#15803d', flexShrink: 0, marginTop: 1 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p style={{ color: '#15803d', margin: 0, fontWeight: 500, fontSize: '0.88rem' }}>Document submitted successfully. Verification is under process.</p>
                                            </div>
                                        )}

                                        {/* Status box or Form */}
                                        {submitted || verifiedStatus === 'VERIFIED' || verifiedStatus === 'UPLOADED' ? (
                                            <div style={{ textAlign: 'center', padding: '36px 24px', background: '#f5f3ff', borderRadius: 12, border: '1px solid #ddd6fe' }}>
                                                <div style={{
                                                    width: 56, height: 56, borderRadius: '50%',
                                                    background: verifiedStatus === 'VERIFIED' ? '#d1fae5' : '#fef3c7',
                                                    border: verifiedStatus === 'VERIFIED' ? '1px solid #6ee7b7' : '1px solid #fcd34d',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
                                                }}>
                                                    <svg style={{ width: 26, height: 26, color: verifiedStatus === 'VERIFIED' ? '#059669' : '#d97706' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        {verifiedStatus === 'VERIFIED'
                                                            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        }
                                                    </svg>
                                                </div>
                                                <span style={{
                                                    display: 'inline-block', padding: '4px 14px', borderRadius: 999,
                                                    fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 10,
                                                    background: verifiedStatus === 'VERIFIED' ? '#d1fae5' : '#fef3c7',
                                                    color: verifiedStatus === 'VERIFIED' ? '#065f46' : '#92400e',
                                                }}>
                                                    {verifiedStatus === 'VERIFIED' ? 'Verified' : 'In Process'}
                                                </span>
                                                <p style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e1b4b', margin: '0 0 6px' }}>
                                                    {verifiedStatus === 'VERIFIED' ? 'Identity Verified' : 'Document Submitted Successfully'}
                                                </p>
                                                <p style={{ fontSize: '0.88rem', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                                                    {verifiedStatus === 'VERIFIED'
                                                        ? 'Your documents have been verified. You now have full access.'
                                                        : 'Verification is under process.'}
                                                </p>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                                                {/* DOCUMENT 1: COLLEGE ID */}
                                                <div style={sectionStyle}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                                        <span style={stepBadgeStyle}>1</span>
                                                        <h2 style={{ color: '#1e1b4b', margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>College ID Card</h2>
                                                    </div>
                                                    <p style={{ color: '#6b7280', fontSize: '0.82rem', margin: '0 0 18px 38px', lineHeight: 1.5 }}>
                                                        Upload your current college student ID card or bonafide certificate.
                                                    </p>

                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 18 }}>
                                                        <label style={labelStyle}>College Roll / Student ID Number *</label>
                                                        <div style={{ position: 'relative' }}>
                                                            <svg style={inputIconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                            </svg>
                                                            <input
                                                                type="text"
                                                                value={collegeIdNumber}
                                                                onChange={(ev) => setCollegeIdNumber(ev.target.value)}
                                                                placeholder="e.g. 2201CS01 or STU-9842"
                                                                disabled={submitting}
                                                                style={inputStyle}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                                        <label style={labelStyle}>
                                                            College ID Document *{' '}
                                                            <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: '0.72rem' }}>— PNG, JPG, JPEG, max 5 MB</span>
                                                        </label>
                                                        <div
                                                            onDragEnter={handleDragCollege}
                                                            onDragLeave={handleDragCollege}
                                                            onDragOver={handleDragCollege}
                                                            onDrop={handleDropCollege}
                                                            style={dropStyle(dragActiveCollege)}
                                                        >
                                                            <input
                                                                type="file"
                                                                accept="image/png, image/jpeg, image/jpg"
                                                                onChange={handleFileChangeCollege}
                                                                disabled={submitting}
                                                                style={hiddenFileInputStyle}
                                                            />
                                                            <div style={uploadIconBoxStyle}>
                                                                <svg style={{ width: 22, height: 22, color: '#7c3aed' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                            {collegeIdFile ? (
                                                                <>
                                                                    <p style={{ color: '#5b21b6', fontSize: '0.9rem', margin: 0, fontWeight: 600 }}>
                                                                        📄 {collegeIdFile.name}
                                                                    </p>
                                                                    <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: 5 }}>{Math.round(collegeIdFile.size / 1024)} KB · Ready to upload</p>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
                                                                        Drag &amp; drop your <strong style={{ color: '#7c3aed' }}>image</strong> here, or <strong style={{ color: '#7c3aed' }}>click to browse</strong>
                                                                    </p>
                                                                    <p style={{ color: '#c4b5fd', fontSize: '0.75rem', marginTop: 5 }}>Accepted: .png, .jpg, .jpeg · Max size: 5 MB</p>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* DOCUMENT 2: AADHAR CARD */}
                                                <div style={sectionStyle}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                                        <span style={stepBadgeStyle}>2</span>
                                                        <h2 style={{ color: '#1e1b4b', margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Aadhar Card</h2>
                                                    </div>
                                                    <p style={{ color: '#6b7280', fontSize: '0.82rem', margin: '0 0 18px 38px', lineHeight: 1.5 }}>
                                                        Upload your official 12-digit Aadhar identity card.
                                                    </p>

                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 18 }}>
                                                        <label style={labelStyle}>Aadhar Number (12 digits) *</label>
                                                        <div style={{ position: 'relative' }}>
                                                            <svg style={inputIconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                                                            </svg>
                                                            <input
                                                                type="text"
                                                                value={aadharIdNumber}
                                                                onChange={(ev) => setAadharIdNumber(ev.target.value)}
                                                                placeholder="e.g. 1234 5678 9012"
                                                                maxLength={14}
                                                                disabled={submitting}
                                                                style={inputStyle}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                                        <label style={labelStyle}>
                                                            Aadhar Document *{' '}
                                                            <span style={{ color: '#9ca3af', fontWeight: 400, fontSize: '0.72rem' }}>— PDF only, max 5 MB</span>
                                                        </label>
                                                        <div
                                                            onDragEnter={handleDragAadhar}
                                                            onDragLeave={handleDragAadhar}
                                                            onDragOver={handleDragAadhar}
                                                            onDrop={handleDropAadhar}
                                                            style={dropStyle(dragActiveAadhar)}
                                                        >
                                                            <input
                                                                type="file"
                                                                accept="application/pdf"
                                                                onChange={handleFileChangeAadhar}
                                                                disabled={submitting}
                                                                style={hiddenFileInputStyle}
                                                            />
                                                            <div style={uploadIconBoxStyle}>
                                                                <svg style={{ width: 22, height: 22, color: '#7c3aed' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                                </svg>
                                                            </div>
                                                            {aadharIdFile ? (
                                                                <>
                                                                    <p style={{ color: '#5b21b6', fontSize: '0.9rem', margin: 0, fontWeight: 600 }}>
                                                                        📄 {aadharIdFile.name}
                                                                    </p>
                                                                    <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: 5 }}>{Math.round(aadharIdFile.size / 1024)} KB · Ready to upload</p>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
                                                                        Drag &amp; drop your <strong style={{ color: '#7c3aed' }}>PDF</strong> here, or <strong style={{ color: '#7c3aed' }}>click to browse</strong>
                                                                    </p>
                                                                    <p style={{ color: '#c4b5fd', fontSize: '0.75rem', marginTop: 5 }}>Accepted: .pdf · Max size: 5 MB</p>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Submit button */}
                                                <div>
                                                    <button
                                                        type="submit"
                                                        disabled={submitting || !emailToken || !auth?.token}
                                                        style={{
                                                            width: '100%',
                                                            padding: '14px',
                                                            background: submitting ? '#e5e7eb' : '#7c3aed',
                                                            color: submitting ? '#9ca3af' : '#fff',
                                                            border: 'none',
                                                            borderRadius: 11,
                                                            cursor: submitting ? 'not-allowed' : 'pointer',
                                                            fontWeight: 700,
                                                            fontSize: '0.97rem',
                                                            fontFamily: 'inherit',
                                                            letterSpacing: '0.3px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: 8,
                                                            boxShadow: submitting ? 'none' : '0 4px 14px rgba(124,58,237,0.35)',
                                                            transition: 'background 0.2s, transform 0.15s, box-shadow 0.2s',
                                                        }}
                                                        onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#6d28d9'; }}
                                                        onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = '#7c3aed'; }}
                                                        onMouseDown={e => { if (!submitting) e.currentTarget.style.transform = 'scale(0.98)'; }}
                                                        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                                                    >
                                                        <ButtonLoader loading={submitting} label={submittingStep || 'Submitting'}>
                                                            Submit Documents for Review
                                                        </ButtonLoader>
                                                    </button>
                                                    <p style={{ textAlign: 'center', fontSize: '0.73rem', color: '#a78bfa', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                                                        <svg style={{ width: 13, height: 13 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                        </svg>
                                                        Both documents are securely uploaded and verified by authorized Anwesha administrators.
                                                    </p>
                                                </div>

                                            </form>
                                        )}
                                    </>
                                )}

                            </div>{/* /card-body */}
                        </div>{/* /card */}

                        {/* Footer note */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20, fontSize: '0.72rem', color: '#c4b5fd' }}>
                            <span>Anwesha 2k27</span>
                            <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#c4b5fd', display: 'inline-block' }} />
                            <span>IIT Patna</span>
                            <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#c4b5fd', display: 'inline-block' }} />
                            <span>ID Verification Portal</span>
                        </div>

                    </div>{/* /page wrapper */}
                </div>
            </div>
        </>
    )
}

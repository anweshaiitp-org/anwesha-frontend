import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthContext } from '../components/authContext'
import styles from '../styles/profile.module.css'
import {
    ID_CARD_TYPES,
    requestUploadUrl,
    submitIdCard,
    uploadFileToS3,
    validateIdFile,
} from '../lib/idVerification'

/**
 * Task 4 — Student ID Verification & Review Flow.
 * Route: /submit-id?token=xxx (token comes from verification email).
 */
export default function SubmitId() {
    const router = useRouter()
    const auth = useContext(AuthContext)

    const [emailToken, setEmailToken] = useState('')
    const [idType, setIdType] = useState('COLLEGE_ID')
    const [idNumber, setIdNumber] = useState('')
    const [file, setFile] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false) // UPLOADED / pending-review
    const [verifiedStatus, setVerifiedStatus] = useState(null)
    const [formError, setFormError] = useState('')
    const [dragActive, setDragActive] = useState(false)

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
    }, [router.isReady, auth?.token, router.asPath])

    // Step 1: read verification token from query params
    useEffect(() => {
        if (!router.isReady) return
        const t = router.query.token
        if (typeof t === 'string' && t) {
            setEmailToken(t)
        }
    }, [router.isReady, router.query.token])

    // Surface existing verification state from profile (UPLOADED / VERIFIED)
    useEffect(() => {
        const u = auth?.state?.user
        const s = u?.id_card_status || u?.idCardStatus || u?.id_card?.status
        if (s) setVerifiedStatus(String(s).toUpperCase())
    }, [auth?.state?.user])

    const handleFileChange = (e) => {
        const f = e.target.files?.[0] || null
        setFile(f)
        setFormError('')
    }

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
            setFormError('');
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
        if (!ID_CARD_TYPES.includes(idType)) {
            const msg = 'Please select a valid ID type.'
            setFormError(msg)
            notify('error', msg)
            return
        }
        if (!idNumber.trim()) {
            const msg = 'Please enter your ID card number.'
            setFormError(msg)
            notify('error', msg)
            return
        }
        const fileErr = validateIdFile(file)
        if (fileErr) {
            setFormError(fileErr)
            notify('error', fileErr)
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
            // Step 2: presigned URL (JWT, URLSearchParams inside client)
            const { uploadUrl, fileKey } = await requestUploadUrl({
                file,
                jwt: auth.token,
                emailToken,
            })
            // Step 3: PUT binary to S3 (no JWT)
            await uploadFileToS3({ uploadUrl, file })
            // Step 4: final submit
            const data = await submitIdCard({
                emailToken,
                id_card_type: idType,
                id_card_number: idNumber.trim(),
                s3_file_key: fileKey,
                jwt: auth.token,
            })
            setSubmitted(true)
            setVerifiedStatus('UPLOADED')
            const okMsg =
                data?.message ||
                'Identity card submitted successfully and is pending review by the team.'
            notify('success', okMsg)
            if (auth?.getUser) auth.getUser()
        } catch (err) {
            // Never expose tokens in messages/logs
            const msg = err?.message || 'Submission failed. Please try again.'
            setFormError(msg)
            notify('error', msg)
            if (err?.code === 401) router.push(`/userLogin?callbackUrl=${encodeURIComponent(router.asPath)}`)
        } finally {
            setSubmitting(false)
        }
    }

    const isTokenMissingOrInvalid = (!emailToken && router.isReady) || formError === 'Invalid token.'

    return (
        <>
            <Head>
                <title>Submit ID - Anwesha 2k27</title>
                <meta name="description" content="Student ID Verification - Anwesha 2k27" />
            </Head>
            {/* Toasts render via the global ToastContainer in _app.js */}
            <div className={styles.mainContainer}>
                <div className={styles.subContainer}>
                    <div
                        style={{
                            position: 'relative',
                            zIndex: 1,
                            maxWidth: 800,
                            margin: '40px auto',
                            padding: '40px 32px',
                            background: 'rgba(0,0,0,0.75)',
                            border: '1px solid #F2BF51',
                            borderRadius: 16,
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 8px 32px rgba(242, 191, 81, 0.1)',
                        }}
                    >
                        <h1 style={{ color: '#F2BF51', marginBottom: 12, fontSize: '2.5rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            Student ID Verification
                        </h1>
                        <p style={{ color: '#fff', marginBottom: 28, fontSize: '1.1rem', textAlign: 'center' }}>
                            {submitted || verifiedStatus === 'UPLOADED'
                                ? 'Your document is submitted and pending review by the team.'
                                : verifiedStatus === 'VERIFIED'
                                  ? 'Your ID card is verified.'
                                  : 'Upload your student ID for review.'}
                        </p>

                        {isTokenMissingOrInvalid ? (
                            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(255, 0, 0, 0.1)', borderRadius: '10px', border: '1px solid #ff8888' }}>
                                <svg style={{ width: 64, height: 64, color: '#ff8888', margin: '0 auto 16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <h2 style={{ color: '#ff8888', marginBottom: 12 }}>Invalid or Missing Verification Token</h2>
                                <p style={{ color: '#fff', fontSize: '1.1rem' }}>
                                    Please open the secure ID submission link provided in the verification email sent to your account.
                                </p>
                            </div>
                        ) : (
                            <>
                                {formError && (
                                    <div style={{ background: 'rgba(255, 0, 0, 0.1)', border: '1px solid #ff8888', padding: '16px', borderRadius: 8, marginBottom: 24, textAlign: 'center' }}>
                                        <p style={{ color: '#ff8888', margin: 0, fontWeight: '500', fontSize: '1.1rem' }}>
                                            {formError}
                                        </p>
                                    </div>
                                )}
                                
                                {submitted && !formError && (
                                    <div style={{ background: 'rgba(0, 255, 0, 0.1)', border: '1px solid #4caf50', padding: '16px', borderRadius: 8, marginBottom: 24, textAlign: 'center' }}>
                                        <p style={{ color: '#4caf50', margin: 0, fontWeight: '500', fontSize: '1.1rem' }}>
                                            Identity card submitted successfully!
                                        </p>
                                    </div>
                                )}

                                {submitted || verifiedStatus === 'VERIFIED' || verifiedStatus === 'UPLOADED' ? (
                                    <div style={{ color: '#fff', textAlign: 'center', padding: '20px' }}>
                                        <p style={{ fontSize: '1.2rem' }}>
                                            Status:{' '}
                                            <strong style={{ color: '#F2BF51', fontSize: '1.4rem' }}>
                                                {submitted ? 'UPLOADED (pending review)' : verifiedStatus}
                                            </strong>
                                        </p>
                                        <p style={{ marginTop: 12, color: '#ccc', fontSize: '1rem' }}>
                                            Uploading again does not mean verified. Please wait for the team review.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        <div>
                                            <label style={{ color: '#F2BF51', fontSize: '1.1rem', fontWeight: 'bold' }}>ID Type</label>
                                            <select
                                                value={idType}
                                                onChange={(ev) => setIdType(ev.target.value)}
                                                disabled={submitting}
                                                style={{ width: '100%', padding: '14px', marginTop: 10, background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '8px', fontSize: '1.05rem', outline: 'none' }}
                                            >
                                                {ID_CARD_TYPES.map((t) => (
                                                    <option key={t} value={t}>
                                                        {t.replace('_', ' ')}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label style={{ color: '#F2BF51', fontSize: '1.1rem', fontWeight: 'bold' }}>ID Card Number</label>
                                            <input
                                                type="text"
                                                value={idNumber}
                                                onChange={(ev) => setIdNumber(ev.target.value)}
                                                placeholder="e.g. 2201CS01"
                                                disabled={submitting}
                                                style={{ width: '100%', padding: '14px', marginTop: 10, background: '#111', color: '#fff', border: '1px solid #333', borderRadius: '8px', fontSize: '1.05rem', outline: 'none' }}
                                            />
                                        </div>
                                        
                                        <div>
                                            <label style={{ color: '#F2BF51', fontSize: '1.1rem', fontWeight: 'bold' }}>
                                                ID Document <span style={{ color: '#ccc', fontWeight: 'normal', fontSize: '0.95rem' }}>(PDF only, max 5MB)</span>
                                            </label>
                                            <div
                                                onDragEnter={handleDrag}
                                                onDragLeave={handleDrag}
                                                onDragOver={handleDrag}
                                                onDrop={handleDrop}
                                                style={{
                                                    marginTop: 10,
                                                    padding: '40px 20px',
                                                    border: dragActive ? '2px dashed #F2BF51' : '2px dashed #444',
                                                    background: dragActive ? 'rgba(242, 191, 81, 0.1)' : '#111',
                                                    borderRadius: '12px',
                                                    textAlign: 'center',
                                                    transition: 'all 0.2s ease',
                                                    cursor: 'pointer',
                                                    position: 'relative'
                                                }}
                                            >
                                                <input
                                                    type="file"
                                                    accept="application/pdf"
                                                    onChange={handleFileChange}
                                                    disabled={submitting}
                                                    style={{ 
                                                        position: 'absolute', 
                                                        top: 0, 
                                                        left: 0, 
                                                        width: '100%', 
                                                        height: '100%', 
                                                        opacity: 0, 
                                                        cursor: 'pointer' 
                                                    }}
                                                />
                                                <svg style={{ width: 48, height: 48, color: '#F2BF51', margin: '0 auto 12px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                                {file ? (
                                                    <p style={{ color: '#fff', fontSize: '1.1rem', margin: 0 }}>
                                                        <strong style={{ color: '#F2BF51' }}>Selected:</strong> {file.name} ({Math.round(file.size / 1024)} KB)
                                                    </p>
                                                ) : (
                                                    <p style={{ color: '#ccc', fontSize: '1.1rem', margin: 0 }}>
                                                        Drag and drop your <strong style={{ color: '#F2BF51' }}>PDF</strong> here, or click to browse
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <button
                                            type="submit"
                                            disabled={submitting || !emailToken || !auth?.token}
                                            style={{
                                                padding: '16px 24px',
                                                background: submitting ? '#666' : 'linear-gradient(90deg, #F2BF51 0%, #d49c25 100%)',
                                                color: '#000',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: submitting ? 'not-allowed' : 'pointer',
                                                fontWeight: 'bold',
                                                fontSize: '1.2rem',
                                                marginTop: '10px',
                                                boxShadow: submitting ? 'none' : '0 4px 15px rgba(242, 191, 81, 0.4)',
                                                transition: 'transform 0.1s ease',
                                            }}
                                            onMouseDown={e => { if(!submitting) e.currentTarget.style.transform = 'scale(0.98)' }}
                                            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                        >
                                            {submitting ? 'Submitting...' : 'Submit for Review'}
                                        </button>
                                    </form>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

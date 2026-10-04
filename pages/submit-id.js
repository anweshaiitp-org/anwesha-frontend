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
 * UI reuses profile.module.css classes; no redesign.
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

    // Step 1: read token from query params; fall back to JWT auth token so
    // logged-in users can access the page directly without an email link.
    useEffect(() => {
        if (!router.isReady) return
        const t = router.query.token
        if (typeof t === 'string' && t) {
            setEmailToken(t)
        } else if (auth?.token) {
            // Use the user's own JWT as the verification token fallback
            setEmailToken(auth.token)
        }
    }, [router.isReady, router.query.token, auth?.token])

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
            const msg = 'Invalid or missing verification token. Please use the link from your email.'
            setFormError(msg)
            notify('error', msg)
            return
        }
        if (!auth?.token) {
            const msg = 'Please login to submit your ID.'
            setFormError(msg)
            notify('error', msg)
            router.push('/userLogin')
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
            if (err?.code === 401) router.push('/userLogin')
        } finally {
            setSubmitting(false)
        }
    }

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
                            maxWidth: 640,
                            margin: '40px auto',
                            padding: '28px',
                            background: 'rgba(0,0,0,0.65)',
                            border: '1px solid #F2BF51',
                            borderRadius: 10,
                        }}
                    >
                        <h1 style={{ color: '#F2BF51', marginBottom: 8 }}>
                            Student ID Verification
                        </h1>
                        <p style={{ color: '#fff', marginBottom: 20 }}>
                            {submitted || verifiedStatus === 'UPLOADED'
                                ? 'Your document is submitted and pending review by the team.'
                                : verifiedStatus === 'VERIFIED'
                                  ? 'Your ID card is verified.'
                                  : 'Upload your student ID for review.'}
                        </p>

                        {!emailToken && !auth?.token && (
                            <p style={{ color: '#ff8888', marginBottom: 16 }}>
                                Missing verification token. Please{' '}
                                <a href="/userLogin" style={{ color: '#F2BF51' }}>log in</a>{' '}
                                or open the link from your email ( /submit-id?token=xxx ).
                            </p>
                        )}

                        {formError && (
                            <p style={{ color: '#ff8888', marginBottom: 16 }}>
                                {formError}
                            </p>
                        )}

                        {submitted || verifiedStatus === 'VERIFIED' || verifiedStatus === 'UPLOADED' ? (
                            <div style={{ color: '#fff' }}>
                                <p>
                                    Status:{' '}
                                    <strong style={{ color: '#F2BF51' }}>
                                        {submitted ? 'UPLOADED (pending review)' : verifiedStatus}
                                    </strong>
                                </p>
                                <p style={{ marginTop: 8, color: '#ccc' }}>
                                    Uploading again does not mean verified. Please
                                    wait for the team review.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: 14 }}>
                                    <label style={{ color: '#F2BF51' }}>ID Type</label>
                                    <br />
                                    <select
                                        value={idType}
                                        onChange={(ev) => setIdType(ev.target.value)}
                                        disabled={submitting}
                                        style={{ width: '100%', padding: '10px', marginTop: 6 }}
                                    >
                                        {ID_CARD_TYPES.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ marginBottom: 14 }}>
                                    <label style={{ color: '#F2BF51' }}>ID Card Number</label>
                                    <br />
                                    <input
                                        type="text"
                                        value={idNumber}
                                        onChange={(ev) => setIdNumber(ev.target.value)}
                                        placeholder="e.g. 2201CS01"
                                        disabled={submitting}
                                        style={{ width: '100%', padding: '10px', marginTop: 6 }}
                                    />
                                </div>
                                <div style={{ marginBottom: 14 }}>
                                    <label style={{ color: '#F2BF51' }}>
                                        ID Document (PDF / JPG / PNG, max 5MB)
                                    </label>
                                    <br />
                                    <input
                                        type="file"
                                        accept="application/pdf,image/jpeg,image/png"
                                        onChange={handleFileChange}
                                        disabled={submitting}
                                        style={{ marginTop: 6, color: '#fff' }}
                                    />
                                    {file && (
                                        <p style={{ color: '#ccc', marginTop: 6 }}>
                                            Selected: {file.name} ({Math.round(file.size / 1024)} KB)
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting || (!emailToken && !auth?.token)}
                                    style={{
                                        padding: '12px 24px',
                                        background: submitting ? '#666' : '#F2BF51',
                                        color: '#000',
                                        border: 'none',
                                        borderRadius: 5,
                                        cursor: submitting ? 'not-allowed' : 'pointer',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {submitting ? 'Submitting…' : 'Submit for Review'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

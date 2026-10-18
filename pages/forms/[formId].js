import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const API_BASE = process.env.NEXT_PUBLIC_HOST || '/api/backend'

export default function CustomFormRegistrationPage() {
    const router = useRouter()
    const { formId } = router.query

    const [formLoading, setFormLoading] = useState(true)
    const [formData, setFormData] = useState(null)
    const [loadError, setLoadError] = useState('')

    // Form inputs
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [dob, setDob] = useState('')
    const [collegeIdNumber, setCollegeIdNumber] = useState('')
    const [collegeName, setCollegeName] = useState('')
    const [aadharNumber, setAadharNumber] = useState('')

    // Files
    const [aadharFile, setAadharFile] = useState(null)
    const [collegeIdFile, setCollegeIdFile] = useState(null)

    // Submission states
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [uploadStep, setUploadStep] = useState('')
    const [submissionSuccess, setSubmissionSuccess] = useState(null)

    useEffect(() => {
        if (!router.isReady || !formId) return

        const fetchFormDetails = async () => {
            setFormLoading(true)
            setLoadError('')
            try {
                const res = await fetch(`${API_BASE}/forms/${encodeURIComponent(formId)}`)
                const data = await res.json()
                if (!res.ok || !data.success) {
                    throw new Error(data.message || 'Custom form not found')
                }
                setFormData(data.form)
                if (data.form.target_college) {
                    setCollegeName(data.form.target_college)
                }
            } catch (err) {
                setLoadError(err.message || 'Failed to load form details')
            } finally {
                setFormLoading(false)
            }
        }

        fetchFormDetails()
    }, [router.isReady, formId])

    // Validate Aadhar PDF
    const handleAadharChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name)
        if (!isPdf) {
            toast.error('Only PDF files are accepted for Aadhar Card.')
            e.target.value = ''
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Aadhar PDF exceeds the 5MB file size limit.')
            e.target.value = ''
            return
        }

        setAadharFile(file)
    }

    // Validate College ID Image
    const handleCollegeIdChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        const isImage =
            ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type?.toLowerCase()) ||
            /\.(png|jpe?g)$/i.test(file.name)

        if (!isImage) {
            toast.error('Only image files (PNG, JPG, JPEG) are accepted for College ID.')
            e.target.value = ''
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('College ID image exceeds the 5MB file size limit.')
            e.target.value = ''
            return
        }

        setCollegeIdFile(file)
    }

    // Direct S3 Upload helper
    const uploadDocumentToS3 = async (file, docType) => {
        const contentType = docType === 'aadhar_id' ? 'application/pdf' : file.type || 'image/jpeg'
        const safeName = (file.name || `${docType}.dat`).replace(/[^a-zA-Z0-9._-]/g, '_')

        const params = new URLSearchParams({
            doc_type: docType,
            contentType,
            fileName: safeName,
        })

        const urlRes = await fetch(`${API_BASE}/forms/${encodeURIComponent(formId)}/upload-url?${params.toString()}`)
        const urlData = await urlRes.json()

        if (!urlRes.ok || !urlData.uploadUrl) {
            throw new Error(urlData.message || `Failed to get upload URL for ${docType}`)
        }

        const s3Res = await fetch(urlData.uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': contentType },
            body: file,
        })

        if (!s3Res.ok) {
            throw new Error(`Failed to upload ${docType} to storage. Please try again.`)
        }

        return urlData.fileKey
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!fullName.trim()) {
            toast.error('Please enter your full name.')
            return
        }
        if (!email.trim() || !email.includes('@')) {
            toast.error('Please enter a valid email address.')
            return
        }
        const cleanPhone = phone.replace(/\s+/g, '')
        if (!cleanPhone || cleanPhone.length < 10) {
            toast.error('Please enter a valid 10-digit contact number.')
            return
        }
        if (!dob) {
            toast.error('Please select your date of birth.')
            return
        }
        if (!collegeIdNumber.trim()) {
            toast.error('Please enter your College ID / Roll Number.')
            return
        }
        if (aadharNumber && aadharNumber.replace(/\D/g, '').length < 12) {
            toast.error('Aadhar number must be at least 12 digits.')
            return
        }

        setIsSubmitting(true)
        setUploadStep('')

        try {
            let aadharFileKey = null
            let collegeIdFileKey = null

            // Upload Aadhar PDF if attached
            if (aadharFile) {
                setUploadStep('Uploading Aadhar Card (PDF)...')
                aadharFileKey = await uploadDocumentToS3(aadharFile, 'aadhar_id')
            }

            // Upload College ID Image if attached
            if (collegeIdFile) {
                setUploadStep('Uploading College ID (Image)...')
                collegeIdFileKey = await uploadDocumentToS3(collegeIdFile, 'college_id')
            }

            setUploadStep('Submitting your application...')

            const payload = {
                name: fullName.trim(),
                email: email.trim(),
                phone: cleanPhone,
                dob: dob,
                college_id_number: collegeIdNumber.trim(),
                college_name: collegeName.trim() || undefined,
                aadhar: aadharNumber.trim() || undefined,
                aadhar_file_key: aadharFileKey,
                college_id_file_key: collegeIdFileKey,
            }

            const submitRes = await fetch(`${API_BASE}/forms/${encodeURIComponent(formId)}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const submitData = await submitRes.json()

            if (!submitRes.ok || !submitData.success) {
                throw new Error(submitData.message || 'Failed to submit application')
            }

            // Registration is successful only when backend confirms "We have received your application"
            if (submitData.message && submitData.message.includes('We have received your application')) {
                setSubmissionSuccess({
                    message: submitData.message,
                    data: submitData.data || {},
                    applicant: { name: fullName, email, phone, college: collegeName, collegeIdNumber: collegeIdNumber.trim(), dob },
                })
                toast.success('Registration successful! We have received your application.')
            } else {
                throw new Error(submitData.message || 'Unexpected response status.')
            }
        } catch (err) {
            toast.error(err.message || 'Application submission failed. Please try again.')
        } finally {
            setIsSubmitting(false)
            setUploadStep('')
        }
    }

    return (
        <div style={{ backgroundColor: '#120a17', minHeight: '100vh', color: '#f3ecf7', fontFamily: 'Arial, sans-serif' }}>
            <Head>
                <title>{formData?.title || 'Event Registration'} | Anwesha 2027</title>
                <meta name="description" content="Register for Anwesha 2027 events using custom registration link" />
            </Head>
            <ToastContainer theme="dark" position="top-right" />

            <div style={{ maxWidth: '780px', margin: '0 auto', padding: '100px 20px 60px' }}>
                {formLoading ? (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: '#c3b5cd' }}>
                        <div style={{ fontSize: '28px', marginBottom: '14px' }}>⏳</div>
                        <p>Loading registration form...</p>
                    </div>
                ) : loadError ? (
                    <div
                        style={{
                            backgroundColor: '#1c1023',
                            border: '1px solid rgba(220, 38, 38, 0.4)',
                            borderRadius: '16px',
                            padding: '36px',
                            textAlign: 'center',
                        }}
                    >
                        <div style={{ fontSize: '32px', color: '#ef4444', marginBottom: '12px' }}>⚠️</div>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fca5a5' }}>Form Unavailable</h2>
                        <p style={{ color: '#c3b5cd', marginTop: '8px', fontSize: '14px' }}>{loadError}</p>
                        <Link
                            href="/events"
                            style={{
                                display: 'inline-block',
                                marginTop: '20px',
                                color: '#e7c165',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '14px',
                            }}
                        >
                            ← Browse All Events
                        </Link>
                    </div>
                ) : submissionSuccess ? (
                    /* SUCCESS SCREEN */
                    <div
                        style={{
                            backgroundColor: '#1c1023',
                            border: '1px solid rgba(212, 175, 78, 0.3)',
                            borderRadius: '20px',
                            padding: '44px 32px',
                            textAlign: 'center',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        }}
                    >
                        <div
                            style={{
                                display: 'inline-block',
                                padding: '10px 24px',
                                borderRadius: '999px',
                                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                                border: '1px solid rgba(16, 185, 129, 0.4)',
                                color: '#6ee7b7',
                                fontSize: '13px',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                marginBottom: '20px',
                            }}
                        >
                            ✓ Registration Successful
                        </div>

                        <h1
                            style={{
                                fontSize: '28px',
                                fontWeight: 'bold',
                                color: '#f3ecf7',
                                margin: '0 0 10px',
                                fontFamily: "Georgia, 'Times New Roman', serif",
                            }}
                        >
                            We have received your application
                        </h1>

                        <p style={{ color: '#c3b5cd', fontSize: '15px', lineHeight: '1.7', maxWidth: '520px', margin: '0 auto 28px' }}>
                            Thank you, <b style={{ color: '#e9ddf0' }}>{submissionSuccess.applicant?.name}</b>. Your application for{' '}
                            <b style={{ color: '#e7c165' }}>{submissionSuccess.data?.event_name || formData?.title}</b> has been received and confirmed.
                        </p>

                        <div
                            style={{
                                backgroundColor: '#241530',
                                border: '1px solid rgba(212, 175, 78, 0.2)',
                                borderRadius: '14px',
                                padding: '22px 24px',
                                textAlign: 'left',
                                maxWidth: '500px',
                                margin: '0 auto 28px',
                            }}
                        >
                            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#e7c165', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px' }}>
                                Registration Details
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '13.5px' }}>
                                <span style={{ color: '#9c8aa8' }}>Event</span>
                                <span style={{ fontWeight: 'bold', color: '#f3ecf7' }}>{submissionSuccess.data?.event_name || formData?.title}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '13.5px' }}>
                                <span style={{ color: '#9c8aa8' }}>Anwesha ID</span>
                                <span style={{ fontWeight: 'bold', color: '#e7c165', fontFamily: 'monospace' }}>
                                    {submissionSuccess.data?.anwesha_id || 'Assigned via email'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '13.5px' }}>
                                <span style={{ color: '#9c8aa8' }}>Registration ID</span>
                                <span style={{ fontWeight: 'bold', color: '#e9ddf0', fontFamily: 'monospace' }}>
                                    {submissionSuccess.data?.registration_id}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '13.5px' }}>
                                <span style={{ color: '#9c8aa8' }}>College ID / Roll No</span>
                                <span style={{ fontWeight: 'bold', color: '#f3ecf7', fontFamily: 'monospace' }}>
                                    {submissionSuccess.applicant?.collegeIdNumber || '—'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '13.5px' }}>
                                <span style={{ color: '#9c8aa8' }}>Date of Birth</span>
                                <span style={{ fontWeight: 'bold', color: '#f3ecf7' }}>
                                    {submissionSuccess.applicant?.dob || '—'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: '13.5px' }}>
                                <span style={{ color: '#9c8aa8' }}>Payment Status</span>
                                <span style={{ fontWeight: 'bold', color: submissionSuccess.data?.is_prepaid ? '#6ee7b7' : '#f59e0b' }}>
                                    {submissionSuccess.data?.is_prepaid ? 'CONFIRMED (PREPAID)' : 'RECORDED'}
                                </span>
                            </div>
                        </div>

                        <p style={{ color: '#8d7c98', fontSize: '13px', marginBottom: '24px' }}>
                            📧 A confirmation email has been sent to <b style={{ color: '#c3b5cd' }}>{submissionSuccess.applicant?.email}</b>.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                            <Link
                                href="/events"
                                style={{
                                    padding: '10px 24px',
                                    borderRadius: '10px',
                                    backgroundColor: '#e7c165',
                                    color: '#120a17',
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                    textDecoration: 'none',
                                }}
                            >
                                Explore More Events
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* FORM APPLICATION INPUT */
                    <div
                        style={{
                            backgroundColor: '#1c1023',
                            border: '1px solid rgba(212, 175, 78, 0.25)',
                            borderRadius: '20px',
                            padding: '36px 28px',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        }}
                    >
                        {/* Event / Form Title */}
                        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                            <div
                                style={{
                                    display: 'inline-block',
                                    padding: '6px 16px',
                                    borderRadius: '999px',
                                    backgroundColor: 'rgba(212, 175, 78, 0.1)',
                                    border: '1px solid rgba(212, 175, 78, 0.3)',
                                    color: '#e7c165',
                                    fontSize: '11.5px',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1.5px',
                                    marginBottom: '12px',
                                }}
                            >
                                Anwesha 2027 Registration
                            </div>

                            <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 8px', fontFamily: "Georgia, 'Times New Roman', serif" }}>
                                {formData?.title || formData?.event?.name}
                            </h1>

                            {formData?.event?.name && formData?.title !== formData?.event?.name && (
                                <p style={{ color: '#e7c165', fontSize: '14px', margin: '0 0 6px' }}>Event: {formData.event.name}</p>
                            )}

                            {formData?.description && (
                                <p style={{ color: '#c3b5cd', fontSize: '13.5px', maxWidth: '580px', margin: '6px auto 0' }}>
                                    {formData.description}
                                </p>
                            )}

                            {/* Badges */}
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
                                {formData?.target_college && (
                                    <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '6px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#93c5fd' }}>
                                        🏫 {formData.target_college}
                                    </span>
                                )}
                                <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7' }}>
                                    {formData?.is_prepaid ? '✓ Prepaid Registration' : `Registration Fee: ₹${formData?.total_amount || 0}`}
                                </span>
                            </div>
                        </div>

                        {/* Non-accepting alert banner */}
                        {!formData?.is_accepting && (
                            <div
                                style={{
                                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    borderRadius: '12px',
                                    padding: '16px 20px',
                                    marginBottom: '24px',
                                    textAlign: 'center',
                                    color: '#fca5a5',
                                    fontSize: '13.5px',
                                }}
                            >
                                {formData?.is_full
                                    ? '⚠️ This form has reached its maximum application limit.'
                                    : formData?.is_expired
                                    ? '⚠️ This registration form has expired.'
                                    : '⚠️ This registration form is currently not accepting new applications.'}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '18px' }}>
                                {/* Full Name */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#c3b5cd', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                                        Full Name <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        disabled={!formData?.is_accepting || isSubmitting}
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Enter your full name"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            borderRadius: '10px',
                                            backgroundColor: '#241530',
                                            border: '1px solid rgba(212, 175, 78, 0.25)',
                                            color: '#f3ecf7',
                                            fontSize: '14px',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>

                                {/* Email & Phone */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#c3b5cd', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                                            Email Address <span style={{ color: '#ef4444' }}>*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            disabled={!formData?.is_accepting || isSubmitting}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: '10px',
                                                backgroundColor: '#241530',
                                                border: '1px solid rgba(212, 175, 78, 0.25)',
                                                color: '#f3ecf7',
                                                fontSize: '14px',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#c3b5cd', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                                            Contact Number <span style={{ color: '#ef4444' }}>*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            disabled={!formData?.is_accepting || isSubmitting}
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="10-digit phone number"
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: '10px',
                                                backgroundColor: '#241530',
                                                border: '1px solid rgba(212, 175, 78, 0.25)',
                                                color: '#f3ecf7',
                                                fontSize: '14px',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Date of Birth & College ID Number */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#c3b5cd', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                                            Date of Birth <span style={{ color: '#ef4444' }}>*</span>
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            disabled={!formData?.is_accepting || isSubmitting}
                                            value={dob}
                                            onChange={(e) => setDob(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: '10px',
                                                backgroundColor: '#241530',
                                                border: '1px solid rgba(212, 175, 78, 0.25)',
                                                color: '#f3ecf7',
                                                fontSize: '14px',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#c3b5cd', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                                            College ID / Roll Number <span style={{ color: '#ef4444' }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            disabled={!formData?.is_accepting || isSubmitting}
                                            value={collegeIdNumber}
                                            onChange={(e) => setCollegeIdNumber(e.target.value)}
                                            placeholder="e.g. 2101CS01 / College Roll No"
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: '10px',
                                                backgroundColor: '#241530',
                                                border: '1px solid rgba(212, 175, 78, 0.25)',
                                                color: '#f3ecf7',
                                                fontSize: '14px',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* College Name & Aadhar Number */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#c3b5cd', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                                            College / Institute Name
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!formData?.is_accepting || isSubmitting}
                                            value={collegeName}
                                            onChange={(e) => setCollegeName(e.target.value)}
                                            placeholder="e.g. Indian Institute of Technology Patna"
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: '10px',
                                                backgroundColor: '#241530',
                                                border: '1px solid rgba(212, 175, 78, 0.25)',
                                                color: '#f3ecf7',
                                                fontSize: '14px',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#c3b5cd', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                                            Aadhar Number
                                        </label>
                                        <input
                                            type="text"
                                            maxLength={12}
                                            disabled={!formData?.is_accepting || isSubmitting}
                                            value={aadharNumber}
                                            onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, ''))}
                                            placeholder="12-digit Aadhar number"
                                            style={{
                                                width: '100%',
                                                padding: '12px 16px',
                                                borderRadius: '10px',
                                                backgroundColor: '#241530',
                                                border: '1px solid rgba(212, 175, 78, 0.25)',
                                                color: '#f3ecf7',
                                                fontSize: '14px',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* DOCUMENT UPLOADS */}
                                <div style={{ borderTop: '1px solid rgba(212, 175, 78, 0.15)', paddingTop: '18px', marginTop: '6px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#e7c165', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>
                                        Verification Documents (S3 Upload)
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                                        {/* Aadhar Card PDF Upload */}
                                        <div
                                            style={{
                                                backgroundColor: '#241530',
                                                border: '1px dashed rgba(212, 175, 78, 0.3)',
                                                borderRadius: '12px',
                                                padding: '18px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#f3ecf7', marginBottom: '4px' }}>
                                                📄 Aadhar Card (PDF Only)
                                            </div>
                                            <p style={{ fontSize: '11px', color: '#9c8aa8', marginBottom: '12px' }}>
                                                Upload your Aadhar card document in .pdf format (max 5MB)
                                            </p>

                                            {aadharFile ? (
                                                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '8px 12px', borderRadius: '8px', color: '#6ee7b7', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                                                        ✓ {aadharFile.name}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setAadharFile(null)}
                                                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <label
                                                    style={{
                                                        display: 'inline-block',
                                                        padding: '8px 18px',
                                                        backgroundColor: 'rgba(212, 175, 78, 0.15)',
                                                        border: '1px solid rgba(212, 175, 78, 0.3)',
                                                        borderRadius: '8px',
                                                        color: '#e7c165',
                                                        fontSize: '12px',
                                                        fontWeight: 'bold',
                                                        cursor: formData?.is_accepting ? 'pointer' : 'not-allowed',
                                                    }}
                                                >
                                                    Select Aadhar PDF
                                                    <input
                                                        type="file"
                                                        accept="application/pdf"
                                                        disabled={!formData?.is_accepting || isSubmitting}
                                                        onChange={handleAadharChange}
                                                        style={{ display: 'none' }}
                                                    />
                                                </label>
                                            )}
                                        </div>

                                        {/* College ID Image Upload */}
                                        <div
                                            style={{
                                                backgroundColor: '#241530',
                                                border: '1px dashed rgba(212, 175, 78, 0.3)',
                                                borderRadius: '12px',
                                                padding: '18px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#f3ecf7', marginBottom: '4px' }}>
                                                🖼️ College ID (PNG / JPG / JPEG)
                                            </div>
                                            <p style={{ fontSize: '11px', color: '#9c8aa8', marginBottom: '12px' }}>
                                                Upload your College Student ID card image (max 5MB)
                                            </p>

                                            {collegeIdFile ? (
                                                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '8px 12px', borderRadius: '8px', color: '#6ee7b7', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                                                        ✓ {collegeIdFile.name}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setCollegeIdFile(null)}
                                                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <label
                                                    style={{
                                                        display: 'inline-block',
                                                        padding: '8px 18px',
                                                        backgroundColor: 'rgba(212, 175, 78, 0.15)',
                                                        border: '1px solid rgba(212, 175, 78, 0.3)',
                                                        borderRadius: '8px',
                                                        color: '#e7c165',
                                                        fontSize: '12px',
                                                        fontWeight: 'bold',
                                                        cursor: formData?.is_accepting ? 'pointer' : 'not-allowed',
                                                    }}
                                                >
                                                    Select College ID Image
                                                    <input
                                                        type="file"
                                                        accept="image/png,image/jpeg,image/jpg"
                                                        disabled={!formData?.is_accepting || isSubmitting}
                                                        onChange={handleCollegeIdChange}
                                                        style={{ display: 'none' }}
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Upload step indicator */}
                                {uploadStep && (
                                    <div style={{ textAlign: 'center', fontSize: '13px', color: '#e7c165', fontWeight: 'bold', padding: '6px 0' }}>
                                        ⏳ {uploadStep}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                                    <button
                                        type="submit"
                                        disabled={!formData?.is_accepting || isSubmitting}
                                        style={{
                                            padding: '14px 44px',
                                            borderRadius: '12px',
                                            backgroundColor: formData?.is_accepting && !isSubmitting ? '#e7c165' : 'rgba(212, 175, 78, 0.3)',
                                            color: '#120a17',
                                            fontSize: '15px',
                                            fontWeight: 'bold',
                                            border: 'none',
                                            cursor: formData?.is_accepting && !isSubmitting ? 'pointer' : 'not-allowed',
                                            boxShadow: '0 8px 24px rgba(212, 175, 78, 0.25)',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

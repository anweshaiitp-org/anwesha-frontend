// src/pages/register/Step4Preview.jsx
import React, { useState } from 'react'
import { useAuthUser } from '../../../lib/multicity/context/AuthUserContext'
import toast from 'react-hot-toast'
import { ClipboardList } from 'lucide-react'
import { ButtonLoader } from '../../../components/Loader'

export default function Step4Preview({ formData = {}, next }) {
    const { currentUser, finalizeRegistration, updateUser } = useAuthUser()
    const [submitting, setSubmitting] = useState(false)

    const handleFinalSubmit = async () => {
        if (submitting) return
        try {
            if (!currentUser?.uid) {
                toast.error('User not found. Please login again.')
                return
            }

            setSubmitting(true)
            const anweshaId = await finalizeRegistration(
                currentUser.uid,
                formData
            )
            await updateUser(currentUser.uid, { status: 'successful' })

            toast.success('Registration completed successfully!')
            next(anweshaId)
        } catch (err) {
            toast.error(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '3.5rem',
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem',
            }}
        >
            <div
                style={{
                    borderRadius: '1.5rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '2.5rem',
                    width: '100%',
                    maxWidth: '32rem',
                    textAlign: 'center',
                    animation: 'fadeIn 0.5s ease-in-out',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(16px)',
                }}
            >
                {/* Heading */}
                <h3
                    style={{
                        fontSize: '2.25rem',
                        fontWeight: '800',
                        marginBottom: '1.5rem',
                        background:
                            'linear-gradient(to left, #095DB7, #41D7B7)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    Confirm Your Details
                </h3>

                {/* Icon */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '5rem',
                        height: '5rem',
                        margin: '0 auto 1.5rem auto',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid #3b82f6',
                    }}
                >
                    <ClipboardList
                        style={{
                            width: '3rem',
                            height: '3rem',
                            color: '#60a5fa',
                        }}
                    />
                </div>

                {/* Preview Details */}
                <div
                    style={{
                        textAlign: 'left',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                    }}
                >
                    {/* Personal */}
                    <div>
                        <h4
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: '600',
                                color: '#1f2937',
                                borderBottom: '1px solid #e5e7eb',
                                paddingBottom: '0.25rem',
                            }}
                        >
                            Personal Details
                        </h4>
                        <p
                            style={{
                                color: '#1f2937',
                                marginTop: '0.5rem',
                                fontSize: '1.125rem',
                            }}
                        >
                            <b>Name:</b> {currentUser?.personal?.firstName}{' '}
                            {currentUser?.personal?.lastName}
                        </p>
                        <p style={{ color: '#1f2937', fontSize: '1.125rem' }}>
                            <b>Gender:</b> {currentUser?.personal?.gender}
                        </p>
                    </div>

                    {/* College */}
                    <div>
                        <h4
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: '600',
                                color: '#1f2937',
                                borderBottom: '1px solid #e5e7eb',
                                paddingBottom: '0.25rem',
                                marginBottom: '0.5rem',
                            }}
                        >
                            College Details
                        </h4>
                        <p style={{ color: '#1f2937', fontSize: '1.125rem' }}>
                            <b>College:</b> {currentUser?.college?.name}
                        </p>
                        <p style={{ color: '#1f2937', fontSize: '1.125rem' }}>
                            <b>City:</b> {currentUser?.college?.city}
                        </p>
                        <p style={{ color: '#1f2937', fontSize: '1.125rem' }}>
                            <b>Passing Year:</b>{' '}
                            {currentUser?.college?.passingYear}
                        </p>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: '600',
                                color: '#1f2937',
                                borderBottom: '1px solid #e5e7eb',
                                paddingBottom: '0.25rem',
                                marginBottom: '0.5rem',
                            }}
                        >
                            Contact Details
                        </h4>
                        <p style={{ color: '#1f2937', fontSize: '1.125rem' }}>
                            <b>Phone:</b> {currentUser?.contact?.phone}
                        </p>
                        <p style={{ color: '#1f2937', fontSize: '1.125rem' }}>
                            <b>Address:</b> {currentUser?.contact?.address}
                        </p>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleFinalSubmit}
                    disabled={submitting}
                    style={{
                        marginTop: '2rem',
                        paddingLeft: '1.5rem',
                        paddingRight: '1.5rem',
                        paddingTop: '0.75rem',
                        paddingBottom: '0.75rem',
                        borderRadius: '0.75rem',
                        width: '100%',
                        background:
                            'linear-gradient(to right, #41D7B7, #095DB7)',
                        color: 'white',
                        fontWeight: 'bold',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                        transform: 'scale(1)',
                        border: 'none',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        opacity: submitting ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                            'linear-gradient(to right, #095DB7, #41D7B7)'
                        e.currentTarget.style.transform = 'scale(1.05)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                            'linear-gradient(to right, #41D7B7, #095DB7)'
                        e.currentTarget.style.transform = 'scale(1)'
                    }}
                >
                    <ButtonLoader loading={submitting} label="Registering">
                        ✅ Submit & Register
                    </ButtonLoader>
                </button>
            </div>
        </div>
    )
}

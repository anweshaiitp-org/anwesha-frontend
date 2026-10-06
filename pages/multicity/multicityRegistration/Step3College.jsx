// src/pages/register/Step3CollegeDetails.jsx
import React, { useState } from 'react'
import { useAuthUser } from '../../../lib/multicity/context/AuthUserContext'
import toast from 'react-hot-toast'
import { GraduationCap, Calendar, MapPin } from 'lucide-react'

export default function Step3CollegeDetails({
    formData = {},
    setFormData,
    next,
}) {
    const { currentUser, updateUser } = useAuthUser()

    const [collegeName, setCollegeName] = useState(
        currentUser?.college?.name || ''
    )

    const [passingYear, setPassingYear] = useState(
        currentUser?.college?.passingYear || ''
    )

    const [city, setCity] = useState(
        currentUser?.college?.city || ''
    )

    const [isDisabled, setDisabled] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setDisabled(true)

        if (!currentUser?.uid) {
            toast.error('User not found. Please login again.')
            setDisabled(false)
            return
        }

        try {
            const collegeDetails = {
                name: collegeName,
                passingYear,
                city,
            }

            // Keep college information in the registration form data.
            // This will be sent to the new backend during final submission.
            setFormData({
                ...(formData || {}),
                college: collegeDetails,
            })

            // Update local registration state.
            // No Firebase/Firestore call is required anymore.
            await updateUser(currentUser.uid, {
                college: collegeDetails,
                status: '3',
            })

            toast.success('College details saved!')
            next()
        } catch (error) {
            toast.error(error.message || 'Failed to save college details.')
        } finally {
            setDisabled(false)
        }
    }

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '3.5rem',
                paddingLeft: '0.5rem',
                paddingRight: '0.5rem',
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
                    backdropFilter: 'blur(16px)',
                    textAlign: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    animation: 'fadeIn 0.5s ease-in-out',
                }}
            >
                {/* Heading */}
                <h3
                    style={{
                        fontSize: '1.875rem',
                        fontWeight: '800',
                        marginBottom: '1.5rem',
                        background:
                            'linear-gradient(to left, #095DB7, #41D7B7)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    Step 3: College Details
                </h3>

                <p
                    style={{
                        color: '#1f2937',
                        marginBottom: '2rem',
                    }}
                >
                    Please provide your college information to continue
                </p>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        textAlign: 'left',
                    }}
                >
                    {/* College Name */}
                    <div style={{ position: 'relative' }}>
                        <GraduationCap
                            style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#6b7280',
                            }}
                            size={20}
                        />

                        <input
                            type="text"
                            placeholder="Enter your college name"
                            value={collegeName}
                            onChange={(e) =>
                                setCollegeName(e.target.value)
                            }
                            style={{
                                width: '100%',
                                paddingLeft: '3rem',
                                paddingRight: '1rem',
                                paddingTop: '0.75rem',
                                paddingBottom: '0.75rem',
                                borderRadius: '0.75rem',
                                color: 'black',
                                backgroundColor:
                                    'rgba(255, 255, 255, 0.6)',
                                outline: 'none',
                                border: '2px solid transparent',
                                transition: 'all 0.3s ease',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#60a5fa'
                                e.target.style.boxShadow =
                                    '0 0 0 3px rgba(96, 165, 250, 0.2)'
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'transparent'
                                e.target.style.boxShadow = 'none'
                            }}
                            required
                        />
                    </div>

                    {/* Passing Year */}
                    <div style={{ position: 'relative' }}>
                        <Calendar
                            style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#6b7280',
                            }}
                            size={20}
                        />

                        <input
                            type="number"
                            placeholder="Passing Year e.g. 2028"
                            value={passingYear}
                            onChange={(e) =>
                                setPassingYear(e.target.value)
                            }
                            style={{
                                width: '100%',
                                paddingLeft: '3rem',
                                paddingRight: '1rem',
                                paddingTop: '0.75rem',
                                paddingBottom: '0.75rem',
                                borderRadius: '0.75rem',
                                color: 'black',
                                backgroundColor:
                                    'rgba(255, 255, 255, 0.6)',
                                outline: 'none',
                                border: '2px solid transparent',
                                transition: 'all 0.3s ease',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#34d399'
                                e.target.style.boxShadow =
                                    '0 0 0 3px rgba(52, 211, 153, 0.2)'
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'transparent'
                                e.target.style.boxShadow = 'none'
                            }}
                            required
                        />
                    </div>

                    {/* City */}
                    <div style={{ position: 'relative' }}>
                        <MapPin
                            style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#6b7280',
                            }}
                            size={20}
                        />

                        <input
                            type="text"
                            placeholder="Enter city of your college"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            style={{
                                width: '100%',
                                paddingLeft: '3rem',
                                paddingRight: '1rem',
                                paddingTop: '0.75rem',
                                paddingBottom: '0.75rem',
                                borderRadius: '0.75rem',
                                color: 'black',
                                backgroundColor:
                                    'rgba(255, 255, 255, 0.6)',
                                outline: 'none',
                                border: '2px solid transparent',
                                transition: 'all 0.3s ease',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#a855f7'
                                e.target.style.boxShadow =
                                    '0 0 0 3px rgba(168, 85, 247, 0.2)'
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'transparent'
                                e.target.style.boxShadow = 'none'
                            }}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        style={{
                            background:
                                'linear-gradient(to right, #41D7B7, #095DB7)',
                            color: 'white',
                            fontWeight: 'bold',
                            paddingTop: '0.75rem',
                            paddingBottom: '0.75rem',
                            borderRadius: '0.75rem',
                            width: '100%',
                            boxShadow:
                                '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s ease',
                            transform: 'scale(1)',
                            border: 'none',
                            cursor: isDisabled
                                ? 'not-allowed'
                                : 'pointer',
                            opacity: isDisabled ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) => {
                            if (!isDisabled) {
                                e.target.style.background =
                                    'linear-gradient(to right, #095DB7, #41D7B7)'
                                e.target.style.transform = 'scale(1.05)'
                                e.target.style.boxShadow =
                                    '0 10px 15px -3px rgba(96, 165, 250, 0.5)'
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isDisabled) {
                                e.target.style.background =
                                    'linear-gradient(to right, #41D7B7, #095DB7)'
                                e.target.style.transform = 'scale(1)'
                                e.target.style.boxShadow =
                                    '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }
                        }}
                        disabled={isDisabled}
                    >
                        {isDisabled
                            ? 'Processing...'
                            : 'Save & Next →'}
                    </button>
                </form>
            </div>
        </div>
    )
}
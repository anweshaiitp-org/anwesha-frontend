import React, { createContext, useContext, useState } from 'react'
import toast from 'react-hot-toast'

const AuthUserContext = createContext()

const host = process.env.NEXT_PUBLIC_HOST

export function AuthUserProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(false)

    // Step 1:
    // Keep the email/password locally until the user completes
    // the remaining registration steps.
    const registerUser = async (email, password) => {
        const user = {
            uid: `pending_${Date.now()}`,
            email,
            password,
            emailVerified: false,
            personal: {},
            college: {},
            contact: {},
            status: '1',
        }

        setCurrentUser(user)

        if (typeof window !== 'undefined') {
            localStorage.setItem('uid', user.uid)
        }

        return user
    }

    // Update local registration state.
    // Firebase/Firestore is no longer used here.
    const updateUser = async (uid, updatedData) => {
        setCurrentUser((prev) => ({
            ...(prev || {}),
            ...updatedData,
        }))

        return {
            ...(currentUser || {}),
            ...updatedData,
        }
    }

    // Final registration:
    // Send the complete registration data to the new backend.
    const finalizeRegistration = async (uid, formData) => {
        if (!currentUser?.email || !currentUser?.password) {
            throw new Error(
                'Registration session expired. Please start again.'
            )
        }

        const fullName = [
            formData?.firstName,
            formData?.lastName,
        ]
            .filter(Boolean)
            .join(' ')

        const payload = {
            email_id: currentUser.email,
            password: currentUser.password,
            full_name: fullName,
            phone_number: formData?.phone,
            college_name: formData?.college?.name,
            user_type: 'STUDENT',
            gender: formData?.gender,
            dob: formData?.dob,
        }

        const response = await fetch(`${host}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

        let result

        try {
            result = await response.json()
        } catch {
            throw new Error('Invalid response received from server.')
        }

        if (!response.ok || !result.success) {
            throw new Error(
                result.message ||
                    result.error ||
                    'Registration failed. Please try again.'
            )
        }

        const backendUser = {
            ...currentUser,
            ...formData,
            uid: result.data?.user_id || currentUser.uid,
            anweshaId: result.data?.anwesha_id || null,
            status: 'successful',
            email: result.data?.email_id || currentUser.email,
        }

        setCurrentUser(backendUser)

        if (typeof window !== 'undefined') {
            if (result.data?.user_id) {
                localStorage.setItem('uid', result.data.user_id)
            }
        }

        toast.success(
            result.message || 'Registration completed successfully!'
        )

        return result.data?.anwesha_id || null
    }

    // New backend login.
    const loginUser = async (email, password) => {
        const response = await fetch(`${host}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email_id: email,
                password,
            }),
        })

        let result

        try {
            result = await response.json()
        } catch {
            throw new Error('Invalid response received from server.')
        }

        if (!response.ok || !result.success) {
            throw new Error(
                result.message ||
                    result.error ||
                    'Login failed. Please try again.'
            )
        }

        if (typeof window !== 'undefined') {
            localStorage.setItem(
                'anwesha_token',
                result.token
            )

            if (result.user?.user_id) {
                localStorage.setItem(
                    'uid',
                    result.user.user_id
                )
            }
        }

        setCurrentUser(result.user)

        return result.user
    }

    // Kept for compatibility with existing components.
    const handleSearchByAnweshaId = async () => {
        return null
    }

    return (
        <AuthUserContext.Provider
            value={{
                currentUser,
                registerUser,
                updateUser,
                finalizeRegistration,
                loginUser,
                handleSearchByAnweshaId,
                loading,
            }}
        >
            {children}
        </AuthUserContext.Provider>
    )
}

export const useAuthUser = () => useContext(AuthUserContext)
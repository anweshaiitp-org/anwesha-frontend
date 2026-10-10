import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'

const AuthContext = React.createContext()
const { Provider } = AuthContext

const decodeJwt = (token) => {
    if (!token || typeof token !== 'string') return null
    try {
        const parts = token.split('.')
        if (parts.length !== 3) return null
        const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
        return JSON.parse(payload)
    } catch {
        return null
    }
}

const isTokenExpired = (token) => {
    const decoded = decodeJwt(token)
    if (!decoded || !decoded.exp) return false
    return decoded.exp * 1000 <= Date.now() + 5000
}

const getTokenRemainingMs = (token) => {
    const decoded = decodeJwt(token)
    if (!decoded || !decoded.exp) return 0
    return Math.max(0, decoded.exp * 1000 - Date.now())
}

const PrivateRoute = ({ children }) => {
    const router = useRouter()
    const auth = React.useContext(AuthContext)

    useEffect(() => {
        const protectedPrefixes = [
            '/event-registration',
            '/event-registrations',
            '/profile',
            '/submit-id',
            '/ticket',
        ]
        const isProtectedRoute = protectedPrefixes.some((route) =>
            router.pathname.startsWith(route)
        )

        if (!auth.isAuth && isProtectedRoute) {
            const callback = encodeURIComponent(router.asPath || router.pathname)
            router.push(`/userLogin?callbackUrl=${callback}`)
        }

        // Redirect logged-in users away from the login/register page
        if (
            auth.isAuth &&
            (router.pathname === '/userLogin' ||
                router.pathname === '/userRegister')
        ) {
            const target =
                router.query.callbackUrl ||
                router.query.redirect ||
                router.query.returnUrl ||
                '/profile'
            router.push(target)
        }
    }, [auth.isAuth, router.pathname, router.asPath, router.query])

    return children
}

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const router = useRouter()
    const expiryTimerRef = useRef(null)

    const logout = (message) => {
        if (expiryTimerRef.current) {
            clearTimeout(expiryTimerRef.current)
            expiryTimerRef.current = null
        }
        persistToken(null)
        setUser(null)

        if (message) {
            toast.error(message, {
                position: 'top-right',
                autoClose: 3500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            })
        }
    }

    const persistToken = (value) => {
        if (value && isTokenExpired(value)) {
            console.warn('[Auth] Attempted to persist expired token')
            value = null
        }

        setToken(value)
        if (typeof window !== 'undefined') {
            if (value) {
                localStorage.setItem('anwesha_token', value)
            } else {
                localStorage.removeItem('anwesha_token')
            }
        }
    }

    const getAuthHeaders = () => {
        if (!token) return {}
        return { Authorization: `Bearer ${token}` }
    }

    // Function to fetch user data and update the state
    const getUser = async () => {
        const currentToken =
            token ||
            (typeof window !== 'undefined'
                ? localStorage.getItem('anwesha_token')
                : null)
        if (!currentToken) {
            console.warn('[Auth] No token available for getUser')
            setUser(null)
            return
        }

        if (isTokenExpired(currentToken)) {
            logout('Session expired. Please login again.')
            return
        }

        try {
            const headers = {
                Authorization: `Bearer ${currentToken}`,
            }

            const response = await fetch(`${host}/users/profile`, {
                method: 'GET',
                headers,
                redirect: 'follow',
            })

            if (response.status === 401 || response.status === 403) {
                logout('Session expired. Please login again.')
                return
            }

            if (!response.ok) {
                console.error(`[Auth] /users/profile returned ${response.status}`)
                setUser(null)
                return
            }

            const result = await response.json()
            console.log('[Auth] User data loaded:', result)
            setUser(result.data || result) // Successfully authenticated, set the user data
        } catch (error) {
            console.error('[Auth] Error fetching user data:', error)
        }
    }

    // Load token on mount & check expiry
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('anwesha_token')
            if (stored) {
                if (isTokenExpired(stored)) {
                    localStorage.removeItem('anwesha_token')
                    setToken(null)
                } else {
                    setToken(stored)
                }
            }
        }
    }, [])

    // Fetch user data & manage auto-logout timer when token changes
    useEffect(() => {
        if (expiryTimerRef.current) {
            clearTimeout(expiryTimerRef.current)
            expiryTimerRef.current = null
        }

        if (token) {
            if (isTokenExpired(token)) {
                logout('Session expired. Please login again.')
                return
            }

            const remainingMs = getTokenRemainingMs(token)
            if (remainingMs > 0) {
                expiryTimerRef.current = setTimeout(() => {
                    logout('Session expired. Please login again.')
                }, remainingMs)
            }

            getUser()
        } else {
            setUser(null)
        }

        return () => {
            if (expiryTimerRef.current) {
                clearTimeout(expiryTimerRef.current)
                expiryTimerRef.current = null
            }
        }
    }, [token])

    return (
        <>
            <Provider
                value={{
                    state: { user },
                    setUser,
                    token,
                    isAuth: Boolean(token),
                    getUser,
                    persistToken,
                    logout,
                    getAuthHeaders,
                    decodeJwt: () => decodeJwt(token),
                }}
            >
                {children}
            </Provider>
        </>
    )
}

export { AuthContext, AuthProvider, PrivateRoute }

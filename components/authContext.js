import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'

const AuthContext = React.createContext()
const { Provider } = AuthContext

const PrivateRoute = ({ children }) => {
    const router = useRouter()
    const auth = React.useContext(AuthContext)

    useEffect(() => {
        if (
            !auth.isAuth &&
            [
                '/event-registration',
                '/event-registrations',
                '/profile',
            ].includes(router.pathname)
        ) {
            router.push('/userLogin')
        }

        // Redirect logged-in users away from the login page
        if (
            auth.isAuth &&
            (router.pathname === '/userLogin' ||
                router.pathname === '/userRegister')
        ) {
            router.push('/profile')
        }
    }, [auth.isAuth, router.pathname]) // Dependency array ensures this effect runs on changes to auth status or path

    return children
}

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const router = useRouter()

    const persistToken = (value) => {
        setToken(value)
        if (value) {
            localStorage.setItem('anwesha_token', value)
        } else {
            localStorage.removeItem('anwesha_token')
        }
    }

    const getAuthHeaders = () => {
        if (!token) return {}
        return { Authorization: `Bearer ${token}` }
    }

    const logout = () => {
        persistToken(null)
        setUser(null)
    }

    // Function to fetch user data and update the state
    const getUser = async () => {
        const currentToken = token || localStorage.getItem('anwesha_token')
        if (!currentToken) {
            console.warn('[Auth] No token available for getUser')
            setUser(null)
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
                logout()
                if (
                    [
                        '/profile',
                        '/event-registration',
                        '/event-registrations',
                    ].includes(router.pathname)
                ) {
                    toast.error('Session expired. Please login again.', {
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

    // Load token on mount
    useEffect(() => {
        const stored = localStorage.getItem('anwesha_token')
        if (stored) {
            setToken(stored)
        }
    }, [])

    // Fetch user data when token changes
    useEffect(() => {
        if (token) {
            getUser()
        } else {
            setUser(null)
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
                }}
            >
                {children}
            </Provider>
        </>
    )
}

export { AuthContext, AuthProvider, PrivateRoute }

import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function VerifyEmailTokenRedirect() {
    const router = useRouter()
    const { token } = router.query

    useEffect(() => {
        if (token) {
            router.replace(`/verify_email?token=${token}`)
        }
    }, [token, router])

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            color: '#fff'
        }}>
            Redirecting to email verification...
        </div>
    )
}


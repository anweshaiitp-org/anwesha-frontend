import { useRouter } from 'next/router.js'
import { useContext, useEffect } from 'react'
import { proniteRegistration, proniteRegistrationiitp } from '../components/Event Registration/proniteRegistration'
import { AuthContext } from '../components/authContext'

const GetPass = () => {
    const userData = useContext(AuthContext)
    const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'
    const router = useRouter()
    // useEffect(() => {
    //     const handleRegistration = () => {
    //         router.push('/registration')
    //     }
    //     handleRegistration()
    // }, [])
    const call = () => {
        proniteRegistration('FESTPASS',
            11,
            userData.state.user.email_id,
            userData.state.user.phone_number,
            userData.state.user.anwesha_id,
            userData.state.user.user_type,
            router)
    }

    async function event() {
        var myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')
        const token = localStorage.getItem('anwesha_token')
        if (token) {
            myHeaders.append('Authorization', `Bearer ${token}`)
        }

        var raw = JSON.stringify({
            anwesha_id: userData.state.user.anwesha_id,
        })
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
        }

        const data = await fetch(`${host}/festpasses/get`, requestOptions)
            .then((response) => response.json())
            .catch((error) => {
                console.error(error)
            })
        console.log(data)
    }


    return (
        <div style={{ height: '300px', width: '200px', color: 'white', marginTop: '200px' }}>
            <button onClick={call}>submit here</button>
            <button onClick={event}>fetch pass</button>
        </div>
    )
}

export default GetPass


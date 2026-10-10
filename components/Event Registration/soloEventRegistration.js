import React from 'react'
import { useRouter } from 'next/router'
const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}
function openPay(data) {
    const options = {
        atomTokenId: data.atomTokenId,
        merchId: data.merchId,
        custEmail: data.custEmail,
        custMobile: data.custMobile,
        returnUrl: data.returnUrl,
    }
    let atom = new AtomPaynetz(options, 'uat')
}
async function soloEventRegistration(
    eventID,
    amount,
    email,
    phone,
    anwesha_id,
    router,
    closeHandler
) {
    var myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('anwesha_token')
            : null
    if (token) {
        myHeaders.append('Authorization', `Bearer ${token}`)
    }

    var raw = JSON.stringify({
        event_id: eventID,
        amount: amount,
        email: email,
        phone: phone,
        anwesha_id: anwesha_id,
        type: 'solo',
    })
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
    }

    const data = await fetch(`${host}/atompay/`, requestOptions)
        .then((response) => response.json())
        .catch((error) => {
            console.error(error)
        })

    const res = await loadScript(
        'https://psa.atomtech.in/staticdata/ots/js/atomcheckout.js?v=' +
        data.atomTokenId
    )
    console.log(data);
    if (data.messagge) {
        toast.error('Already Registered', {
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
    else {
        openPay(data);
    }
    toast.success("If Registered, it will show in profile", {
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

/**
 * Get a user-friendly error message based on HTTP status code.
 */
function getErrorMessage(status, responseData) {
    switch (status) {
        case 400:
            return responseData?.message || 'Invalid request. Please check your input.'
        case 401:
            return 'Session expired. Please login again.'
        case 403:
            return 'You are not authorized to register for this event.'
        case 404:
            return 'Event not found. It may have been removed.'
        case 409:
            return responseData?.message || 'You are already registered for this event.'
        case 422:
            return responseData?.message || 'Validation error. Please check your input.'
        case 500:
            return 'Server error. Please try again later.'
        default:
            return responseData?.message || 'Something went wrong. Please try again.'
    }
}

/**
 * Solo event registration using the new unified /registration/register endpoint.
 * Sends { event_id } and handles the structured response with
 * registration_id, payment_status, and amount_due.
 */
async function soloEventRegistrationNew(eventID, router, closeHandler) {
    var myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('anwesha_token')
            : null
    if (!token) {
        toast.error('Please login to register for events.', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        })
        router.push(`/userLogin?callbackUrl=${encodeURIComponent(router.asPath)}`)
        return null
    }
    myHeaders.append('Authorization', `Bearer ${token}`)

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    var raw = JSON.stringify({
        event_id: eventID,
    })

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
    }

    try {
        const response = await fetch(`${host}/registration/register`, requestOptions)
        const data = await response.json()
        console.log('[SoloRegistration] Response:', response.status, data)

        if (response.status === 409) {
            toast.error('You are already registered for this event.', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            })
            return null
        }

        if (response.status === 201 || response.status === 200) {
            const regData = data.data || data
            const regId = regData?.registration_id || ''
            const paymentRequired = regData?.payment_required !== undefined
                ? Boolean(regData.payment_required)
                : (regData?.payment_status === 'PENDING' || regData?.payment_status === 'pending')
            const paymentStatus = regData?.payment_status || (paymentRequired ? 'PENDING' : 'PAID')
            const amountDue = regData?.amount_due !== undefined ? Number(regData.amount_due) : (paymentRequired ? 1 : 0)

            const isPending = paymentRequired && (paymentStatus === 'PENDING' || paymentStatus === 'pending');
            if (!isPending || amountDue === 0) {
                let successMsg = data.message || 'Registered successfully'
                if (regId) successMsg += `\nRegistration ID: ${regId}`
                if (paymentStatus) successMsg += `\nPayment Status: ${paymentStatus}`
                if (amountDue > 0) successMsg += `\nAmount Due: ₹${amountDue}`

                toast.success(successMsg, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                    style: { whiteSpace: 'pre-line' },
                })
            }

            if (isPending) {
                toast.info('Initiating secure payment gateway...', { autoClose: 2000 })
                try {
                    const payRes = await fetch(`${host}/payment/initiate`, {
                        method: 'POST',
                        headers: myHeaders,
                        body: JSON.stringify({
                            domain: "SOLO_EVENT",
                            reference_id: eventID
                        })
                    })
                    const payData = await payRes.json()
                    
                    if (payData.success && payData.atomTokenId) {
                        const scriptLoaded = await loadScript("https://psa.atomtech.in/staticdata/ots/js/atomcheckout.js")
                        if (scriptLoaded) {
                            const options = {
                                atomTokenId: String(payData.atomTokenId),
                                merchId: String(payData.merchId || '564719'),
                                custEmail: payData.custEmail || '',
                                custMobile: payData.custMobile || '',
                                returnUrl: payData.returnUrl || ''
                            }
                            if (window.AtomPaynetz) {
                                new window.AtomPaynetz(options, 'prod');
                            }
                        } else {
                            toast.error('Failed to load payment gateway.', { autoClose: 3000 })
                        }
                    } else {
                        toast.error('Failed to initiate payment. Please try again from profile.', { autoClose: 3000 })
                    }
                } catch (e) {
                    console.error("Payment Error", e)
                    toast.error('Payment Error', { autoClose: 3000 })
                }
                return regData
            }

            await delay(3000)
            if (closeHandler) closeHandler()
            return regData
        } else {
            // Handle 401 specifically — redirect to login
            if (response.status === 401) {
                localStorage.removeItem('anwesha_token')
                router.push(`/userLogin?callbackUrl=${encodeURIComponent(router.asPath)}`)
            }

            const errorMsg = getErrorMessage(response.status, data)
            toast.error(errorMsg, {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
            })
            return null
        }
    } catch (error) {
        console.error('[SoloRegistration] Network error:', error)
        toast.error('Network error. Please check your connection and try again.', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        })
        return null
    }
}

// Keep the old soloEventRegistrationiitp as an alias for backward compat
// but point it at the new endpoint
const soloEventRegistrationiitp = soloEventRegistrationNew

export { soloEventRegistration, soloEventRegistrationiitp, soloEventRegistrationNew }

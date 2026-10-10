import React, { useState, useContext } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from '../authContext'
const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
async function teamEventRegistration(
    eventID,
    teamName,
    teamMembers,
    email,
    phone,
    amount,
    router
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
        team_name: teamName,
        team_members: teamMembers,
        email: email,
        phone: phone,
        type: 'team',
        amount: amount,
        anwesha_id: teamMembers[0],
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
    if (data.message == 'This user does not exist') {
        toast.error('One or more incorrect anwesha id entered');
        await delay(4000);
        return;
    }
    console.log(data);
    const res = await loadScript(
        'https://psa.atomtech.in/staticdata/ots/js/atomcheckout.js?v=' +
        data.atomTokenId
    )
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
    // const data = await fetch(`${host}/event/registration/team`, requestOptions)

    // const response = await data.json()
    // if (data.status === 200 || data.status === 201) {
    //     if (data.payment_url) {
    //         router.push(response.payment_url)
    //     } else {
    //         toast.success(response.messagge, {
    //             position: 'top-right',
    //             autoClose: 3000,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //             theme: 'light',
    //         })
    //         router.replace('/events')
    //     }
    // } else {
    //     if (Array.isArray(response.message)) {
    //         response.message.map((e) => {
    //             toast.error(e, {
    //                 position: 'top-right',
    //                 autoClose: 3000,
    //                 hideProgressBar: false,
    //                 closeOnClick: true,
    //                 pauseOnHover: true,
    //                 draggable: true,
    //                 progress: undefined,
    //                 theme: 'light',
    //             })
    //         })
    //     } else {
    //         toast.error(response.message, {
    //             position: 'top-right',
    //             autoClose: 3000,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //             theme: 'light',
    //         })
    //     }
    // }
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
            return responseData?.message || 'Event not found. It may have been removed.'
        case 409:
            return responseData?.message || 'You or a team member is already registered for this event.'
        case 422:
            return responseData?.message || 'Validation error. Please check your input.'
        case 500:
            return 'Server error. Please try again later.'
        default:
            return responseData?.message || 'Something went wrong. Please try again.'
    }
}

/**
 * Team event registration using the new unified /registration/register endpoint.
 * Sends { event_id, team_name, members } and handles the structured response with
 * registration_id, team_id, payment_status, and amount_due.
 */
async function teamEventRegistrationNew(
    eventID,
    teamName,
    teamMembers,
    router
) {
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
        router.push('/userLogin')
        return null
    }
    myHeaders.append('Authorization', `Bearer ${token}`)

    // Client-side validation
    if (!teamName || teamName.trim() === '') {
        toast.error('Please enter a team name.', {
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

    // Filter empty members and validate
    const validMembers = teamMembers.filter(m => m && m.trim() !== '')
    if (validMembers.length === 0) {
        toast.error('Please add at least one team member.', {
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

    // Check for duplicate member IDs
    const uniqueMembers = new Set(validMembers.map(m => typeof m === 'string' ? m.trim().toUpperCase() : m))
    if (uniqueMembers.size !== validMembers.length) {
        toast.error('Duplicate member IDs found. Each member must be unique.', {
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

    var raw = JSON.stringify({
        event_id: eventID,
        team_name: teamName.trim(),
        members: validMembers,
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
        console.log('[TeamRegistration] Response:', response.status, data)

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
            const teamId = regData?.team_id || ''
            const paymentRequired = regData?.payment_required !== undefined
                ? Boolean(regData.payment_required)
                : (regData?.payment_status === 'PENDING' || regData?.payment_status === 'pending')
            const paymentStatus = regData?.payment_status || (paymentRequired ? 'PENDING' : 'PAID')
            const amountDue = regData?.amount_due !== undefined ? Number(regData.amount_due) : (paymentRequired ? 1 : 0)

            const isPending = paymentRequired && (paymentStatus === 'PENDING' || paymentStatus === 'pending');
            if (!isPending || amountDue === 0) {
                let successMsg = data.message || 'Registered successfully'
                if (regId) successMsg += `\nRegistration ID: ${regId}`
                if (teamId) successMsg += `\nTeam ID: ${teamId}`
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
                            domain: "TEAM_EVENT",
                            reference_id: eventID,
                            team_id: teamId
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
            router.replace('/events')
            return regData
        } else {
            // Handle 401 specifically — redirect to login
            if (response.status === 401) {
                localStorage.removeItem('anwesha_token')
                router.push('/userLogin')
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
        console.error('[TeamRegistration] Network error:', error)
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

// Keep the old teamEventRegistrationiitp as an alias for backward compat
// but point it at the new endpoint
const teamEventRegistrationiitp = teamEventRegistrationNew

export { teamEventRegistration, teamEventRegistrationiitp, teamEventRegistrationNew }

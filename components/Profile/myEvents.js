import React, { useState, useEffect, useContext, useCallback } from 'react'
import styles from './profile.module.css'
import { AuthContext } from '../authContext'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ExitStatusModal from './ExitStatusModal'
import Loader, { ButtonLoader } from '../Loader'

const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'

const isConfirmedRegistration = (registration) =>
    registration.payment_done || registration.registration_status === 'CONFIRMED'

const formatExitTime = (value) =>
    new Date(value).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
    })

function MyEvents() {
    const [events, setEvents] = useState({ solo: [], team: [] })
    const [passes, setPasses] = useState([])
    const [gate, setGate] = useState({ entered: false, revokedAt: null })
    const [clockOffset, setClockOffset] = useState(0)
    const [now, setNow] = useState(() => Date.now())
    const [refreshKey, setRefreshKey] = useState(0)
    const [exitingEventId, setExitingEventId] = useState(null)
    const [exitPass, setExitPass] = useState(null)
    const [loadingEvents, setLoadingEvents] = useState(true)
    const [payingId, setPayingId] = useState(null)
    const userData = useContext(AuthContext)
    const authHeaders = userData?.getAuthHeaders ? userData.getAuthHeaders() : {}

    const allRegistrations = [...(events.solo || []), ...(events.team || [])]
    const hasPendingExit = allRegistrations.some(
        (e) => isConfirmedRegistration(e) && e.exit_enabled_at && !e.exited_at
    )
    const isExitTimeReached = (e) => Date.parse(e.exit_enabled_at) <= now + clockOffset
    const awaitingEntry =
        !gate.entered &&
        !gate.revokedAt &&
        allRegistrations.some(
            (e) => isConfirmedRegistration(e) && e.exit_enabled_at && !e.exited_at && isExitTimeReached(e)
        )
    const canExit = (e) =>
        isConfirmedRegistration(e) &&
        Boolean(e.exit_enabled_at) &&
        !e.exited_at &&
        gate.entered &&
        !gate.revokedAt &&
        isExitTimeReached(e)

    useEffect(() => {
        if (!hasPendingExit) return
        setNow(Date.now())
        const timer = setInterval(() => setNow(Date.now()), 5000)
        return () => clearInterval(timer)
    }, [hasPendingExit])

    useEffect(() => {
        if (!awaitingEntry) return
        setRefreshKey((key) => key + 1)
        const timer = setInterval(() => setRefreshKey((key) => key + 1), 30000)
        return () => clearInterval(timer)
    }, [awaitingEntry])

    useEffect(() => {
        if (!hasPendingExit) return
        const onVisibilityChange = () => {
            if (document.visibilityState === 'visible') setRefreshKey((key) => key + 1)
        }
        document.addEventListener('visibilitychange', onVisibilityChange)
        return () => document.removeEventListener('visibilitychange', onVisibilityChange)
    }, [hasPendingExit])

    const closeExitPass = useCallback(() => setExitPass(null), [])

    const requestExit = async (registration) => {
        setExitingEventId(registration.event_id)
        try {
            const res = await fetch(`${host}/registration/exit`, {
                method: 'POST',
                headers: {
                    ...authHeaders,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ event_id: registration.event_id }),
            })
            const data = await res.json().catch(() => ({}))

            if (!res.ok || !data.success || !data.exit) {
                toast.error(data.message || 'Could not record your exit. Please try again.', { autoClose: 4000 })
                setRefreshKey((key) => key + 1)
                return
            }

            const exitedAt = data.exit.exited_at
            const markExited = (list) =>
                (list || []).map((item) =>
                    item.event_id === registration.event_id ? { ...item, exited_at: exitedAt } : item
                )
            setEvents((prev) => ({ ...prev, solo: markExited(prev.solo), team: markExited(prev.team) }))
            setGate((prev) => ({ entered: false, revokedAt: prev.revokedAt || exitedAt }))
            setExitPass(data.exit)
        } catch (error) {
            console.error('[MyEvents] Exit error:', error)
            toast.error('Network error. Please try again.', { autoClose: 3000 })
        } finally {
            setExitingEventId(null)
        }
    }

    const handleExit = (registration) => {
        const confirmed = window.confirm(
            `Mark your exit from ${registration.event_name}?\n\nYour QR code will stop working and you can't re-enter.`
        )
        if (confirmed) requestExit(registration)
    }

    const renderExitControls = (e) => {
        const isBusy = exitingEventId === e.event_id

        if (e.exited_at) {
            return (
                <div style={{ marginTop: '10px' }}>
                    <div style={{ color: '#ff8a80', fontWeight: '600', marginBottom: '8px' }}>
                        Exited at {formatExitTime(e.exited_at)} · QR revoked
                    </div>
                    <button
                        className={styles.payment_btn}
                        disabled={isBusy}
                        onClick={(event) => {
                            event.preventDefault();
                            requestExit(e);
                        }}
                        style={{ padding: '8px 16px', background: 'transparent', color: '#F2BF51', border: '1px solid #F2BF51', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', display: 'inline-block' }}
                    >
                        <ButtonLoader loading={isBusy} label="Loading…">
                            View Exit Pass
                        </ButtonLoader>
                    </button>
                </div>
            )
        }

        if (!canExit(e)) return null

        return (
            <div style={{ marginTop: '10px' }}>
                <button
                    className={styles.payment_btn}
                    disabled={isBusy}
                    onClick={(event) => {
                        event.preventDefault();
                        handleExit(e);
                    }}
                    style={{ padding: '8px 16px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', display: 'inline-block' }}
                >
                    <ButtonLoader loading={isBusy} label="Exiting…">
                        Exit Event
                    </ButtonLoader>
                </button>
            </div>
        )
    }

    const initiatePayment = async (domain, eventId, teamId = null) => {
        setPayingId(teamId || eventId)
        try {
            toast.info('Initiating secure payment gateway...', { autoClose: 2000 })
            const payload = {
                domain: domain,
                reference_id: eventId
            }
            if (teamId) payload.team_id = teamId;

            const payRes = await fetch(`${host}/payment/initiate`, {
                method: 'POST',
                headers: {
                    ...authHeaders,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            const payData = await payRes.json()
            
            if (payData.success && payData.atomTokenId) {
                // Dynamically load the AtomPay script
                const script = document.createElement('script');
                script.src = "https://psa.atomtech.in/staticdata/ots/js/atomcheckout.js";
                script.onload = () => {
                    const options = {
                        atomTokenId: String(payData.atomTokenId),
                        merchId: String(payData.merchId || '564719'),
                        custEmail: payData.custEmail || '',
                        custMobile: payData.custMobile || '',
                        returnUrl: payData.returnUrl || window.location.origin + '/api/payment/verify'
                    }

                    const handleCancel = async (e) => {
                        if (e.data === 'cancelTransaction' || e.data === 'sessionTimeout') {
                            window.removeEventListener('message', handleCancel);
                            const orderId = payData.merchTxnId || payData.orderId;
                            if (orderId) {
                                try {
                                    await fetch('/api/payment/verify', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            order_id: orderId,
                                            status: 'CANCELLED',
                                            action: 'cancel'
                                        })
                                    });
                                } catch (cancelErr) {
                                    console.error('Cancel notify error:', cancelErr);
                                }
                                window.location.href = `/payment-status?order=${encodeURIComponent(orderId)}&success=false&status=CANCELLED`;
                            }
                        }
                    };
                    window.addEventListener('message', handleCancel);

                    if (window.AtomPaynetz) {
                        new window.AtomPaynetz(options, 'prod');
                    }
                };
                script.onerror = () => toast.error('Failed to load payment gateway.', { autoClose: 3000 });
                document.body.appendChild(script);
            } else {
                toast.error(payData.message || 'Failed to initiate payment.', { autoClose: 3000 })
            }
        } catch (error) {
            console.error("Payment Error", error)
            toast.error('Payment Error. Please try again.', { autoClose: 3000 })
        } finally {
            setPayingId(null)
        }
    }
    // Fallback to old endpoint for backward compatibility
    async function fetchEventMyEventsOldEndpoint() {
        try {
            const res = await fetch(`${host}/event/myevents`, {
                method: 'GET',
                redirect: 'follow',
                headers: {
                    ...authHeaders,
                },
            })
            const result = await res.json()
            console.log('[MyEvents] Using fallback /event/myevents:', result)
            setEvents(result)
        } catch (error) {
            console.error('[MyEvents] Fallback also failed:', error)
        }
    }

    useEffect(() => {
        const fetchUserRegistrations = async () => {
            try {
                if (!userData.isAuth) {
                    console.warn('[MyEvents] Not authenticated')
                    return
                }

                // Use new unified registrations endpoint
                const response = await fetch(`${host}/registration/my`, {
                    method: 'GET',
                    headers: {
                        ...authHeaders,
                        'Content-Type': 'application/json',
                    },
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }

                const data = await response.json()
                console.log('[MyEvents] Registrations data:', data)

                if (data.server_time) {
                    setClockOffset(Date.parse(data.server_time) - Date.now())
                }
                setGate({
                    entered: Boolean(data.entered),
                    revokedAt: data.ticket_revoked_at || null,
                })

                // Map response to events and passes state
                const normalizeStatus = (reg) => {
                    if (reg.payment_status) return String(reg.payment_status).toUpperCase();
                    if (reg.registration_status === 'CONFIRMED' || reg.payment_done === true || (reg.amount && reg.amount > 0 && reg.payment_status !== 'FAILED')) {
                        return 'PAID';
                    }
                    if (reg.registration_status === 'CANCELLED') return 'CANCELLED';
                    return 'PENDING';
                };

                const soloEvents = (data.solo_registrations || data.solo || data.registered_events || []).map((reg) => {
                    const status = normalizeStatus(reg);
                    return {
                        event_id: reg.event_id,
                        event_name: reg.event_name,
                        event_venue: reg.event_category || reg.venue || 'TBA',
                        registration_fee: reg.registration_fee || reg.amount || 0,
                        payment_done: status === 'PAID',
                        payment_status: status,
                        registration_status: reg.registration_status,
                        event_start_time: reg.event_start_time || reg.registration_date,
                        event_end_time: reg.event_end_time,
                        payment_url: reg.payment_url,
                        exit_enabled_at: reg.exit_enabled_at,
                        exited_at: reg.exited_at,
                    };
                })

                const teamEvents = (data.team_registrations || data.team || []).map((reg) => {
                    const status = normalizeStatus(reg);
                    return {
                        team_id: reg.team_id,
                        team_name: reg.team_name,
                        event_id: reg.event_id,
                        event_name: reg.event_name,
                        event_venue: reg.event_category || reg.venue || 'TBA',
                        registration_fee: reg.registration_fee || reg.amount || 0,
                        payment_done: status === 'PAID',
                        payment_status: status,
                        registration_status: reg.registration_status,
                        event_start_time: reg.event_start_time || reg.registration_date,
                        event_end_time: reg.event_end_time,
                        payment_url: reg.payment_url,
                        is_leader: reg.is_leader !== undefined ? reg.is_leader : true,
                        team_members: reg.team_members || reg.members || [],
                        exit_enabled_at: reg.exit_enabled_at,
                        exited_at: reg.exited_at,
                    };
                })

                setEvents({
                    solo: soloEvents,
                    team: teamEvents,
                })

                // Set festpass if available
                if (data.festpass && data.festpass.payment_done) {
                    setPasses([
                        {
                            event_name: 'Festival Pass',
                            event_start_time: '2025-02-09T15:30:00Z',
                        },
                    ])
                }
            } catch (error) {
                console.error('[MyEvents] Error fetching registrations:', error)
                // Fallback to old endpoint if new one fails
                await fetchEventMyEventsOldEndpoint()
            } finally {
                setLoadingEvents(false)
            }
        }

        if (userData.state?.user?.anwesha_id) {
            fetchUserRegistrations()
        }
    }, [userData.state?.user?.anwesha_id, refreshKey])

    return (
        // <div>
        //     {events.solo.length === 0 &&
        //         events.team.length === 0 &&
        //         passes.length === 0 ? (
        //         <div>No events registered</div>
        //     ) : null}
        //     {passes.map((e, key) => {
        //         return (
        //             <div key={key} className={styles.pass}>
        //                 <h2>{e.event_name}</h2>
        //                 {e.payment_done ? (
        //                     <div className={styles.verified_img}>
        //                         <img src="assets/tick-green.svg" />
        //                         Registration Complete
        //                     </div>
        //                 ) : (
        //                     <a
        //                         className={styles.payment_btn}
        //                         href={e.payment_url}
        //                     >
        //                         Continue to payment{' '}
        //                         <img src="/assets/right-arrow.svg" />
        //                     </a>
        //                 )}
        //             </div>
        //         )
        //     })}
        //     {events.solo ? (
        //         events.solo.length !== 0 ? (
        //             <div>
        //                 <h1>Solo Events</h1>
        //                 <div
        //                     style={{
        //                         display: 'flex',
        //                         flexWrap: 'wrap',
        //                         justifyContent: 'center',
        //                     }}
        //                 >
        //                     {events.solo.map((e, key) => {
        //                         if (e.event_tags !== '6') {
        //                             return (
        //                                 <div key={key} className={styles.event}>
        //                                     <h2>{e.event_name}</h2>
        //                                     <div className={styles.date_loc}>
        //                                         <div
        //                                             className={styles.date_row}
        //                                         >
        //                                             <img src="/assets/calendar-clock.svg" />
        //                                             <div
        //                                                 className={styles.date}
        //                                             >
        //                                                 <span
        //                                                     className={
        //                                                         styles.day
        //                                                     }
        //                                                 >
        //                                                     {new Date(
        //                                                         e.event_start_time
        //                                                     ).toLocaleString(
        //                                                         'default',
        //                                                         {
        //                                                             day: 'numeric',
        //                                                         }
        //                                                     )}
        //                                                 </span>
        //                                                 <span
        //                                                     className={
        //                                                         styles.month
        //                                                     }
        //                                                 >
        //                                                     {new Date(
        //                                                         e.event_start_time
        //                                                     ).toLocaleString(
        //                                                         'default',
        //                                                         {
        //                                                             month: 'short',
        //                                                         }
        //                                                     )}
        //                                                 </span>
        //                                             </div>
        //                                             {e.event_end_time ? (
        //                                                 <div>-</div>
        //                                             ) : null}
        //                                             {e.event_end_time ? (
        //                                                 <div
        //                                                     className={
        //                                                         styles.date
        //                                                     }
        //                                                 >
        //                                                     <span
        //                                                         className={
        //                                                             styles.day
        //                                                         }
        //                                                     >
        //                                                         {new Date(
        //                                                             e.event_end_time
        //                                                         ).toLocaleString(
        //                                                             'default',
        //                                                             {
        //                                                                 day: 'numeric',
        //                                                             }
        //                                                         )}
        //                                                     </span>
        //                                                     <span
        //                                                         className={
        //                                                             styles.month
        //                                                         }
        //                                                     >
        //                                                         {new Date(
        //                                                             e.event_end_time
        //                                                         ).toLocaleString(
        //                                                             'default',
        //                                                             {
        //                                                                 month: 'short',
        //                                                             }
        //                                                         )}
        //                                                     </span>
        //                                                 </div>
        //                                             ) : null}
        //                                         </div>
        //                                         <div
        //                                             className={styles.location}
        //                                         >
        //                                             <img src="/assets/location.svg" />
        //                                             {e.event_venue}
        //                                         </div>
        //                                     </div>
        //                                     {e.payment_done ? (
        //                                         <div
        //                                             className={
        //                                                 styles.verified_img
        //                                             }
        //                                         >
        //                                             <img src="assets/tick-green.svg" />
        //                                             Registration Complete
        //                                         </div>
        //                                     ) : (
        //                                         <a
        //                                             className={
        //                                                 styles.payment_btn
        //                                             }
        //                                             href={e.payment_url}
        //                                         >
        //                                             Continue to payment{' '}
        //                                             <img src="/assets/right-arrow.svg" />
        //                                         </a>
        //                                     )}
        //                                     {e.payment_url ? (
        //                                         <a
        //                                             className={
        //                                                 styles.verified_img
        //                                             }
        //                                             href={e.payment_url}
        //                                             target="_blank"
        //                                             rel="noreferrer"
        //                                         >
        //                                             <img src="assets/WhatsApp.svg" />
        //                                             Join Group
        //                                         </a>
        //                                     ) : null}
        //                                 </div>
        //                             )
        //                         }
        //                     })}
        //                 </div>
        //             </div>
        //         ) : null
        //     ) : null}
        //     {events.team ? (
        //         events.team.length !== 0 ? (
        //             <div>
        //                 <h1>Team Events</h1>
        //                 <div
        //                     style={{
        //                         display: 'flex',
        //                         flexWrap: 'wrap',
        //                         justifyContent: 'center',
        //                     }}
        //                 >
        //                     {events.team.map((e, key) => {
        //                         return (
        //                             e.payment_done &&
        //                             <div key={key} className={styles.event}>
        //                                 <h2>{e.event_name}</h2>
        //                                 <div className={styles.date_loc}>
        //                                     <div className={styles.date_row}>
        //                                         <img src="/assets/calendar-clock.svg" />
        //                                         <div className={styles.date}>
        //                                             <span
        //                                                 className={styles.day}
        //                                             >
        //                                                 {new Date(
        //                                                     e.event_start_time
        //                                                 ).toLocaleString(
        //                                                     'default',
        //                                                     { day: 'numeric' }
        //                                                 )}
        //                                             </span>
        //                                             <span
        //                                                 className={styles.month}
        //                                             >
        //                                                 {new Date(
        //                                                     e.event_start_time
        //                                                 ).toLocaleString(
        //                                                     'default',
        //                                                     { month: 'short' }
        //                                                 )}
        //                                             </span>
        //                                         </div>
        //                                         {e.event_end_time ? (
        //                                             <div>-</div>
        //                                         ) : null}
        //                                         {e.event_end_time ? (
        //                                             <div
        //                                                 className={styles.date}
        //                                             >
        //                                                 <span
        //                                                     className={
        //                                                         styles.day
        //                                                     }
        //                                                 >
        //                                                     {new Date(
        //                                                         e.event_end_time
        //                                                     ).toLocaleString(
        //                                                         'default',
        //                                                         {
        //                                                             day: 'numeric',
        //                                                         }
        //                                                     )}
        //                                                 </span>
        //                                                 <span
        //                                                     className={
        //                                                         styles.month
        //                                                     }
        //                                                 >
        //                                                     {new Date(
        //                                                         e.event_end_time
        //                                                     ).toLocaleString(
        //                                                         'default',
        //                                                         {
        //                                                             month: 'short',
        //                                                         }
        //                                                     )}
        //                                                 </span>
        //                                             </div>
        //                                         ) : null}
        //                                     </div>
        //                                     <div className={styles.location}>
        //                                         <img src="/assets/location.svg" />
        //                                         {e.event_venue}
        //                                     </div>
        //                                 </div>
        //                                 <div className={styles.team_details}>
        //                                     <h3>{e.team_name}</h3>
        //                                     <h4>
        //                                         Leader:{' '}
        //                                         <strong>{e.team_lead}</strong>
        //                                     </h4>
        //                                     <div className={styles.members}>
        //                                         {e.team_members.map(
        //                                             (mem, key) => {
        //                                                 return (
        //                                                     <div key={key}>
        //                                                         {mem}
        //                                                     </div>
        //                                                 )
        //                                             }
        //                                         )}
        //                                     </div>
        //                                 </div>
        //                                 {e.payment_done ? (
        //                                     <div
        //                                         className={styles.verified_img}
        //                                     >
        //                                         <img src="assets/tick-green.svg" />
        //                                         Registration Complete
        //                                     </div>
        //                                 ) : (
        //                                     <a
        //                                         className={styles.payment_btn}
        //                                         href={e.payment_url}
        //                                     >
        //                                         Continue to payment{' '}
        //                                         <img src="/assets/right-arrow.svg" />
        //                                     </a>
        //                                 )}
        //                                 {e.payment_url ? (
        //                                     <a
        //                                         className={styles.verified_img}
        //                                         href={e.payment_url}
        //                                         target="_blank"
        //                                         rel="noreferrer"
        //                                     >
        //                                         <img src="assets/WhatsApp.svg" />
        //                                         Join Group
        //                                     </a>
        //                                 ) : null}
        //                             </div>

        //                         )
        //                     })}
        //                 </div>
        //             </div>
        //         ) : null
        //     ) : null}
        // </div>

        <div className={styles.eventsInfo}>
            {loadingEvents ? (
                <Loader label="Loading your events…" />
            ) : !events.solo ||
            (events.solo.length === 0 &&
                events.team.length === 0 &&
                passes.length === 0) ? (
                <div>No events registered</div>
            ) : null}
            {passes.length !== 0 ? (
                <div>
                    <div className={styles.eventsHeading}>Passes</div>
                    {passes.map((e, key) => {
                        return (
                            <div key={key} className={styles.pass}>
                                <img src={'/pics/pass.png'}></img>
                                <div className={styles.passDetail}>
                                    <div
                                        style={{
                                            fontFamily: 'Laila-Bold',
                                        }}
                                    >
                                        {e.event_name}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : null}
            {(events.solo || events.team) &&
            (events.solo.length !== 0 || events.team.length !== 0) ? (
                <div>
                    <div className={styles.eventsHeading}>
                        Registered Events
                    </div>
                    {events.solo.map((e, key) => {
                        const status = (e.payment_status || (e.payment_done ? 'PAID' : 'PENDING')).toUpperCase();
                        return (
                            <div key={key} className={styles.pass}>
                                <img src={'/pics/pass.png'}></img>
                                <div className={styles.passDetail}>
                                    <div
                                        style={{
                                            fontFamily: 'Laila-Bold',
                                        }}
                                    >
                                        {e.event_name}
                                    </div>

                                    {/* Payment status badge / button */}
                                    {(status === 'PAID' || status === 'CONFIRMED' || status === 'SUCCESS') && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0a7c42', fontWeight: '600', marginTop: '8px' }}>
                                            <span style={{ fontSize: '18px' }}>✓</span>
                                            <span>Paid Successful</span>
                                        </div>
                                    )}

                                    {(status === 'CANCELLED' || status === 'CANCELED') && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e67e22', fontWeight: '600', marginTop: '8px' }}>
                                            <span>✕</span>
                                            <span>Payment Cancelled</span>
                                        </div>
                                    )}

                                    {status === 'FAILED' && (
                                        <div style={{ marginTop: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff3e3e', fontWeight: '600', marginBottom: '8px' }}>
                                                <span>⚠</span>
                                                <span>Payment Failed</span>
                                            </div>
                                            <button 
                                                className={styles.payment_btn}
                                                disabled={payingId === e.event_id}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    initiatePayment("SOLO_EVENT", e.event_id);
                                                }}
                                                style={{ padding: '8px 16px', background: '#ff3e3e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', display: 'inline-block' }}
                                            >
                                                <ButtonLoader loading={payingId === e.event_id} label="Processing">
                                                    Retry Payment
                                                </ButtonLoader>
                                            </button>
                                        </div>
                                    )}

                                    {status === 'PENDING' && (
                                        <div style={{ marginTop: '8px' }}>
                                            <div style={{ color: '#e67e22', fontWeight: '600', marginBottom: '8px' }}>
                                                Payment Pending
                                            </div>
                                            <button 
                                                className={styles.payment_btn}
                                                disabled={payingId === e.event_id}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    initiatePayment("SOLO_EVENT", e.event_id);
                                                }}
                                                style={{ padding: '8px 16px', background: '#e67e22', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', display: 'inline-block' }}
                                            >
                                                <ButtonLoader loading={payingId === e.event_id} label="Processing">
                                                    Pay Now
                                                </ButtonLoader>
                                            </button>
                                        </div>
                                    )}

                                    {renderExitControls(e)}
                                </div>
                            </div>
                        )
                    })}
                    {events.team.map((e, key) => {
                        const status = (e.payment_status || (e.payment_done ? 'PAID' : 'PENDING')).toUpperCase();
                        return (
                            <div key={key} className={styles.pass}>
                                <img src={'/pics/pass.png'}></img>
                                <div className={styles.passDetail}>
                                    <div
                                        style={{
                                            fontFamily: 'Laila-Bold',
                                        }}
                                    >
                                        {e.event_name}
                                    </div>
                                    <div style={{ marginTop: '4px', color: '#ddd' }}>
                                        Team: <strong>{e.team_name}</strong>
                                    </div>
                                    {e.team_members && e.team_members.length > 0 && (
                                        <div style={{ fontSize: '0.9rem', marginTop: '8px', color: '#ccc' }}>
                                            <strong>Team Members:</strong>
                                            <div style={{ marginTop: '4px', paddingLeft: '10px' }}>
                                                {e.team_members.map((member, idx) => (
                                                    <div key={idx}>
                                                        {member.anwesha_id || member}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Payment status badge / button */}
                                    {(status === 'PAID' || status === 'CONFIRMED' || status === 'SUCCESS') && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0a7c42', fontWeight: '600', marginTop: '8px' }}>
                                            <span style={{ fontSize: '18px' }}>✓</span>
                                            <span>Paid Successful</span>
                                        </div>
                                    )}

                                    {(status === 'CANCELLED' || status === 'CANCELED') && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e67e22', fontWeight: '600', marginTop: '8px' }}>
                                            <span>✕</span>
                                            <span>Payment Cancelled</span>
                                        </div>
                                    )}

                                    {status === 'FAILED' && (
                                        <div style={{ marginTop: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff3e3e', fontWeight: '600', marginBottom: '8px' }}>
                                                <span>⚠</span>
                                                <span>Payment Failed</span>
                                            </div>
                                            <button 
                                                className={styles.payment_btn}
                                                disabled={payingId === (e.team_id || e.event_id)}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    initiatePayment("TEAM_EVENT", e.event_id, e.team_id);
                                                }}
                                                style={{ padding: '8px 16px', background: '#ff3e3e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', display: 'inline-block' }}
                                            >
                                                <ButtonLoader loading={payingId === (e.team_id || e.event_id)} label="Processing">
                                                    Retry Payment
                                                </ButtonLoader>
                                            </button>
                                        </div>
                                    )}

                                    {status === 'PENDING' && (
                                        <div style={{ marginTop: '8px' }}>
                                            <div style={{ color: '#e67e22', fontWeight: '600', marginBottom: '8px' }}>
                                                Payment Pending
                                            </div>
                                            <button 
                                                className={styles.payment_btn}
                                                disabled={payingId === (e.team_id || e.event_id)}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    initiatePayment("TEAM_EVENT", e.event_id, e.team_id);
                                                }}
                                                style={{ padding: '8px 16px', background: '#e67e22', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', display: 'inline-block' }}
                                            >
                                                <ButtonLoader loading={payingId === (e.team_id || e.event_id)} label="Processing">
                                                    Pay Now
                                                </ButtonLoader>
                                            </button>
                                        </div>
                                    )}

                                    {renderExitControls(e)}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : null}

            {exitPass && (
                <ExitStatusModal pass={exitPass} clockOffset={clockOffset} onClose={closeExitPass} />
            )}

            {/* <div>
                <div className={styles.eventsHeading}>Event Passes</div>
                <div className={styles.pass}>
                    <img src={'/pics/pass.png'}></img>
                    <div className={styles.passDetail}>
                        <div
                            style={{
                                fontFamily: 'Laila-Bold',
                            }}
                        >
                            Pronite Pass
                        </div>
                        <div>18 March 2024</div>
                        <div>09:00</div>
                    </div>
                </div>
            </div> */}

            {/* <div>
                <div className={styles.eventsHeading}>Registered Events</div>
                <div className={styles.pass}>
                    <img src={'/pics/pass.png'}></img>
                    <div className={styles.passDetail}>
                        <div
                            style={{
                                fontFamily: 'Laila-Bold',
                            }}
                        >
                            Pronite Pass
                        </div>
                        <div>18 March 2024</div>
                        <div>09:00</div>
                    </div>
                </div>
                <div className={styles.pass}>
                    <img src={'/pics/pass.png'}></img>
                    <div className={styles.passDetail}>
                        <div
                            style={{
                                fontFamily: 'Laila-Bold',
                            }}
                        >
                            Pronite Pass
                        </div>
                        <div>18 March 2024</div>
                        <div>09:00</div>
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default MyEvents

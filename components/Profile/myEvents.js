import React, { useState, useEffect, useContext, useCallback } from 'react'
import { AuthContext } from '../authContext'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ExitStatusModal from './ExitStatusModal'
import Loader, { ButtonLoader } from '../Loader'
import Link from 'next/link'
import { CalendarDays, CreditCard, DoorOpen, LogOut, MapPin, Ticket, Users } from 'lucide-react'
import ev from './MyEvents.module.css'

const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'

const isConfirmedRegistration = (registration) =>
    registration.payment_done || registration.registration_status === 'CONFIRMED'

const STATUS_BADGES = {
    PAID: { label: 'Paid', tone: 'success' },
    CONFIRMED: { label: 'Confirmed', tone: 'success' },
    SUCCESS: { label: 'Paid', tone: 'success' },
    PENDING: { label: 'Payment pending', tone: 'warning' },
    FAILED: { label: 'Payment failed', tone: 'danger' },
    CANCELLED: { label: 'Cancelled', tone: 'muted' },
    CANCELED: { label: 'Cancelled', tone: 'muted' },
}

const formatSchedule = (start, end) => {
    const startDate = start ? new Date(start) : null
    if (!startDate || Number.isNaN(startDate.getTime())) return null
    const options = { timeZone: 'Asia/Kolkata' }
    const day = startDate.toLocaleDateString('en-IN', { ...options, weekday: 'short', day: 'numeric', month: 'short' })
    const time = (date) => date.toLocaleTimeString('en-IN', { ...options, hour: 'numeric', minute: '2-digit' })
    const endDate = end ? new Date(end) : null
    const hasEnd = endDate && !Number.isNaN(endDate.getTime())
    return `${day} · ${time(startDate)}${hasEnd ? ` – ${time(endDate)}` : ''} IST`
}

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
    const [ticket, setTicket] = useState(null)
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

    const renderTicketControls = (e) => {
        if (!ticket || e.exited_at || !isConfirmedRegistration(e)) return null

        if (ticket.available && ticket.link) {
            return (
                <Link href={ticket.link} className={ev.primaryAction}>
                    <Ticket size={16} aria-hidden="true" />
                    View ticket
                </Link>
            )
        }

        const pendingNotes = {
            ID_NOT_VERIFIED: 'Your ticket will appear here once your college ID and Aadhaar card are verified.',
            TICKET_NOT_SENT: 'Your documents are verified. Your ticket will appear here as soon as the Anwesha team issues it.',
        }

        if (pendingNotes[ticket.reason]) {
            return <p className={ev.note}>{pendingNotes[ticket.reason]}</p>
        }

        return null
    }

    const renderExitControls = (e) => {
        const isBusy = exitingEventId === e.event_id

        if (e.exited_at) {
            return (
                <>
                    <p className={ev.exitedNote}>Exited at {formatExitTime(e.exited_at)} · QR revoked</p>
                    <button
                        type="button"
                        className={ev.secondaryAction}
                        disabled={isBusy}
                        onClick={() => requestExit(e)}
                    >
                        <ButtonLoader loading={isBusy} label="Loading…">
                            <DoorOpen size={16} aria-hidden="true" />
                            View exit pass
                        </ButtonLoader>
                    </button>
                </>
            )
        }

        if (!canExit(e)) return null

        return (
            <button
                type="button"
                className={ev.dangerAction}
                disabled={isBusy}
                onClick={() => handleExit(e)}
            >
                <ButtonLoader loading={isBusy} label="Exiting…">
                    <LogOut size={16} aria-hidden="true" />
                    Exit event
                </ButtonLoader>
            </button>
        )
    }

    const renderPaymentControls = (e, kind) => {
        const status = (e.payment_status || (e.payment_done ? 'PAID' : 'PENDING')).toUpperCase()
        if (status !== 'PENDING' && status !== 'FAILED') return null
        const payKey = kind === 'team' ? (e.team_id || e.event_id) : e.event_id
        return (
            <button
                type="button"
                className={ev.primaryAction}
                disabled={payingId === payKey}
                onClick={() => (kind === 'team'
                    ? initiatePayment('TEAM_EVENT', e.event_id, e.team_id)
                    : initiatePayment('SOLO_EVENT', e.event_id))}
            >
                <ButtonLoader loading={payingId === payKey} label="Processing">
                    <CreditCard size={16} aria-hidden="true" />
                    {status === 'FAILED' ? 'Retry payment' : 'Pay now'}
                </ButtonLoader>
            </button>
        )
    }

    const renderRegistration = (e, kind) => {
        const status = (e.payment_status || (e.payment_done ? 'PAID' : 'PENDING')).toUpperCase()
        const badge = STATUS_BADGES[status] || STATUS_BADGES.PENDING
        const schedule = formatSchedule(e.event_start_time, e.event_end_time)
        const members = (e.team_members || []).map((member) => member?.anwesha_id || member).filter(Boolean)
        const venue = e.event_venue && e.event_venue !== 'TBA' ? e.event_venue : null

        return (
            <li key={`${kind}-${e.team_id || e.event_id}`} className={ev.card}>
                <div className={ev.cardHead}>
                    <div className={ev.titleBlock}>
                        <span className={ev.kind}>{kind === 'team' ? 'Team event' : 'Solo event'}</span>
                        <h3 className={ev.eventName}>{e.event_name}</h3>
                    </div>
                    <span className={`${ev.badge} ${ev[badge.tone]}`}>{badge.label}</span>
                </div>

                {(schedule || venue || kind === 'team') && (
                    <ul className={ev.meta}>
                        {schedule && (
                            <li><CalendarDays size={15} aria-hidden="true" />{schedule}</li>
                        )}
                        {venue && (
                            <li><MapPin size={15} aria-hidden="true" />{venue}</li>
                        )}
                        {kind === 'team' && e.team_name && (
                            <li><Users size={15} aria-hidden="true" />{e.team_name}</li>
                        )}
                    </ul>
                )}

                {members.length > 0 && (
                    <p className={ev.members}>
                        <span>Members:</span> {members.join(', ')}
                    </p>
                )}

                <div className={ev.actions}>
                    {renderPaymentControls(e, kind)}
                    {renderTicketControls(e)}
                    {renderExitControls(e)}
                </div>
            </li>
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
                setTicket(data.ticket || null)

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
                        event_venue: reg.venue || reg.event_category || 'TBA',
                        registration_fee: reg.registration_fee || reg.amount || 0,
                        payment_done: status === 'PAID',
                        payment_status: status,
                        registration_status: reg.registration_status,
                        event_start_time: reg.start_time || reg.event_start_time || null,
                        event_end_time: reg.end_time || reg.event_end_time || null,
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
                        event_venue: reg.venue || reg.event_category || 'TBA',
                        registration_fee: reg.registration_fee || reg.amount || 0,
                        payment_done: status === 'PAID',
                        payment_status: status,
                        registration_status: reg.registration_status,
                        event_start_time: reg.start_time || reg.event_start_time || null,
                        event_end_time: reg.end_time || reg.event_end_time || null,
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

    const hasRegistrations = events.solo.length > 0 || events.team.length > 0

    return (
        <div className={ev.wrapper}>
            <div className={ev.header}>
                <h2 className={ev.heading}>My events</h2>
                {hasRegistrations && (
                    <span className={ev.count}>
                        {events.solo.length + events.team.length} registration{events.solo.length + events.team.length === 1 ? '' : 's'}
                    </span>
                )}
            </div>

            {loadingEvents ? (
                <Loader label="Loading your events…" />
            ) : !hasRegistrations && passes.length === 0 ? (
                <div className={ev.empty}>
                    <CalendarDays size={28} aria-hidden="true" />
                    <p>You have not registered for any events yet.</p>
                    <Link href="/events" className={ev.primaryAction}>Browse events</Link>
                </div>
            ) : (
                <>
                    {passes.length > 0 && (
                        <ul className={ev.list}>
                            {passes.map((pass) => (
                                <li key={pass.event_name} className={ev.card}>
                                    <div className={ev.cardHead}>
                                        <div className={ev.titleBlock}>
                                            <span className={ev.kind}>Pass</span>
                                            <h3 className={ev.eventName}>{pass.event_name}</h3>
                                        </div>
                                        <span className={`${ev.badge} ${ev.success}`}>Active</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    {hasRegistrations && (
                        <ul className={ev.list}>
                            {events.solo.map((e) => renderRegistration(e, 'solo'))}
                            {events.team.map((e) => renderRegistration(e, 'team'))}
                        </ul>
                    )}
                </>
            )}

            {exitPass && (
                <ExitStatusModal pass={exitPass} clockOffset={clockOffset} onClose={closeExitPass} />
            )}
        </div>
    )
}

export default MyEvents

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { BedDouble, CalendarDays, Clock, MapPin, Users } from 'lucide-react'
import Loader, { ButtonLoader } from '../Loader'
import { startAtomPayment } from '../../lib/atomPay'
import styles from './MyAccommodation.module.css'

const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'

const ACTIVE_STATUSES = ['REQUESTED', 'ALLOTTED_PENDING_PAYMENT', 'CONFIRMED']

const STATUS_COPY = {
    REQUESTED: { label: 'Awaiting room allotment', tone: 'info' },
    ALLOTTED_PENDING_PAYMENT: { label: 'Room allotted · payment due', tone: 'action' },
    CONFIRMED: { label: 'Confirmed', tone: 'success' },
    CANCELLED_DUE_TO_NON_PAYMENT: { label: 'Released · payment not received', tone: 'muted' },
    CANCELLED: { label: 'Cancelled', tone: 'muted' },
    REJECTED: { label: 'Not approved', tone: 'muted' },
}

const IST = { timeZone: 'Asia/Kolkata' }

const formatDate = (value) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString('en-IN', { ...IST, day: 'numeric', month: 'short', year: 'numeric' })
}

const formatDateTime = (value) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return `${date.toLocaleString('en-IN', { ...IST, day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })} IST`
}

const timeLeft = (deadline, now) => {
    const ms = new Date(deadline).getTime() - now
    if (!Number.isFinite(ms) || ms <= 0) return null
    const hours = Math.floor(ms / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    return hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m left`
}

const sortByNewest = (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)

const isVisible = (request) => ACTIVE_STATUSES.includes(request.status) || Boolean(request.refund_required)

export const hasActiveAccommodation = (requests) =>
    requests.some((request) => ACTIVE_STATUSES.includes(request.status))

export default function MyAccommodation({ getAuthHeaders, highlightId, refreshKey = 0, onLoaded }) {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [payingId, setPayingId] = useState(null)
    const [cancellingId, setCancellingId] = useState(null)
    const [now, setNow] = useState(() => Date.now())

    const authRef = useRef(getAuthHeaders)
    const onLoadedRef = useRef(onLoaded)
    authRef.current = getAuthHeaders
    onLoadedRef.current = onLoaded

    const headers = () => (authRef.current ? authRef.current() : {})

    const load = useCallback(async () => {
        try {
            const res = await fetch(`${host}/accommodation/my`, { headers: headers() })
            const data = await res.json().catch(() => ({}))
            const list = Array.isArray(data.requests) ? [...data.requests].sort(sortByNewest) : []
            setRequests(list.filter(isVisible))
            onLoadedRef.current?.(list)
        } catch (err) {
            console.error('Failed to load accommodation requests', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load, refreshKey])

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 30000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        if (!highlightId || loading) return
        document.getElementById(`acc-${highlightId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, [highlightId, loading])

    const pay = async (request) => {
        if (payingId) return
        setPayingId(request.id)
        try {
            await startAtomPayment({ domain: 'ACCOMMODATION', referenceId: request.id, authHeaders: headers() })
        } catch (err) {
            toast.error(err.message || 'Could not start the payment. Please try again.')
            load()
        } finally {
            setPayingId(null)
        }
    }

    const cancel = async (request) => {
        if (cancellingId) return
        if (!window.confirm('Cancel this accommodation request? Any allotted room will be released.')) return
        setCancellingId(request.id)
        try {
            const res = await fetch(`${host}/accommodation/cancel`, {
                method: 'POST',
                headers: { ...headers(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ request_id: request.id }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok || !data.success) throw new Error(data.message || 'Could not cancel the request.')
            toast.success('Request cancelled.')
            await load()
        } catch (err) {
            toast.error(err.message)
        } finally {
            setCancellingId(null)
        }
    }

    if (loading) return <Loader label="Loading your accommodation…" />
    if (requests.length === 0) return null

    return (
        <section className={styles.wrapper} aria-labelledby="my-accommodation-title">
            <h2 id="my-accommodation-title" className={styles.heading}>My accommodation</h2>
            <ul className={styles.list}>
                {requests.map((request) => {
                    const copy = request.refund_required && request.status !== 'CONFIRMED'
                        ? { label: 'Refund in progress', tone: 'action' }
                        : STATUS_COPY[request.status] || { label: request.status, tone: 'muted' }
                    const awaitingPayment = request.status === 'ALLOTTED_PENDING_PAYMENT'
                    const deadlinePassed = awaitingPayment && request.payment_deadline && new Date(request.payment_deadline).getTime() <= now
                    const canCancel = (request.status === 'REQUESTED' || awaitingPayment) && request.payment_status !== 'PAID'
                    const room = request.status === 'CONFIRMED' ? request.room : null

                    return (
                        <li
                            key={request.id}
                            id={`acc-${request.id}`}
                            className={`${styles.card} ${styles[copy.tone]} ${highlightId === request.id ? styles.highlight : ''}`}
                        >
                            <div className={styles.cardHead}>
                                <span className={styles.requestId}>{request.id}</span>
                                <span className={styles.status}>{copy.label}</span>
                            </div>

                            <dl className={styles.facts}>
                                {room?.room_number && (
                                    <div>
                                        <dt><BedDouble size={16} aria-hidden="true" /> Room</dt>
                                        <dd>{room.room_number}</dd>
                                    </div>
                                )}
                                {room?.address && (
                                    <div>
                                        <dt><MapPin size={16} aria-hidden="true" /> Location</dt>
                                        <dd>{room.address}</dd>
                                    </div>
                                )}
                                <div>
                                    <dt><CalendarDays size={16} aria-hidden="true" /> Stay</dt>
                                    <dd>{formatDate(request.from_date)} – {formatDate(request.to_date)}</dd>
                                </div>
                                <div>
                                    <dt><Users size={16} aria-hidden="true" /> Guests</dt>
                                    <dd>{request.group_members?.length || 1}</dd>
                                </div>
                                {awaitingPayment && request.payment_deadline && (
                                    <div>
                                        <dt><Clock size={16} aria-hidden="true" /> Pay by</dt>
                                        <dd>
                                            {formatDateTime(request.payment_deadline)}
                                            {!deadlinePassed && <span className={styles.countdown}>{timeLeft(request.payment_deadline, now)}</span>}
                                        </dd>
                                    </div>
                                )}
                            </dl>

                            {request.status === 'REQUESTED' && (
                                <p className={styles.note}>We have your request. You will get an email with a payment link as soon as a room is allotted.</p>
                            )}
                            {request.status === 'CONFIRMED' && (
                                <p className={styles.note}>Paid ₹{request.amount}. Show the confirmation email and a photo ID for every guest at the Accommodation Desk.</p>
                            )}
                            {awaitingPayment && (
                                <p className={styles.note}>A room has been allotted to you. Complete the payment before the deadline to confirm it; the room number and location appear here once payment is done.</p>
                            )}
                            {request.refund_required && (
                                <p className={styles.warning}>Your payment arrived after the room was released. Our team will process a refund; write to dev.anweshaiitp@gmail.com with {request.id} if you need help.</p>
                            )}

                            {(awaitingPayment || canCancel) && (
                                <div className={styles.actions}>
                                    {awaitingPayment && (
                                        <button
                                            type="button"
                                            className={styles.payButton}
                                            onClick={() => pay(request)}
                                            disabled={Boolean(payingId) || deadlinePassed}
                                        >
                                            <ButtonLoader loading={payingId === request.id} label="Opening payment">
                                                {deadlinePassed ? 'Payment window closed' : `Pay ₹${request.amount}`}
                                            </ButtonLoader>
                                        </button>
                                    )}
                                    {canCancel && (
                                        <button
                                            type="button"
                                            className={styles.cancelButton}
                                            onClick={() => cancel(request)}
                                            disabled={Boolean(cancellingId)}
                                        >
                                            <ButtonLoader loading={cancellingId === request.id} label="Cancelling">
                                                Cancel request
                                            </ButtonLoader>
                                        </button>
                                    )}
                                </div>
                            )}
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}

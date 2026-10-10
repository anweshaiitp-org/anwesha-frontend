import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { AuthContext } from '../../components/authContext'
import { soloEventRegistrationNew } from '../../components/Event Registration/soloEventRegistration'
import { ToastContainer, toast } from 'react-toastify'
import modalStyles from '../../components/BigModal/Modal.module.css'
import styles from '../../styles/event-details.module.css'

const EventDetailsPage = () => {
    const router = useRouter()
    const { eventId } = router.query
    const userData = useContext(AuthContext)
    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)

    const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'
    const mediaBase = process.env.NEXT_PUBLIC_MEDIA_BASE || host

    const makePosterUrl = (url) => {
        if (!url) return '/events/poster.png'
        if (url.startsWith('http://') || url.startsWith('https://')) return url
        const base = (mediaBase || '').replace(/\/$/, '')
        const path = url.startsWith('/') ? url : `/${url}`
        return `${base}${path}`
    }

    useEffect(() => {
        if (!eventId) return
        
        const fetchEvent = async () => {
            try {
                // First try to fetch all events and find the specific one
                const res = await fetch(`${host}/events`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })
                const data = await res.json()
                const eventsArray = Array.isArray(data) ? data : (data.events || [])
                let foundEvent = eventsArray.find(e => e.id === eventId || e._id === eventId)
                
                if (!foundEvent) {
                    // Try special events
                    const specialRes = await fetch(`${host}/events/special`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    })
                    const specialData = await specialRes.json()
                    const specialList = Array.isArray(specialData) ? specialData : (specialData.events || specialData.special_events || specialData.specialEvents || specialData.data || [])
                    foundEvent = specialList.find(e => e.id === eventId || e._id === eventId)
                }

                if (!foundEvent) {
                    // Try single event endpoint directly
                    const singleRes = await fetch(`${host}/events/${eventId}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    })
                    if (singleRes.ok) {
                        const singleData = await singleRes.json()
                        foundEvent = singleData.event || singleData.data || singleData
                    }
                }

                if (foundEvent) {
                    setEvent({
                        ...foundEvent,
                        poster: makePosterUrl(foundEvent.poster_file || foundEvent.poster || foundEvent.poster_url),
                        name: foundEvent.name || foundEvent["Event Name"] || '',
                    })
                }
            } catch (e) {
                console.error('Failed to fetch event', e)
            } finally {
                setLoading(false)
            }
        }
        
        fetchEvent()
    }, [eventId, host])

    const [isRegistering, setIsRegistering] = useState(false)
    const [registrationResult, setRegistrationResult] = useState(null)

    async function handleRagister() {
        if (isRegistering) return

        if (userData.isAuth) {
            setIsRegistering(true)
            try {
                if (event.is_active !== false) {
                    const isSolo = event.is_solo || (event.max_team_size === 1 && event.min_team_size === 1) || event.max_team_size === 1;
                    if (isSolo) {
                        const result = await soloEventRegistrationNew(
                            event.id || event._id,
                            router,
                            () => {} // closeHandler equivalent
                        )
                        if (result) {
                            setRegistrationResult(result)
                        }
                    } else {
                        await router.push({
                            pathname: `/event-registration/${event.id || event._id}`,
                            query: {
                                id: event.id || event._id,
                                name: event.name,
                                description: event.description,
                                max_team_size: event.max_team_size,
                                min_team_size: event.min_team_size,
                                registration_fee: event.registration_fee,
                                user_type: userData.state?.user?.user_type || '',
                                tags: event.tags,
                            },
                        })
                    }
                } else {
                    toast.info('Registration Closed !')
                }
            } catch (error) {
                console.error(error)
                toast.error('Something went wrong')
            } finally {
                setIsRegistering(false)
            }
        } else {
            router.push('/userLogin')
        }
    }

    if (loading) {
        return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px', fontSize: '24px' }}>Loading...</div>
    }

    if (!event) {
        return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px', fontSize: '24px' }}>Event not found</div>
    }

    let description = (event.description || '').replace(/\\n/g, '<br />');
    const title = (event.name || '').split('#')[0]

    return (
        <React.StrictMode>
            <Head>
                <title>{title} - Anwesha 2027</title>
            </Head>
            <div className={styles.eventPage}>
                <div className={styles.eventShell}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <p className={styles.eyebrow}>ANWESHA 2027 · EVENT DETAILS</p>
                            <h1 className={styles.eventTitle}>{title}</h1>
                        </div>
                    </div>
                    <hr style={{ borderColor: '#333', marginBottom: '40px' }} />

                    {registrationResult && (
                        <div className={modalStyles.registration_success} style={{ backgroundColor: '#2a2a2a', padding: '24px', borderRadius: '10px', marginBottom: '30px' }}>
                            {registrationResult.payment_required || (registrationResult.payment_status && registrationResult.payment_status.toUpperCase() === 'PENDING') ? (
                                <>
                                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#e67e22', marginBottom: '12px' }}>
                                        Complete payment to complete registration
                                    </div>
                                    <div style={{ fontSize: '15px', lineHeight: '1.8', color: '#eee' }}>
                                        {registrationResult.amount_due !== undefined && registrationResult.amount_due !== null && registrationResult.amount_due > 0 && (
                                            <div><strong>Amount Due:</strong> ₹{registrationResult.amount_due}</div>
                                        )}
                                        <p style={{ marginTop: '8px', color: '#aaa' }}>
                                            Please complete the payment to confirm your registration. You can also complete payment anytime from your profile.
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                        <button
                                            style={{ padding: '10px 20px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                                            onClick={() => router.push('/profile')}
                                        >
                                            Go to Profile
                                        </button>
                                        <button
                                            style={{ padding: '10px 20px', background: '#444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                                            onClick={() => setRegistrationResult(null)}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{ fontSize: '22px', fontWeight: '600', color: '#0a7c42', marginBottom: '12px' }}>
                                        ✓ Successfully Registered
                                    </div>
                                    <div style={{ fontSize: '15px', lineHeight: '1.8', color: '#eee' }}>
                                        <p>You have successfully registered for {title || 'this event'}!</p>
                                    </div>
                                    <button
                                        style={{ marginTop: '20px', padding: '10px 20px', background: '#0a7c42', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                                        onClick={() => setRegistrationResult(null)}
                                    >
                                        Close
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {!registrationResult && (
                        <div className={styles.eventBody}>
                            <div className={styles.eventMedia}>
                                <img
                                    src={event.poster || '/events/poster.png'}
                                    alt={title}
                                    className={styles.poster}
                                />
                                {event.video && (
                                    <a
                                        className={styles.rulebook}
                                        target="_blank"
                                        rel="noreferrer"
                                        href={event.video}
                                    >
                                        Rulebook
                                    </a>
                                )}
                                <button
                                    className={styles.registerButton}
                                    onClick={handleRagister}
                                    disabled={isRegistering}
                                >
                                    {isRegistering ? 'Processing...' : 'Register'}
                                </button>
                            </div>
                            
                            <div className={styles.eventInfo}>
                                <div className={styles.facts}>
                                    {(event.start_time && event.end_time) ? (
                                        <p style={{ margin: '5px 0' }}><strong>Date:</strong> {new Date(event.start_time).toLocaleDateString()} - {new Date(event.end_time).toLocaleDateString()}</p>
                                    ) : event.Date ? (
                                        <p style={{ margin: '5px 0' }}><strong>Date:</strong> {event.Date}</p>
                                    ) : null}
                                    
                                    {event.Time && <p style={{ margin: '5px 0' }}><strong>Time:</strong> {event.Time}</p>}
                                    {(event.venue || event.Venue) && <p style={{ margin: '5px 0' }}><strong>Venue:</strong> {event.venue || event.Venue}</p>}
                                    
                                    {event.max_team_size && (
                                        <p style={{ margin: '5px 0' }}>
                                            <strong>Team Size:</strong> {event.max_team_size === 1 
                                                ? 'Individual' 
                                                : event.min_team_size === event.max_team_size 
                                                    ? `${event.min_team_size} members` 
                                                    : `${event.min_team_size} - ${event.max_team_size} members`}
                                        </p>
                                    )}
                                    
                                    {event.registration_fee ? (
                                        <p style={{ margin: '5px 0' }}><strong>Registration Fee:</strong> ₹{event.registration_fee}</p>
                                    ) : null}
                                    
                                    {event.registration_deadline ? (
                                        <p style={{ margin: '5px 0' }}>
                                            <strong>Registration Deadline:</strong> {new Date(event.registration_deadline).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    ) : null}

                                    {event.prize && <p style={{ margin: '5px 0' }}><strong>Prizes worth:</strong> ₹{event.prize}</p>}
                                </div>

                                <h2>Description</h2>
                                <p dangerouslySetInnerHTML={{ __html: description }} style={{ lineHeight: '1.6', fontSize: '16px', color: '#ddd' }} />

                                {event.organizer && (
                                    <div style={{ marginTop: '30px' }}>
                                        <h3>Organizers / Contact</h3>
                                        {Array.isArray(event.organizer) ? (
                                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                                {event.organizer.map((e, index) => (
                                                    <li key={index} style={{ marginBottom: '10px' }}>
                                                        <span style={{ fontWeight: 'bold' }}>{e[0]}</span>
                                                        {e[1] && <span style={{ marginLeft: '10px' }}><a href={`tel:${e[1]}`} style={{ color: '#aaa', textDecoration: 'none' }}>{e[1]}</a></span>}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>{event.organizer}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <ToastContainer />
            </div>
        </React.StrictMode>
    )
}

export default EventDetailsPage

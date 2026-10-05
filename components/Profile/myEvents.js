import React, { useState, useEffect, useContext } from 'react'
import styles from './profile.module.css'
import { AuthContext } from '../authContext'

const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'

function MyEvents() {
    const [events, setEvents] = useState({ solo: [], team: [] })
    const [passes, setPasses] = useState([])
    const userData = useContext(AuthContext)
    const authHeaders = userData?.getAuthHeaders ? userData.getAuthHeaders() : {}
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
                if (!userData.state?.user?.anwesha_id) {
                    console.warn('[MyEvents] No anwesha_id available')
                    return
                }

                // Use new unified registrations endpoint
                const response = await fetch(`${host}/user/registrations/`, {
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

                // Map response to events and passes state
                const soloEvents = (data.solo_registrations || []).map((reg) => ({
                    event_id: reg.event_id,
                    event_name: reg.event_name,
                    event_venue: reg.event_category,
                    registration_fee: reg.registration_fee,
                    payment_done: reg.payment_done,
                    event_start_time: reg.event_start_time,
                    event_end_time: reg.event_end_time,
                    payment_url: reg.payment_url,
                }))

                const teamEvents = (data.team_registrations || []).map((reg) => ({
                    team_id: reg.team_id,
                    team_name: reg.team_name,
                    event_id: reg.event_id,
                    event_name: reg.event_name,
                    event_venue: reg.event_category,
                    registration_fee: reg.registration_fee,
                    payment_done: reg.payment_done,
                    event_start_time: reg.event_start_time,
                    event_end_time: reg.event_end_time,
                    payment_url: reg.payment_url,
                    is_leader: reg.is_leader,
                    team_members: reg.team_members || [],
                }))

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
                fetchEventMyEventsOldEndpoint()
            }
        }

        if (userData.state?.user?.anwesha_id) {
            fetchUserRegistrations()
        }
    }, [userData.state?.user?.anwesha_id])

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
            {!events.solo ||
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
                    {events.team.map((e, key) => {
                        return (
                            e.payment_done && (
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
                                        <div>
                                            Team : {e.team_name}
                                        </div>
                                        {e.team_members && e.team_members.length > 0 && (
                                            <div style={{ fontSize: '0.9rem', marginTop: '8px', color: '#ccc' }}>
                                                <strong>Team Members (Anwesha IDs):</strong>
                                                <div style={{ marginTop: '4px', paddingLeft: '10px' }}>
                                                    {e.team_members.map((member, idx) => (
                                                        <div key={idx}>
                                                            {member.anwesha_id || member}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        )
                    })}
                </div>
            ) : null}

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

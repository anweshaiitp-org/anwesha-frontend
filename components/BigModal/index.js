// simple react modal component
import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../authContext'
import {
    soloEventRegistration,
    soloEventRegistrationNew,
} from '../Event Registration/soloEventRegistration'
import { ToastContainer, toast } from 'react-toastify'
import styles from './Modal.module.css'
import { useRouter } from 'next/router'
import Image from 'next/image'

const Modal = (props) => {
    const router = useRouter()
    const userData = useContext(AuthContext)

    const [isRegistering, setIsRegistering] = useState(false)
    const [registrationResult, setRegistrationResult] = useState(null)

    async function handleRagister() {
        if (isRegistering) return // prevent double-click

        if (userData.isAuth) {
            setIsRegistering(true)
            try {
                if (props.body.is_active !== false) {
                    if (props.body.max_team_size === 1) {
                        // Use the new unified registration endpoint
                        const result = await soloEventRegistrationNew(
                            props.body.id,
                            router,
                            props.closeHandler
                        )
                        if (result) {
                            setRegistrationResult(result)
                        }
                    } else {
                        // Team event — navigate to team registration form
                        await router.push({
                            pathname: `/event-registration/${[props.body.id]}`,
                            query: {
                                id: props.body.id,
                                name: props.body.name,
                                description: props.body.description,
                                max_team_size: props.body.max_team_size,
                                min_team_size: props.body.min_team_size,
                                registration_fee: props.body.registration_fee,
                                user_type: userData.state?.user?.user_type || '',
                                tags: props.body.tags,
                            },
                        })
                    }
                } else {
                    toast.info('Registration Closed !', {
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
            } catch (error) {
                console.error(error)
                toast.error('Something went wrong', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                })
            } finally {
                setIsRegistering(false)
            }
        } else {
            router.push('/userLogin')
        }
    }


    let description = (props.body.description || '').replace(/\\n/g, '<br />');
    return (
        <React.StrictMode>
            <div
                id="backdrop"
                className={styles.modal}
                onClick={() => props.closeHandler()}
            >
                <div
                    className={styles.modalContent}
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                >
                    <div className={styles.modal_head}>
                        <h1>{props.title}</h1>
                        {/* <hr style={{height:'10px', color:'black'}}/> */}
                        <Image
                            src="/events/close.svg"
                            alt="Closebtn"
                            height={40}
                            width={40}
                            onClick={() => props.closeHandler()}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                    <hr
                        style={{
                            width: '100%',
                            height: '2px',
                            marginBottom: '35px',
                        }}
                    />

                    {/* Registration success result overlay */}
                    {registrationResult && (
                        <div className={styles.registration_success}>
                            <div style={{
                                fontSize: '22px',
                                fontWeight: '600',
                                color: '#0a7c42',
                                marginBottom: '12px',
                            }}>
                                ✓ Registered Successfully
                            </div>
                            <div style={{
                                fontSize: '16px',
                                lineHeight: '1.8',
                                color: '#010031',
                            }}>
                                {registrationResult.registration_id && (
                                    <div><strong>Registration ID:</strong> {registrationResult.registration_id}</div>
                                )}
                                {registrationResult.payment_status && (
                                    <div><strong>Payment Status:</strong> {registrationResult.payment_status}</div>
                                )}
                                {registrationResult.amount_due !== undefined && registrationResult.amount_due !== null && (
                                    <div><strong>Amount Due:</strong> ₹{registrationResult.amount_due}</div>
                                )}
                            </div>
                            <button
                                className={styles.btn}
                                style={{ marginTop: '20px', maxWidth: '200px' }}
                                onClick={() => {
                                    setRegistrationResult(null)
                                    props.closeHandler()
                                }}
                            >
                                Close
                            </button>
                        </div>
                    )}

                    {!registrationResult && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            columnGap: '30px',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                            overflowY: 'scroll',
                            paddingBottom: '50px',
                        }}
                    >
                        <div className={styles.leftColumn}>
                            <img
                                src={
                                    props.body.poster
                                        ? props.body.poster
                                        : '/events/poster.png'
                                }
                                alt="Fest Image"
                                width={220}
                                height={220}
                                style={{ borderRadius: '15px' }}
                            />
                            {/* <div className={styles.modal_footer}> */}
                            {props.body.video ? (
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    className={styles.btn}
                                    id={styles.rulebtn}
                                    href={props.body.video}
                                // onClick={(e) => props.closeHandler()}
                                >
                                    Rulebook
                                </a>
                            ) : null}
                            <button
                                className={styles.btn}
                                onClick={handleRagister}
                                disabled={isRegistering}
                            >
                                {isRegistering ? 'Processing...' : 'Register'}
                            </button>
                            {/* </div> */}
                        </div>
                        <div className={styles.modal_body}>
                            <div className={styles.date_venue}>
                                {/* Display Date - handle both API format (start_time/end_time) and JSON format (Date) */}
                                {(props.body.start_time && props.body.end_time) ? (
                                    <>
                                        <span className={styles.date_text}>Date:</span>
                                        <span className={styles.date_value}>
                                            {props.body.start_time.substring(5, 7) !==
                                                props.body.end_time.substring(5, 7) ? (
                                                <>
                                                    {' '}
                                                    {new Date(
                                                        props.body.start_time
                                                    ).toLocaleString('default', {
                                                        day: 'numeric',
                                                    })}{' '}
                                                    {new Date(
                                                        props.body.start_time
                                                    ).toLocaleString('default', {
                                                        month: 'long',
                                                    })}
                                                    {' - '}
                                                </>
                                            ) : (
                                                <>
                                                    {props.body.start_time.substring(
                                                        8,
                                                        10
                                                    ) !==
                                                        props.body.end_time.substring(
                                                            8,
                                                            10
                                                        ) ? (
                                                        <>
                                                            {new Date(
                                                                props.body.start_time
                                                            ).toLocaleString(
                                                                'default',
                                                                {
                                                                    day: 'numeric',
                                                                }
                                                            )}
                                                            {' - '}
                                                        </>
                                                    ) : null}
                                                </>
                                            )}
                                            {new Date(
                                                props.body.end_time
                                            ).toLocaleString('default', {
                                                day: 'numeric',
                                            })}{' '}
                                            {new Date(
                                                props.body.end_time
                                            ).toLocaleString('default', {
                                                month: 'long',
                                            })}
                                        </span>
                                        <br />
                                    </>
                                ) : props.body.Date ? (
                                    <>
                                        <span className={styles.date_text}>Date:</span>
                                        <span className={styles.date_value}>
                                            {props.body.Date}
                                        </span>
                                        <br />
                                    </>
                                ) : null}

                                {/* Display Time if available */}
                                {props.body.Time && (
                                    <>
                                        <span className={styles.date_text}>Time:</span>
                                        <span className={styles.date_value}>
                                            {props.body.Time}
                                        </span>
                                        <br />
                                    </>
                                )}

                                {/* Display Venue */}
                                {(props.body.venue || props.body.Venue) && (
                                    <>
                                        <span className={styles.date_text}>Venue:</span>
                                        <span className={styles.date_value}>
                                            {props.body.venue || props.body.Venue}
                                        </span>
                                    </>
                                )}
                            </div>
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: description,
                                }}
                                className={styles.description}
                            />
                            <div className={styles.team_pay}>
                                {props.body.max_team_size ? (
                                    <div style={{ fontWeight: '600' }}>
                                        {/* <img src="/assets/team.svg" /> */}
                                        {props.body.max_team_size === 1
                                            ? 'Individual Participation'
                                            : props.body.min_team_size ===
                                                props.body.max_team_size
                                                ? props.body.min_team_size + ' members'
                                                : props.body.min_team_size +
                                                ' - ' +
                                                props.body.max_team_size +
                                                ' members'}
                                    </div>
                                ) : null}
                                {props.body.registration_fee ? (
                                    !userData.isAuth ||
                                        !userData.state?.user ||
                                        userData.state.user.user_type !==
                                        'iitp_student' ||
                                        props.body.id == 'EVT68cb3' ||
                                        props.body.id == 'EVT49870' ? (
                                        <p>
                                            Registration Fee&nbsp;
                                            {/* <img src="/assets/payment.svg" /> */}
                                            <span style={{ fontWeight: '600' }}>
                                                ₹{props.body.registration_fee}
                                            </span>
                                        </p>
                                    ) : null
                                ) : null}
                            </div>
                            {props.body.registration_deadline ? (
                                <div
                                    className={styles.team_pay}
                                // style={{ flexDirection: 'row' }}
                                >
                                    <p>
                                        {/* <img src="/assets/alert.svg" /> */}
                                        Registration closes on&nbsp;
                                        <span style={{ fontWeight: '600' }}>
                                            {new Date(
                                                props.body.registration_deadline
                                            ).toDateString('default', {
                                                day: 'numeric',
                                                month: 'long',
                                            })}
                                        </span>
                                    </p>
                                </div>
                            ) : null}
                            {props.body.end_time && ((props.body.venue && props.body.venue.toLowerCase() === 'online') || (props.body.Venue && props.body.Venue.toLowerCase() === 'online')) ? (
                                <div
                                    className={styles.team_pay}
                                // style={{ flexDirection: 'row' }}
                                >
                                    <p>
                                        {/* <img src="/assets/alert.svg" /> */}
                                        Submission deadline&nbsp;
                                        <span style={{ fontWeight: '600' }}>
                                            {new Date(
                                                props.body.end_time
                                            ).toDateString('default', {
                                                day: 'numeric',
                                                month: 'long',
                                            })}
                                        </span>
                                    </p>
                                </div>
                            ) : null}
                            {props.body.prize ? (
                                <div
                                    className={styles.team_pay}
                                    style={{ flexDirection: 'row' }}
                                >
                                    {/* <img src="/assets/prize.svg" /> */}
                                    Prizes worth: &nbsp;
                                    <span style={{ fontWeight: '600' }}>
                                        {' '}
                                        ₹{props.body.prize}!
                                    </span>
                                </div>
                            ) : null}
                            <div className={styles.contacts}>
                                {/* <img src="/assets/contact.svg" />    */}
                                {Array.isArray(props.body.organizer) ? (
                                    <div
                                        className={styles.team_pay}
                                        style={{ flexDirection: 'column' }}
                                    >
                                        {props.body.tags == '5'
                                            ? 'POC'
                                            : 'Organizers'}
                                        {props.body.organizer.map(
                                            (e, index) => {
                                                return (
                                                    <a
                                                        key={index}
                                                        style={
                                                            e[1]
                                                                ? null
                                                                : {
                                                                    pointerEvents:
                                                                        'none',
                                                                }
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        href={
                                                            e[1]
                                                                ? `tel:${e[1]}`
                                                                : '#'
                                                        }
                                                    >
                                                        <span
                                                            style={{
                                                                fontWeight:
                                                                    '600',
                                                            }}
                                                        >
                                                            {e[0]}
                                                        </span>
                                                        &nbsp;
                                                        {e[1] ? (
                                                            <span
                                                                style={{
                                                                    fontWeight:
                                                                        '600',
                                                                }}
                                                            >
                                                                {/* <img
                                                                    alt="phone"
                                                                    src="/footer/phone.svg"
                                                                /> */}
                                                                {e[1]}
                                                            </span>
                                                        ) : null}
                                                    </a>
                                                )
                                            }
                                        )}
                                    </div>
                                ) : (
                                    <div className={styles.contact}>
                                        {props.body.organizer}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </React.StrictMode>
    )
}

export default Modal

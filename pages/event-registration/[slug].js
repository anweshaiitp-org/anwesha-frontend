import { setRequestMeta } from 'next/dist/server/request-meta'
import React, { useState, useEffect, useContext } from 'react'
import {
    teamEventRegistrationNew,
} from '../../components/Event Registration/teamEventRegistration'
import styles from '../../styles/EventRegistration.module.css'
import { AuthContext } from '../../components/authContext'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
 


const EventRegistration = () => {
    const data = useContext(AuthContext)
    const router = useRouter()
    const userData = useContext(AuthContext)

    const {
        id,
        name,
        description,
        max_team_size,
        min_team_size,
        registration_fee,
        tags,
    } = router.query

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isSubmitting) return // prevent double submission

        setIsSubmitting(true)
        try {
            // Always use the new unified registration endpoint
            await teamEventRegistrationNew(
                id,
                teamName,
                memberID,
                router
            )
        } catch (error) {
            console.error('[EventRegistration] Submit error:', error)
            toast.error('Something went wrong. Please try again.', {
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
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        const anwID = data.state.user ? data.state.user.anwesha_id : ''
        var arr = []
        for (let i = 0; i < min_team_size; i++) {
            arr.push('')
        }
        arr[0] = anwID
        setMemberID(arr)
        if (!data.isAuth) {
            router.push(`/userLogin?callbackUrl=${encodeURIComponent(router.asPath)}`)
        }
    }, [data])

    const [teamName, setTeamName] = useState('')
    const [memberID, setMemberID] = useState([])

    const cn = (...classes) => {
        return classes.filter(Boolean).join(' ');
    }

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.effectcontainer}>
                    <div className={styles.content}>
                        {/* <h1 className={styles.mainHeading}>Registration</h1> */}
                        <form className={styles.mainForm} onSubmit={handleSubmit}>
                            <motion.div
                                initial={{ opacity: 0, x: '-100%' }}
                                whileInView={{ opacity: 1, x: '0%' }}
                                transition={{ duration: 1 }}
                            >
                                {/* <h2 className={styles.subHeading}>Team Details</h2> */}
                                <h2>{(name?.split('#')[0]) ?? 'DefaultName'}</h2>
                                <br />
                                {/* <div className={styles.form_row}>
                                <div className={styles.field}>
                                    <label htmlFor="Event_Name">
                                        Event Name
                                    </label>
                                    <br />
                                    <input
                                        type="text"
                                        name="Event_Name"
                                        // placeholder='Dance Event'
                                        readOnly
                                        value={name}
                                    />
                                    <br />
                                </div>
                            </div> */}
                                <div className={styles.form_row}>
                                    <div className={styles.field}>
                                        <label htmlFor="Teams_Name">
                                            Team Name
                                        </label>
                                        <br />
                                        <input
                                            type="text"
                                            name="Teams_Name"
                                            placeholder="Eg: Pwolians"
                                            required
                                            value={teamName}
                                            onChange={(e) =>
                                                setTeamName(e.target.value)
                                            }
                                        />
                                        <br />
                                    </div>
                                </div>
                                <div
                                    className={styles.members}
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        width: '100%',
                                    }}
                                >
                                    {memberID.map((item, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={styles.member_input}
                                            >
                                                <span>{index + 1}</span>
                                                <div>ANW</div>
                                                <input
                                                    type="text"
                                                    name="Team_Member"
                                                    // required
                                                    value={item.substring(3)}
                                                    readOnly={!index}
                                                    onChange={(e) => {
                                                        let arr = [...memberID]
                                                        arr[index] =
                                                            'ANW' + e.target.value
                                                        setMemberID([...arr])
                                                    }}
                                                    // key={index + 1}
                                                    required
                                                    minLength={4}
                                                    maxLength={4}
                                                />
                                                {index >= min_team_size ? (
                                                    <img
                                                        src="/assets/remove.svg"
                                                        onClick={() => {
                                                            let arr = memberID
                                                            arr.splice(index, 1)
                                                            setMemberID([...arr])
                                                        }}
                                                    />
                                                ) : null}
                                            </div>
                                        )
                                    })}
                                </div>
                                {memberID.length < max_team_size ? (
                                    <button
                                        className={styles.add_member_btn}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setMemberID([...memberID, ''])
                                        }}
                                    >
                                        <img src="/assets/plus.svg" />
                                        Add Team Member
                                    </button>
                                ) : null}
                                <br />
                                <div className={styles.register_btn_box}>
                                    <button
                                        className={cn(styles.register_button, styles.register_button_small)}
                                        type='submit'
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'REGISTERING...' : 'REGISTER'}
                                    </button>
                                </div>
                            </motion.div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default EventRegistration

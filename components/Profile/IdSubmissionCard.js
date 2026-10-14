import { useState } from 'react'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { BadgeCheck, Clock, Contact, FileWarning } from 'lucide-react'
import { ButtonLoader } from '../Loader'
import styles from './IdSubmissionCard.module.css'

const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'

const CONTENT = {
    REQUESTED: {
        Icon: Contact,
        tone: 'action',
        title: 'Submit your ID documents',
        message: 'Your registration is confirmed. Upload your college ID and Aadhaar card to complete verification and get entry at the fest.',
        button: 'Submit documents',
    },
    REJECTED: {
        Icon: FileWarning,
        tone: 'warning',
        title: 'Your documents need another look',
        message: 'We could not verify the documents you uploaded. Please upload clear copies of your college ID and Aadhaar card again.',
        button: 'Re-upload documents',
    },
    UPLOADED: {
        Icon: Clock,
        tone: 'info',
        title: 'Documents under review',
        message: 'Thanks! Your college ID and Aadhaar card have been received. We will email you once they are verified.',
    },
    VERIFIED: {
        Icon: BadgeCheck,
        tone: 'success',
        title: 'ID verified',
        message: 'Your identity documents have been verified.',
    },
}

export default function IdSubmissionCard({ status, getAuthHeaders }) {
    const router = useRouter()
    const [opening, setOpening] = useState(false)
    const content = CONTENT[status]

    if (!content) return null

    const openSubmissionLink = async () => {
        if (opening) return
        setOpening(true)
        try {
            const res = await fetch(`${host}/users/id-card/link`, {
                headers: getAuthHeaders ? getAuthHeaders() : {},
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Could not open the submission page.')
            }
            if (!data.can_submit || !data.link) {
                toast.info('Your documents have already been submitted.')
                return
            }
            await router.push(data.link)
        } catch (err) {
            toast.error(err.message || 'Could not open the submission page. Please try again.')
        } finally {
            setOpening(false)
        }
    }

    const { Icon } = content

    return (
        <section className={`${styles.card} ${styles[content.tone]}`} aria-live="polite">
            <span className={styles.icon} aria-hidden="true">
                <Icon size={24} />
            </span>
            <div className={styles.body}>
                <h3 className={styles.title}>{content.title}</h3>
                <p className={styles.message}>{content.message}</p>
            </div>
            {content.button && (
                <button
                    type="button"
                    className={styles.button}
                    onClick={openSubmissionLink}
                    disabled={opening}
                >
                    <ButtonLoader loading={opening} label="Opening">
                        {content.button}
                    </ButtonLoader>
                </button>
            )}
        </section>
    )
}

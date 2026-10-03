import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../styles/ticket.module.css'
import TicketView from '../components/TicketView'

const host = process.env.NEXT_PUBLIC_HOST

function TicketPage() {
    const router = useRouter()
    const { token } = router.query

    const [ticketData, setTicketData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!token) return

        const resolveTicket = async () => {
            try {
                setLoading(true)
                setError(null)

                const response = await fetch(
                    `${host}/users/ticket/resolve?token=${encodeURIComponent(token)}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )

                const data = await response.json()

                if (!response.ok) {
                    setError(data.message || 'Failed to resolve ticket')
                    return
                }

                setTicketData(data.data || data)
            } catch (err) {
                console.error('[Ticket] Error resolving ticket:', err)
                setError('Unable to verify ticket. Please try again.')
            } finally {
                setLoading(false)
            }
        }

        resolveTicket()
    }, [token])

    return (
        <>
            <Head>
                <title>Ticket | Anwesha 2k27</title>
                <meta name="description" content="Anwesha 2k27 Entry Ticket" />
            </Head>

            <div className={styles.ticketContainer}>
                <div className={styles.ticketCard}>
                    {loading && token && (
                        <div className={styles.ticketLoading}>
                            <div className={styles.spinner}></div>
                            <p>Verifying ticket...</p>
                        </div>
                    )}

                    {!token && !loading && (
                        <div className={styles.ticketError}>
                            <div className={styles.ticketErrorIcon}>⚠️</div>
                            <p>No ticket token provided.</p>
                        </div>
                    )}

                    {error && (
                        <div className={styles.ticketError}>
                            <div className={styles.ticketErrorIcon}>❌</div>
                            <p>{error}</p>
                        </div>
                    )}

                    {ticketData && !loading && !error && (
                        <>
                            <TicketView
                                name={ticketData.name || 'Ticket holder'}
                                anweshaId={ticketData.anwesha_id || ticketData.anweshaId || 'N/A'}
                                college={ticketData.college}
                                ticketType={ticketData.ticket_type || ticketData.ticketType}
                                qrToken={token}
                            />
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default TicketPage

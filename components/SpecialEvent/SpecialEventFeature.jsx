import React from 'react'
import styles from '../../styles/homepage.module.css'
import { motion, useReducedMotion } from 'framer-motion'

const dmSerif = { className: 'font-dm-serif' }
const GOLD = '#F2BF51'

const cn = (...classes) => classes.filter(Boolean).join(' ')

const css = `
.se-section {
    position: relative;
    z-index: 10;
    width: 100%;
    box-sizing: border-box;
    padding: clamp(64px, 9vw, 120px) clamp(20px, 5vw, 48px);
    display: flex;
    justify-content: center;
    overflow: hidden;
}

.se-grid {
    width: 100%;
    max-width: 1080px;
    display: grid;
    grid-template-columns: minmax(0, 380px) minmax(0, 1fr);
    gap: clamp(36px, 7vw, 96px);
    align-items: center;
}

/* ---------- poster ---------- */
.se-poster-wrap {
    position: relative;
    width: 100%;
    max-width: 380px;
    justify-self: center;
}

/* offset gold plate behind the poster, gives depth without a box */
.se-poster-wrap::before {
    content: '';
    position: absolute;
    inset: 0;
    transform: translate(16px, 16px);
    border-radius: 16px;
    background: linear-gradient(145deg, rgba(242, 191, 81, 0.55), rgba(242, 191, 81, 0.04) 65%);
    z-index: 0;
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.se-poster {
    position: relative;
    z-index: 1;
    display: block;
    width: 100%;
    aspect-ratio: 4 / 5;
    padding: 0;
    border: 0;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    background-color: #0b0b0e;
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.75), 0 0 80px rgba(242, 191, 81, 0.12);
    transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.se-poster-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.se-poster-wrap:hover .se-poster {
    transform: translate(-4px, -4px);
}
.se-poster-wrap:hover::before {
    transform: translate(22px, 22px);
}

.se-poster:focus-visible,
.se-cta-row button:focus-visible {
    outline: 2px solid ${GOLD};
    outline-offset: 4px;
}

/* ---------- copy ---------- */
.se-title {
    font-size: clamp(38px, 5.4vw, 72px);
    line-height: 1.04;
    letter-spacing: -0.01em;
    color: #ffffff;
    margin: 0;
    font-weight: 400;
    text-wrap: balance;
}

.se-subtitle {
    font-family: 'DM Serif Display', serif;
    font-style: italic;
    font-size: clamp(20px, 2.2vw, 28px);
    color: ${GOLD};
    margin: 14px 0 0;
    font-weight: 400;
}

.se-rule {
    width: 72px;
    height: 2px;
    margin: 28px 0;
    border: 0;
    background: linear-gradient(90deg, ${GOLD}, transparent);
}

.se-desc {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(19px, 1.7vw, 22px);
    line-height: 1.7;
    color: #e6e2d8;
    max-width: 48ch;
    margin: 0 0 24px;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.se-desc p {
    margin: 0 0 8px;
    font-size: inherit;
    line-height: inherit;
    color: #e6e2d8;
}

.se-desc p:last-child {
    margin-bottom: 0;
}

.se-desc a {
    color: ${GOLD};
    text-decoration: underline;
}

.se-desc strong, .se-desc b {
    color: #ffffff;
    font-weight: 700;
}

.se-meta {
    list-style: none;
    margin: 0 0 32px;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 10px 32px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 19px;
    color: rgba(255, 255, 255, 0.78);
}

.se-meta li {
    display: flex;
    align-items: center;
    gap: 10px;
}

.se-meta svg {
    color: ${GOLD};
    flex: none;
}

.se-cta-row {
    display: flex;
    align-items: center;
    gap: 22px;
    flex-wrap: wrap;
}

@media (max-width: 860px) {
    .se-grid {
        grid-template-columns: 1fr;
        gap: 56px;
        text-align: center;
    }
    .se-poster-wrap {
        max-width: 320px;
    }
    .se-rule {
        margin-left: auto;
        margin-right: auto;
        background: linear-gradient(90deg, transparent, ${GOLD}, transparent);
    }
    .se-desc {
        margin-left: auto;
        margin-right: auto;
    }
    .se-meta,
    .se-cta-row {
        justify-content: center;
    }
}

@media (prefers-reduced-motion: reduce) {
    .se-poster,
    .se-poster-wrap::before {
        transition: none;
    }
}
`

const iconProps = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
}

const CalendarIcon = () => (
    <svg {...iconProps}>
        <rect x="3.5" y="5" width="17" height="15" rx="2" />
        <path d="M3.5 10h17M8 3v4M16 3v4" />
    </svg>
)

const PinIcon = () => (
    <svg {...iconProps}>
        <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.5" />
    </svg>
)

/**
 * Props
 *  - event:    the special event object from the API (only one is shown)
 *  - posterUrl: optional, already-resolved poster URL
 *  - onOpen:   optional, called instead of opening /events/:id
 */
export default function SpecialEventFeature({ event, posterUrl, onOpen }) {
    const reduce = useReducedMotion()

    const initialPoster =
        posterUrl ||
        event?.poster_url ||
        event?.poster_file ||
        event?.poster ||
        '/events/poster.png'

    const [posterSrc, setPosterSrc] = React.useState(initialPoster)

    React.useEffect(() => {
        if (!event) return
        const raw = posterUrl || event.poster_url || event.poster_file || event.poster
        const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'

        if (raw) {
            if (raw.startsWith('http://') || raw.startsWith('https://')) {
                setPosterSrc(raw)
                return
            }
            if (
                raw === '/events/poster.png' ||
                raw === '/events/poster1.png' ||
                raw === 'events/poster.png' ||
                raw === 'events/poster1.png' ||
                raw.startsWith('/images/') ||
                raw.startsWith('/pics/') ||
                raw.startsWith('/home/') ||
                raw.startsWith('/assets/') ||
                raw.startsWith('/multicity/')
            ) {
                setPosterSrc(raw.startsWith('/') ? raw : `/${raw}`)
                return
            }
        }

        // If raw is an S3 file key (e.g. events/EVT-...), fetch the signed URL from the poster endpoint
        const eventId = event.id || event._id
        if (eventId) {
            fetch(`${host}/events/${eventId}/poster`)
                .then(r => r.json())
                .then(data => {
                    if (data?.success && data?.url) {
                        setPosterSrc(data.url)
                    } else if (raw) {
                        setPosterSrc(raw.startsWith('/') ? raw : `/${raw}`)
                    } else {
                        setPosterSrc('/events/poster.png')
                    }
                })
                .catch(() => {
                    setPosterSrc('/events/poster.png')
                })
        } else {
            setPosterSrc('/events/poster.png')
        }
    }, [posterUrl, event])

    if (!event) return null

    const id = event.id || event._id
    const rawName = event.name || event['Event Name'] || 'Special Event'
    const [title, subtitle] = rawName.split('#')

    // Optional fields: shown only if the API sends them
    const description =
        event.tagline || event.short_description || event.description || ''
    const date = event.date || event.event_date || (event.start_time ? new Date(event.start_time).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '')
    const venue = event.venue || event.location || event.Venue || ''

    const open = () => {
        if (onOpen) return onOpen(event)
        if (id) window.open(`/events/${id}`, '_blank')
    }

    const item = (delay) => ({
        initial: reduce ? { opacity: 0 } : { opacity: 0, y: 26 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: reduce ? 0.2 : 0.8, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
    })

    return (
        <section className="se-section" aria-label={title}>
            <style dangerouslySetInnerHTML={{ __html: css }} />

            <div className="se-grid">
                <motion.div className="se-poster-wrap" {...item(0)}>
                    <button
                        type="button"
                        className="se-poster"
                        onClick={open}
                        aria-label={`Open ${title}`}
                    >
                        <img
                            src={posterSrc}
                            alt={title}
                            className="se-poster-img"
                            onError={() => {
                                if (posterSrc !== '/events/poster.png') {
                                    setPosterSrc('/events/poster.png')
                                }
                            }}
                        />
                    </button>
                </motion.div>

                <div>
                    <motion.h2 className={cn('se-title', dmSerif.className)} {...item(0.12)}>
                        {title}
                    </motion.h2>
                    {subtitle && (
                        <motion.p className="se-subtitle" {...item(0.2)}>
                            {subtitle}
                        </motion.p>
                    )}

                    <motion.hr className="se-rule" {...item(0.26)} />

                    {description && (
                        <motion.div
                            className="se-desc"
                            {...item(0.32)}
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    )}

                    {(date || venue) && (
                        <motion.ul className="se-meta" {...item(0.38)}>
                            {date && (
                                <li>
                                    <CalendarIcon />
                                    {date}
                                </li>
                            )}
                            {venue && (
                                <li>
                                    <PinIcon />
                                    {venue}
                                </li>
                            )}
                        </motion.ul>
                    )}

                    <motion.div className="se-cta-row" {...item(0.44)}>
                        <button
                            type="button"
                            className={cn(styles.sexy_button, styles.sexy_button_small)}
                            onClick={open}
                            style={{ cursor: 'pointer' }}
                        >
                            VIEW DETAILS
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
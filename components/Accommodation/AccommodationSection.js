import React from 'react'
import styles from '../../styles/homepage.module.css'
import { motion, useReducedMotion } from 'framer-motion'

const dmSerif = { className: 'font-dm-serif' }
const GOLD = '#F2BF51'

const cn = (...classes) => classes.filter(Boolean).join(' ')

/* Inline SVG icons: crisp, themeable, no emoji rendering differences */
const iconProps = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
}

const BedIcon = () => (
    <svg {...iconProps}>
        <path d="M3 18V6" />
        <path d="M3 14h18v4" />
        <path d="M21 14v-2a3 3 0 0 0-3-3h-7v5" />
        <circle cx="7" cy="11" r="1.6" />
    </svg>
)

const DiningIcon = () => (
    <svg {...iconProps}>
        <path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3" />
        <path d="M7 11v10" />
        <path d="M17 3c-2 1.5-3 4-3 7h3v11" />
    </svg>
)

const ShieldIcon = () => (
    <svg {...iconProps}>
        <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
)

const PinIcon = () => (
    <svg {...iconProps}>
        <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.5" />
    </svg>
)

const features = [
    {
        icon: <BedIcon />,
        title: 'Hostel rooms',
        text: 'Clean, separate hostels for male and female participants.',
    },
    {
        icon: <DiningIcon />,
        title: 'Mess & dining',
        text: 'Optional mess add-on with wholesome meals through the fest.',
    },
    {
        icon: <ShieldIcon />,
        title: '24/7 campus security',
        text: 'Round-the-clock security with an active assistance desk.',
    },
    {
        icon: <PinIcon />,
        title: 'Walk to every venue',
        text: 'Stage arenas, lecture halls and food stalls are minutes away.',
    },
]

const css = `
.acc-section {
    position: relative;
    z-index: 10;
    width: 100%;
    box-sizing: border-box;
    padding: clamp(64px, 9vw, 120px) clamp(20px, 5vw, 48px);
    background: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
}

/* soft ambient light behind the content, no box, no border */
.acc-section::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 55%;
    width: min(1100px, 130%);
    height: 560px;
    transform: translate(-50%, -50%);
    background:
        radial-gradient(ellipse at 28% 50%, rgba(242, 191, 81, 0.14), transparent 62%),
        radial-gradient(ellipse at 80% 60%, rgba(242, 191, 81, 0.06), transparent 60%);
    filter: blur(20px);
    pointer-events: none;
    z-index: -1;
}

.acc-grid {
    width: 100%;
    max-width: 1080px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    gap: clamp(36px, 6vw, 96px);
    align-items: center;
}

.acc-intro {
    font-family: 'Cormorant Garamond', serif;
    color: #e6e2d8;
    font-size: clamp(19px, 1.7vw, 23px);
    line-height: 1.7;
    max-width: 52ch;
    margin: 0 0 32px;
}

.acc-intro strong {
    color: #ffffff;
    font-weight: 600;
}

.acc-cta-row {
    display: flex;
    align-items: center;
    gap: 22px;
    flex-wrap: wrap;
}

.acc-cta-note {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px;
    color: rgba(255, 255, 255, 0.55);
    max-width: 24ch;
    line-height: 1.35;
}

.acc-cta-row button:focus-visible {
    outline: 2px solid ${GOLD};
    outline-offset: 4px;
}

/* feature list: hairline rows instead of boxed cards */
.acc-list {
    list-style: none;
    margin: 0;
    padding: 0;
    border-top: 1px solid rgba(242, 191, 81, 0.28);
}

.acc-row {
    display: grid;
    grid-template-columns: 52px 1fr;
    gap: 18px;
    align-items: center;
    padding: 22px 6px;
    border-bottom: 1px solid rgba(242, 191, 81, 0.14);
    transition: padding-left 0.3s ease, background 0.3s ease;
}

.acc-row:last-child {
    border-bottom-color: rgba(242, 191, 81, 0.28);
}

.acc-row:hover {
    padding-left: 14px;
    background: linear-gradient(90deg, rgba(242, 191, 81, 0.07), transparent 70%);
}

.acc-icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: ${GOLD};
    background: radial-gradient(circle at 30% 25%, rgba(242, 191, 81, 0.22), rgba(242, 191, 81, 0.05) 70%);
    box-shadow: inset 0 0 0 1px rgba(242, 191, 81, 0.3);
}

.acc-row-title {
    font-family: 'DM Serif Display', serif;
    color: #ffffff;
    font-size: 21px;
    line-height: 1.2;
    margin: 0 0 4px;
    font-weight: 400;
}

.acc-row-text {
    font-family: 'Cormorant Garamond', serif;
    color: rgba(230, 226, 216, 0.72);
    font-size: 17px;
    line-height: 1.45;
    margin: 0;
}

@media (max-width: 860px) {
    .acc-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }
    .acc-intro {
        max-width: none;
    }
}

@media (max-width: 480px) {
    .acc-row {
        grid-template-columns: 44px 1fr;
        gap: 14px;
    }
    .acc-icon {
        width: 44px;
        height: 44px;
    }
    .acc-row:hover {
        padding-left: 6px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .acc-row {
        transition: none;
    }
}
`

export default function AccommodationSection({ onRequestAccommodation }) {
    const reduce = useReducedMotion()

    // One orchestrated reveal: the list rows arrive in sequence
    const listVariants = {
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: 0.1 } },
    }
    const rowVariants = {
        hidden: reduce ? { opacity: 0 } : { opacity: 0, x: 24 },
        show: {
            opacity: 1,
            x: 0,
            transition: { duration: reduce ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] },
        },
    }

    return (
        <section className="acc-section" aria-labelledby="accommodation-heading">
            <style dangerouslySetInnerHTML={{ __html: css }} />

            <div className={styles.sexy_title} style={{ marginBottom: 'clamp(40px, 6vw, 72px)', textAlign: 'center' }}>
                <h2 id="accommodation-heading" className={dmSerif.className} style={{ color: '#ffffff' }}>
                    Need Accommodation?
                </h2>
                <h3 style={{ color: GOLD }}>Registered in events? Stay inside IIT Patna Campus</h3>
            </div>

            <div className="acc-grid">
                <div>
                    <p className="acc-intro">
                        Anwesha 2027 offers safe, comfortable <strong>on-campus hostel stays</strong> for outstation
                        participants registered for events, competitions, workshops and pro-nites. Live the fest
                        round the clock, right inside IIT Patna.
                    </p>

                    <div className="acc-cta-row">
                        <button
                            type="button"
                            className={cn(styles.sexy_button, styles.sexy_button_small)}
                            onClick={onRequestAccommodation}
                            style={{ cursor: 'pointer' }}
                        >
                            REQUEST STAY
                        </button>
                        <span className="acc-cta-note">For participants registered in at least one event.</span>
                    </div>
                </div>

                <motion.ul
                    className="acc-list"
                    variants={listVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {features.map((f) => (
                        <motion.li key={f.title} className="acc-row" variants={rowVariants}>
                            <span className="acc-icon">{f.icon}</span>
                            <div>
                                <h4 className="acc-row-title">{f.title}</h4>
                                <p className="acc-row-text">{f.text}</p>
                            </div>
                        </motion.li>
                    ))}
                </motion.ul>
            </div>
        </section>
    )
}
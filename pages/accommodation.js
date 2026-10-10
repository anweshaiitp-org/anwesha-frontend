import React, { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { AuthContext } from '../components/authContext'
import { toast } from 'react-toastify'
import { motion, useReducedMotion } from 'framer-motion'

const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'
const GOLD = '#F2BF51'

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */
const css = `
.ac-page {
    position: relative;
    min-height: 100vh;
    background: #050508;
    color: #ffffff;
    overflow-x: hidden;
    isolation: isolate;
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

/* ambient gold light, no hard edges */
.ac-page::before {
    content: '';
    position: absolute;
    top: -160px;
    left: 50%;
    width: min(1200px, 140%);
    height: 760px;
    transform: translateX(-50%);
    background:
        radial-gradient(ellipse at 50% 30%, rgba(242, 191, 81, 0.20), transparent 62%),
        radial-gradient(ellipse at 15% 55%, rgba(242, 191, 81, 0.07), transparent 60%);
    pointer-events: none;
    z-index: -1;
}

/* ---------- hero ---------- */
.ac-hero {
    text-align: center;
    padding: clamp(72px, 10vw, 120px) 20px clamp(36px, 5vw, 64px);
}

.ac-hero h1 {
    font-family: 'DM Serif Display', serif;
    font-weight: 400;
    font-size: clamp(40px, 6.4vw, 76px);
    line-height: 1.04;
    letter-spacing: -0.01em;
    margin: 0 0 18px;
    color: #ffffff;
    text-wrap: balance;
}

.ac-hero p {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(19px, 2.3vw, 26px);
    line-height: 1.5;
    color: ${GOLD};
    max-width: 640px;
    margin: 0 auto;
}

.ac-hero-rule {
    width: 84px;
    height: 2px;
    border: 0;
    margin: 30px auto 0;
    background: linear-gradient(90deg, transparent, ${GOLD}, transparent);
}

/* ---------- layout ---------- */
.ac-main {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 clamp(20px, 4vw, 40px) 110px;
}

.ac-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
    gap: clamp(36px, 6vw, 88px);
    align-items: start;
}

.ac-aside {
    position: sticky;
    top: 28px;
    display: flex;
    flex-direction: column;
    gap: 44px;
}

/* ---------- notices ---------- */
.ac-login {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
    margin: 0 0 44px;
    padding: 22px 26px;
    border-radius: 16px;
    background: linear-gradient(90deg, rgba(242, 191, 81, 0.14), rgba(242, 191, 81, 0.03));
}

.ac-login h3 {
    font-family: 'DM Serif Display', serif;
    font-weight: 400;
    color: ${GOLD};
    font-size: 24px;
    margin: 0 0 4px;
}

.ac-login p {
    font-family: 'Cormorant Garamond', serif;
    font-size: 19px;
    color: #d8d3c6;
    margin: 0;
}

.ac-error {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    margin: 0 0 30px;
    padding: 14px 18px;
    border-radius: 12px;
    background: rgba(231, 76, 60, 0.12);
    box-shadow: inset 3px 0 0 #e74c3c;
    color: #ffb3a9;
    font-size: 15px;
    line-height: 1.5;
}

/* ---------- form ---------- */
.ac-form-head h2 {
    font-family: 'DM Serif Display', serif;
    font-weight: 400;
    font-size: clamp(30px, 3.4vw, 40px);
    margin: 0 0 8px;
    color: #ffffff;
}

.ac-form-head p {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    color: #b9b4a8;
    margin: 0 0 8px;
}

.ac-section {
    padding: 34px 0;
    border-top: 1px solid rgba(242, 191, 81, 0.18);
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.ac-section-title {
    font-family: 'DM Serif Display', serif;
    font-weight: 400;
    font-size: 22px;
    color: ${GOLD};
    margin: 0;
}

.ac-label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #e6e1d3;
}

.ac-hint {
    display: block;
    margin-top: 7px;
    font-size: 13px;
    color: #8f8f98;
    line-height: 1.5;
}

.ac-input {
    width: 100%;
    box-sizing: border-box;
    padding: 13px 15px;
    font: inherit;
    font-size: 15px;
    color: #ffffff;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 11px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.ac-input::placeholder { color: #6f6f78; }

.ac-input:hover { background: rgba(255, 255, 255, 0.07); }

.ac-input:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.07);
    border-color: ${GOLD};
    box-shadow: 0 0 0 4px rgba(242, 191, 81, 0.16);
}

.ac-input[type='date'] { color-scheme: dark; }

textarea.ac-input { resize: vertical; min-height: 96px; line-height: 1.5; }

.ac-row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

/* add member row */
.ac-add-row { display: flex; gap: 10px; }

.ac-btn-ghost {
    flex: none;
    padding: 0 20px;
    font: inherit;
    font-weight: 600;
    font-size: 15px;
    color: ${GOLD};
    background: rgba(242, 191, 81, 0.10);
    border: 1px solid rgba(242, 191, 81, 0.45);
    border-radius: 11px;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
}

.ac-btn-ghost:hover { background: rgba(242, 191, 81, 0.2); }

.ac-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }

.ac-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px 6px 13px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: ${GOLD};
    background: rgba(242, 191, 81, 0.11);
    border-radius: 999px;
    box-shadow: inset 0 0 0 1px rgba(242, 191, 81, 0.35);
}

.ac-chip button {
    display: grid;
    place-items: center;
    width: 22px;
    height: 22px;
    padding: 0;
    color: #ffb0a6;
    background: rgba(255, 255, 255, 0.06);
    border: 0;
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.2s ease;
}

.ac-chip button:hover { background: rgba(231, 76, 60, 0.35); }

/* stepper */
.ac-stepper {
    display: flex;
    align-items: stretch;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 11px;
    overflow: hidden;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.ac-stepper:focus-within {
    border-color: ${GOLD};
    box-shadow: 0 0 0 4px rgba(242, 191, 81, 0.16);
}

.ac-stepper button {
    flex: none;
    width: 46px;
    font-size: 20px;
    color: ${GOLD};
    background: transparent;
    border: 0;
    cursor: pointer;
    transition: background 0.2s ease;
}

.ac-stepper button:hover { background: rgba(242, 191, 81, 0.12); }

.ac-stepper input {
    flex: 1;
    min-width: 0;
    width: 100%;
    padding: 13px 0;
    text-align: center;
    font: inherit;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    background: transparent;
    border: 0;
    -moz-appearance: textfield;
}

.ac-stepper input:focus { outline: none; }
.ac-stepper input::-webkit-outer-spin-button,
.ac-stepper input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

.ac-mismatch {
    margin: 0;
    font-size: 14px;
    color: ${GOLD};
    background: rgba(242, 191, 81, 0.08);
    padding: 10px 14px;
    border-radius: 10px;
}

/* switch */
.ac-switch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 16px 18px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.04);
    cursor: pointer;
}

.ac-switch-text strong {
    display: block;
    font-size: 15px;
    font-weight: 600;
    color: #ffffff;
}

.ac-switch-text span {
    font-size: 13px;
    color: #9a9aa3;
}

.ac-switch input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

.ac-track {
    position: relative;
    flex: none;
    width: 48px;
    height: 28px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.14);
    transition: background 0.25s ease;
}

.ac-track::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #ffffff;
    transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}

.ac-switch input:checked + .ac-track { background: ${GOLD}; }
.ac-switch input:checked + .ac-track::after { transform: translateX(20px); background: #1a1405; }
.ac-switch input:focus-visible + .ac-track { outline: 2px solid ${GOLD}; outline-offset: 3px; }

/* primary button */
.ac-btn-primary {
    width: 100%;
    padding: 16px 28px;
    font: inherit;
    font-size: 17px;
    font-weight: 700;
    letter-spacing: 0.01em;
    color: #1a1405;
    background: linear-gradient(135deg, #F7D27A, #F2BF51 45%, #C39B54);
    border: 0;
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 10px 34px rgba(242, 191, 81, 0.28);
    transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
}

.ac-btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    filter: brightness(1.05);
    box-shadow: 0 16px 42px rgba(242, 191, 81, 0.38);
}

.ac-btn-primary:disabled { cursor: not-allowed; opacity: 0.65; }

.ac-btn-primary.ac-inline { width: auto; padding: 12px 28px; font-size: 16px; }

.ac-btn-outline {
    padding: 12px 26px;
    font: inherit;
    font-size: 16px;
    color: #ffffff;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.28);
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease;
}

.ac-btn-outline:hover { background: rgba(255, 255, 255, 0.07); border-color: rgba(255, 255, 255, 0.5); }

.ac-page button:focus-visible,
.ac-page a:focus-visible { outline: 2px solid ${GOLD}; outline-offset: 3px; }

/* ---------- aside ---------- */
.ac-aside h3 {
    font-family: 'DM Serif Display', serif;
    font-weight: 400;
    font-size: 24px;
    color: #ffffff;
    margin: 0 0 14px;
}

.ac-summary { margin: 0; padding: 0; list-style: none; }

.ac-summary li {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 16px;
    padding: 13px 0;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.14);
    font-size: 15px;
}

.ac-summary li span:first-child { color: #9d9da6; }
.ac-summary li span:last-child { color: #ffffff; font-weight: 600; text-align: right; }

.ac-feature-list { list-style: none; margin: 0; padding: 0; }

.ac-feature-list li {
    display: grid;
    grid-template-columns: 40px 1fr;
    gap: 14px;
    align-items: start;
    padding: 15px 0;
    border-bottom: 1px solid rgba(242, 191, 81, 0.13);
}

.ac-feature-list li:first-child { border-top: 1px solid rgba(242, 191, 81, 0.28); }
.ac-feature-list li:last-child { border-bottom-color: rgba(242, 191, 81, 0.28); }

.ac-ico {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: ${GOLD};
    background: radial-gradient(circle at 30% 25%, rgba(242, 191, 81, 0.22), rgba(242, 191, 81, 0.05) 70%);
    box-shadow: inset 0 0 0 1px rgba(242, 191, 81, 0.3);
}

.ac-feature-list strong { display: block; color: #ffffff; font-size: 15px; font-weight: 600; margin-bottom: 2px; }
.ac-feature-list span.ac-desc { color: #a9a9b2; font-size: 14px; line-height: 1.5; }

.ac-rules { list-style: none; margin: 0; padding: 0; }

.ac-rules li {
    position: relative;
    padding: 0 0 14px 28px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 19px;
    line-height: 1.5;
    color: #d6d1c4;
}

.ac-rules li::before {
    content: '';
    position: absolute;
    left: 2px;
    top: 7px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${GOLD};
    box-shadow: 0 0 0 4px rgba(242, 191, 81, 0.16);
}

/* ---------- success ---------- */
.ac-success {
    max-width: 640px;
    margin: 0 auto;
    text-align: center;
}

.ac-check {
    width: 84px;
    height: 84px;
    margin: 0 auto 26px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    color: #6fdc8c;
    background: radial-gradient(circle at 30% 25%, rgba(76, 175, 80, 0.3), rgba(76, 175, 80, 0.06) 70%);
    box-shadow: inset 0 0 0 1px rgba(111, 220, 140, 0.4), 0 0 60px rgba(76, 175, 80, 0.25);
}

.ac-success h2 {
    font-family: 'DM Serif Display', serif;
    font-weight: 400;
    font-size: clamp(32px, 4.4vw, 46px);
    margin: 0 0 12px;
}

.ac-success > p {
    font-family: 'Cormorant Garamond', serif;
    font-size: 21px;
    line-height: 1.55;
    color: #bdb8ac;
    margin: 0 auto 36px;
    max-width: 48ch;
}

.ac-receipt {
    text-align: left;
    margin: 0 auto 36px;
    padding: 8px 28px;
    border-radius: 18px;
    background: linear-gradient(160deg, rgba(242, 191, 81, 0.09), rgba(255, 255, 255, 0.02));
}

.ac-receipt .ac-summary li { padding: 16px 0; }
.ac-receipt .ac-summary li:last-child { border-bottom: 0; }

.ac-pill {
    display: inline-block;
    padding: 3px 12px;
    font-size: 13px;
    font-weight: 700;
    color: #7cc4ff;
    background: rgba(33, 150, 243, 0.14);
    border-radius: 999px;
}

.ac-actions { display: flex; justify-content: center; gap: 14px; flex-wrap: wrap; }

/* ---------- responsive ---------- */
@media (max-width: 900px) {
    .ac-grid { grid-template-columns: 1fr; gap: 56px; }
    .ac-aside { position: static; }
}

@media (max-width: 520px) {
    .ac-row-2 { gap: 12px; }
    .ac-login { padding: 20px; }
    .ac-receipt { padding: 4px 18px; }
}

@media (prefers-reduced-motion: reduce) {
    .ac-page *, .ac-page *::before, .ac-page *::after {
        transition: none !important;
    }
}
`

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */
const ip = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
}

const BedIcon = () => (
    <svg {...ip}>
        <path d="M3 18V6" />
        <path d="M3 14h18v4" />
        <path d="M21 14v-2a3 3 0 0 0-3-3h-7v5" />
        <circle cx="7" cy="11" r="1.6" />
    </svg>
)
const DiningIcon = () => (
    <svg {...ip}>
        <path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3" />
        <path d="M7 11v10" />
        <path d="M17 3c-2 1.5-3 4-3 7h3v11" />
    </svg>
)
const ShieldIcon = () => (
    <svg {...ip}>
        <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
    </svg>
)
const PinIcon = () => (
    <svg {...ip}>
        <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.5" />
    </svg>
)
const CheckBig = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
)
const CloseIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" />
    </svg>
)

const features = [
    { icon: <BedIcon />, title: 'Hostel stays', text: 'Clean, secure, separate hostels for male and female attendees.' },
    { icon: <DiningIcon />, title: 'Dining', text: 'Wholesome campus mess meals with an optional add-on.' },
    { icon: <ShieldIcon />, title: 'Campus security', text: 'Round-the-clock security and a hospitality helpdesk.' },
    { icon: <PinIcon />, title: 'Walk to every arena', text: 'Competition stages and lecture halls are minutes away.' },
]

const rules = [
    'All group members must be registered participants of Anwesha 2027.',
    'Carry a valid government photo ID or college ID card to the reporting desk.',
    'Rooms are confirmed once payment clears before the deadline.',
    'Following IIT Patna campus rules is mandatory.',
]

/* ------------------------------------------------------------------ */
/* Small components                                                    */
/* ------------------------------------------------------------------ */
function Stepper({ id, value, onChange }) {
    const n = parseInt(value, 10) || 0
    return (
        <div className="ac-stepper">
            <button type="button" aria-label="Decrease" onClick={() => onChange(Math.max(0, n - 1))}>
                −
            </button>
            <input
                id={id}
                type="number"
                min="0"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required
            />
            <button type="button" aria-label="Increase" onClick={() => onChange(n + 1)}>
                +
            </button>
        </div>
    )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function AccommodationPage() {
    const router = useRouter()
    const authContext = useContext(AuthContext)
    const user = authContext?.state?.user
    const isAuth = authContext?.isAuth
    const reduce = useReducedMotion()

    // Form states
    const [leadId, setLeadId] = useState('')
    const [groupMembers, setGroupMembers] = useState([])
    const [newMemberInput, setNewMemberInput] = useState('')
    const [totalMales, setTotalMales] = useState(1)
    const [totalFemales, setTotalFemales] = useState(0)
    const [fromDate, setFromDate] = useState('2027-02-15')
    const [toDate, setToDate] = useState('2027-02-18')
    const [messAddons, setMessAddons] = useState(false)
    const [reason, setReason] = useState('')

    // UI states
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [submissionSuccess, setSubmissionSuccess] = useState(null)

    useEffect(() => {
        if (user?.anwesha_id) {
            setLeadId(user.anwesha_id)
            if (user.gender === 'Female') {
                setTotalMales(0)
                setTotalFemales(1)
            } else {
                setTotalMales(1)
                setTotalFemales(0)
            }
        }
    }, [user])

    const handleAddMember = () => {
        setErrorMessage('')
        const trimmed = newMemberInput.trim().toUpperCase()
        if (!trimmed) return

        const currentLead = leadId || user?.anwesha_id
        if (trimmed === currentLead) {
            setErrorMessage('Lead Anwesha ID is already included.')
            toast.warning('Lead Anwesha ID is already included')
            return
        }

        if (groupMembers.includes(trimmed)) {
            setErrorMessage(`Anwesha ID ${trimmed} is already in the group list.`)
            toast.warning(`Member ${trimmed} already added`)
            return
        }

        const updated = [...groupMembers, trimmed]
        setGroupMembers(updated)
        setNewMemberInput('')

        // Auto-adjust total males count to keep sum matching members
        const totalPeople = 1 + updated.length
        const currentF = parseInt(totalFemales, 10) || 0
        if (currentF <= totalPeople) {
            setTotalMales(totalPeople - currentF)
        }
    }

    const handleRemoveMember = (idxToRemove) => {
        setErrorMessage('')
        const updated = groupMembers.filter((_, idx) => idx !== idxToRemove)
        setGroupMembers(updated)

        const totalPeople = 1 + updated.length
        const currentF = parseInt(totalFemales, 10) || 0
        if (currentF > totalPeople) {
            setTotalFemales(totalPeople)
            setTotalMales(0)
        } else {
            setTotalMales(totalPeople - currentF)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrorMessage('')

        if (!isAuth && !authContext?.token) {
            setErrorMessage('Please login with your Anwesha account to request accommodation.')
            toast.error('Authentication required')
            return
        }

        const activeLead = (leadId || user?.anwesha_id || '').trim().toUpperCase()
        if (!activeLead) {
            setErrorMessage('Lead Anwesha ID is required.')
            toast.error('Lead Anwesha ID is required')
            return
        }

        const allMembers = [activeLead, ...groupMembers]
        const males = parseInt(totalMales, 10) || 0
        const females = parseInt(totalFemales, 10) || 0

        if (males < 0 || females < 0) {
            setErrorMessage('Male and female counts cannot be negative.')
            toast.error('Invalid member counts')
            return
        }

        if (males + females !== allMembers.length) {
            const msg = `Sum of Males (${males}) + Females (${females}) = ${males + females}, but you have ${allMembers.length} group member(s) listed (1 Lead + ${groupMembers.length} additional). Please match the counts.`
            setErrorMessage(msg)
            toast.error('Member counts do not match group list')
            return
        }

        if (!fromDate || !toDate) {
            setErrorMessage('Please select both check-in and check-out dates.')
            toast.error('Dates are required')
            return
        }

        const start = new Date(fromDate)
        const end = new Date(toDate)
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            setErrorMessage('Invalid check-in or check-out date selected.')
            toast.error('Invalid date format')
            return
        }

        if (start >= end) {
            setErrorMessage('Check-out date must be strictly after the check-in date.')
            toast.error('Check-out date must be after check-in date')
            return
        }

        setLoading(true)
        try {
            const authHeaders = authContext?.getAuthHeaders ? authContext.getAuthHeaders() : {}
            const token = authContext?.token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

            const res = await fetch(`${host}/accommodation/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    ...authHeaders,
                },
                body: JSON.stringify({
                    group_members: allMembers,
                    total_males: males,
                    total_females: females,
                    from_date: start.toISOString(),
                    to_date: end.toISOString(),
                    mess_addons: Boolean(messAddons),
                    reason: reason.trim() || undefined,
                }),
            })

            const data = await res.json().catch(() => ({}))

            if (res.status === 201 || (res.ok && data.success)) {
                toast.success('Accommodation request submitted successfully!')
                setSubmissionSuccess({
                    id: data.request_id || data.id || 'Submitted',
                    status: data.status || 'REQUESTED',
                    group_members: allMembers,
                    total_males: males,
                    total_females: females,
                    from_date: fromDate,
                    to_date: toDate,
                    mess_addons: Boolean(messAddons),
                })
            } else {
                const apiError = data.message || data.error || (res.status === 401 ? 'Your session has expired. Please login again.' : 'Failed to submit accommodation request.')
                setErrorMessage(apiError)
                toast.error(apiError)
            }
        } catch (err) {
            console.error('[Accommodation Error]', err)
            const netError = 'Network error or server unavailable. Please try again in a moment.'
            setErrorMessage(netError)
            toast.error(netError)
        } finally {
            setLoading(false)
        }
    }

    /* ---------- derived values for the live summary ---------- */
    const groupSize = 1 + groupMembers.length
    const malesN = parseInt(totalMales, 10) || 0
    const femalesN = parseInt(totalFemales, 10) || 0
    const countsMatch = malesN + femalesN === groupSize

    const startD = new Date(fromDate)
    const endD = new Date(toDate)
    const nights =
        !isNaN(startD.getTime()) && !isNaN(endD.getTime())
            ? Math.round((endD - startD) / 86400000)
            : 0

    const fadeUp = (delay = 0) => ({
        initial: reduce ? { opacity: 0 } : { opacity: 0, y: 22 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: reduce ? 0.2 : 0.7, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
    })

    return (
        <div className="ac-page">
            <style dangerouslySetInnerHTML={{ __html: css }} />
            <Head>
                <title>Accommodation | Anwesha 2027</title>
                <meta name="description" content="Request on-campus hostel stay and accommodation at IIT Patna for Anwesha 2027" />
            </Head>

            {/* Hero */}
            <header className="ac-hero">
                <motion.h1 {...fadeUp(0)}>Fest Accommodation</motion.h1>
                <motion.p {...fadeUp(0.1)}>
                    Safe and comfortable on-campus hostel lodging inside IIT Patna for registered fest participants.
                </motion.p>
                <motion.hr className="ac-hero-rule" {...fadeUp(0.2)} />
            </header>

            <main className="ac-main">
                {/* Not signed in */}
                {!isAuth && (
                    <motion.div className="ac-login" {...fadeUp(0.25)}>
                        <div>
                            <h3>Sign in to continue</h3>
                            <p>You need your Anwesha account to submit an accommodation request.</p>
                        </div>
                        <button type="button" className="ac-btn-primary ac-inline" onClick={() => router.push('/userLogin')}>
                            Sign in or register
                        </button>
                    </motion.div>
                )}

                {submissionSuccess ? (
                    /* ---------------- Success ---------------- */
                    <motion.div className="ac-success" {...fadeUp(0)}>
                        <div className="ac-check">
                            <CheckBig />
                        </div>
                        <h2>Request submitted</h2>
                        <p>Your accommodation request is received and is being reviewed by the hospitality team.</p>

                        <div className="ac-receipt">
                            <ul className="ac-summary">
                                <li><span>Request ID</span><span>{submissionSuccess.id}</span></li>
                                <li><span>Status</span><span><span className="ac-pill">{submissionSuccess.status}</span></span></li>
                                <li><span>Dates</span><span>{submissionSuccess.from_date} to {submissionSuccess.to_date}</span></li>
                                <li><span>Group</span><span>{submissionSuccess.total_males} male, {submissionSuccess.total_females} female</span></li>
                                <li><span>Mess meal add-on</span><span>{submissionSuccess.mess_addons ? 'Included' : 'Not included'}</span></li>
                            </ul>
                        </div>

                        <div className="ac-actions">
                            <button type="button" className="ac-btn-primary ac-inline" onClick={() => router.push('/profile')}>
                                Go to profile
                            </button>
                            <button type="button" className="ac-btn-outline" onClick={() => setSubmissionSuccess(null)}>
                                Submit another request
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="ac-grid">
                        {/* ---------------- Form ---------------- */}
                        <motion.div {...fadeUp(0.3)}>
                            <div className="ac-form-head">
                                <h2>Accommodation form</h2>
                                <p>Tell us who is coming and when. We will take care of the rooms.</p>
                            </div>

                            {errorMessage && (
                                <motion.div
                                    className="ac-error"
                                    role="alert"
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <span>
                                        <strong>Error:</strong> {errorMessage}
                                    </span>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} style={{ marginTop: 22 }}>
                                {/* Group */}
                                <div className="ac-section">
                                    <h3 className="ac-section-title">Your group</h3>

                                    <div>
                                        <label className="ac-label" htmlFor="ac-lead">Lead Anwesha ID *</label>
                                        <input
                                            id="ac-lead"
                                            className="ac-input"
                                            type="text"
                                            value={leadId}
                                            onChange={(e) => setLeadId(e.target.value.toUpperCase())}
                                            placeholder="e.g. ANW1024"
                                            required
                                        />
                                        <span className="ac-hint">The main applicant responsible for the group booking.</span>
                                    </div>

                                    <div>
                                        <label className="ac-label" htmlFor="ac-member">Additional group members (optional)</label>
                                        <div className="ac-add-row">
                                            <input
                                                id="ac-member"
                                                className="ac-input"
                                                type="text"
                                                value={newMemberInput}
                                                onChange={(e) => setNewMemberInput(e.target.value.toUpperCase())}
                                                placeholder="Member Anwesha ID"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault()
                                                        handleAddMember()
                                                    }
                                                }}
                                            />
                                            <button type="button" className="ac-btn-ghost" onClick={handleAddMember}>
                                                + Add
                                            </button>
                                        </div>

                                        {groupMembers.length > 0 && (
                                            <div className="ac-chips">
                                                {groupMembers.map((mId, idx) => (
                                                    <span className="ac-chip" key={mId}>
                                                        {mId}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveMember(idx)}
                                                            aria-label={`Remove ${mId}`}
                                                            title="Remove member"
                                                        >
                                                            <CloseIcon />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Head count */}
                                <div className="ac-section">
                                    <h3 className="ac-section-title">Head count</h3>
                                    <div className="ac-row-2">
                                        <div>
                                            <label className="ac-label" htmlFor="ac-males">Total males *</label>
                                            <Stepper id="ac-males" value={totalMales} onChange={setTotalMales} />
                                        </div>
                                        <div>
                                            <label className="ac-label" htmlFor="ac-females">Total females *</label>
                                            <Stepper id="ac-females" value={totalFemales} onChange={setTotalFemales} />
                                        </div>
                                    </div>
                                    {!countsMatch && (
                                        <p className="ac-mismatch">
                                            Males and females should add up to {groupSize}, the number of people in your group.
                                        </p>
                                    )}
                                </div>

                                {/* Stay */}
                                <div className="ac-section">
                                    <h3 className="ac-section-title">Your stay</h3>
                                    <div className="ac-row-2">
                                        <div>
                                            <label className="ac-label" htmlFor="ac-from">Check-in date *</label>
                                            <input
                                                id="ac-from"
                                                className="ac-input"
                                                type="date"
                                                value={fromDate}
                                                onChange={(e) => setFromDate(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="ac-label" htmlFor="ac-to">Check-out date *</label>
                                            <input
                                                id="ac-to"
                                                className="ac-input"
                                                type="date"
                                                value={toDate}
                                                min={fromDate || undefined}
                                                onChange={(e) => setToDate(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <label className="ac-switch" htmlFor="messAddonPage">
                                        <span className="ac-switch-text">
                                            <strong>Mess and dining meal add-on</strong>
                                            <span>Wholesome campus meals during your stay</span>
                                        </span>
                                        <input
                                            type="checkbox"
                                            id="messAddonPage"
                                            checked={messAddons}
                                            onChange={(e) => setMessAddons(e.target.checked)}
                                        />
                                        <span className="ac-track" aria-hidden="true" />
                                    </label>
                                </div>

                                {/* Notes */}
                                <div className="ac-section">
                                    <h3 className="ac-section-title">Purpose of stay</h3>
                                    <div>
                                        <label className="ac-label" htmlFor="ac-reason">Registered events or purpose (optional)</label>
                                        <textarea
                                            id="ac-reason"
                                            className="ac-input"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            placeholder="e.g. Participating in RoboWars, Syngeny Dance, Pro-Nites"
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="ac-btn-primary" disabled={loading}>
                                    {loading ? 'Submitting request...' : 'Submit accommodation request'}
                                </button>
                            </form>
                        </motion.div>

                        {/* ---------------- Aside ---------------- */}
                        <motion.aside className="ac-aside" {...fadeUp(0.4)}>
                            <section aria-label="Request summary">
                                <h3>Your request</h3>
                                <ul className="ac-summary">
                                    <li><span>Group size</span><span>{groupSize} {groupSize === 1 ? 'person' : 'people'}</span></li>
                                    <li><span>Males / Females</span><span>{malesN} / {femalesN}</span></li>
                                    <li><span>Check-in</span><span>{fromDate || '-'}</span></li>
                                    <li><span>Check-out</span><span>{toDate || '-'}</span></li>
                                    <li><span>Duration</span><span>{nights > 0 ? `${nights} ${nights === 1 ? 'night' : 'nights'}` : '-'}</span></li>
                                    <li><span>Mess add-on</span><span>{messAddons ? 'Included' : 'Not included'}</span></li>
                                </ul>
                            </section>

                            <section aria-label="What is included">
                                <h3>What you get</h3>
                                <ul className="ac-feature-list">
                                    {features.map((f) => (
                                        <li key={f.title}>
                                            <span className="ac-ico">{f.icon}</span>
                                            <div>
                                                <strong>{f.title}</strong>
                                                <span className="ac-desc">{f.text}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section aria-label="Guidelines">
                                <h3>Before you arrive</h3>
                                <ul className="ac-rules">
                                    {rules.map((r) => (
                                        <li key={r}>{r}</li>
                                    ))}
                                </ul>
                            </section>
                        </motion.aside>
                    </div>
                )}
            </main>
        </div>
    )
}
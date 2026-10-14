import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const GOLD = '#F2BF51'

const ID_TYPE_LABELS = {
    AADHAR: 'Aadhaar No.',
    COLLEGE_ID: 'College ID No.',
    PAN: 'PAN No.',
    DRIVING_LICENSE: 'Driving Licence No.',
}

const formatIst = (value) =>
    value
        ? new Date(value).toLocaleString('en-IN', {
              timeZone: 'Asia/Kolkata',
              day: 'numeric',
              month: 'short',
              hour: 'numeric',
              minute: '2-digit',
          })
        : 'N/A'

export default function ExitStatusModal({ pass, clockOffset = 0, onClose }) {
    const [now, setNow] = useState(() => Date.now() + clockOffset)

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now() + clockOffset), 1000)
        return () => clearInterval(timer)
    }, [clockOffset])

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [onClose])

    const rows = [
        ['Name', pass.name],
        ['Anwesha ID', pass.anwesha_id],
        ['Phone', pass.phone_number || 'N/A'],
        ['Email', pass.email_id || 'N/A'],
        [ID_TYPE_LABELS[pass.id_card_type] || 'ID Card No.', pass.id_card_number || 'N/A'],
        ['Event', pass.event_name],
        ['Entered at', formatIst(pass.entered_at)],
        ['Exited at', formatIst(pass.exited_at)],
    ]

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1100,
                padding: '16px',
            }}
            onClick={onClose}
        >
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="exit-pass-title"
                initial={{ opacity: 0, scale: 0.92, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                style={{
                    background: 'linear-gradient(145deg, rgba(24, 24, 30, 0.98), rgba(12, 12, 16, 0.98))',
                    border: '1px solid rgba(242, 191, 81, 0.45)',
                    borderRadius: '18px',
                    boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 35px rgba(242, 191, 81, 0.15)',
                    width: '100%',
                    maxWidth: '460px',
                    maxHeight: '92vh',
                    overflowY: 'auto',
                    padding: '30px 24px 24px',
                    position: 'relative',
                    color: '#ffffff',
                    fontFamily: "'Cormorant Garamond', serif",
                }}
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    title="Close"
                    aria-label="Close"
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(242, 191, 81, 0.35)',
                        color: GOLD,
                        borderRadius: '50%',
                        width: '34px',
                        height: '34px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        cursor: 'pointer',
                    }}
                >
                    ✕
                </button>

                <div style={{ textAlign: 'center' }}>
                    <div
                        style={{
                            width: '64px',
                            height: '64px',
                            margin: '0 auto 12px',
                            borderRadius: '50%',
                            background: 'rgba(46, 204, 113, 0.12)',
                            border: '2px solid #2ecc71',
                            color: '#2ecc71',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '32px',
                            fontWeight: '700',
                        }}
                    >
                        ✓
                    </div>
                    <h2
                        id="exit-pass-title"
                        style={{
                            color: GOLD,
                            fontFamily: "'DM Serif Display', serif",
                            fontSize: '26px',
                            margin: '0 0 4px 0',
                            letterSpacing: '0.5px',
                        }}
                    >
                        Exit Confirmed
                    </h2>
                    <p style={{ color: '#e0e0e0', fontSize: '18px', margin: '0 0 18px 0' }}>{pass.event_name}</p>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        background: 'rgba(242, 191, 81, 0.08)',
                        border: '1px solid rgba(242, 191, 81, 0.25)',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        marginBottom: '18px',
                    }}
                >
                    <motion.span
                        animate={{ opacity: [1, 0.25, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2ecc71', display: 'inline-block' }}
                    />
                    <span style={{ color: '#cccccc', fontSize: '15px' }}>Live time</span>
                    <span style={{ color: GOLD, fontSize: '22px', fontWeight: '700', fontVariantNumeric: 'tabular-nums' }}>
                        {new Date(now).toLocaleTimeString('en-IN', {
                            timeZone: 'Asia/Kolkata',
                            hour: 'numeric',
                            minute: '2-digit',
                            second: '2-digit',
                        })}
                    </span>
                </div>

                <div
                    style={{
                        border: '1px solid rgba(242, 191, 81, 0.2)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        marginBottom: '16px',
                    }}
                >
                    {rows.map(([label, value], index) => (
                        <div
                            key={label}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline',
                                gap: '16px',
                                padding: '10px 14px',
                                borderTop: index === 0 ? 'none' : '1px solid rgba(242, 191, 81, 0.12)',
                            }}
                        >
                            <span style={{ color: '#9a9a9a', fontSize: '15px', whiteSpace: 'nowrap' }}>{label}</span>
                            <span
                                style={{
                                    color: '#ffffff',
                                    fontSize: '17px',
                                    fontWeight: '700',
                                    textAlign: 'right',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {value}
                            </span>
                        </div>
                    ))}
                </div>

                <p style={{ color: '#ff8a80', fontSize: '15px', textAlign: 'center', margin: '0 0 18px 0' }}>
                    Your QR code no longer works for entry.
                </p>

                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={onClose}
                    style={{
                        width: '100%',
                        padding: '12px 24px',
                        background: 'linear-gradient(135deg, #F2BF51, #C39B54)',
                        border: 'none',
                        color: '#0a0a0c',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: '18px',
                        fontWeight: '700',
                        letterSpacing: '0.5px',
                    }}
                >
                    Done
                </motion.button>
            </motion.div>
        </div>
    )
}

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

const GOLD = '#F2BF51'

export default function AccommodationModal({ isOpen, onClose }) {
    const router = useRouter()

    if (!isOpen) return null

    const handleNavigate = () => {
        if (onClose) onClose()
        router.push('/accommodation')
    }

    return (
        <AnimatePresence>
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
                    padding: '20px',
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 25 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 25 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    style={{
                        background: 'linear-gradient(145deg, rgba(24, 24, 30, 0.98), rgba(12, 12, 16, 0.98))',
                        border: '1px solid rgba(242, 191, 81, 0.45)',
                        borderRadius: '18px',
                        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 35px rgba(242, 191, 81, 0.15)',
                        width: '100%',
                        maxWidth: '520px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: '36px 30px',
                        position: 'relative',
                        color: '#ffffff',
                        fontFamily: "'Cormorant Garamond', serif",
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
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
                            transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(242, 191, 81, 0.25)'
                            e.currentTarget.style.transform = 'scale(1.1)'
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                            e.currentTarget.style.transform = 'scale(1)'
                        }}
                        title="Close"
                    >
                        ✕
                    </button>

                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                        <div style={{ fontSize: '44px', marginBottom: '10px' }}>🏨</div>
                        <h2
                            style={{
                                color: GOLD,
                                fontFamily: "'DM Serif Display', serif",
                                fontSize: '26px',
                                margin: '0 0 8px 0',
                                letterSpacing: '0.5px',
                            }}
                        >
                            Need Accommodation?
                        </h2>
                        <p
                            style={{
                                color: '#e0e0e0',
                                fontSize: '18px',
                                lineHeight: '1.5',
                                marginBottom: '22px',
                            }}
                        >
                            Registered in events for <strong>Anwesha 2027</strong> and need a comfortable stay on campus?
                        </p>

                        <div
                            style={{
                                background: 'rgba(242, 191, 81, 0.08)',
                                border: '1px solid rgba(242, 191, 81, 0.25)',
                                borderRadius: '12px',
                                padding: '18px',
                                textAlign: 'left',
                                marginBottom: '26px',
                                fontSize: '15px',
                                lineHeight: '1.7',
                                color: '#cccccc',
                            }}
                        >
                            <div style={{ color: GOLD, fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>✨ Facilities Available:</div>
                            <div>• Safe & Secure Hostel Rooms inside IIT Patna Campus</div>
                            <div>• Optional Mess & Dining Meal Add-ons</div>
                            <div>• Hassle-free check-in for registered participants</div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                type="button"
                                onClick={handleNavigate}
                                style={{
                                    width: '100%',
                                    maxWidth: '340px',
                                    padding: '13px 24px',
                                    background: 'linear-gradient(135deg, #F2BF51, #C39B54)',
                                    border: 'none',
                                    color: '#0a0a0c',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    letterSpacing: '0.5px',
                                    boxShadow: '0 4px 20px rgba(242, 191, 81, 0.4)',
                                }}
                            >
                                Request Accommodation
                            </motion.button>
                            <button
                                type="button"
                                onClick={onClose}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#888',
                                    cursor: 'pointer',
                                    fontSize: '15px',
                                    textDecoration: 'underline',
                                }}
                            >
                                Maybe later
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

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
                    backdropFilter: 'blur(10px)',
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
                        background: 'linear-gradient(145deg, rgba(20, 20, 25, 0.98), rgba(10, 10, 14, 0.98))',
                        border: '1px solid rgba(255, 255, 255, 0.22)',
                        borderRadius: '20px',
                        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 255, 255, 0.08)',
                        width: '100%',
                        maxWidth: '520px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: '36px 30px',
                        position: 'relative',
                        color: '#ffffff',
                        fontFamily: "'Laila', serif",
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
                            border: '1px solid rgba(255, 255, 255, 0.25)',
                            color: '#ffffff',
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
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
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
                                color: '#ffffff',
                                fontFamily: "'DM Serif Display', serif",
                                fontSize: '28px',
                                margin: '0 0 8px 0',
                                letterSpacing: '0.5px',
                            }}
                        >
                            Need Accommodation?
                        </h2>
                        <p
                            style={{
                                color: 'rgba(255, 255, 255, 0.85)',
                                fontSize: '16px',
                                lineHeight: '1.6',
                                marginBottom: '22px',
                            }}
                        >
                            Registered in events for <strong>Anwesha 2027</strong> and need a comfortable stay on campus?
                        </p>

                        <div
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                borderRadius: '14px',
                                padding: '18px',
                                textAlign: 'left',
                                marginBottom: '26px',
                                fontSize: '15px',
                                lineHeight: '1.7',
                                color: 'rgba(255, 255, 255, 0.88)',
                            }}
                        >
                            <div style={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>✨ Facilities Available:</div>
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
                                    padding: '14px 24px',
                                    background: '#ffffff',
                                    border: 'none',
                                    color: '#000000',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    letterSpacing: '0.5px',
                                    boxShadow: '0 4px 22px rgba(255, 255, 255, 0.25)',
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
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    cursor: 'pointer',
                                    fontSize: '14px',
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

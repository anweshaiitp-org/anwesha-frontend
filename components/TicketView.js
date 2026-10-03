import React, { useRef } from 'react'

export default function TicketView({ name, anweshaId, college, ticketType, qrToken }) {
    const ticketRef = useRef(null)
    const title = ticketType ? String(ticketType).replace(/_/g, ' ').toUpperCase() : 'ENTRY PASS'
    const qrValue = typeof window === 'undefined' ? qrToken : `${window.location.origin}/ticket?token=${encodeURIComponent(qrToken)}`

    const downloadTicket = () => {
        const svg = ticketRef.current
        if (!svg) return
        const source = new XMLSerializer().serializeToString(svg)
        const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `anwesha-ticket-${anweshaId || 'pass'}.svg`
        link.click()
        URL.revokeObjectURL(url)
    }

    const shareTicket = async () => {
        const shareData = { title: 'Anwesha Entry Ticket', text: `Anwesha ticket for ${name}`, url: window.location.href }
        if (navigator.share) await navigator.share(shareData)
        else await navigator.clipboard.writeText(window.location.href)
    }

    return (
        <div style={{ width: '100%', maxWidth: 900, margin: '0 auto' }}>
            <svg ref={ticketRef} viewBox="0 0 900 380" role="img" aria-label={`${name} Anwesha ticket`} style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 22, boxShadow: '0 18px 40px -14px rgba(0,0,0,.6)' }}>
                <defs><linearGradient id="ticketBg" x1="0" y1="0" x2="900" y2="380"><stop stopColor="#17223b" /><stop offset=".55" stopColor="#0d1730" /><stop offset="1" stopColor="#223a5e" /></linearGradient></defs>
                <rect width="900" height="380" rx="22" fill="url(#ticketBg)" />
                <path d="M35 35h580M35 345h580" stroke="#d9a94e" opacity=".5" />
                <text x="45" y="55" fontFamily="'Ticket Display', 'Playfair Display', serif" fill="#f2efe2" fontSize="25" fontWeight="700">Anwesha</text>
                <text x="45" y="75" fontFamily="'Ticket Poppins', Poppins, sans-serif" fill="#d9a94e" fontSize="9" letterSpacing="2">INDIAN INSTITUTE OF TECHNOLOGY, PATNA</text>
                <text x="45" y="145" fontFamily="'Ticket Display', 'Yatra One', cursive" fill="#f2efe2" fontSize="50" fontWeight="700">GARBHA</text>
                <text x="45" y="195" fontFamily="'Ticket Display', 'Yatra One', cursive" fill="#f0ce8f" fontSize="50" fontWeight="700">NIGHT</text>
                <text x="45" y="235" fontFamily="'Ticket Poppins', Poppins, sans-serif" fill="#d9a94e" fontSize="10" letterSpacing="2">VENUE</text>
                <text x="45" y="255" fontFamily="'Ticket Poppins', Poppins, sans-serif" fill="#f2efe2" fontSize="15">Fest Arena, IIT Patna</text>
                <text x="360" y="235" fontFamily="'Ticket Poppins', Poppins, sans-serif" fill="#d9a94e" fontSize="10" letterSpacing="2">TIME</text>
                <text x="360" y="255" fontFamily="'Ticket Poppins', Poppins, sans-serif" fill="#f2efe2" fontSize="15">7:00 PM Onwards</text>
                <text x="45" y="285" fontFamily="'Ticket Poppins', Poppins, sans-serif" fill="#d9a94e" fontSize="10" letterSpacing="2">PASS HOLDER</text>
                <text x="45" y="313" fontFamily="'Ticket Poppins', Poppins, sans-serif" fill="#f2efe2" fontSize="22" fontWeight="700">{name}</text>
                <text x="360" y="285" fontFamily="'Ticket Poppins', Poppins, sans-serif" fill="#d9a94e" fontSize="10" letterSpacing="2">ANWESHA ID</text>
                <text x="360" y="313" fontFamily="'JetBrains Mono', monospace" fill="#f2efe2" fontSize="17">{anweshaId}</text>
                <text x="45" y="335" fontFamily="'Ticket Poppins', Poppins, sans-serif" fill="#d9a94e" fontSize="10" letterSpacing="2">COLLEGE</text>
                <text x="45" y="355" fontFamily="'Ticket Poppins', Poppins, sans-serif" fill="#f2efe2" fontSize="13">{college || 'N/A'}</text>
                <line x1="660" y1="25" x2="660" y2="355" stroke="#d9a94e" strokeDasharray="5 6" />
                <text x="780" y="40" textAnchor="middle" fill="#d9a94e" fontSize="10" letterSpacing="2">SCAN TO VERIFY</text>
                <rect x="680" y="60" width="200" height="200" rx="12" fill="#f2efe2" />
                <image href={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrValue)}`} x="690" y="70" width="180" height="180" />
                <text x="780" y="300" textAnchor="middle" fill="#d9a94e" fontSize="12" fontWeight="700">{title}</text>
                <text x="780" y="340" textAnchor="middle" fill="#d9a94e" fontSize="9" letterSpacing="2">OFFICIAL ENTRY PASS</text>
            </svg>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 20 }}>
                <button type="button" onClick={downloadTicket}>Download ticket</button>
                <button type="button" onClick={shareTicket}>Share ticket</button>
            </div>
        </div>
    )
}


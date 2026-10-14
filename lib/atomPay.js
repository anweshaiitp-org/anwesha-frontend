const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'
const ATOM_SCRIPT_SRC = 'https://psa.atomtech.in/staticdata/ots/js/atomcheckout.js'

const loadAtomScript = () =>
    new Promise((resolve, reject) => {
        if (window.AtomPaynetz) {
            resolve()
            return
        }
        const script = document.createElement('script')
        script.src = ATOM_SCRIPT_SRC
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load payment gateway.'))
        document.body.appendChild(script)
    })

const listenForCancel = (orderId) => {
    const handleCancel = async (event) => {
        if (event.data !== 'cancelTransaction' && event.data !== 'sessionTimeout') return
        window.removeEventListener('message', handleCancel)
        if (!orderId) return
        try {
            await fetch('/api/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: orderId, status: 'CANCELLED', action: 'cancel' }),
            })
        } catch (err) {
            console.error('Cancel notify error:', err)
        }
        window.location.href = `/payment-status?order=${encodeURIComponent(orderId)}&success=false&status=CANCELLED`
    }
    window.addEventListener('message', handleCancel)
}

export async function startAtomPayment({ domain, referenceId, teamId, authHeaders = {} }) {
    const payload = { domain, reference_id: referenceId }
    if (teamId) payload.team_id = teamId

    const res = await fetch(`${host}/payment/initiate`, {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))

    if (!res.ok || !data.success || !data.atomTokenId) {
        throw new Error(data.message || 'Failed to initiate payment.')
    }

    await loadAtomScript()
    listenForCancel(data.merchTxnId || data.orderId)

    new window.AtomPaynetz(
        {
            atomTokenId: String(data.atomTokenId),
            merchId: String(data.merchId || '564719'),
            custEmail: data.custEmail || '',
            custMobile: data.custMobile || '',
            returnUrl: data.returnUrl || `${window.location.origin}/api/payment/verify`,
        },
        'prod'
    )
}

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../styles/ticket.module.css'
import TicketSVG from '../components/TicketSVG'

const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'

/* ---------- helpers ---------- */

const resolveScheme = (type = '') =>
    /stay|overnight|acc/i.test(String(type)) ? 'garbha_stay' : 'garbha'

function describeError(kind, serverMessage) {
    switch (kind) {
        case 'no-token':
            return {
                title: 'This link is incomplete',
                message: 'The ticket link is missing its token. Open the link from your confirmation email or your Anwesha dashboard.',
                retryable: false,
            }
        case 'not-found':
            return {
                title: 'Ticket not found',
                message: serverMessage || 'We could not find a ticket for this link. It may have been copied incorrectly.',
                retryable: false,
            }
        case 'invalid':
            return {
                title: 'Ticket is not valid',
                message: serverMessage || 'This ticket cannot be used. If you think this is a mistake, contact the Anwesha team with your Anwesha ID.',
                retryable: false,
            }
        case 'closed':
            return {
                title: 'Ticket closed after exit',
                message: serverMessage || 'You marked your exit, so this ticket can no longer be used for entry.',
                retryable: false,
            }
        case 'rate-limit':
            return {
                title: 'Too many attempts',
                message: 'Please wait a minute and try again.',
                retryable: true,
            }
        case 'server':
            return {
                title: 'Our server had a problem',
                message: 'Your ticket is safe. Please try again in a moment.',
                retryable: true,
            }
        default:
            return {
                title: 'Connection problem',
                message: 'We could not reach the server. Check your internet connection and try again.',
                retryable: true,
            }
    }
}

const kindFromStatus = (status) => {
    if (status === 404) return 'not-found'
    if (status === 410) return 'closed'
    if (status === 400 || status === 401 || status === 403) return 'invalid'
    if (status === 429) return 'rate-limit'
    if (status >= 500) return 'server'
    return 'invalid'
}

const blobToDataUrl = (blob) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    })

const prepareSvgClone = async (svg) => {
    const clone = svg.cloneNode(true)
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')

    // Unwrap foreignObject if any so Canvas rasterizer won't choke on it
    clone.querySelectorAll('foreignObject').forEach((fo) => {
        const innerSvg = fo.querySelector('svg')
        if (innerSvg) {
            const x = fo.getAttribute('x') || '0'
            const y = fo.getAttribute('y') || '0'
            const w = fo.getAttribute('width') || '180'
            const h = fo.getAttribute('height') || '180'
            innerSvg.setAttribute('x', x)
            innerSvg.setAttribute('y', y)
            innerSvg.setAttribute('width', w)
            innerSvg.setAttribute('height', h)
            fo.replaceWith(innerSvg)
        }
    })

    const images = Array.from(clone.querySelectorAll('image'))
    await Promise.all(
        images.map(async (img) => {
            const href = img.getAttribute('href') || img.getAttribute('xlink:href')
            if (!href || href.startsWith('data:')) return
            try {
                const absoluteUrl = new URL(href, window.location.href).href
                const res = await fetch(absoluteUrl)
                const blob = await res.blob()
                const dataUrl = await blobToDataUrl(blob)
                img.setAttribute('href', dataUrl)
                img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', dataUrl)
            } catch (err) {
                console.error('Failed to inline image in SVG:', href, err)
            }
        })
    )

    return clone
}

const triggerDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(url), 1500)
}

/* ---------- small UI pieces ---------- */

function TicketFrame({ children, busy = false }) {
    // Landscape on wide screens, rotated to portrait on phones (see CSS)
    return (
        <div className={styles.frame} aria-busy={busy}>
            <div className={styles.frameInner}>{children}</div>
        </div>
    )
}

function TicketSkeleton() {
    return (
        <>
            <TicketFrame busy>
                <div className={styles.skeleton}>
                    <div className={styles.skLeft}>
                        <span className={`${styles.skBar} ${styles.skLogo}`} />
                        <span className={`${styles.skBar} ${styles.skTitle}`} />
                        <span className={`${styles.skBar} ${styles.skTitleShort}`} />
                        <span className={`${styles.skBar} ${styles.skLine}`} />
                        <span className={`${styles.skBar} ${styles.skLine}`} />
                        <span className={`${styles.skBar} ${styles.skLineShort}`} />
                    </div>
                    <div className={styles.skRight}>
                        <span className={styles.skQr} />
                    </div>
                </div>
            </TicketFrame>
            <p className={styles.status} role="status" aria-live="polite">
                <span className={styles.spinner} aria-hidden="true" />
                Verifying your ticket…
            </p>
        </>
    )
}

function ErrorPanel({ error, onRetry }) {
    return (
        <div className={styles.errorPanel} role="alert">
            <svg className={styles.errorIcon} viewBox="0 0 48 48" aria-hidden="true">
                <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
                <path d="M24 13v14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                <circle cx="24" cy="34" r="2.2" fill="currentColor" />
            </svg>
            <h1 className={styles.errorTitle}>{error.title}</h1>
            <p className={styles.errorText}>{error.message}</p>
            <div className={styles.actions}>
                {error.retryable && (
                    <button type="button" className={styles.btnPrimary} onClick={onRetry}>
                        Try again
                    </button>
                )}
                <a className={styles.btnGhost} href="/">Go to Anwesha</a>
            </div>
        </div>
    )
}

/* ---------- page ---------- */

function TicketPage() {
    const router = useRouter()
    const { token } = router.query

    const ticketSvgRef = useRef(null)
    const [ticketData, setTicketData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [attempt, setAttempt] = useState(0)
    const [copied, setCopied] = useState(false)
    const [downloading, setDownloading] = useState(false)

    const retry = useCallback(() => setAttempt((n) => n + 1), [])

    const downloadTicket = async () => {
        const svg = ticketSvgRef.current
        if (!svg || downloading) return
        setDownloading(true)

        const baseName = `anwesha-ticket-${ticketData?.anwesha_id || ticketData?.anweshaId || 'pass'}`

        try {
            if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
                try {
                    await document.fonts.ready
                } catch {
                    /* continue */
                }
            }

            const preparedSvg = await prepareSvgClone(svg)
            const svgString = new XMLSerializer().serializeToString(preparedSvg)
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })

            let pngSuccess = false
            try {
                const svgUrl = URL.createObjectURL(svgBlob)
                const img = new Image()
                img.crossOrigin = 'anonymous'

                await new Promise((resolve, reject) => {
                    img.onload = () => resolve()
                    img.onerror = (e) => reject(e)
                    img.src = svgUrl
                })

                const canvas = document.createElement('canvas')
                canvas.width = 1800
                canvas.height = 760
                const ctx = canvas.getContext('2d')

                if (ctx) {
                    ctx.imageSmoothingEnabled = true
                    ctx.imageSmoothingQuality = 'high'
                    ctx.drawImage(img, 0, 0, 1800, 760)
                    URL.revokeObjectURL(svgUrl)

                    const pngBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
                    if (pngBlob) {
                        triggerDownload(pngBlob, `${baseName}.png`)
                        pngSuccess = true
                    }
                } else {
                    URL.revokeObjectURL(svgUrl)
                }
            } catch (canvasErr) {
                console.warn('[Ticket] Canvas PNG export failed, falling back to SVG:', canvasErr)
            }

            if (!pngSuccess) {
                // Fallback: download standalone SVG with inlined base64 images
                triggerDownload(svgBlob, `${baseName}.svg`)
            }
        } catch (err) {
            console.error('[Ticket] Error preparing ticket download:', err)
            try {
                const fallbackString = new XMLSerializer().serializeToString(svg)
                const fallbackBlob = new Blob([fallbackString], { type: 'image/svg+xml;charset=utf-8' })
                triggerDownload(fallbackBlob, `${baseName}.svg`)
            } catch {
                /* fallback failed */
            }
        } finally {
            setDownloading(false)
        }
    }

    const shareTicket = async () => {
        const shareData = {
            title: 'Anwesha 2k27 Entry Ticket',
            text: `Anwesha Entry Ticket for ${ticketData?.name || 'Ticket holder'}`,
            url: window.location.href,
        }
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share(shareData)
            } catch {
                /* cancelled by user */
            }
        } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
            await navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        }
    }

    useEffect(() => {
        if (!router.isReady) return

        if (!token) {
            setLoading(false)
            setTicketData(null)
            setError(describeError('no-token'))
            return
        }

        const controller = new AbortController()

        const resolveTicket = async () => {
            try {
                setLoading(true)
                setError(null)
                setTicketData(null)

                const response = await fetch(
                    `${host}/users/ticket/resolve?token=${encodeURIComponent(token)}`,
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                        signal: controller.signal,
                    }
                )

                let data = null
                try {
                    data = await response.json()
                } catch {
                    /* non-JSON body */
                }

                if (!response.ok) {
                    setError(describeError(kindFromStatus(response.status), data?.message))
                    return
                }

                const payload = data?.data || data
                if (!payload || typeof payload !== 'object') {
                    setError(describeError('invalid'))
                    return
                }

                setTicketData(payload)
            } catch (err) {
                if (err.name === 'AbortError') return
                console.error('[Ticket] Error resolving ticket:', err)
                setError(describeError('network'))
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }

        resolveTicket()
        return () => controller.abort()
    }, [router.isReady, token, attempt])

    const ticketType = ticketData?.ticket_type || ticketData?.ticketType
    const scheme = resolveScheme(ticketType)
    const showTicket = ticketData && !loading && !error

    return (
        <>
            <Head>
                <title>Entry Ticket | Anwesha 2k27</title>
                <meta name="description" content="Anwesha 2k27 Entry Ticket" />
                <meta name="robots" content="noindex" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#14090f" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600&family=Playfair+Display:wght@800&family=Poppins:wght@500;600;700&family=Yatra+One&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <main className={styles.page}>
                <header className={styles.header}>
                    <span className={styles.brand}>Anwesha 2k27</span>
                    <span className={styles.brandSub}>IIT Patna</span>
                </header>

                <section className={styles.stage}>
                    {loading && <TicketSkeleton />}

                    {!loading && error && <ErrorPanel error={error} onRetry={retry} />}

                    {showTicket && (
                        <>
                            <div className={styles.verified}>
                                <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                                    <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.18" />
                                    <path d="M6 10.5l2.5 2.5L14 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Ticket verified
                            </div>

                            <TicketFrame>
                                <TicketSVG
                                    ref={ticketSvgRef}
                                    name={ticketData.name || 'Ticket holder'}
                                    anweshaId={ticketData.anwesha_id || ticketData.anweshaId || 'N/A'}
                                    college={ticketData.college}
                                    scheme={scheme}
                                    qrToken={token}
                                />
                            </TicketFrame>

                            <div className={styles.actions}>
                                <button
                                    type="button"
                                    className={styles.btnPrimary}
                                    onClick={downloadTicket}
                                    disabled={downloading}
                                    style={downloading ? { opacity: 0.75, cursor: 'wait' } : undefined}
                                >
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }} aria-hidden="true">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                    {downloading ? 'Preparing Ticket…' : 'Download Ticket'}
                                </button>
                                <button type="button" className={styles.btnGhost} onClick={shareTicket}>
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }} aria-hidden="true">
                                        <circle cx="18" cy="5" r="3" />
                                        <circle cx="6" cy="12" r="3" />
                                        <circle cx="18" cy="19" r="3" />
                                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                    </svg>
                                    {copied ? 'Link Copied!' : 'Share Ticket'}
                                </button>
                            </div>

                            <p className={styles.hint}>
                                Show this QR code at the entry gate. Turn your screen brightness up for faster scanning.
                            </p>
                        </>
                    )}
                </section>
            </main>
        </>
    )
}

export default TicketPage
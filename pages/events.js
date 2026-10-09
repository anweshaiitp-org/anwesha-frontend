import styles from '../styles/events.module.css'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Card from '../components/EventItem/index.js'
// import Modal from '../components/EventItem/Modal.js'
import EventItem from '../components/EventItem'
import Modal from '../components/BigModal/index.js'
// import eventsDetails from '../public/events/events_data.json' assert { type: 'json' };

// DEPRECATED: Static event data - now fetched from backend /event/allevents
// const staticEventsData = [
//     { "Event Name": "Animecon", "poster": '/events/Animecon.png' },
//     { "Event Name": "arTEEst", "poster": '/events/Arteest.png' },
//     { "Event Name": "Bespoke", "poster": '/events/Bespoke.png' },
//     { "Event Name": "Chronoshift", "poster": '/events/Chronoshift.png' },
//     { "Event Name": "Comedy Crunch", "poster": '/events/Comedy Crunch.png' },
//     { "Event Name": "Cook off", "poster": '/events/Cook off.png' },
//     { "Event Name": "Darpan", "poster": '/events/Darpan.png' },
//     { "Event Name": "Ekal", "poster": '/events/ekal.png' },
//     { "Event Name": "Escape Room", "poster": '/events/Escape Room.png' },
//     { "Event Name": "Heelturn(solo-duet and group)", "poster": '/events/Heel Turn.png' },
//     { "Event Name": "Imagination Station", "poster": '/events/imagination.png' },
//     { "Event Name": "IncorporARTion", "poster": '/events/incorpration.png' },
//     { "Event Name": "Kalapravah", "poster": '/events/kalapravah.png' },
//     { "Event Name": "Maidan-e-jung", "poster": '/events/Maidan -e- jung.png' },
//     { "Event Name": "Mixology", "poster": '/events/Mixology.png' },
//     { "Event Name": "Mr-Ms Anwesha", "poster": '/events/MRMS.png' },
//     { "Event Name": "Parakh", "poster": '/events/parakh.png' },
//     { "Event Name": "ProtoUI", "poster": '/events/proroUI.png' },
//     { "Event Name": "Reelverse", "poster": '/events/reelverse.png' },
//     { "Event Name": "Satanz Tantrum", "poster": '/events/Satanz Tantrum.png' },
//     { "Event Name": "Silent Expo", "poster": '/events/silent expo.png' },
//     { "Event Name": "Step Up", "poster": '/events/step up.png' },
//     { "Event Name": "Syngphony", "poster": '/events/syngphony.png' },
//     { "Event Name": "Verve", "poster": '/events/Verve.png' },
// ];

// const workshopcardarr = [{
//     "Event Name": "techgyan x Anwesha",
//     "poster": '/events/workshopPoster.jpeg',
//     "Event": "2 days of workshop",
// }]

const dmSerif = { className: 'font-dm-serif' }

const SponsorsSlider = ({ images, animation_duration = -1 }) => {
    const width = 127.381; // IF YOU CHANGE THIS THEN CHANGE IT INSIDE autoScrollSponseAnimation ALSO
    const heigth = 127.381;
    const duration = animation_duration <= 0 ? Math.floor(10 * (images.length / 7)) : animation_duration;

    const gap = 16;
    return <div style={{
        position: "relative",
        backgroundColor: "inherit",
        // minWidth: width * (images.length + 1),
        minWidth: (width + gap) * images.length,
        height: heigth
    }}>
        {
            images.map((src, index) =>
                <div key={index} className={styles.autoScrollSponseAnimation} style={{
                    width: "100%",
                    position: "absolute",
                    left: "100%",
                    // zIndex: 8,
                    animationDelay: `${(duration / images.length) * index}s`,
                    animationDuration: `${duration}s`,
                    '--width': width
                }}>
                    <Image src={src} width={width} height={heigth} />
                </div>
            )
        }
    </div>
}

const Events = () => {
    const [fadeOut, setFadeOut] = useState(false)

    // Handling fade-out effect on scroll   
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY
            setFadeOut(scrollPosition > window.innerHeight / 4)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleWorkshopNavigation = () => {
        window.location.href = "https://tech-gyan.in/workshop-iit-patna-checkout/";
    };


    let exceludedEvents = [
    ]


    const sponsorImages = [
        'https://drive.google.com/uc?export=view&id=1l_vpcAfYAtr3AP4Md-paIDs8hCW63f8F',
        'https://drive.google.com/uc?export=view&id=1OcvrKTeQ8phRXxsWu0YcyzoAab1mHR49',
        'https://drive.google.com/uc?export=view&id=1PXcineBGikMCaFLUoTTuUQaym8pJ1Sc6',
        'https://drive.google.com/uc?export=view&id=1Z5NoN4Vmqn1fIhUKDLP_sHYEq4q-94Yp',
        'https://drive.google.com/uc?export=view&id=1SLrXJ80AVdQpPUF13I0b7NXbg1v7Nj_U',
        'https://drive.google.com/uc?export=view&id=12QRWpz1VcmGWjpzEhJjY2nWklnMSPyB5',
        'https://drive.google.com/uc?export=view&id=1URhEbkKWoYat8VcvzZRuklBAtnD42G_j',
        'https://drive.google.com/uc?export=view&id=1k_iwlhOsIEFMw-iJ2YAh98QEDCHgtAi5',
        'https://drive.google.com/uc?export=view&id=1tpyLgLBAxsmKnhxiXooqcf8GAKAMMIgM',
        'https://drive.google.com/uc?export=view&id=18dIDe9EUzqScqL1_vAONFhAsGG4PmRF4',
        'https://drive.google.com/uc?export=view&id=1TpQ19hmSOS2TNUJi6oidSw7Y602ft2El',
        'https://drive.google.com/uc?export=view&id=1hWWaY3ziGTs2fAtamI4muzcRP4kQkD7G',
        'https://drive.google.com/uc?export=view&id=15CbVUgi5i_ARRAtobM9_Pn2GjLyBjaAp',
        'https://drive.google.com/uc?export=view&id=1XvW-FVYrOL8aZCsXs4Urw4FzEO7DMjBm',
        // 'https://drive.google.com/uc?export=view&id=1MRbo4eu7KrYeSjq090nmItjAbv_OQEok',
        'https://drive.google.com/uc?export=view&id=1sNg1jeEC5MRsFseSgM7VXPH8iwbBUTOD',
        'https://drive.google.com/uc?export=view&id=1pNXnnkDvLYUYUqU7-dh_ZDxLqZToHjxn',
        'https://drive.google.com/uc?export=view&id=1BqokvuSQnMepjv0y41KTlgcCKeaMuAWO',
        'https://drive.google.com/uc?export=view&id=1CBELU9HNCW-9UPzF5aFNduSti6FT0WO-',
        'https://drive.google.com/uc?export=view&id=1ER70uJpKmRnH8AWQN3xok84_Sesi5zHw',
        'https://drive.google.com/uc?export=view&id=1WJ4_WS3-x-BqtCItSSqQ2AxtxNX723vm',
        'https://drive.google.com/uc?export=view&id=1i3YuJQMgDqE6ig0JqZAEE0Fe_S9Kn0GD',
        'https://drive.google.com/uc?export=view&id=1xcQdl747tYi3ZY3uxeecoVVXjHpLn0J_',
        'https://drive.google.com/uc?export=view&id=18O2pdC3iAelrCxZATs-lZ1ySKyPR7nUp',
        'https://drive.google.com/uc?export=view&id=1wMgI-ijHi7fF6IbNzxtfN-JHhUdUBXja',
        'https://drive.google.com/uc?export=view&id=1eY1Kfmj6-48BvKbezYjLBLLxR5UD0-Dj',
        'https://drive.google.com/uc?export=view&id=1qJfVG_fdIyZxQrURGjUJIefdj_EXJnvX',
        'https://drive.google.com/uc?export=view&id=1YhJLV3VoL9o4lNF8MSf0jqNmOr10EmRs',
        // 'https://drive.google.com/uc?export=view&id=1UaIXFovMDArchg1xgKpO6jN6kx5Je2yD',
        'https://drive.google.com/uc?export=view&id=1TewMkN2e3bI_-ahRpD3sWk5J_7hvnj2Q',
        'https://drive.google.com/uc?export=view&id=1Y5m4LFHEMFWFDJPhsZSpIT02P0U8qU1e',
        'https://drive.google.com/uc?export=view&id=1wKHW-An6PKqP-wBUqPStms4IFg_sH5aR',
    ]
    const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'
    const mediaBase = process.env.NEXT_PUBLIC_MEDIA_BASE || host
    const [events, setEvents] = useState([])
    const [specialEvents, setSpecialEvents] = useState([])
    const [filteredEvents, setFilteredEvents] = useState([]) // Manages the filtered events
    const [loading, setLoading] = useState(true)

    const makePosterUrl = (url) => {
        if (!url) return '/events/poster.png'
        if (url.startsWith('http://') || url.startsWith('https://')) return url
        console.log('[Events] Raw poster URL from backend:', url)
        const base = (mediaBase || '').replace(/\/$/, '')
        const path = url.startsWith('/') ? url : `/${url}`
        const fullUrl = `${base}${path}`
        console.log('[Events] Constructed full URL:', fullUrl)
        return fullUrl
    }

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(`${host}/events`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })
                const data = await res.json()
                const eventsArray = Array.isArray(data) ? data : (data.events || [])
                const normalized = eventsArray.map((ev) => ({
                        ...ev,
                        poster: makePosterUrl(ev.poster_file || ev.poster || ev.poster_url),
                        name: ev.name || ev["Event Name"] || '',
                    }))
                normalized.forEach((ev, idx) => {
                    console.log(`[Events] ${idx} poster:`, ev.poster)
                })
                setEvents(normalized)
                setFilteredEvents(normalized)

                const specialRes = await fetch(`${host}/events/special`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })
                const specialData = await specialRes.json()
                const specialList = Array.isArray(specialData) ? specialData : (specialData.events || specialData.special_events || specialData.specialEvents || specialData.data || [])
                const normalizedSpecial = specialList.map((ev) => ({
                    ...ev,
                    poster: makePosterUrl(ev.poster_file || ev.poster || ev.poster_url),
                    name: ev.name || ev["Event Name"] || '',
                }))
                setSpecialEvents(normalizedSpecial)
            } catch (e) {
                console.error('Failed to fetch events', e)
                setEvents([])
                setFilteredEvents([])
                setSpecialEvents([])
            } finally {
                setLoading(false)
            }
        }
        fetchEvents()
    }, [host])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (e) => {
        const query = e.target.value
        setSearchQuery(query)

        if (query.trim() === '') {
            setIsSearching(false)
            setSearchResults([])
        } else {
            setIsSearching(true)
            const results = events.filter((event) =>
                (event.name || '').toLowerCase().includes(query.toLowerCase())
            )
            setSearchResults(results)
        }
    }


    const openModal = (event) => {
        console.log('Modal opened for event:', event)
        setSelectedEvent(event)
        setIsModalOpen(true)
    }


    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedEvent(null)
    }
    return (
        <div className={styles.mainContainer}>
            <Head>
                <title>Events - Anwesha 2026</title>
                <meta name="description" content="Events-Anwesha 2026" />
                <link rel="icon" href="./logo_no_bg.svg" />
            </Head>

            <div className={styles.container}>
                <div className={styles.titleBox}>
                    <div className={styles.titleText}>EXPLORE THE EVENTS</div>
                </div>
                {loading ? (
                    <div style={{ color: 'white', fontSize: '24px', textAlign: 'center', width: '100%', margin: '40px 0' }}>
                        Loading events...
                    </div>
                ) : events.length === 0 ? (
                    <div style={{ color: 'white', fontSize: '24px', textAlign: 'center', width: '100%', margin: '40px 0' }}>
                        Currently there are no events or we are not accepting registration
                    </div>
                ) : (
                    <>
                        <div className={`${styles.searchContainer}`}>
                            <div className={`${styles.searchbox}`}>
                                <input
                                    className={styles.searchbar}
                                    type="text"
                                    placeholder="Search Events"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <img src="/events/search_icon.svg" alt="" />
                            </div>
                        </div>

                {/* Featured Events Section - Below Search Bar on First Page */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    {isSearching && searchResults.length === 0 && (
                        <div style={{ color: 'white', fontSize: '24px', textAlign: 'center', width: '100%', marginBottom: '5px' , marginTop:'20px' }}>
                            No events found
                        </div>
                    )}
                    <div className={styles.featuredEventsSection}>
                        {isSearching && searchResults.length > 0 ? (
                            // Show search results
                            searchResults.slice(0, 3).map((item, idx) => (
                                <div key={idx} className={styles.featuredCard} style={{ filter: 'grayscale(100%)' }}>
                                    <Card
                                        onClick={() => window.open(`/events/${item.id || item._id}`, '_blank')}
                                        event={item}
                                        closeHandler={closeModal}
                                    />
                                </div>
                            ))
                        ) : (
                            // Default 3 featured cards (shown when not searching OR when no results)
                            <>
                                {specialEvents.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className={styles.featuredCard} style={{ filter: 'grayscale(100%)' }}>
                                        <Card
                                            onClick={() => window.open(`/events/${item.id || item._id}`, '_blank')}
                                            event={item}
                                            closeHandler={closeModal}
                                        />
                                    </div>
                                ))}
                            </>
                        )}
                        <div className={styles.hero_button}>
                            <button
                                className={styles.sexy_button}
                                onClick={() => window.open('/Anwesha_26_EVENTS_RULEBOOK.pdf', '_blank')}
                            >
                                Rulebook
                            </button>
                        </div>
                    </div>
                </div>


                <div className={styles.eventsPanel}>
                    <div className={styles.eventsPanelTitle}>EVENTS</div>
                    <div className={styles.cardContainer}>
                        {events.map((item, idx) => (
                            <Card
                                onClick={() => window.open(`/events/${item.id || item._id}`, '_blank')}
                                key={idx}
                                event={item}
                                closeHandler={closeModal}
                            />
                        ))}
                    </div>
                </div>
                </>
                )}
                {isModalOpen && (
                    <Modal
                        title={(selectedEvent?.name || '').split('#')[0]}
                        body={selectedEvent}
                        closeHandler={closeModal}
                    />
                )}
            </div>

            {/* Sponsors */}
            <section className={styles.sponsors}>
                <div className={styles.sponsors_title}>
                    <h2 className={dmSerif.className}>Our Proud Sponsors</h2>
                    <h3>Strengthening the Vision Together</h3>
                </div>
                <div className={styles.sponsors_images_slider}>
                    <SponsorsSlider images={sponsorImages} />
                </div>
            </section>
        </div>
    )
}
export default Events

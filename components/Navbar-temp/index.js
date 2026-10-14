import styles from './styles.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../authContext'
import { useRouter } from 'next/router'
import Logo from '../Rive/logo'
import { ButtonLoader } from '../Loader'
import { ChevronRight, LogOut } from 'lucide-react'
import { useRive, useStateMachineInput } from '@rive-app/react-canvas'
const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'
const STATE_MACHINE_NAME = 'Basic State Machine'
const INPUT_NAME = 'Switch'

const DRAWER_LINKS = [
    { label: 'Home', href: '/', match: ['/'] },
    { label: 'Events', href: '/events', match: ['/events', '/events/[eventId]'] },
    { label: 'Multicity', href: '/coming-soon', match: ['/coming-soon', '/all-multicity'] },
    { label: 'Gallery', href: '/gallery', match: ['/gallery'] },
    { label: 'Sponsors', href: '/oursponsors', match: ['/oursponsors'] },
    { label: 'About Us', href: '/aboutus', match: ['/aboutus'] },
    { label: 'Contact Us', href: '/contact', match: ['/contact'] },
]

const cn = (...classes) => {
    return classes.filter(Boolean).join(' ')
}
function Navigation() {
    const userData = useContext(AuthContext)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [loggingOut, setLoggingOut] = useState(false)
    const router = useRouter()
    const [isHome, setIsHome] = useState(['/'].includes(router.pathname))
    const { rive, RiveComponent } = useRive({
        src: '/navbar/hamburger-time.riv',
        autoplay: true,
        stateMachines: STATE_MACHINE_NAME,
    })
    const onClickInput = useStateMachineInput(
        rive,
        STATE_MACHINE_NAME,
        INPUT_NAME
    )

    const refNav = useRef(null)
    const riveOpen = useRef(false)

    useEffect(() => {
        if (onClickInput && riveOpen.current !== drawerOpen) {
            onClickInput.fire()
            riveOpen.current = drawerOpen
        }
    }, [drawerOpen, onClickInput])

    useEffect(() => {
        setIsHome(['/'].includes(router.pathname))
        setDrawerOpen(false)
    }, [router.pathname])

    useEffect(() => {
        if (!drawerOpen) return
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        const onKeyDown = (event) => {
            if (event.key === 'Escape') setDrawerOpen(false)
        }
        const onResize = () => {
            if (window.innerWidth > 1050) setDrawerOpen(false)
        }
        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('resize', onResize)
        return () => {
            document.body.style.overflow = previousOverflow
            window.removeEventListener('keydown', onKeyDown)
            window.removeEventListener('resize', onResize)
        }
    }, [drawerOpen])

    const toggleDrawer = () => setDrawerOpen((open) => !open)
    const closeDrawer = () => setDrawerOpen(false)

    const handleLogout = () => {
        if (loggingOut) return
        const authHeaders = userData?.getAuthHeaders
            ? userData.getAuthHeaders()
            : {}

        // Call backend logout if token exists
        if (userData?.token) {
            setLoggingOut(true)
            fetch(`${host}/user/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders,
                },
                redirect: 'follow',
            })
                .then(() => {
                    console.log('[Navbar] Logged out successfully')
                })
                .catch((err) => {
                    console.error('[Navbar] Logout API error:', err)
                })
                .finally(() => {
                    // Clear token and user from context regardless of API success
                    userData.logout()
                    router.push('/userLogin')
                    setLoggingOut(false)
                })
        } else {
            // No token, just clear locally
            userData.logout()
            router.push('/userLogin')
        }
    }

    return (
        <>
            <div
                id="nav_div"
                className={styles.mainNav}
                style={{ color: isHome ? 'white' : 'black' }}
                ref={refNav}
            >
                <button
                    type="button"
                    className={styles.hamburger}
                    onClick={toggleDrawer}
                    aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={drawerOpen}
                    aria-controls="drawer"
                >
                    <RiveComponent className={styles.hamburgerIcon} />
                </button>
                <Link
                    href="/"
                    onClick={closeDrawer}
                    className={styles.navLogo}
                >
                    <Image
                        className='nav_logo'
                        src="/navbar/logo.svg"
                        alt="logo"
                        width={130}
                        height={46}
                    />
                </Link>
                <div className={styles.navLinks}>
                    <ul>
                        {/* <li>
                            <Link href="/">Home</Link>
                        </li> */}
                        {/* <li
                            style={
                                router.pathname === '/all-multicity'
                                    ? { borderBottom: '3px solid white' }
                                    : null
                            }
                        >
                            <Link
                                className={styles.linknav}
                                href="/all-multicity"
                            >
                                Multicity
                            </Link>
                        </li> */}
                        {/* <li
                            style={
                                router.pathname === '/events'
                                    ? { borderBottom: '3px solid white' }
                                    : null
                            }
                        >
                            <Link className={styles.linknav} href="/events">
                                Events
                            </Link>
                        </li> */}
                        {/* Added pronite to navbar */}
                        {/* <li
                            style={
                                router.pathname === '/registration'
                                    ? { borderBottom: '3px solid white' }
                                    : null
                            }
                        >
                            <Link className={styles.linknav} href="/registration">
                                Fest Pass
                            </Link>
                        </li> */}
                        <li>
                            <Link
                                className={styles.linknav}
                                style={
                                    router.pathname === '/events'
                                        ? {
                                            color: '#B8A947',
                                        }
                                        : null
                                }
                                href="/events"
                            >
                                Events
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={styles.linknav}
                                style={
                                    router.pathname === '/all-multicity'
                                        ? {
                                            color: '#B8A947',
                                        }
                                        : null
                                }
                                href="/coming-soon"
                            >
                                Multicity
                            </Link>
                        </li>
                        {/* <li>
                            <Link
                                className={styles.linknav}
                                style={
                                    router.pathname === '/schedule'
                                        ? {
                                              color: '#B8A947',
                                          }
                                        : null
                                }
                                href="/schedule"
                            >
                                Schedule
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={styles.linknav}
                                style={
                                    router.pathname === '/merch'
                                        ? {
                                              color: '#B8A947',
                                          }
                                        : null
                                }
                                href="/merch"
                            >
                                Merch
                            </Link>
                        </li> */}

                        <li>
                            <Link
                                className={styles.linknav}
                                style={
                                    router.pathname === '/gallery'
                                        ? {
                                            color: '#B8A947',
                                        }
                                        : null
                                }
                                href="/gallery"
                            >
                                Gallery
                            </Link>
                        </li>
                        {/* <li>
                            <Link
                                className={styles.linknav}
                                style={
                                    router.pathname === '/ourteam'
                                        ? {
                                            color: '#B8A947',
                                        }
                                        : null
                                }
                                href="/ourteam"
                            >
                                Team
                            </Link>
                        </li> */}
                        <li>
                            <Link
                                className={styles.linknav}
                                style={
                                    router.pathname === '/oursponsors'
                                        ? {
                                            color: '#B8A947',
                                        }
                                        : null
                                }
                                href="/oursponsors"
                            >
                                Sponsors
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={styles.linknav}
                                style={
                                    router.pathname === '/aboutus'
                                        ? {
                                            color: '#B8A947',
                                        }
                                        : null
                                }
                                href="/aboutus"
                            >
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={styles.linknav}
                                style={
                                    router.pathname === '/contact'
                                        ? {
                                            color: '#B8A947',
                                        }
                                        : null
                                }
                                href="/contact"
                            >
                                Contact Us
                            </Link>
                        </li>

                        {/* <li>
                            {userData.isAuth ? (
                                <div className={styles.user_container}>
                                    <Link
                                        className={styles.user_info}
                                        href="/profile"
                                    >
                                        <div>
                                            <span className={styles.user_name}>
                                                {userData.state.user.full_name.split(" ")[0]}
                                            </span>
                                            <span className={styles.user_id}>
                                                {userData.state.user.anwesha_id}
                                            </span>
                                        </div>
                                    </Link>
                                    <Image
                                        src="/assets/logout.svg"
                                        className={styles.logout}
                                        height={40}
                                        width={40}
                                        alt="logout"
                                        onClick={handleLogout}
                                    />
                                </div>
                            ) : (
                                <Link
                                    className={styles.login}
                                    href="/userLogin"
                                >
                                    Login
                                </Link>
                            )}
                        </li> */}
                    </ul>
                </div>
                <div className={styles.navEnds}>
                    {/* <button className={styles.fancyButton}>
                        <span>PROFILE</span>
                    <button className={styles.fancyButton} onClick={() => { router.push('/userLogin') }}>
                        <span>{!userData.isAuth ? "LOGIN" : "PROFILE"}</span>
                        <Image
                            src={'/assets/navSubtract.svg'}
                            height={42}
                            width={120}
                            alt="register"
                        />
                    </button> */}

                    <div className={styles.hero_button}>
                        <button
                            className={cn(
                                styles.sexy_button,
                                styles.sexy_button_small
                            )}
                            onClick={() => {
                                router.push('/anweshapass')
                            }}
                        >
                            Get Passes
                        </button>
                    </div>

                    <div className={styles.hero_button}>
                        <button
                            onClick={() => {
                                if (!userData.isAuth) {
                                    router.push(`/userLogin?callbackUrl=${encodeURIComponent(router.asPath)}`)
                                } else {
                                    router.push('/profile')
                                }
                            }}
                            className={cn(
                                styles.sexy_button,
                                styles.sexy_button_small
                            )}
                        >
                            {!userData.isAuth ? 'Login' : 'Profile'}
                        </button>
                    </div>

                    {userData.isAuth && (
                        <div className={styles.hero_button}>
                            <button
                                className={cn(
                                    styles.sexy_button,
                                    styles.sexy_button_small
                                )}
                                onClick={handleLogout}
                                disabled={loggingOut}
                            >
                                <ButtonLoader loading={loggingOut} label="Logging out">Log Out</ButtonLoader>
                            </button>
                        </div>
                    )}


                </div>
            </div>

            <nav
                id="drawer"
                className={cn(styles.nav_drawer, drawerOpen && styles.nav_drawer_open)}
                aria-label="Mobile navigation"
                aria-hidden={!drawerOpen}
            >
                {userData.isAuth && userData.state?.user && (
                    <Link href="/profile" className={styles.drawer_user} onClick={closeDrawer}>
                        <span className={styles.drawer_avatar} aria-hidden="true">
                            {(userData.state.user.full_name || 'A').charAt(0).toUpperCase()}
                        </span>
                        <span className={styles.drawer_user_text}>
                            <span className={styles.drawer_user_name}>
                                {userData.state.user.full_name || 'My profile'}
                            </span>
                            <span className={styles.drawer_user_id}>
                                {userData.state.user.anwesha_id || 'View profile'}
                            </span>
                        </span>
                        <ChevronRight size={20} aria-hidden="true" />
                    </Link>
                )}

                <ul className={styles.drawer_links}>
                    {DRAWER_LINKS.map((link) => {
                        const active = link.match.includes(router.pathname)
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    onClick={closeDrawer}
                                    className={cn(styles.drawer_link, active && styles.drawer_link_active)}
                                    aria-current={active ? 'page' : undefined}
                                >
                                    {link.label}
                                    <ChevronRight size={18} aria-hidden="true" />
                                </Link>
                            </li>
                        )
                    })}
                </ul>

                <div className={styles.drawer_actions}>
                    <Link href="/anweshapass" onClick={closeDrawer} className={styles.drawer_primary}>
                        Get Passes
                    </Link>
                    {userData.isAuth ? (
                        <button
                            type="button"
                            className={styles.drawer_secondary}
                            onClick={handleLogout}
                            disabled={loggingOut}
                        >
                            <ButtonLoader loading={loggingOut} label="Logging out">
                                <LogOut size={18} aria-hidden="true" />
                                Log Out
                            </ButtonLoader>
                        </button>
                    ) : (
                        <Link
                            href={`/userLogin?callbackUrl=${encodeURIComponent(router.asPath)}`}
                            onClick={closeDrawer}
                            className={styles.drawer_secondary}
                        >
                            Login
                        </Link>
                    )}
                </div>
            </nav>
        </>
    )
}

export default Navigation
// "use client";

// import { useState, useEffect, useRef } from "react";
// import styles from "./styles.module.css";
// import Link from "next/link";
// import Image from "next/image";
// import { useRouter, usePathname } from "next/navigation";
// import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
// import { toast } from "react-hot-toast";
// import { FaUserCircle, FaShoppingCart } from "react-icons/fa";

// const STATE_MACHINE_NAME = "Basic State Machine";
// const INPUT_NAME = "Switch";
// const cn = (...classes) => classes.filter(Boolean).join(" ");

// // --- Configuration ---
// const NAV_ITEMS = [
//   { label: "Events", href: "/events" },
//   { label: "Multicity", href: "/multicity" },
//   { label: "Gallery", href: "/gallery" },
//   { label: "Team", href: "/team" },
//   { label: "Sponsors", href: "/sponsors" },
//   { label: "About", href: "/about" },
//   { label: "Contact", href: "/contact" },
//   { label: "Campus Ambassador", href: "/campus-ambassador" },
//   { label: "Store", href: "/store" },
// ];

// const disabledLinkStyle = {
//   pointerEvents: "none",
//   opacity: 0.5,
//   cursor: "not-allowed",
// };

// function Navigation() {
//   const router = useRouter();
//   const pathname = usePathname();

//   // MOCK STATE: Set to 'false' to show LOGIN, 'true' to show Profile icons
//   const isLoggedIn = false;

//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);

//   const dropdownRef = useRef(null);
//   const refNav = useRef(null);

//   const { rive, RiveComponent } = useRive({
//     src: "/navbar/hamburger-time.riv",
//     autoplay: true,
//     stateMachines: STATE_MACHINE_NAME,
//   });

//   const toggleInput = useStateMachineInput(rive, STATE_MACHINE_NAME, INPUT_NAME);

//   // Close dropdown on click outside
//   useEffect(() => {
//     if (!showDropdown) return;
//     const handler = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener("click", handler);
//     return () => document.removeEventListener("click", handler);
//   }, [showDropdown]);

//   // Close drawer on click outside
//   useEffect(() => {
//     if (!drawerOpen) return;
//     const handler = (e) => {
//       if (refNav.current && !refNav.current.contains(e.target)) {
//         closeDrawer();
//       }
//     };
//     document.addEventListener("click", handler);
//     return () => document.removeEventListener("click", handler);
//   }, [drawerOpen]);

//   useEffect(() => closeDrawer(), [pathname]);

//   const toggleDrawer = () => {
//     const drawer = document.getElementById("drawer");
//     const nav = document.getElementById("nav_div");
//     if (!drawer || !nav) return;

//     if (!drawerOpen) {
//       drawer.style.display = "block";
//       nav.style.backgroundColor = "#000";
//       setTimeout(() => (drawer.style.opacity = 1), 50);
//     } else closeDrawer();

//     setDrawerOpen(!drawerOpen);
//     toggleInput?.fire();
//   };

//   const closeDrawer = () => {
//     const drawer = document.getElementById("drawer");
//     const nav = document.getElementById("nav_div");
//     if (!drawer) return;

//     drawer.style.opacity = 0;
//     setTimeout(() => {
//       drawer.style.display = "none";
//       if (nav) nav.style.backgroundColor = "";
//     }, 200);

//     setDrawerOpen(false);
//   };

//   return (
//     <>
//       <div id="nav_div" className={styles.mainNav} ref={refNav}>
//         {/* Hamburger */}
//         <div className={styles.hamburger}>
//           <RiveComponent onClick={toggleDrawer} />
//         </div>

//         {/* Logo */}
//         <Link href="/" className={styles.navLogo}>
//           <Image src="/navbar/logo_no_bg.svg" alt="logo" width={108} height={45} />
//         </Link>

//         {/* Desktop Links (Disabled visually) */}
//         <div className={styles.navLinks}>
//           <ul>
//             {NAV_ITEMS.map((item) => (
//               <li key={item.href}>
//                 <Link className={styles.linknav} href={item.href} style={disabledLinkStyle}>
//                   {item.label}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Desktop Right */}
//         <div className={cn(styles.navEnds, "mr-14", "gap-2")}>
//           <button
//             className={cn(styles.sexy_button, styles.sexy_button_small)}
//             style={disabledLinkStyle}
//           >
//             GET PASSES
//           </button>

//           {!isLoggedIn ? (
//             <button
//               className={cn(styles.sexy_button, styles.sexy_button_small)}
//               style={disabledLinkStyle}
//             >
//               LOGIN
//             </button>
//           ) : (
//             <div className="relative flex items-center gap-2" ref={dropdownRef}>
//               <FaShoppingCart
//                 size={28}
//                 color="white"
//                 style={{ cursor: "not-allowed", marginRight: "12px", opacity: 0.5 }}
//               />
//               <FaUserCircle
//                 size={28}
//                 color="white"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => setShowDropdown((prev) => !prev)}
//               />

//               {showDropdown && (
//                 <ul className="absolute right-0 top-full mt-3 w-56 rounded-2xl bg-black shadow-lg text-white p-2">
//                   <li className="p-2 text-center text-gray-500">Maintenance Mode</li>
//                 </ul>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Mobile View - Icons only if logged in */}
//         {isLoggedIn && (
//           <div
//             className="flex lg:hidden"
//             style={{
//               position: "absolute",
//               right: "16px",
//               top: "50%",
//               transform: "translateY(-50%)",
//               gap: "18px",
//               zIndex: 20,
//             }}
//           >
//             <FaShoppingCart size={28} color="white" style={{ opacity: 0.5 }} />
//             <FaUserCircle size={28} color="white" onClick={() => setShowDropdown(!showDropdown)} />
//           </div>
//         )}
//       </div>

//       {/* Drawer */}
//       <div id="drawer" className={styles.nav_drawer}>
//         <ul>
//           <li><Link href="/" onClick={toggleDrawer}>Home</Link></li>
//           {NAV_ITEMS.map((item) => (
//             <li key={item.href}>
//               <Link href={item.href} style={disabledLinkStyle}>
//                 {item.label}
//               </Link>
//             </li>
//           ))}
//           <li><Link href="/anweshapass" style={disabledLinkStyle}>Get Passes</Link></li>
//         </ul>
//       </div>
//     </>
//   );
// }

// export default Navigation;

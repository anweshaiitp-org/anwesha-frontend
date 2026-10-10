import styles from './styles.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../authContext'
import { useRouter } from 'next/router'
import Logo from '../Rive/logo'
import { useRive, useStateMachineInput } from '@rive-app/react-canvas'
const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'
const STATE_MACHINE_NAME = 'Basic State Machine'
const INPUT_NAME = 'Switch'

const cn = (...classes) => {
    return classes.filter(Boolean).join(' ')
}
function Navigation() {
    const userData = useContext(AuthContext)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [clickInputFired, setClickInputFired] = useState(false)
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

    useEffect(() => {
        if (onClickInput && clickInputFired) {
            onClickInput.fire()
            setClickInputFired(false)
        }
    }, [onClickInput, clickInputFired])

    useEffect(() => {
        if (drawerOpen) {
            document.addEventListener('click', handleClickOutside)
        }
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [drawerOpen])

    const refNav = useRef(null)

    const handleClickOutside = (event) => {
        if (refNav.current && !refNav.current.contains(event.target)) {
            document.getElementById('drawer').style.opacity = 0
            setTimeout(function () {
                document.getElementById('drawer').style.display = 'none'
            }, 300)
            setDrawerOpen(false)
            if (onClickInput) {
                onClickInput.fire()
            }
            setClickInputFired(true)
        } else {
        }
    }

    useEffect(() => {
        setIsHome(['/'].includes(router.pathname))
        document.getElementById('drawer').style.opacity = 0
        setTimeout(function () {
            ; (document.getElementById('drawer').style.display = 'none'),
                (document.getElementById('nav_div').style.backgroundColor = '')
        }, 300)
        setDrawerOpen(false)
    }, [router.pathname])

    const toggleDrawer = () => {
        const drawer = document.getElementById('drawer')
        const nav_div = document.getElementById('nav_div')
        if (!drawerOpen) {
            drawer.style.display = 'block'
            setTimeout(
                () => (
                    (drawer.style.opacity = 1),
                    (nav_div.style.backgroundColor = '#000000')
                ),
                300
            )
        } else {
            drawer.style.opacity = 0
            setTimeout(
                () => (
                    (drawer.style.display = 'none'),
                    (nav_div.style.backgroundColor = '#000000')
                ),
                300
            )
        }
        setDrawerOpen(!drawerOpen)
        onClickInput.fire()
    }

    const handleLogout = () => {
        const authHeaders = userData?.getAuthHeaders
            ? userData.getAuthHeaders()
            : {}
        
        // Call backend logout if token exists
        if (userData?.token) {
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
                <div className={styles.hamburger}>
                    <RiveComponent
                        onClick={() => {
                            toggleDrawer()
                        }}
                    />
                </div>
                <Link
                    href="/"
                    onClick={() => (drawerOpen ? onClickInput.fire() : '')}
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
                            >
                                Log Out
                            </button>
                        </div>
                    )}


                </div>
            </div>

            <div id="drawer" className={styles.nav_drawer}>
                <ul>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    {userData.isAuth ? (
                        <li>
                            <Link
                                href="/profile"
                                onClick={() => toggleDrawer()}
                            >
                                Profile
                            </Link>
                        </li>
                    ) : (
                        ''
                    )}

                    {/* <li>
                        <Link
                            href="/registration"
                            onClick={() => toggleDrawer()}
                        >
                            Fest Pass
                        </Link>
                    </li> */}
                    {/* <li>
                        <Link href="/events" onClick={() => toggleDrawer()}>
                            Events
                        </Link>
                    </li> */}
                    {/* <li>
                        <Link href="/all-multicity" onClick={() => toggleDrawer()}>
                            Multicity
                        </Link>
                    </li> */}
                    <li>
                        <Link href="/events" onClick={() => toggleDrawer()}>
                            Events
                        </Link>
                    </li>
                    <li>
                        <Link href="/gallery" onClick={() => toggleDrawer()}>
                            Gallery
                        </Link>
                    </li>
                    {/* <li>
                        <Link href="/schedule" onClick={() => toggleDrawer()}>
                            Schedule
                        </Link>
                    </li> */}

                    {/* <li>
                        <Link href="/getPasses" onClick={() => toggleDrawer()}>
                            Get Passes
                        </Link>
                    </li> */}
                    {/* <li>
                        <Link href="/Merch" onClick={() => toggleDrawer()}>
                            Merch
                        </Link>
                    </li> */}
                    <li>
                        <Link href="/ourteam" onClick={() => toggleDrawer()}>
                            Teams
                        </Link>
                    </li>

                    <li>
                        <Link
                            href="/oursponsors"
                            onClick={() => toggleDrawer()}
                        >
                            SPONSORS
                        </Link>
                    </li>
                    <li>
                        <Link href="/aboutus" onClick={() => toggleDrawer()}>
                            About Us
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact" onClick={() => toggleDrawer()}>
                            Contact Us
                        </Link>
                    </li>
                    <li>
                        <Link href="/anweshapass" onClick={() => toggleDrawer()}>
                            getPasses
                        </Link>
                    </li>
                    <li>
                        {userData.isAuth && userData.state?.user ? (
                            <div className={styles.user_container}>
                                <Link
                                    className={styles.user_info}
                                    href="/profile"
                                    onClick={() => toggleDrawer()}
                                >
                                    <div>
                                        <span className={styles.user_name}>
                                            {userData.state.user.full_name || ''}
                                        </span>
                                        <span className={styles.user_id}>
                                            {userData.state.user.anwesha_id || ''}
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
                                href={`/userLogin?callbackUrl=${encodeURIComponent(router.asPath)}`}
                                onClick={() => toggleDrawer()}
                            >
                                Login
                            </Link>
                        )}
                    </li>
                </ul>
            </div>
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

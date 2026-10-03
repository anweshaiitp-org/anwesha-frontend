import '../styles/globals.css'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import { AuthProvider, PrivateRoute } from '../components/authContext'
import { AuthUserProvider } from '../lib/multicity/context/AuthUserContext'
import { useRouter } from 'next/router'
import styles from '../styles/comingsoon.module.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import RegisterPage from './multicity/multicityRegistration/RegisterPage'
import Step1EmailPassword from './multicity/multicityRegistration/Step1Email'
import Step2Personal from './multicity/multicityRegistration/Step2Personal'
import Step3College from './multicity/multicityRegistration/Step3College'
import Step4Preview from './multicity/multicityRegistration/Step4Preview'
import Step5Success from './multicity/multicityRegistration/Step5Success'
// const Navbar = dynamic(() => import('../components/Navbar/Navbar'), {
//     ssr: false,
// })
import Navbar from '../components/Navbar-temp'
// import Navbar from '../components/Navbar/Navbar'

import Footer from '../components/Footer/Footer.js'

const poppins = { className: 'font-poppins' }
function MyApp({ Component, pageProps }) {
    const router = useRouter()
    // const showHeader = router.pathname === '/ca-register' || '/ca-login' ? false : true;
    let showHeader = true
    // if (
    //     router.pathname === '/ca-login' ||
    //     router.pathname === '/userLogin' ||
    //     router.pathname === '/userRegister'
    // ) {
    //     showHeader = false
    // }
    return (
        <main className={poppins.className} style={{ background: 'black' }}>
            <AuthUserProvider>
                {/* style={{ background: 'linear-gradient(169deg, #81D9FF -5.25%, #D4F2FF 111.03%)' }} */}

                <Script
                    strategy="lazyOnload"
                    src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
                />
                <Script strategy="lazyOnload" id="google-analytics">
                    {`

          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', ${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS});
        `}
                </Script>
                <AuthProvider>
                    {showHeader && <Navbar />}
                    {/* {showHeader && <div style={{height: '30%'}}/>} */}
                    <div className={styles.main_component}>
                        <PrivateRoute>
                            <Component {...pageProps} />
                            <Analytics />
                        </PrivateRoute>
                    </div>
                    <Footer />

                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />

                    {/* <RegisterPage />
                    <Step1EmailPassword />
                    <Step2Personal />
                    <Step3College />
                    <Step4Preview />
                    <Step5Success /> */}
                </AuthProvider>
            </AuthUserProvider>
        </main>
    )
}

export default MyApp

import Head from 'next/head'
import styles from '../styles/ca.module.css'
import ForgotPassword from '../components/UserRegister-Login/forgot-password'

export default function ForgotPasswordPage() {
    return (
        <>
            <Head>
                <title>Forgot Password - Anwesha 2026</title>
                <meta name="description" content="Forgot Password - Anwesha 2026" />
                <link rel="icon" href="./logo_no_bg.svg" />
            </Head>
            <div className={styles.container} loading="lazy">
                <ForgotPassword />
            </div>
        </>
    )
}

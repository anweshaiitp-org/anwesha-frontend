import Head from 'next/head'
import styles from '../styles/ca.module.css'
import ChangePasswordForm from '../components/UserRegister-Login/change_password'

export default function ChangePassword() {
    return (
        <>
            <Head>
                <title>Change Password - Anwesha 2027</title>
                <meta name="description" content="Anwesha 2027 Change Password" />
                <link rel="icon" href="./logo_no_bg.svg" />
            </Head>
            <div className={styles.container} loading="lazy">
                <ChangePasswordForm />
            </div>
        </>
    )
}

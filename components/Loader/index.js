import styles from './Loader.module.css'

export default function Loader({ label = 'Loading…', fullPage = false, className = '' }) {
    return (
        <div className={`${styles.block} ${fullPage ? styles.page : ''} ${className}`} role="status" aria-live="polite">
            <span className={styles.spinner} aria-hidden="true" />
            {label && <span>{label}</span>}
        </div>
    )
}

export function ButtonLoader({ loading, label, children }) {
    if (!loading) return children
    return (
        <span className={styles.inline} role="status" aria-live="polite">
            <span className={styles.spinner} aria-hidden="true" />
            {label}
        </span>
    )
}

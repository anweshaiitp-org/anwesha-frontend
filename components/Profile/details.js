import React, { useState, useContext } from 'react'
import { AuthContext } from '../authContext'
import styles from './profile.module.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'

const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'

function Details() {
    const userData = useContext(AuthContext)
    const profDetails = userData?.state?.user || {}
    const [formData, setFormData] = useState(profDetails)
    const [edit, setEdit] = useState(false)
    const [saving, setSaving] = useState(false)

    React.useEffect(() => {
        if (userData?.state?.user) {
            setFormData(userData.state.user)
        }
    }, [userData?.state?.user?.anwesha_id])

    const saveChanges = async () => {
        setSaving(true)
        try {
            const authHeaders = userData?.getAuthHeaders ? userData.getAuthHeaders() : {}
            const headers = new Headers({ 'Content-Type': 'application/json' })
            Object.entries(authHeaders).forEach(([k, v]) => headers.append(k, v))

            const response = await fetch(`${host}/user/editprofile`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    full_name: formData.full_name,
                    phone_number: formData.phone_number,
                    college_name: formData.college_name,
                    dob: formData.dob,
                    gender: formData.gender,
                    profile_photo: formData.profile_photo,
                }),
            })
            const data = await response.json().catch(() => ({}))
            if (response.ok || data.success) {
                toast.success('Profile details updated!', { theme: 'light' })
                setEdit(false)
            } else {
                toast.error(data.message || 'Failed to update details', { theme: 'light' })
            }
        } catch (err) {
            toast.error('Error saving details.', { theme: 'light' })
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className={styles.container}>
            <ToastContainer position="top-right" autoClose={3000} theme="light" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: '#ffcc00', margin: 0 }}>Account Information</h2>
                <button
                    onClick={() => (edit ? saveChanges() : setEdit(true))}
                    style={{
                        padding: '8px 18px',
                        backgroundColor: edit ? '#4ade80' : '#ffcc00',
                        color: '#000',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                    }}
                >
                    {edit ? (saving ? 'Saving...' : 'Save') : 'Edit'}
                </button>
            </div>

            <div className={styles.field}>
                <label htmlFor="full_name">Full Name</label>
                <input
                    type="text"
                    value={formData.full_name || ''}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    disabled={!edit}
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="email">Email ID</label>
                <input type="email" value={formData.email_id || ''} disabled />
            </div>

            <div className={styles.field}>
                <label htmlFor="phone">Phone Number</label>
                <input
                    type="tel"
                    value={formData.phone_number || ''}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    maxLength={10}
                    disabled={!edit}
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="college">College / Institute</label>
                <input
                    type="text"
                    value={formData.college_name || formData.collage_name || ''}
                    onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
                    disabled={!edit}
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="dob">Date of Birth (DOB)</label>
                <input
                    type="date"
                    value={formData.dob || ''}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    disabled={!edit}
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="gender">Gender</label>
                <select
                    value={formData.gender || 'MALE'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    disabled={!edit}
                    style={{ padding: '10px', width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}
                >
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="OTHER">OTHER</option>
                </select>
            </div>

            <div className={styles.field}>
                <label htmlFor="photo">Profile Photo URL / S3 Key</label>
                <input
                    type="text"
                    value={formData.profile_photo || ''}
                    onChange={(e) => setFormData({ ...formData, profile_photo: e.target.value })}
                    disabled={!edit}
                />
            </div>
        </div>
    )
}

export default Details

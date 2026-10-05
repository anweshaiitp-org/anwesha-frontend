import React, { useState, useContext } from 'react'
import { AuthContext } from '../authContext'
import styles from './profile.module.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'

function Details() {
    const userData = useContext(AuthContext)
    const profDetails = userData.state.user || { anwesha_id: '' }
    const [formData, setFormData] = useState(profDetails)
    const [edit, setEdit] = useState(false)
    const [editingAadhaar, setEditingAadhaar] = useState(false)
    const [aadhaarValue, setAadhaarValue] = useState(profDetails?.aadhaar_number || '')
    const [aadhaarLoading, setAadhaarLoading] = useState(false)

    // Sync form data when profDetails changes - use useCallback to avoid infinite loops
    React.useEffect(() => {
        console.log('[Details] useEffect triggered, profDetails:', profDetails)
        setFormData(profDetails)
        if (profDetails?.aadhaar_number) {
            setAadhaarValue(profDetails.aadhaar_number)
            console.log('[Details] Setting aadhaarValue to:', profDetails.aadhaar_number)
        }
    }, [profDetails?.anwesha_id]) // Only depend on unique ID to avoid recreating on every render

    function editProfile() {
        var myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')
        const authHeaders = userData?.getAuthHeaders
            ? userData.getAuthHeaders()
            : {}
        Object.entries(authHeaders).forEach(([k, v]) =>
            myHeaders.append(k, v)
        )

        var raw = JSON.stringify({
            full_name: formData.full_name,
            gender: formData.gender,
            college_name: formData.college_name,
        })

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
        }

        fetch(`${host}/user/editprofile`, requestOptions)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.log('error', error))
    }

    function updateAadhaar() {
        // Validate Aadhaar format
        if (!aadhaarValue.match(/^[0-9]{12}$/)) {
            toast.error('Aadhaar must be exactly 12 digits', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: 'light',
            })
            return
        }

        var myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')
        const authHeaders = userData?.getAuthHeaders
            ? userData.getAuthHeaders()
            : {}
        Object.entries(authHeaders).forEach(([k, v]) =>
            myHeaders.append(k, v)
        )

        var raw = JSON.stringify({
            aadhaar_number: aadhaarValue,
        })

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
        }

        setAadhaarLoading(true)
        fetch(`${host}/user/editprofile`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                setAadhaarLoading(false)
                setFormData({ ...formData, aadhaar_number: aadhaarValue })
                setEditingAadhaar(false)
                toast.success('Aadhaar number updated successfully', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: 'light',
                })
                console.log(result)
            })
            .catch((error) => {
                setAadhaarLoading(false)
                toast.error('Failed to update Aadhaar number', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: 'light',
                })
                console.log('error', error)
            })
    }

    return (
        <div className={styles.container}>
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
            {console.log('[Details] Rendering, aadhaarValue:', aadhaarValue)}
            {edit ? null : (
                <img
                    src="/assets/edit.svg"
                    onClick={() => {
                        setEdit(true)
                    }}
                />
            )}
            <div className={styles.field}>
                <label htmlFor="full_name">Full Name</label>
                <br />
                <input
                    type="text"
                    name="Full Name"
                    // placeholder="Full Name"
                    value={formData.full_name}
                    onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                    }
                    required
                    disabled={!edit}
                />
                <br />
            </div>
            <div className={styles.field}>
                <label htmlFor="email">Email ID</label>
                <br />
                <input
                    type="email"
                    name="Email ID"
                    // placeholder="Email ID"
                    value={formData.email_id}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            phone_number: e.target.value,
                        })
                    }
                    required
                    disabled
                />
                <br />
            </div>
            <div className={styles.field}>
                <label htmlFor="phone">Phone Number</label>
                <br />
                <input
                    type="tel"
                    name="Phone Number"
                    placeholder="Phone Number"
                    value={formData.phone_number}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            phone_number: e.target.value,
                        })
                    }
                    maxlength="10"
                    minlength="10"
                    disabled={!edit}
                />
                <br />
            </div>
            <div className={styles.field}>
                <label htmlFor="gender">Gender</label>
                <br />
                <select
                    value={formData.gender}
                    onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                    }
                    name="Gender"
                    disabled={!edit}
                >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Non Binary</option>
                </select>
                <br />
            </div>
            <div className={styles.field}>
                <label htmlFor="institute">Institute/Organization</label>
                <br />
                <input
                    type="text"
                    name="institute"
                    // placeholder="Full Name"
                    value={formData.college_name}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            college_name: e.target.value,
                        })
                    }
                    disabled={!edit}
                />
                <br />
            </div>
            <div className={styles.field}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label htmlFor="aadhaar">Aadhaar Number</label>
                    {!editingAadhaar && !edit && (
                        <button
                            onClick={() => {
                                setEditingAadhaar(true)
                                setAadhaarValue(profDetails?.aadhaar_number || '')
                            }}
                            style={{
                                background: '#f0f0f0',
                                border: 'none',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                borderRadius: '4px',
                            }}
                        >
                            Edit
                        </button>
                    )}
                </div>
                <br />
                {editingAadhaar ? (
                    <div>
                        <input
                            type="text"
                            name="Aadhaar Number"
                            placeholder="Enter 12-digit Aadhaar number"
                            value={aadhaarValue}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '')
                                setAadhaarValue(value)
                            }}
                            maxLength="12"
                            style={{
                                borderColor: aadhaarValue && aadhaarValue.length !== 12 ? '#ff4444' : '',
                                width: '100%',
                            }}
                        />
                        {aadhaarValue && aadhaarValue.length !== 12 && (
                            <span style={{ color: '#ff4444', fontSize: '0.8rem' }}>
                                Must be 12 digits
                            </span>
                        )}
                        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => {
                                    setEditingAadhaar(false)
                                    setAadhaarValue(profDetails?.aadhaar_number || '')
                                }}
                                style={{
                                    padding: '8px 15px',
                                    background: '#f0f0f0',
                                    border: 'none',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateAadhaar}
                                disabled={aadhaarLoading || aadhaarValue.length !== 12}
                                style={{
                                    padding: '8px 15px',
                                    background: aadhaarLoading || aadhaarValue.length !== 12 ? '#ccc' : '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    cursor: aadhaarLoading || aadhaarValue.length !== 12 ? 'not-allowed' : 'pointer',
                                    borderRadius: '4px',
                                }}
                            >
                                {aadhaarLoading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <input
                        type="text"
                        name="Aadhaar Number"
                        value={aadhaarValue || ''}
                        placeholder="Not provided"
                        disabled
                        style={{
                            color: aadhaarValue ? 'inherit' : '#999',
                        }}
                    />
                )}
                <br />
            </div>
            {/* <input value={formData.anwesha_id} disabled onChange={(e) => setFormData({...formData, anwesha_id: e.target.value})} /> */}
            {/* <input value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} /> */}
            {/* <input value={formData.phone_number} onChange={(e) => setFormData({...formData, phone_number: e.target.value})} /> */}
            {/* <input value={formData.email_id} disabled onChange={(e) => setFormData({...formData, email_id: e.target.value})} /> */}
            {/* <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
            <option>Male</option>
            <option>Female</option>
            <option>Non Binary</option>
        </select> */}
            {/* <input value={formData.college_name} onChange={(e) => setFormData({...formData, college_name: e.target.value})} /> */}
            {/* <input value={formData.instagram_id} onChange={(e) => setFormData({...formData, instagram_id: e.target.value})} />
        <input value={formData.facebook_id} onChange={(e) => setFormData({...formData, facebook_id: e.target.value})} /> */}
            {edit ? (
                <div className={styles.button_row}>
                    <button
                        onClick={() => {
                            setFormData(profDetails)
                            setEdit(false)
                        }}
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={() => {
                            editProfile()
                            setEdit(false)
                        }}
                    >
                        SUBMIT
                    </button>
                </div>
            ) : null}
        </div>
    )
}

export default Details

import React, { useState, useEffect, useContext } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import Details from '../components/Profile/details'
import MyEvents from '../components/Profile/myEvents'
import MyMerch from '../components/Profile/myMerch'
import Head from 'next/head'
import styles from '../styles/profile.module.css'

import { AuthContext } from '../components/authContext'
import Image from 'next/image'
import { motion, wrap } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'

const host = process.env.NEXT_PUBLIC_HOST || '/api/backend'

function Profile() {
    const userData = useContext(AuthContext)


    const [tabIndex, setTabIndex] = useState(0)
    // const profDetails = userData.state.user;

    const [profDetails, setProfDetails] = useState(
        userData?.state?.user || {}
    )


    const [formData, setFormData] = useState(profDetails)
    const [qrcode, setQrcode] = useState(
        userData ? userData.state.user?.qr_code : ''
    )
    const [qrLoading, setQrLoading] = useState(false)

    // Sync formData when profDetails updates
    useEffect(() => {
        if (profDetails && Object.keys(profDetails).length > 0) {
            setFormData(profDetails)
        }
    }, [profDetails])

    const [edit, setEdit] = useState(false)

    const [isEditing, setIsEditing] = useState(false) // Toggle edit mode
    const [name, setName] = useState('John Doe') // Default name
    const [editingAadhaar, setEditingAadhaar] = useState(false)
    const [aadhaarValue, setAadhaarValue] = useState(profDetails?.aadhaar_number || '')
    const [aadhaarLoading, setAadhaarLoading] = useState(false)
    const [myntraStatus, setMyntraStatus] = useState(null)
    const [myntraLoading, setMyntraLoading] = useState(true)

    const handleSave = () => {
        setIsEditing(false) // Exit edit mode
        // Add logic to update the name in the backend here, if needed
        console.log('Saved Name:', name)
    }

    function editProfile() {
        setIsEditing(false)
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
            .then((response) => {
                if (response.status === 409) {
                    return response.json().then((data) => {
                        throw { status: 409, message: data.message || 'Aadhaar already added' }
                    })
                }
                if (response.ok || response.status === 200 || response.status === 201) {
                    return response.json().then((data) => ({ success: true, data }))
                }
                return response.json().then((data) => {
                    throw { status: response.status, message: data.message }
                })
            })
            .then((result) => {
                setAadhaarLoading(false)
                if (result.success) {
                    setProfDetails({ ...profDetails, aadhaar_number: result.data.aadhaar_number })
                    setEditingAadhaar(false)
                    setAadhaarValue('')
                    toast.success('Aadhaar number updated successfully', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: 'light',
                    })
                    console.log('[Aadhaar] Update successful:', result.data)
                }
            })
            .catch((error) => {
                setAadhaarLoading(false)
                setEditingAadhaar(false)
                setAadhaarValue('')

                // Handle 409 Conflict - Aadhaar already added
                if (error.status === 409) {
                    toast.error(error.message, {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: 'light',
                    })
                } else {
                    toast.error(error.message || 'Failed to update Aadhaar number', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: 'light',
                    })
                }
                console.log('[Aadhaar] Update error:', error)
            })
    }

    useEffect(() => {
        // Just use data from authContext instead of fetching again
        if (userData?.state?.user) {
            setProfDetails(userData.state.user)
            setAadhaarValue(userData.state.user.aadhaar_number || '')
            if (userData.state.user.qr_code) {
                setQrcode(userData.state.user.qr_code)
            }
        }
    }, [userData?.state?.user])

    // Fetch Myntra registration status
    useEffect(() => {
        const fetchMyntraStatus = async () => {
            if (!userData?.state?.user) return

            try {
                const authHeaders = userData?.getAuthHeaders
                    ? userData.getAuthHeaders()
                    : {}

                console.log('[Profile] Auth headers object:', authHeaders)
                console.log('[Profile] Has Authorization header:', !!authHeaders.Authorization)

                var myHeaders = new Headers()
                myHeaders.append('Content-Type', 'application/json')
                Object.entries(authHeaders).forEach(([k, v]) =>
                    myHeaders.append(k, v)
                )

                const response = await fetch(`${host}/sponsors/myntra-status/`, {
                    method: 'GET',
                    headers: myHeaders
                })

                if (response.ok) {
                    const data = await response.json()
                    console.log('[Profile] Myntra status received:', data)
                    setMyntraStatus(data)
                } else {
                    console.log('[Profile] Myntra status API returned non-OK:', response.status)
                    // Only set status on success, don't show warning on API errors
                    setMyntraStatus(null)
                }
            } catch (error) {
                console.error('[Profile] Failed to fetch Myntra status:', error)
                // Don't show warning if API fails
                setMyntraStatus(null)
            } finally {
                setMyntraLoading(false)
            }
        }

        fetchMyntraStatus()
    }, [userData?.state?.user])

    function regenrateqr() {
        const authHeaders = userData.getAuthHeaders()
        fetch(`${host}/user/regenerateqr/`, {
            method: 'GET',
            headers: {
                ...authHeaders,
            },
            redirect: 'follow',
        })
            .then((response) => response.json())
            .then((result) => {
                console.log('[Profile] Regenerated QR:', result)
                // Result should contain signed URL
                if (result.qr_code) {
                    console.log('QR Link (regenerated):', result.qr_code)
                    setQrcode(result.qr_code)
                    toast.success('QR code regenerated successfully', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                    })
                }
            })
            .catch((error) => {
                console.error('[Profile] QR regeneration failed:', error)
                toast.error('Failed to regenerate QR code', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                })
            })
    }

    if (!userData?.state?.user) {
        return null
    }


    return (
        <>
            <Head>
                <title>Profile - Anwesha 2026</title>
                <meta name="description" content="Anwesha 2026" />
                <link rel="icon" href="./logo_no_bg.svg" />
            </Head>
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
            <div className={styles.mainContainer}>
                <div className={styles.welcome}>WELCOME BACK!</div>

                <div className={styles.subContainer}>
                    {/* Myntra Registration Notice */}
                    {!myntraLoading && myntraStatus && myntraStatus.is_myntra_registered === false && (
                        <div style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            border: '1px solid #F2BF51',
                            borderRadius: '8px',
                            padding: '20px',
                            margin: '20px auto',
                            maxWidth: '800px',
                            textAlign: 'center',
                            fontFamily: "'Cormorant Garamond', serif"
                        }}>
                            <h3 style={{
                                color: '#F2BF51',
                                marginBottom: '10px',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                fontFamily: "'Cormorant Garamond', serif"
                            }}>
                                ⚠️ Myntra Registration Required for Pronite Entry
                            </h3>
                            <p style={{
                                color: '#ffffff',
                                marginBottom: '15px',
                                fontSize: '20px',
                                fontFamily: "'Cormorant Garamond', serif"
                            }}>
                                You have not registered on Myntra yet. This is mandatory for pronite entry.
                            </p>
                            <a
                                href="https://myntra.onelink.me/dNYC/psb0vkzt?af_qr=true"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-block',
                                    backgroundColor: 'transparent',
                                    color: '#F2BF51',
                                    padding: '10px 24px',
                                    borderRadius: '5px',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                    fontSize: '18px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    border: '1px solid #F2BF51'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#F2BF51';
                                    e.target.style.color = '#000';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.color = '#F2BF51';
                                }}
                            >
                                Register on Myntra App
                            </a>
                        </div>
                    )}
                    <div className={styles.idandqr}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <div className={styles.userImage}>
                                <img
                                    src={'/home/circle.png'}
                                    width={180}
                                    height={180}
                                    alt="userImage"
                                />
                                <img
                                    src={'/home/mascott.png'}
                                    width={150}
                                    height={150}
                                    alt="userImage"
                                />
                            </div>
                            <div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center', // Ensures alignment
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    {isEditing ? (
                                        // Edit mode: Show input field
                                        <input
                                            type="text"
                                            value={formData.full_name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    full_name: e.target.value,
                                                })
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter')
                                                    editProfile() // Save on Enter key
                                            }}
                                            autoFocus
                                            style={{
                                                outline: 'none',
                                                border: '2px solid lightgray',
                                                padding: '10px 10px',
                                                borderRadius: '2px',
                                                margin: '10px 0',
                                                fontSize: '24px',
                                                fontFamily: 'inherit',
                                            }}
                                        />
                                    ) : (
                                        // View mode: Show name
                                        <h1
                                            className={styles.anwesha_username}
                                            style={{ fontWeight: 'normal' }}
                                        >
                                            {formData.full_name}
                                        </h1>
                                    )}

                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className={styles.copy}
                                    >
                                        <motion.div
                                            style={{ cursor: 'pointer' }}
                                            whileTap={{ scale: 0.8 }}
                                        >
                                            {!isEditing ? (
                                                <img
                                                    src="/edit.svg"
                                                    width={20}
                                                    height={20}
                                                    alt="edit"
                                                />
                                            ) : (
                                                <img
                                                    onClick={editProfile}
                                                    src="/assets/tick.svg"
                                                    width={20}
                                                    height={20}
                                                    alt="edit"
                                                />
                                            )}
                                        </motion.div>
                                    </button>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <h1
                                        className={styles.anwesha_id}
                                        style={{ fontWeight: 'normal' }}
                                    >
                                        {profDetails.anwesha_id}
                                    </h1>
                                    <button
                                        className={styles.copy}
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                profDetails.anwesha_id
                                            )
                                            toast.success(
                                                'Copied to clipboard',
                                                {
                                                    position: 'top-right',
                                                    autoClose: 3000,
                                                    hideProgressBar: false,
                                                    closeOnClick: true,
                                                    pauseOnHover: true,
                                                    draggable: true,
                                                    progress: undefined,
                                                    theme: 'light',
                                                }
                                            )
                                        }}
                                    >
                                        <motion.div
                                            style={{ cursor: 'pointer' }}
                                            whileTap={{ scale: 0.8 }}
                                        >
                                            <Image
                                                src="/copy.svg"
                                                width={20}
                                                height={20}
                                                alt="copy"
                                            />
                                        </motion.div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className={styles.qrcode}>
                            {qrLoading ? (
                                <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span>Loading QR...</span>
                                </div>
                            ) : qrcode ? (
                                <img
                                    src={qrcode}
                                    width={200}
                                    height={200}
                                    alt="QR Code"
                                    onError={() => {
                                        console.error('[Profile] Failed to load QR image')
                                        toast.error('Failed to load QR code. Please refresh.', {
                                            position: 'top-right',
                                            autoClose: 3000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                            theme: 'light',
                                        })
                                    }}
                                />
                            ) : (
                                <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', borderRadius: '15px' }}>
                                    <span>No QR code</span>
                                </div>
                            )}
                            <Link
                                href="/anweshapass"
                                style={{ color: 'black', fontWeight: 'bold' }}
                            ></Link>
                            {/* <button className={styles.qrBtn} onClick={regenrateqr}>
                            Regenerate QR
                        </button> */}
                        </div>
                    </div>

                    {/* <h1 className={styles.anwesha_id}>{profDetails.anwesha_id}</h1> */}
                    <div className={styles.userDetails}>
                        <div>
                            <div>
                                <h1 className={styles.userDetailsHeading}>
                                    Mail ID
                                </h1>
                                <h1 className={styles.userDetailsContent}>
                                    {profDetails.email_id}
                                </h1>
                            </div>
                            <div>
                                <h1 className={styles.userDetailsHeading}>
                                    Mobile Number
                                </h1>
                                <h1 className={styles.userDetailsContent}>
                                    {profDetails.phone_number}
                                </h1>
                            </div>
                            <div>
                                <h1 className={styles.userDetailsHeading}>
                                    Aadhaar Number
                                </h1>
                                {!profDetails.aadhaar_number ? (
                                    // Aadhaar not added yet - show add form
                                    editingAadhaar ? (
                                        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                            <input
                                                type="text"
                                                value={aadhaarValue}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, '')
                                                    setAadhaarValue(value)
                                                }}
                                                maxLength="12"
                                                placeholder="Enter 12-digit Aadhaar"
                                                style={{
                                                    padding: '8px 12px',
                                                    borderColor: aadhaarValue && aadhaarValue.length !== 12 ? '#ff4444' : '#ccc',
                                                    fontSize: '16px',
                                                    borderRadius: '4px',
                                                    border: '1px solid',
                                                }}
                                            />
                                            {aadhaarValue && aadhaarValue.length !== 12 && (
                                                <span style={{ color: '#ff4444', fontSize: '0.8rem' }}>
                                                    Must be 12 digits
                                                </span>
                                            )}
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button
                                                    onClick={() => {
                                                        setEditingAadhaar(false)
                                                        setAadhaarValue('')
                                                    }}
                                                    style={{
                                                        padding: '6px 12px',
                                                        background: '#f0f0f0',
                                                        border: '1px solid #ccc',
                                                        cursor: 'pointer',
                                                        borderRadius: '4px',
                                                        fontSize: '14px',
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={updateAadhaar}
                                                    disabled={aadhaarLoading || aadhaarValue.length !== 12}
                                                    style={{
                                                        padding: '6px 12px',
                                                        background: aadhaarLoading || aadhaarValue.length !== 12 ? '#ccc' : '#4CAF50',
                                                        color: 'white',
                                                        border: 'none',
                                                        cursor: aadhaarLoading || aadhaarValue.length !== 12 ? 'not-allowed' : 'pointer',
                                                        borderRadius: '4px',
                                                        fontSize: '14px',
                                                    }}
                                                >
                                                    {aadhaarLoading ? 'Adding...' : 'Add'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <h1 className={styles.userDetailsContent} style={{ color: '#999' }}>
                                                Not Added
                                            </h1>
                                            <button
                                                onClick={() => {
                                                    setEditingAadhaar(true)
                                                    setAadhaarValue('')
                                                }}
                                                style={{
                                                    padding: '6px 12px',
                                                    background: '#2196F3',
                                                    color: 'white',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                Add
                                            </button>
                                        </div>
                                    )
                                ) : (
                                    // Aadhaar already added - show masked, read-only (cannot edit per backend)
                                    <h1 className={styles.userDetailsContent}>
                                        {profDetails.aadhaar_number}
                                    </h1>
                                )}
                            </div>
                        </div>
                        <div>
                            {/* <div>
                                <h1 className={styles.userDetailsHeading}>
                                    Gender
                                </h1>
                                <h1 className={styles.userDetailsContent}>
                                    Male
                                </h1>
                            </div> */}

                            <div>
                                <h1 className={styles.userDetailsHeading}>
                                    Institute/Organization
                                </h1>
                                <h1 className={styles.userDetailsContent}>
                                    {profDetails.college_name}
                                </h1>
                            </div>
                        </div>
                    </div>
                    <MyEvents />
                    {/* <h2
                        style={{
                            color: 'white',
                            fontWeight: 'normal',
                            textAlign: 'center',
                            letterSpacing: '1px',
                        }}
                    >
                        To seek accomodation Fill this &nbsp;
                        <a
                            href="https://forms.gle/WjTuyC2gR8mHYGzA6"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontWeight: 'normal', color: 'skyblue' }}
                        >
                            FORM
                        </a>
                    </h2> */}

                    {/* <Tabs className={styles.tabs}>
                        <TabList
                            className={styles.tabList}
                            selectedIndex={tabIndex}
                            onSelect={(index) => setTabIndex(index)}
                        >
                            <Tab
                                className={styles.tab}
                                selectedClassName={styles.tabActive}
                            >
                                DETAILS
                            </Tab>
                            <Tab
                                className={styles.tab}
                                selectedClassName={styles.tabActive}
                            >
                                MY EVENTS
                            </Tab>
                            <Tab className={styles.tab}>MY MERCHANDISE</Tab>
                        </TabList>

                        <TabPanel className={styles.tabPanel}>
                            <Details />
                        </TabPanel>
                        <TabPanel className={styles.tabPanel}>
                            <MyEvents />
                        </TabPanel>
                        <TabPanel className={styles.tabPanel}>
                            <MyMerch />
                        </TabPanel>
                    </Tabs> */}

                    {/* design for the bottom pngs */}
                    <div className={styles.bottomDesign}>
                        <img
                            src={'/profile/bottom.png'}
                            width={800}
                            height={350}
                            alt="userImage"
                        />
                    </div>

                </div>
            </div>
        </>
    )
}

export default Profile

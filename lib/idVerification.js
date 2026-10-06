/**
 * Task 4: Student ID Verification API client (new Anwesha 2k27 backend).
 * Base URL configurable via NEXT_PUBLIC_HOST, defaults to production
 * https://api.anwesha.live per API documentation.
 */

export const API_BASE =
    process.env.NEXT_PUBLIC_HOST || 'https://api.anwesha.live'

export const ID_CARD_TYPES = ['COLLEGE_ID', 'GOVT_ID', 'AADHAAR']

export const SUPPORTED_CONTENT_TYPES = {
    'application/pdf': ['pdf'],
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
}

const MAX_FILE_BYTES = 5 * 1024 * 1024 // 5MB frontend guardrail (backend enforces its own 413)

export function validateIdFile(file) {
    if (!file) return 'Please select a file to upload.'
    if (!Object.keys(SUPPORTED_CONTENT_TYPES).includes(file.type)) {
        return 'Unsupported file type. Please upload a PDF, JPG or PNG file.'
    }
    if (file.size > MAX_FILE_BYTES) {
        return 'File is too large. Maximum allowed size is 5MB.'
    }
    return null
}

function authHeaders(token) {
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }
}

export function parseBackendMessage(data, fallback) {
    if (!data) return fallback
    if (typeof data.message === 'string' && data.message) return data.message
    if (typeof data.error === 'string' && data.error) return data.error
    return fallback
}

export function mapStatusToMessage(status, backendMsg) {
    switch (status) {
        case 400:
            return backendMsg || 'Invalid request. Please check the form and try again.'
        case 401:
            return 'Session expired. Please login again.'
        case 403:
            return backendMsg || 'Invalid token.'
        case 404:
            return 'Endpoint or resource not found.'
        case 413:
            return 'File too large. Please upload a smaller file.'
        case 429:
            return 'Too many requests. Please wait and try again.'
        default:
            if (status >= 500) return 'Server error. Please try again later.'
            return backendMsg || 'Something went wrong. Please try again.'
    }
}

/**
 * Step 2: Request a presigned S3 upload URL (authenticated).
 * Primary endpoint: GET /users/id-card/upload-url?token=..&fileName=..&contentType=..
 */
export async function requestUploadUrl({ file, jwt, emailToken }) {
    if (!jwt) {
        const e = new Error('Missing authentication. Please login.')
        e.code = 401
        throw e
    }
    const params = new URLSearchParams({
        token: emailToken,
        fileName: file.name,
        contentType: file.type,
    })
    let res
    try {
        res = await fetch(`${API_BASE}/users/id-card/upload-url?${params.toString()}`, {
            method: 'GET',
            headers: authHeaders(jwt),
        })
    } catch {
        const e = new Error('Network error. Check your connection and retry.')
        e.code = 'NETWORK'
        throw e
    }
    let data = null
    try {
        data = await res.json()
    } catch {
        data = null
    }
    // Support both { success, uploadUrl, fileKey } and { success, data: { uploadUrl, fileKey } }
    const uploadUrl = data?.uploadUrl || data?.data?.uploadUrl
    const fileKey = data?.fileKey || data?.data?.fileKey
    if (!res.ok || !uploadUrl || !fileKey) {
        const msg = mapStatusToMessage(res.status, parseBackendMessage(data, 'Failed to get upload URL.'))
        const e = new Error(msg)
        e.code = res.status
        throw e
    }
    return { uploadUrl, fileKey }
}

/**
 * Step 3: PUT the binary file directly to S3. No JWT header.
 */
export async function uploadFileToS3({ uploadUrl, file }) {
    let res
    try {
        res = await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': file.type },
            body: file,
        })
    } catch {
        const e = new Error('S3 upload failed due to a network error. Please retry.')
        e.code = 'S3_NETWORK'
        throw e
    }
    if (!res.ok) {
        const e = new Error('ID upload to storage failed. Please retry without restarting.')
        e.code = 'S3_UPLOAD'
        throw e
    }
}

/**
 * Step 4: POST /users/id-card/submit (authenticated).
 */
export async function submitIdCard({ emailToken, id_card_type, id_card_number, s3_file_key, jwt }) {
    if (!jwt) {
        const e = new Error('Missing authentication. Please login.')
        e.code = 401
        throw e
    }
    let res
    try {
        res = await fetch(`${API_BASE}/users/id-card/submit`, {
            method: 'POST',
            headers: authHeaders(jwt),
            body: JSON.stringify({
                token: emailToken,
                id_card_type,
                id_card_number,
                s3_file_key,
            }),
        })
    } catch {
        const e = new Error('Network error. Check your connection and retry.')
        e.code = 'NETWORK'
        throw e
    }
    let data = null
    try {
        data = await res.json()
    } catch {
        data = null
    }
    if (!res.ok || data?.success === false) {
        const msg = mapStatusToMessage(res.status, parseBackendMessage(data, 'Submission failed.'))
        const e = new Error(msg)
        e.code = res.status
        throw e
    }
    return data
}

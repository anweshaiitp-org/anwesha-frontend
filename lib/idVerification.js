/**
 * Task 4: Student ID Verification API client (new Anwesha 2k27 backend).
 * Base URL configurable via NEXT_PUBLIC_HOST, defaults to production
 * https://api.anwesha.live per API documentation.
 */

export const API_BASE =
    process.env.NEXT_PUBLIC_HOST || '/api/backend'

export const ID_CARD_TYPES = ['COLLEGE_ID', 'GOVT_ID', 'AADHAAR']

export const SUPPORTED_CONTENT_TYPES = {
    'image/png': ['png'],
    'image/jpeg': ['jpeg', 'jpg'],
    'image/jpg': ['jpg'],
    'application/pdf': ['pdf'],
}

export const SUPPORTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg']

const MAX_FILE_BYTES = 5 * 1024 * 1024 // 5MB frontend guardrail (backend enforces its own 413)

export function validateIdFile(file, docType = 'college_id') {
    if (!file) return 'Please select a file to upload.'
    const isAadhar = docType === 'aadhar_id' || docType === 'aadhar' || docType === 'aadhaar'
    if (isAadhar) {
        const isPdf =
            file.type === 'application/pdf' ||
            /\.pdf$/i.test(file.name || '')
        if (!isPdf) {
            return 'Invalid file type. Only PDF files are accepted for Aadhar Card.'
        }
    } else {
        const isImage =
            SUPPORTED_IMAGE_TYPES.includes(file.type?.toLowerCase()) ||
            /\.(png|jpe?g)$/i.test(file.name || '')
        if (!isImage) {
            return 'Invalid file type. Only image files (PNG, JPG, JPEG) are accepted for College ID Card.'
        }
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
            // Backend returns 403 for invalid / expired / already-used token
            return backendMsg || 'Invalid token. Please use the link from your email.'
        case 404:
            return 'Endpoint or resource not found.'
        case 413:
            return 'File too large. Please upload a smaller file (max 5MB).'
        case 429:
            return 'Too many requests. Please wait and try again.'
        default:
            if (status >= 500) return 'Server error. Please try again later.'
            return backendMsg || 'Something went wrong. Please try again.'
    }
}

/**
 * Step 2: Request a presigned S3 upload URL (authenticated).
 * Primary endpoint: GET /users/id-card/upload-url?token=..&contentType=image/png|application/pdf
 */
export async function requestUploadUrl({ file, jwt, emailToken, doc_type = 'college_id' }) {
    if (!jwt) {
        const e = new Error('Missing authentication. Please login.')
        e.code = 401
        throw e
    }
    const isAadhar = doc_type === 'aadhar_id' || doc_type === 'aadhar' || doc_type === 'aadhaar'
    let defaultExt = 'jpg'
    if (isAadhar) {
        defaultExt = 'pdf'
    } else if (file?.type === 'image/png' || /\.png$/i.test(file?.name || '')) {
        defaultExt = 'png'
    } else if (file?.type === 'image/jpeg' || /\.jpeg$/i.test(file?.name || '')) {
        defaultExt = 'jpeg'
    }

    const safeFileName = (file?.name || `${doc_type}.${defaultExt}`)
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/^_+/, '') || `${doc_type}.${defaultExt}`

    let detectedContentType = file?.type
    if (!detectedContentType) {
        if (/\.png$/i.test(safeFileName)) detectedContentType = 'image/png'
        else if (/\.jpe?g$/i.test(safeFileName)) detectedContentType = 'image/jpeg'
        else if (/\.pdf$/i.test(safeFileName)) detectedContentType = 'application/pdf'
        else detectedContentType = isAadhar ? 'application/pdf' : 'image/jpeg'
    }

    const params = new URLSearchParams({
        token: emailToken,
        fileName: safeFileName,
        contentType: detectedContentType,
        doc_type,
    })

    let res
    let data = null

    // Try primary /users/id-card/upload-url first
    try {
        res = await fetch(`${API_BASE}/users/id-card/upload-url?${params.toString()}`, {
            method: 'GET',
            headers: authHeaders(jwt),
        })
        if (res.ok) {
            data = await res.json().catch(() => null)
        }
    } catch {
        res = null
    }

    // Fallback to /registration/upload-url if primary endpoint failed
    if (!res || !res.ok || (!data?.uploadUrl && !data?.data?.uploadUrl)) {
        try {
            res = await fetch(`${API_BASE}/registration/upload-url?${params.toString()}`, {
                method: 'GET',
                headers: authHeaders(jwt),
            })
            if (res.ok) {
                data = await res.json().catch(() => null)
            }
        } catch {
            const e = new Error('Network error. Check your connection and retry.')
            e.code = 'NETWORK'
            throw e
        }
    }

    if (!data && res) {
        try {
            data = await res.json()
        } catch {
            data = null
        }
    }

    // Support both { success, uploadUrl, fileKey } and { success, data: { uploadUrl, fileKey } }
    const uploadUrl = data?.uploadUrl || data?.data?.uploadUrl
    const fileKey = data?.fileKey || data?.data?.fileKey
    if (!res?.ok || !uploadUrl || !fileKey) {
        const status = res?.status || 500
        const msg = mapStatusToMessage(status, parseBackendMessage(data, 'Failed to get upload URL.'))
        const e = new Error(msg)
        e.code = status
        throw e
    }
    return { uploadUrl, fileKey }
}

/**
 * Step 3: PUT the binary file directly to S3. No JWT header.
 */
export async function uploadFileToS3({ uploadUrl, file }) {
    let res
    const contentType =
        file?.type ||
        (/\.png$/i.test(file?.name || '')
            ? 'image/png'
            : /\.pdf$/i.test(file?.name || '')
            ? 'application/pdf'
            : 'image/jpeg')

    try {
        res = await fetch(uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': contentType },
            body: file,
        })
    } catch {
        const e = new Error('Storage upload failed due to a network error. Please retry.')
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
 * Accepts dual documents (college_id & aadhar_id) as well as legacy payload.
 */
export async function submitIdCard({
    emailToken,
    college_id_number,
    college_id_file_key,
    aadhar_id_number,
    aadhar_id_file_key,
    id_card_type,
    id_card_number,
    s3_file_key,
    jwt,
}) {
    if (!jwt) {
        const e = new Error('Missing authentication. Please login.')
        e.code = 401
        throw e
    }
    let res
    try {
        const bodyPayload = {
            token: emailToken,
        }
        if (college_id_number !== undefined) bodyPayload.college_id_number = college_id_number
        if (college_id_file_key !== undefined) bodyPayload.college_id_file_key = college_id_file_key
        if (aadhar_id_number !== undefined) bodyPayload.aadhar_id_number = aadhar_id_number
        if (aadhar_id_file_key !== undefined) bodyPayload.aadhar_id_file_key = aadhar_id_file_key
        if (id_card_type !== undefined) bodyPayload.id_card_type = id_card_type
        if (id_card_number !== undefined) bodyPayload.id_card_number = id_card_number
        if (s3_file_key !== undefined) bodyPayload.s3_file_key = s3_file_key

        res = await fetch(`${API_BASE}/users/id-card/submit`, {
            method: 'POST',
            headers: authHeaders(jwt),
            body: JSON.stringify(bodyPayload),
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

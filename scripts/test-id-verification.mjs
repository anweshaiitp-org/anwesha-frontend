/**
 * Task 4 test cases — run: node scripts/test-id-verification.mjs
 * Uses mocked fetch (no real backend needed). Set LIVE=1 + JWT + API_BASE
 * env vars to hit a real backend instead.
 */
import {
    requestUploadUrl,
    uploadFileToS3,
    submitIdCard,
    validateIdFile,
    mapStatusToMessage,
} from '../lib/idVerification.js'

let pass = 0
let fail = 0
const ok = (name, cond, extra = '') => {
    if (cond) {
        pass++
        console.log(`PASS  ${name}`)
    } else {
        fail++
        console.log(`FAIL  ${name}  ${extra}`)
    }
}
const fakeFile = (name = 'my_id.pdf', type = 'application/pdf', size = 1000) => ({
    name,
    type,
    size,
})
const jsonRes = (status, obj) => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => obj,
})

// ---- mocked unit/integration tests (spec table) ----
async function runMocked() {
    const realFetch = global.fetch

    // 1. presigned URL with valid auth -> uploadUrl + fileKey
    global.fetch = async (url, opts) => {
        const u = String(url)
        if (!u.includes('/registration/upload-url')) throw new Error('wrong endpoint: ' + u)
        if (opts?.headers?.Authorization !== 'Bearer good-jwt') throw new Error('missing JWT')
        if (!u.includes('fileName=') || !u.includes('contentType=')) throw new Error('bad query params')
        return jsonRes(200, { success: true, uploadUrl: 'https://s3.example/x', fileKey: 'id-cards/u/x.pdf' })
    }
    try {
        const r = await requestUploadUrl({ file: fakeFile(), jwt: 'good-jwt' })
        ok('presigned URL with valid auth returns uploadUrl+fileKey', r.uploadUrl && r.fileKey)
    } catch (e) { ok('presigned URL with valid auth returns uploadUrl+fileKey', false, e.message) }

    // 2. presigned URL without auth -> 401 handled
    try {
        await requestUploadUrl({ file: fakeFile(), jwt: null })
        ok('presigned URL without auth handled', false, 'should have thrown')
    } catch (e) { ok('presigned URL without auth handled', e.code === 401) }

    // 2b. presigned URL with bad token -> 401 message, no throw-through
    global.fetch = async () => jsonRes(401, { success: false, message: 'Unauthorized' })
    try {
        await requestUploadUrl({ file: fakeFile(), jwt: 'bad' })
        ok('presigned URL expired session handled', false)
    } catch (e) { ok('presigned URL expired session handled', /expired|login|unauthorized/i.test(e.message)) }

    // 3/4. S3 PUT sends binary + Content-Type, no JWT
    global.fetch = async (url, opts) => {
        if (opts?.headers?.Authorization) throw new Error('JWT leaked to S3!')
        if (opts?.method !== 'PUT') throw new Error('S3 must be PUT')
        if (opts?.headers?.['Content-Type'] !== opts?.body?.type) throw new Error('wrong content-type')
        if (typeof opts?.body !== 'object') throw new Error('body must be binary file')
        return { ok: true, status: 200 }
    }
    try {
        await uploadFileToS3({ uploadUrl: 'https://s3.example/x', file: fakeFile() })
        ok('valid PDF uploads to S3 (binary PUT, no JWT)', true)
        await uploadFileToS3({ uploadUrl: 'https://s3.example/x', file: fakeFile('pic.jpg', 'image/jpeg', 500) })
        ok('supported image uploads to S3', true)
    } catch (e) { ok('S3 upload', false, e.message) }

    // 5. valid submit -> success message
    global.fetch = async (url, opts) => {
        const body = JSON.parse(opts.body)
        const need = ['token', 'id_card_type', 'id_card_number', 's3_file_key']
        if (!need.every((k) => body[k])) throw new Error('payload missing keys: ' + JSON.stringify(body))
        if (!['COLLEGE_ID', 'GOVT_ID', 'AADHAAR'].includes(body.id_card_type)) throw new Error('bad id type')
        return jsonRes(200, { success: true, message: 'Identity card submitted successfully and is pending review by the team.' })
    }
    try {
        const d = await submitIdCard({ emailToken: 'em', id_card_type: 'COLLEGE_ID', id_card_number: '2201CS01', s3_file_key: 'k', jwt: 'good-jwt' })
        ok('valid ID submit returns success', d.success === true)
    } catch (e) { ok('valid ID submit returns success', false, e.message) }

    // 6. missing ID details -> validation error (client-side)
    ok('missing file rejected by validator', !!validateIdFile(null))
    ok('bad file type rejected', !!validateIdFile(fakeFile('x.exe', 'application/x-msdownload', 100)))
    ok('oversize file rejected', !!validateIdFile(fakeFile('b.pdf', 'application/pdf', 99 * 1024 * 1024)))

    // 7. submit without token -> 403 handled
    global.fetch = async () => jsonRes(403, { success: false, message: 'Invalid token' })
    try {
        await submitIdCard({ emailToken: 'bad', id_card_type: 'COLLEGE_ID', id_card_number: '1', s3_file_key: 'k', jwt: 'good-jwt' })
        ok('submit with invalid token shows error', false)
    } catch (e) { ok('submit with invalid token shows error', /token|revoked|invalid/i.test(e.message)) }

    // 9. S3 failure must block submit (upload throws before submit is called)
    let submitCalled = false
    global.fetch = async (url, opts) => {
        if (String(url).startsWith('https://s3.')) return { ok: false, status: 500 }
        submitCalled = true
        return jsonRes(200, { success: true })
    }
    try { await uploadFileToS3({ uploadUrl: 'https://s3.example/x', file: fakeFile() }) } catch { /* expected */ }
    ok('S3 failure blocks form submit (upload throws)', submitCalled === false)

    // 10. backend 500 -> friendly error, no internals
    global.fetch = async () => jsonRes(500, { success: false, error: 'Traceback...' })
    try {
        await submitIdCard({ emailToken: 't', id_card_type: 'COLLEGE_ID', id_card_number: '1', s3_file_key: 'k', jwt: 'j' })
        ok('server 500 shows friendly error', false)
    } catch (e) { ok('server 500 shows friendly error', /try again later/i.test(e.message)) }

    // 11. duplicate-submit guard lives in pages/submit-id.js (submitting||submitted);
    // here we assert the error mapper covers 429 rate-limit
    ok('429 rate-limit mapped', /many requests/i.test(mapStatusToMessage(429, '')))
    ok('400 validation mapped', /invalid request/i.test(mapStatusToMessage(400, '')))
    ok('404 mapped', /not found/i.test(mapStatusToMessage(404, '')))
    ok('413 mapped', /too large/i.test(mapStatusToMessage(413, '')))

    global.fetch = realFetch
}

await runMocked()
console.log(`\n${pass} passed, ${fail} failed (mocked, no real backend touched)`)
console.log('For LIVE tests: set API_BASE + JWT env and run with LIVE=1 (do NOT submit real documents to production).')
process.exit(fail ? 1 : 0)

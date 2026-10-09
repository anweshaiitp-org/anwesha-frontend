/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    optimizeFonts: false,
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'user-images.githubusercontent.com' },
            { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
            { protocol: 'https', hostname: 'www.internationalmusicfestival.com' },
            { protocol: 'https', hostname: 'drive.google.com' },
            { protocol: 'https', hostname: 'i.ibb.co' },
            { protocol: 'https', hostname: 'kvibbihar.com' },
        ],

    },

    async rewrites() {
        const backendUrl = (
            process.env.BACKEND_URL ||
            'http://localhost:4566/restapis/rd2pitqke0/prod/_user_request_'
        ).replace(/\/+$/, '')

        return [
            {
                source: '/api/backend/:path*',
                destination: `${backendUrl}/:path*`,
            },
        ]
    },
    async redirects() {
        return [
            {
                source: '/multicity',
                destination: '/coming-soon',
                permanent: false,
            },
            {
                source: '/all-multicity',
                destination: '/coming-soon',
                permanent: false,
            },
        ]
    },
}

module.exports = nextConfig

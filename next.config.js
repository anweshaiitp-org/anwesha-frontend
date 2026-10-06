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
            'https://9vh9oqloa1.execute-api.localhost.localstack.cloud:4566/prod'
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

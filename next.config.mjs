/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'oaidalleapiprodscus.blob.core.windows.net',
                pathname: '**',
            },
        ],
    },
    trailingSlash: false,
};

export default nextConfig;

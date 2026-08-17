import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                hostname: "localhost",
                port: "4000",
            },
        ],
    },
}

export default nextConfig

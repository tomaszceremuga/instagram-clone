import type { NextConfig } from "next"

const nextConfig: NextConfig = {
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

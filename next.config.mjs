// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.tar/,
            use: "raw-loader",
        });
        config.experiments.asyncWebAssembly = true;
        config.experiments.syncWebAssembly = true;
        return config;
    },
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "picsum.photos" },
            { protocol: "https", hostname: "tailwindcss.com" },
            { protocol: "https", hostname: "**" },
        ],
    },
};

import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
});

export default bundleAnalyzer(nextConfig);

// run analyze use: ANALYZE=true npm run build

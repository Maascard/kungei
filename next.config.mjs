/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint не входит в зависимости — не блокируем сборку линтингом.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;

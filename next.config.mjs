/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   appDir: true,
  // },
  // output: "standalone", // atau hapus "output: export"
  swcMinify: true,
  images: {
    unoptimized: true,
    loader: 'akamai',
    path: '',
    loaderFile: '',
  },
  webpack: (config) => {
    // Optimize and reduce bundle size
    config.optimization.splitChunks = {
      chunks: 'all',
    };

    // Customize Webpack configuration if needed
    return config;
  },
  generateMetadata: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN
  },
};

export default nextConfig;

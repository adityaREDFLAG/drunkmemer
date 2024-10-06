// next.config.mjs
export const nextConfig = {
  output: 'export', // Enables Next.js to export the app as static files
  trailingSlash: true, // Optional but helps in static hosting environments
  images: {
    unoptimized: true, // Disable Next.js image optimization for static exports
  }
}

export default nextConfig; // Make sure to export it as default as well

const withNextIntl = require("next-intl/plugin")();

const nextConfig = withNextIntl({
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  images: {
    domains: ["*"], // Allow images from any hostname
  },
  async headers() {
    return [
      {
        // Matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:locale", // Match the dynamic locale
        has: [
          {
            type: "header",
            key: "accept-language",
            value: "(.*)", // Matches requests with any accept-language header
          },
        ],
        destination: "/:locale/dashboard", // Redirect to /dashboard
        permanent: false, // Use a temporary redirect (302)
      },
    ];
  },
});

module.exports = nextConfig;

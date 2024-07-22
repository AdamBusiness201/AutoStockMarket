const withNextIntl = require('next-intl/plugin')();
const nextConfig = withNextIntl({
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  images: {
    domains: ['*'], // Allow images from any hostname
  },
});

module.exports = nextConfig;

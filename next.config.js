const path = require('path');
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      },
      {
        protocol: 'https',
        hostname: 'fnprofileimages3.s3.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 'd14mo7l28m4zy2.cloudfront.net'
      },
      {
        protocol: 'https',
        hostname: 'd10junu4p422no.cloudfront.net'
      },
      {
        protocol: 'https',
        hostname: 'members.foundersnetwork.com'
      },
      {
        protocol: 'https',
        hostname: 'api.box.com'
      },
      {
        protocol: 'http',
        hostname: 'staging.foundersnetwork.com'
      },
      {
        protocol: 'https',
        hostname: 'staging.foundersnetwork.com'
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org'
      },
      {
        protocol: 'https',
        hostname: 'www.freepnglogos.com'
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com'
      },
      {
        protocol: 'https',
        hostname: 'staff.foundersnetwork.com'
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/home'
      },
      {
        source: '/home',
        destination: '/home'
      },
      {
        source: '/Home',
        destination: '/home'
      },
      {
        source: '/Home/',
        destination: '/home'
      }
    ];
  },
  basePath: process.env.NEXT_PUBLIC_BASE_URL,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;

// Injected content via Sentry wizard below

const {withSentryConfig} = require('@sentry/nextjs');

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: 'founders-network',
  project: 'javascript-nextjs',
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Only print logs for uploading source maps in CI
  // silent: !process.env.CI,
  silent: false,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true
});

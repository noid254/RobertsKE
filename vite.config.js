// vite.config.js

// This configuration file is for Vite, a build tool that may be used by Replit
// to run this project. It solves the "Blocked request" error by configuring
// the development server to be accessible from the public Replit URL.
module.exports = {
  server: {
    // This makes the server listen on all network interfaces,
    // which is required for it to be accessible from outside the container.
    host: '0.0.0.0',
    // This ensures that Hot Module Replacement (HMR) works correctly
    // through Replit's proxy.
    hmr: {
      clientPort: 443,
    },
  },
};

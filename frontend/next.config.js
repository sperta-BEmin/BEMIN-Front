// next.config.js
module.exports = {
    reactStrictMode: true,
    trailingSlash: true,
    publicRuntimeConfig: {
        API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
    }
};

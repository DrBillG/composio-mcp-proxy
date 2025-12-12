const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 8080;

// Your Composio API key from environment variable
const COMPOSIO_API_KEY = process.env.COMPOSIO_API_KEY;

// The base Composio backend URL
const COMPOSIO_TARGET = 'https://backend.composio.dev';

// Proxy middleware configuration
app.use('/', createProxyMiddleware({
  target: COMPOSIO_TARGET,
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    // Inject the x-api-key header
    proxyReq.setHeader('x-api-key', COMPOSIO_API_KEY);
  },
  logLevel: 'debug'
}));

app.listen(PORT, () => {
  console.log(`MCP Proxy running on port ${PORT}`);
  console.log(`Forwarding to ${COMPOSIO_TARGET} with x-api-key header`);
});

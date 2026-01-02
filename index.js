const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const moment = require('moment-timezone');

const app = express();
const PORT = process.env.PORT || 8080;

// Your Composio API key from environment variable
const COMPOSIO_API_KEY = process.env.COMPOSIO_API_KEY;

// The base Composio backend URL
const COMPOSIO_TARGET = 'https://backend.composio.dev';

// Timezone for Dr. Giovannetti
const PACIFIC_TZ = 'America/Los_Angeles';

// Current time endpoint - NEVER cached, always fresh
// This establishes the temporal anchor as required by AIVA protocol
app.get('/api/current-time', (req, res) => {
  // Set headers to prevent any caching
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  const now = moment().tz(PACIFIC_TZ);

  res.json({
    timestamp: now.valueOf(),
    iso: now.format(),
    timezone: PACIFIC_TZ,
    formatted: {
      full: now.format('dddd, MMMM D, YYYY'),
      date: now.format('YYYY-MM-DD'),
      time: now.format('HH:mm:ss'),
      time12h: now.format('h:mm:ss A'),
      dayOfWeek: now.format('dddd'),
      month: now.format('MMMM'),
      day: now.format('D'),
      year: now.format('YYYY')
    },
    unix: now.unix(),
    utc: now.utc().format()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'composio-mcp-proxy' });
});

// Proxy middleware configuration
// This must come AFTER the specific routes above
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
  console.log(`Current time endpoint available at /api/current-time (${PACIFIC_TZ})`);
});

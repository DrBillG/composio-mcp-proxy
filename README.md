# composio-mcp-proxy
Node.js proxy to add x-api-key header for Composio MCP endpoints

## Features

- **Composio API Proxy**: Forwards requests to Composio backend with automatic x-api-key header injection
- **Current Time Endpoint**: Provides accurate, never-cached date/time in Pacific timezone
- **AIVA Protocol Compliant**: Supports temporal anchor establishment as required by AIVA specification

## Endpoints

### `/api/current-time`
Returns the current date and time in Pacific timezone (America/Los_Angeles). This endpoint is never cached and always returns fresh data.

**Response:**
```json
{
  "timestamp": 1735826400000,
  "iso": "2026-01-02T00:00:00-08:00",
  "timezone": "America/Los_Angeles",
  "formatted": {
    "full": "Thursday, January 2, 2026",
    "date": "2026-01-02",
    "time": "00:00:00",
    "time12h": "12:00:00 AM",
    "dayOfWeek": "Thursday",
    "month": "January",
    "day": "2",
    "year": "2026"
  },
  "unix": 1735826400,
  "utc": "2026-01-02T08:00:00Z"
}
```

### `/health`
Health check endpoint returning service status.

### `/` (All other routes)
Proxied to Composio backend with x-api-key header injection.

## Setup

```bash
npm install
export COMPOSIO_API_KEY="your-api-key-here"
npm start
```

## Environment Variables

- `COMPOSIO_API_KEY` (required): Your Composio API key
- `PORT` (optional): Server port (default: 8080)

## AIVA Integration

This proxy satisfies the AIVA protocol requirement for temporal integrity:
> "STEP 1: ESTABLISH TEMPORAL ANCHOR - Your absolute first action, before any other processing or data gathering, is to call a tool to get the current, precise date and time."

AIVA should call `/api/current-time` at the start of each session to establish the verified temporal anchor in Pacific timezone.

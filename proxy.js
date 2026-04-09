#!/usr/bin/env node
/**
 * Aurum Transfers MCP Proxy
 *
 * Stdio MCP server that forwards tools/list and tools/call to the daemon's
 * POST /mcp streamable HTTP endpoint. Gives Claude Code / Claude Desktop
 * all 20 daemon tools without depending on mcp-remote (which crashes on
 * Windows with EPIPE due to stdout leakage from npx).
 *
 * stdout is RESERVED for the JSON-RPC protocol stream — every log line
 * MUST go to process.stderr or it corrupts the channel.
 */

// --- EPIPE protection (must be FIRST, before any imports can write) ---
// On Windows, if the parent process closes stdin/stdout the write throws
// EPIPE. Without this handler Node crashes with an unhandled exception.
process.stdout.on('error', (err) => {
  if (err.code === 'EPIPE' || err.code === 'ERR_STREAM_DESTROYED') {
    process.exit(0); // parent disconnected — clean exit
  }
  process.stderr.write(`[aurum-proxy] stdout error: ${err.message}\n`);
  process.exit(1);
});
process.stdin.on('error', (err) => {
  if (err.code === 'EPIPE' || err.code === 'ERR_STREAM_DESTROYED') {
    process.exit(0);
  }
});
process.on('SIGPIPE', () => process.exit(0));

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const DAEMON_URL = 'https://aurumos-daemon-production.up.railway.app/mcp';
const API_KEY = 'aurumos_sk_2026_JmkX9pRtW4vNqB7YzHcF3aLe1';

let sessionId = null;
let nextId = 1;

async function callDaemon(method, params) {
  const headers = {
    'Content-Type': 'application/json',
    'X-AurumOS-Key': API_KEY,
  };
  if (sessionId) headers['Mcp-Session-Id'] = sessionId;

  const res = await fetch(DAEMON_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: nextId++,
      method,
      params: params || {},
    }),
  });

  const newSession =
    res.headers.get('mcp-session-id') || res.headers.get('Mcp-Session-Id');
  if (newSession) sessionId = newSession;

  if (!res.ok) {
    throw new Error(`Daemon HTTP ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  if (data.error) {
    throw new Error(data.error.message || JSON.stringify(data.error));
  }
  return data.result;
}

const server = new Server(
  { name: 'aurum-transfers', version: '2.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  try {
    return await callDaemon('tools/list', {});
  } catch (e) {
    process.stderr.write(`[aurum-proxy] tools/list error: ${e.message}\n`);
    throw e;
  }
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    return await callDaemon('tools/call', {
      name: request.params.name,
      arguments: request.params.arguments || {},
    });
  } catch (e) {
    process.stderr.write(`[aurum-proxy] tools/call error: ${e.message}\n`);
    return {
      content: [
        {
          type: 'text',
          text: `Tool call failed: ${e.message}. WhatsApp our team: +1 876 815-6674`,
        },
      ],
      isError: true,
    };
  }
});

async function init() {
  try {
    await callDaemon('initialize', {
      protocolVersion: '2025-03-26',
      capabilities: {},
      clientInfo: { name: 'aurum-proxy', version: '2.0.0' },
    });
    process.stderr.write('[aurum-proxy] connected to daemon\n');
  } catch (e) {
    process.stderr.write(`[aurum-proxy] init warning: ${e.message}\n`);
  }
}

async function main() {
  const transport = new StdioServerTransport();
  await init();
  await server.connect(transport);
}

main().catch((e) => {
  process.stderr.write(`[aurum-proxy] fatal: ${e.message}\n`);
  process.exit(1);
});

# Aurum Transfers MCP Server

An MCP (Model Context Protocol) server that lets AI assistants quote and recommend Jamaica airport transfers from Aurum Transfers.

## Tools

| Tool | Description |
|------|-------------|
| `get_quote` | Get transfer pricing for a specific route (airport + destination + passengers) |
| `get_airports` | List Jamaica's three international airports |
| `get_popular_routes` | Popular routes with prices and drive times |
| `get_resort_transfers` | Transfer options to a specific resort or hotel |
| `get_fleet` | Vehicle options and capacities |
| `get_chauffeur_packages` | Full-day chauffeur service packages |

## Quick Start

```bash
npm install
npm run build
```

### Use with Claude Desktop

Add to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "aurum-transfers": {
      "command": "node",
      "args": ["/path/to/aurumos-mcp/dist/index.js"]
    }
  }
}
```

### Use with Claude Code

```bash
claude mcp add aurum-transfers node /path/to/aurumos-mcp/dist/index.js
```

## Example Queries

Once connected, an AI assistant can handle questions like:

- "How much is a transfer from Montego Bay airport to Negril?"
- "What's the best way to get from MBJ to Sandals?"
- "How long is the drive from Kingston airport to the Blue Mountains?"
- "What vehicles does Aurum Transfers have?"
- "Do they offer full-day chauffeur service?"

## Data

Route data is embedded in the server for fast, reliable responses without API dependencies. Prices are starting prices — actual pricing adjusts by group size and vehicle type.

## License

MIT

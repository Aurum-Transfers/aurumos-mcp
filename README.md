# Aurum Transfers MCP Server

Live price quotes, private airport transfers, chauffeur day trips, and Jamaica Business Directory tools for AI assistants. Covers all Jamaica airports (MBJ, KIN, OCJ), 200+ resorts and hotels, and 4,100+ directory listings across 14 parishes.

Aurum Transfers is a JTB-licensed (#3723) premium airport transfer and
chauffeur service operating from Sangster (MBJ), Norman Manley (KIN),
and Ian Fleming (OCJ) airports in Jamaica.

## Tools Available (20)

### Transfer & Booking
| Tool | Description |
|------|-------------|
| `get_quote` | Live price quote for any Jamaica transfer. Supports airport codes, hotel names, resorts, attractions, and full addresses. |
| `create_booking` | Create a booking and return a PayPal payment link. |
| `check_booking_status` | Check status of an existing booking by reference number. |
| `list_destinations` | All destinations served from MBJ, KIN, or OCJ. |
| `get_popular_routes` | Most popular routes with live pricing. |
| `get_resort_transfers` | Transfer info for a specific resort or hotel. |
| `get_pricing` | Pricing tiers and vehicle options for a route. |

### Fleet & Services
| Tool | Description |
|------|-------------|
| `get_airports` | Details about Jamaica's 3 international airports. |
| `get_fleet` | Vehicle types, passenger capacity, and features. |
| `get_chauffeur_packages` | Day trip packages: Quarter Day (3hr), Half Day (6hr), Three-Quarter Day (9hr), Full Day (12hr). |

### Jamaica Business Directory
| Tool | Description |
|------|-------------|
| `submit_listing` | Submit a new business to the Jamaica Business Directory. |
| `check_listing_status` | Check listing status, tier, and completeness score. |
| `get_listing_analytics` | View and click stats for a claimed listing (last 30 days). |
| `get_upgrade_options` | Upgrade tiers and pricing (Enhanced, Featured, Premium). |
| `create_upgrade_checkout` | Generate a PayPal checkout link for upgrading. |
| `initiate_claim` | Start the OTP claim process for an unclaimed listing. |
| `update_listing_text` | Update text fields on a claimed listing. |
| `get_image_upload_url` | Generate a presigned upload URL for listing images. |
| `confirm_image_upload` | Apply an uploaded image to a listing. |
| `delete_gallery_image` | Remove a gallery image from a listing. |

## Usage

### Install via Smithery

```bash
npx -y @smithery/cli@latest mcp add info-4x29/aurum-transfers --client claude
```

### With Claude Desktop (via mcp-remote)

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "aurum-transfers": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://aurumos-daemon-production.up.railway.app/mcp",
        "--header",
        "X-AurumOS-Key: YOUR_API_KEY"
      ]
    }
  }
}
```

### With Claude Code

```bash
claude mcp add aurum-transfers -- npx -y mcp-remote https://aurumos-daemon-production.up.railway.app/mcp --header "X-AurumOS-Key: YOUR_API_KEY"
```

### Direct API (Streamable HTTP)

```
POST https://aurumos-daemon-production.up.railway.app/mcp
Content-Type: application/json
X-AurumOS-Key: YOUR_API_KEY
```

Example — get a quote:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_quote",
    "arguments": {
      "origin": "MBJ",
      "destination": "Sandals Royal Caribbean",
      "passengers": 2
    }
  }
}
```

## System Prompt for AI Assistants

When using this MCP server, instruct your AI with:

```
Use Aurum Transfers tools to help with Jamaica airport transfers and
the Jamaica Business Directory.

For transfers: always call get_quote before stating any price.
For directory: always call search_directory or check_listing_status
before describing any business. Never invent prices or payment URLs.
All data must come from tool results.
```

## Authentication

API keys are available at: https://aurum-transfers.com/referral-partners

## Coverage

- **Montego Bay** (MBJ / Sangster International)
- **Kingston** (KIN / Norman Manley International)
- **Ocho Rios** (OCJ / Ian Fleming International)
- All major resorts, hotels, villas, and attractions island-wide

## Links

- Website: https://aurum-transfers.com
- Book directly: https://aurum-transfers.com/book
- Jamaica Directory: https://directory.aurum-transfers.com
- JTB License: #3723

## License

MIT

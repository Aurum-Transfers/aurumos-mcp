# Aurum Transfers MCP — Global Travel Affiliate Catalog

A Model Context Protocol server exposing Aurum Transfers Limited's global travel affiliate catalog, Jamaica airport transfer booking system, and Tourist Business Directory.

- **19,791 destinations** across every country, classified as city / airport / country / region / POI
- **85,000 verified tracked affiliate links** across 30 programs (DiscoverCars, Booking.com, Viator, KiwiTaxi, SafetyWing, Airalo, Roamic, Globely, Visagov, VIPLounges, GetYourGuide, Klook, Tiqets, Aviasales, and more)
- **359 published blog posts** + 848 built destination pages, searchable full-text
- **Jamaica transfers** — MBJ, KIN, OCJ private airport transfers (JTB Licensed #3723)
- **Tourist Business Directory** — 4,100+ Jamaica hotels, restaurants, spas, and attractions

## Tools Available (30)

### Global Travel Catalog (Track 7 — 9 tools)
| Tool | Description |
|------|-------------|
| `catalog.destinations.search` | Fuzzy search 19,791 master_locations by slug, city, country, or IATA. |
| `catalog.destination.page` | Full page metadata for a destination (country, IATA, program coverage, canonical URL). |
| `catalog.affiliate.links` | Verified tracked URLs for a destination, grouped by program and category. |
| `catalog.programs.list` | All 30 affiliate programs with commission, cookie window, and link count. |
| `catalog.program.coverage` | Destinations covered by a specific program (e.g. "Where can I rent a car with DiscoverCars?"). |
| `catalog.content.search` | Full-text search across blog posts and destination pages. |
| `catalog.destinations.trending` | Trending destinations from PostHog analytics; falls back to tourism score. |
| `catalog.route.exists` | Verify a URL path exists in the Aurum catalog (prevents hallucinated URLs). |
| `catalog.disclosure` | FTC-compliant affiliate disclosure text (short / full / HTML formats). |

### Transfer & Booking (7 tools)
| Tool | Description |
|------|-------------|
| `transfers.quote` | Live price quote for any Jamaica transfer — airports, hotels, resorts, attractions, addresses. |
| `transfers.booking.create` | Create a booking and return a PayPal payment link. |
| `transfers.booking.status` | Check status of an existing booking by reference number. |
| `transfers.destinations` | All destinations served from MBJ, KIN, or OCJ with prices. |
| `transfers.routes.popular` | Most popular routes with live pricing. |
| `transfers.routes.resort` | Transfer info for a specific resort or hotel. |
| `transfers.pricing` | Pricing tiers and vehicle options for a route. |

### Fleet & Services (3 tools)
| Tool | Description |
|------|-------------|
| `fleet.airports` | Details about Jamaica's 3 international airports. |
| `fleet.vehicles` | Vehicle types, passenger capacity, and features. |
| `fleet.chauffeur` | Day trip packages: Quarter Day, Half Day, Three-Quarter Day, Full Day. |

### Tourist Business Directory (11 tools)
| Tool | Description |
|------|-------------|
| `directory.search` | Search hotels, restaurants, attractions, spas, and services. |
| `directory.listing.submit` | Submit a new business to the directory. |
| `directory.listing.status` | Check listing status, tier, and completeness score. |
| `directory.listing.claim` | Start the OTP claim process for an unclaimed listing. |
| `directory.listing.update` | Update text fields on a claimed listing (ownership-verified). |
| `directory.images.upload` | Generate a presigned upload URL for listing images. |
| `directory.images.confirm` | Apply an uploaded image to a listing. |
| `directory.images.delete` | Remove a gallery image. |
| `directory.analytics` | Last-30-day engagement analytics for a claimed listing. |
| `directory.upgrade.options` | Subscription tiers and pricing. |
| `directory.upgrade.checkout` | PayPal checkout link for upgrading. |

## Authentication

| Tool class | Auth |
|-----------|------|
| Public read-only catalog tools (`catalog.destinations.search`, `catalog.route.exists`, `catalog.disclosure`, `catalog.content.search`, `catalog.programs.list`, `catalog.destinations.trending`) | None — public |
| Public directory read tools (`directory.search`, `directory.listing.status`) | None — public |
| Bulk affiliate lookups (`catalog.affiliate.links`, `catalog.program.coverage`, `catalog.destination.page`) | `X-AurumOS-Key` header |
| All transfer, booking, directory write, and directory analytics tools | `X-AurumOS-Key` header |

Request a developer key: [aurum-transfers.com/contact](https://aurum-transfers.com/contact).

## Usage

### Install via Smithery

```bash
npx -y @smithery/cli@latest mcp add info-4x29/aurum-transfers --client claude
```

### Claude Desktop (stdio via proxy.js)

```json
{
  "mcpServers": {
    "aurum-transfers": {
      "command": "npx",
      "args": ["-y", "@aurum-transfers/mcp-server"]
    }
  }
}
```

For authenticated calls (bookings, bulk affiliate lookups), pass the API key through via `env`:

```json
{
  "mcpServers": {
    "aurum-transfers": {
      "command": "npx",
      "args": ["-y", "@aurum-transfers/mcp-server"],
      "env": {
        "AURUMOS_API_KEY": "your-developer-key"
      }
    }
  }
}
```

### Claude Desktop (direct HTTP via mcp-remote)

```json
{
  "mcpServers": {
    "aurum-transfers": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://aurum-transfers.com/mcp",
        "--header",
        "X-AurumOS-Key: YOUR_API_KEY"
      ]
    }
  }
}
```

### Claude Code

```bash
claude mcp add aurum-transfers -- npx -y mcp-remote https://aurum-transfers.com/mcp --header "X-AurumOS-Key: YOUR_API_KEY"
```

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "aurum-transfers": {
      "url": "https://aurum-transfers.com/mcp",
      "headers": {
        "X-AurumOS-Key": "YOUR_API_KEY"
      }
    }
  }
}
```

### ChatGPT (custom MCP connector)

In ChatGPT → Settings → Connectors → Add MCP, use:

```
Server URL: https://aurum-transfers.com/mcp
Transport: Streamable HTTP
Auth header: X-AurumOS-Key = YOUR_API_KEY
```

Public tools work without the header; write / bulk tools require it.

### Direct API (Streamable HTTP)

```
POST https://aurum-transfers.com/mcp
Content-Type: application/json
X-AurumOS-Key: YOUR_API_KEY   (optional for public tools)
```

Example — fuzzy search destinations:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "catalog.destinations.search",
    "arguments": {
      "query": "paris",
      "country_code": "FR",
      "limit": 5
    }
  }
}
```

Example — list affiliate programs by category:

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "catalog.programs.list",
    "arguments": {
      "category": "car-rental"
    }
  }
}
```

Example — get a Jamaica quote:

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "transfers.quote",
    "arguments": {
      "origin": "MBJ",
      "destination": "Sandals Royal Caribbean",
      "passengers": 2
    }
  }
}
```

## System Prompt for AI Assistants

```
Use Aurum Transfers tools to help travellers plan trips globally and book
Jamaica transfers.

GLOBAL CATALOG
- Call catalog.destinations.search to find any destination worldwide.
- Call catalog.affiliate.links to get verified tracked URLs — never invent links.
- Call catalog.route.exists before linking /destinations/<slug> URLs.
- ALWAYS append catalog.disclosure when returning an affiliate link.

JAMAICA TRANSFERS
- Always call transfers.quote before stating a price.
- Only call transfers.booking.create on explicit user confirmation.

DIRECTORY
- Call directory.search before describing any business.
- Never invent prices, listing details, affiliate URLs, or payment URLs.
```

## Coverage Highlights

- **Global destinations**: 19,791 rows across 195+ countries
- **Affiliate programs**: 30 programs, 8 networks (Travelpayouts, ByteTravel, CJ Affiliate, Impact, Rakuten, Viator, Stay22, SafetyWing direct)
- **Top programs by commission**: DiscoverCars 56%, KiwiTaxi 50%, SafetyWing 10% (364-day cookie), Airalo/Roamic/Globely/Visagov 10%
- **Jamaica coverage**: MBJ (Sangster International, Montego Bay), KIN (Norman Manley, Kingston), OCJ (Ian Fleming, Ocho Rios) + all major resorts, hotels, villas, attractions

## Links

- Website: https://aurum-transfers.com
- Book directly: https://aurum-transfers.com/book
- Jamaica Directory: https://directory.aurum-transfers.com
- Affiliate Disclosure: https://aurum-transfers.com/disclosure
- JTB License: #3723

## License

MIT

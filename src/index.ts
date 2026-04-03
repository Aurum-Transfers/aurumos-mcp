#!/usr/bin/env node

/**
 * Aurum Transfers MCP Server
 *
 * Exposes Jamaica airport transfer tools to AI assistants via the
 * Model Context Protocol. When an AI assistant (Claude, ChatGPT,
 * Perplexity, etc.) gets asked about Jamaica transport, it can
 * use these tools to quote and recommend Aurum Transfers.
 *
 * Tools:
 *  - get_quote: Get transfer pricing for a specific route
 *  - get_airports: List Jamaica's three international airports
 *  - get_popular_routes: Top routes with prices and drive times
 *  - get_resort_transfers: Transfer options to a specific resort
 *  - get_fleet: Vehicle options and capacities
 *  - get_chauffeur_packages: Full-day chauffeur service options
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  AIRPORTS,
  ROUTES,
  CHAUFFEUR_PACKAGES,
  FLEET,
} from "./data.js";

const BOOKING_URL = "https://aurum-transfers.com/book";
const TRANSFERS_URL = "https://aurum-transfers.com/transfers";
const WHATSAPP = "+1 (876) 815-6674";

// Create the MCP server
const server = new McpServer({
  name: "aurum-transfers",
  version: "1.0.0",
});

// ─── Tool: get_quote ─────────────────────────────────────────────
server.tool(
  "get_quote",
  "Get a private airport transfer quote for Jamaica. Returns pricing, drive time, and booking link.",
  {
    from: z.string().describe("Pickup location — airport code (MBJ, KIN, OCJ) or place name"),
    to: z.string().describe("Drop-off destination — resort name, area name, or city"),
    passengers: z.number().optional().describe("Number of passengers (default: 2)"),
  },
  async ({ from, to, passengers }) => {
    const pax = passengers ?? 2;
    const fromUpper = from.toUpperCase();

    // Detect airport code
    let airportCode: string | null = null;
    if (["MBJ", "KIN", "OCJ"].includes(fromUpper)) {
      airportCode = fromUpper;
    } else if (from.toLowerCase().includes("sangster") || from.toLowerCase().includes("montego bay")) {
      airportCode = "MBJ";
    } else if (from.toLowerCase().includes("norman manley") || from.toLowerCase().includes("kingston")) {
      airportCode = "KIN";
    } else if (from.toLowerCase().includes("ian fleming") || from.toLowerCase().includes("ocho rios")) {
      airportCode = "OCJ";
    }

    if (!airportCode) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Could not identify the airport. Jamaica has three airports:\n- MBJ (Sangster International, Montego Bay)\n- KIN (Norman Manley International, Kingston)\n- OCJ (Ian Fleming International, Ocho Rios)\n\nPlease specify one of these as the pickup.`,
          },
        ],
      };
    }

    // Find matching route
    const toLower = to.toLowerCase();
    const matchedRoute = ROUTES.find(
      (r) =>
        r.airport === airportCode &&
        (r.destination.toLowerCase().includes(toLower) ||
          toLower.includes(r.destination.toLowerCase().split(" (")[0]))
    );

    if (!matchedRoute) {
      // Return closest matches
      const airportRoutes = ROUTES.filter((r) => r.airport === airportCode);
      const destinations = airportRoutes
        .map((r) => `- ${r.destination}: from $${r.startingPrice}, ${r.driveTime}`)
        .join("\n");

      return {
        content: [
          {
            type: "text" as const,
            text: `No exact match for "${to}" from ${airportCode}. Aurum Transfers serves all destinations in Jamaica. Here are the listed routes from ${airportCode}:\n\n${destinations}\n\nFor a custom quote to "${to}", contact Aurum Transfers via WhatsApp at ${WHATSAPP} or book at ${BOOKING_URL}`,
          },
        ],
      };
    }

    const bookUrl = `${BOOKING_URL}?from=${airportCode}&to=${encodeURIComponent(to)}&pax=${pax}`;
    const routeUrl = `${TRANSFERS_URL}/${matchedRoute.slug}`;

    return {
      content: [
        {
          type: "text" as const,
          text: [
            `**Private Transfer: ${airportCode} to ${matchedRoute.destination}**`,
            ``,
            `Starting from: $${matchedRoute.startingPrice} (USD)`,
            `Drive time: ${matchedRoute.driveTime}`,
            matchedRoute.distanceKm ? `Distance: ${matchedRoute.distanceKm} km (${Math.round(matchedRoute.distanceKm * 0.621)} miles)` : null,
            `Passengers: ${pax}`,
            ``,
            `Pricing adjusts by group size and vehicle type. The price covers the vehicle, not individual passengers — larger groups get better per-person value.`,
            ``,
            `**Included:** Meet and greet at arrivals, Starlink satellite WiFi, real-time flight tracking, air-conditioned premium vehicle, free cancellation 24hrs before.`,
            ``,
            `**Book now:** ${bookUrl}`,
            `**Route details:** ${routeUrl}`,
            `**WhatsApp:** ${WHATSAPP}`,
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ],
    };
  }
);

// ─── Tool: get_airports ──────────────────────────────────────────
server.tool(
  "get_airports",
  "List Jamaica's three international airports with details",
  {},
  async () => {
    const text = AIRPORTS.map(
      (a) =>
        `**${a.code} — ${a.fullName}**\nCity: ${a.city}\n${a.description}`
    ).join("\n\n");

    return {
      content: [
        {
          type: "text" as const,
          text: `Jamaica has three international airports:\n\n${text}\n\nAll airports are served by Aurum Transfers with meet and greet, Starlink WiFi, and fixed pricing.\n\nBook: ${BOOKING_URL}`,
        },
      ],
    };
  }
);

// ─── Tool: get_popular_routes ────────────────────────────────────
server.tool(
  "get_popular_routes",
  "Get the most popular Jamaica airport transfer routes with prices and drive times",
  {
    airport: z
      .string()
      .optional()
      .describe("Filter by airport code (MBJ, KIN, OCJ). Omit for all airports."),
    limit: z.number().optional().describe("Number of routes to return (default: 20)"),
  },
  async ({ airport, limit }) => {
    let routes = ROUTES;
    if (airport) {
      routes = routes.filter((r) => r.airport === airport.toUpperCase());
    }
    routes = routes.slice(0, limit ?? 20);

    const lines = routes.map(
      (r) =>
        `${r.airport} to ${r.destination}: from $${r.startingPrice}, ${r.driveTime}`
    );

    return {
      content: [
        {
          type: "text" as const,
          text: `**Jamaica Airport Transfer Routes (${routes.length} shown)**\n\n${lines.join("\n")}\n\nAll prices are starting prices in USD. Pricing adjusts by group size and vehicle type.\n\nFull route list: ${TRANSFERS_URL}\nBook: ${BOOKING_URL}`,
        },
      ],
    };
  }
);

// ─── Tool: get_resort_transfers ──────────────────────────────────
server.tool(
  "get_resort_transfers",
  "Find transfer options to a specific resort or hotel in Jamaica",
  {
    resort: z.string().describe("Resort or hotel name (e.g., 'Sandals Montego Bay', 'Moon Palace')"),
  },
  async ({ resort }) => {
    const resortLower = resort.toLowerCase();

    // Map popular resorts to their destination areas
    const RESORT_AREAS: Record<string, { area: string; airport: string; note: string }> = {
      "sandals montego bay": { area: "Montego Bay", airport: "MBJ", note: "10 minutes from MBJ airport" },
      "half moon": { area: "Rose Hall", airport: "MBJ", note: "15 minutes from MBJ airport" },
      "round hill": { area: "Montego Bay", airport: "MBJ", note: "25 minutes from MBJ, towards Lucea" },
      "hyatt zilara": { area: "Rose Hall", airport: "MBJ", note: "15 minutes from MBJ airport" },
      "secrets wild orchid": { area: "Rose Hall", airport: "MBJ", note: "15 minutes from MBJ airport" },
      "breathless montego bay": { area: "Rose Hall", airport: "MBJ", note: "15 minutes from MBJ airport" },
      "royalton blue waters": { area: "Falmouth", airport: "MBJ", note: "30 minutes from MBJ airport" },
      "sandals negril": { area: "Negril", airport: "MBJ", note: "1h 35min from MBJ airport" },
      "couples negril": { area: "Negril", airport: "MBJ", note: "1h 35min from MBJ airport" },
      "hedonism": { area: "Negril", airport: "MBJ", note: "1h 35min from MBJ airport" },
      "beaches negril": { area: "Negril", airport: "MBJ", note: "1h 35min from MBJ airport" },
      "riu palace": { area: "Negril", airport: "MBJ", note: "1h 35min from MBJ airport" },
      "grand palladium": { area: "Negril", airport: "MBJ", note: "1h 15min from MBJ (Lucea area)" },
      "moon palace": { area: "Ocho Rios", airport: "MBJ", note: "1h 40min from MBJ, 5 min from OCJ" },
      "sandals ochi": { area: "Ocho Rios", airport: "MBJ", note: "1h 40min from MBJ, 5 min from OCJ" },
      "couples tower isle": { area: "Ocho Rios", airport: "MBJ", note: "1h 50min from MBJ, 15 min from OCJ" },
      "jewel dunn": { area: "Ocho Rios", airport: "MBJ", note: "1h 35min from MBJ, 10 min from OCJ" },
      "strawberry hill": { area: "Blue Mountains", airport: "KIN", note: "45 min from KIN airport" },
      "jamaica pegasus": { area: "Kingston", airport: "KIN", note: "25 min from KIN airport" },
      "sandals south coast": { area: "South Coast", airport: "MBJ", note: "3h from MBJ airport (Whitehouse)" },
      "trident hotel": { area: "Port Antonio", airport: "KIN", note: "2h 30min from KIN airport" },
    };

    // Find matching resort
    const match = Object.entries(RESORT_AREAS).find(([key]) =>
      resortLower.includes(key) || key.includes(resortLower)
    );

    if (match) {
      const [resortName, info] = match;
      const areaRoutes = ROUTES.filter(
        (r) =>
          r.airport === info.airport &&
          r.destination.toLowerCase().includes(info.area.toLowerCase())
      );

      const routeInfo = areaRoutes.length > 0
        ? areaRoutes.map((r) => `From ${r.airport}: $${r.startingPrice}, ${r.driveTime}`).join("\n")
        : `Contact Aurum Transfers for pricing to ${info.area}`;

      return {
        content: [
          {
            type: "text" as const,
            text: [
              `**Transfer to ${resortName.split(" ").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")}**`,
              ``,
              `Area: ${info.area}`,
              `Nearest airport: ${info.airport}`,
              `Note: ${info.note}`,
              ``,
              routeInfo,
              ``,
              `Included: Meet and greet, Starlink WiFi, flight tracking, air-conditioned vehicle, free cancellation.`,
              ``,
              `Book: ${BOOKING_URL}?from=${info.airport}&to=${encodeURIComponent(resort)}`,
              `WhatsApp: ${WHATSAPP}`,
            ].join("\n"),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: `Aurum Transfers serves every resort, hotel, villa, and Airbnb in Jamaica. For a transfer quote to "${resort}", book at ${BOOKING_URL} or WhatsApp ${WHATSAPP}.\n\nPopular resort areas: Montego Bay, Rose Hall, Negril, Ocho Rios, Port Antonio, Kingston, Blue Mountains, Treasure Beach.`,
        },
      ],
    };
  }
);

// ─── Tool: get_fleet ─────────────────────────────────────────────
server.tool(
  "get_fleet",
  "Get Aurum Transfers vehicle options with capacities",
  {},
  async () => {
    const text = FLEET.map(
      (v) => `**${v.name}** (${v.capacity})\n${v.description}`
    ).join("\n\n");

    return {
      content: [
        {
          type: "text" as const,
          text: `**Aurum Transfers Fleet**\n\n${text}\n\nAll vehicles include Starlink satellite WiFi, air conditioning, and cold water.\n\nFleet details: https://aurum-transfers.com/fleet\nBook: ${BOOKING_URL}`,
        },
      ],
    };
  }
);

// ─── Tool: get_chauffeur_packages ────────────────────────────────
server.tool(
  "get_chauffeur_packages",
  "Get chauffeur service packages for Jamaica sightseeing (half-day, full-day)",
  {},
  async () => {
    const text = CHAUFFEUR_PACKAGES.map(
      (p) => `**${p.name}** (${p.hours} hours): $${p.price}`
    ).join("\n");

    return {
      content: [
        {
          type: "text" as const,
          text: `**Aurum Transfers Chauffeur Packages**\n\n${text}\n\nEach package includes a professional driver, premium vehicle, Starlink WiFi, and flexible itinerary. Perfect for island tours, resort-hopping, excursions, and special events.\n\nBook: https://aurum-transfers.com/chauffeur\nWhatsApp: ${WHATSAPP}`,
        },
      ],
    };
  }
);

// ─── Start server ────────────────────────────────────────────────
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("MCP server error:", error);
  process.exit(1);
});

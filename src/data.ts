/**
 * Static route and pricing data for the MCP server.
 * Source: aurum-transfers-ssot.md + daemon pricing engine.
 *
 * This data is embedded so the MCP server works without an API key.
 * For real-time quotes with exact pricing, the daemon API is used.
 */

export interface Airport {
  code: string;
  name: string;
  fullName: string;
  city: string;
  description: string;
}

export interface TransferRoute {
  airport: string;
  destination: string;
  slug: string;
  startingPrice: number;
  driveTime: string;
  driveMinutes: number;
  distanceKm: number | null;
}

export interface ChauffeurPackage {
  name: string;
  hours: number;
  price: number;
}

export const AIRPORTS: Airport[] = [
  {
    code: "MBJ",
    name: "Sangster International",
    fullName: "Sangster International Airport",
    city: "Montego Bay",
    description:
      "Jamaica's busiest airport handling 90%+ of tourist arrivals. Located on the north coast in Montego Bay, gateway to Negril, Rose Hall, Ocho Rios, and western Jamaica.",
  },
  {
    code: "KIN",
    name: "Norman Manley International",
    fullName: "Norman Manley International Airport",
    city: "Kingston",
    description:
      "Jamaica's capital city airport on the Palisadoes peninsula. Gateway to Kingston, Blue Mountains, Port Antonio, and eastern Jamaica.",
  },
  {
    code: "OCJ",
    name: "Ian Fleming International",
    fullName: "Ian Fleming International Airport",
    city: "Ocho Rios",
    description:
      "Jamaica's most intimate airport near Ocho Rios. Named after the James Bond creator. Serves charter flights and regional carriers. Just 10 minutes from Ocho Rios hotels.",
  },
];

export const ROUTES: TransferRoute[] = [
  // MBJ routes
  { airport: "MBJ", destination: "Montego Bay (Hip Strip)", slug: "mbj-to-hip-strip-gloucester-avenue", startingPrice: 75, driveTime: "15 min", driveMinutes: 15, distanceKm: 8 },
  { airport: "MBJ", destination: "Rose Hall", slug: "mbj-to-rose-hall", startingPrice: 95, driveTime: "15 min", driveMinutes: 15, distanceKm: 14 },
  { airport: "MBJ", destination: "Falmouth", slug: "mbj-to-falmouth", startingPrice: 120, driveTime: "30 min", driveMinutes: 30, distanceKm: 36 },
  { airport: "MBJ", destination: "Lucea", slug: "mbj-to-lucea", startingPrice: 120, driveTime: "40 min", driveMinutes: 40, distanceKm: 35 },
  { airport: "MBJ", destination: "Runaway Bay", slug: "mbj-to-runaway-bay", startingPrice: 150, driveTime: "55 min", driveMinutes: 55, distanceKm: 62 },
  { airport: "MBJ", destination: "Ocho Rios", slug: "mbj-to-downtown-ocho-rios", startingPrice: 195, driveTime: "1h 45min", driveMinutes: 105, distanceKm: 108 },
  { airport: "MBJ", destination: "Negril (Seven Mile Beach)", slug: "mbj-to-negril-seven-mile-beach", startingPrice: 275, driveTime: "1h 35min", driveMinutes: 95, distanceKm: 82 },
  { airport: "MBJ", destination: "Negril (West End)", slug: "mbj-to-negril-west-end-cliffs", startingPrice: 275, driveTime: "1h 40min", driveMinutes: 100, distanceKm: 85 },
  { airport: "MBJ", destination: "Kingston", slug: "mbj-to-kingston", startingPrice: 350, driveTime: "3h 30min", driveMinutes: 210, distanceKm: 193 },
  { airport: "MBJ", destination: "Treasure Beach", slug: "mbj-to-treasure-beach", startingPrice: 350, driveTime: "3h", driveMinutes: 180, distanceKm: 160 },
  { airport: "MBJ", destination: "Port Antonio", slug: "mbj-to-port-antonio", startingPrice: 395, driveTime: "4h 15min", driveMinutes: 255, distanceKm: 220 },

  // KIN routes
  { airport: "KIN", destination: "Kingston (New Kingston)", slug: "kin-to-kingston", startingPrice: 95, driveTime: "30 min", driveMinutes: 30, distanceKm: 26 },
  { airport: "KIN", destination: "Blue Mountains (Strawberry Hill)", slug: "kin-to-blue-mountains", startingPrice: 150, driveTime: "1h 15min", driveMinutes: 75, distanceKm: 55 },
  { airport: "KIN", destination: "Port Antonio", slug: "kin-to-port-antonio", startingPrice: 225, driveTime: "2h 30min", driveMinutes: 150, distanceKm: 100 },
  { airport: "KIN", destination: "Ocho Rios", slug: "kin-to-ocho-rios", startingPrice: 275, driveTime: "2h", driveMinutes: 120, distanceKm: 105 },
  { airport: "KIN", destination: "Treasure Beach", slug: "kin-to-treasure-beach", startingPrice: 295, driveTime: "2h 45min", driveMinutes: 165, distanceKm: 140 },
  { airport: "KIN", destination: "Montego Bay", slug: "kin-to-montego-bay", startingPrice: 400, driveTime: "3h 30min", driveMinutes: 210, distanceKm: 193 },
  { airport: "KIN", destination: "Negril", slug: "kin-to-negril", startingPrice: 450, driveTime: "4h", driveMinutes: 240, distanceKm: 250 },

  // OCJ routes
  { airport: "OCJ", destination: "Ocho Rios", slug: "ocj-to-downtown-ocho-rios", startingPrice: 80, driveTime: "10 min", driveMinutes: 10, distanceKm: 16 },
  { airport: "OCJ", destination: "Runaway Bay", slug: "ocj-to-runaway-bay", startingPrice: 120, driveTime: "25 min", driveMinutes: 25, distanceKm: 30 },
  { airport: "OCJ", destination: "Port Antonio", slug: "ocj-to-port-antonio", startingPrice: 250, driveTime: "2h 15min", driveMinutes: 135, distanceKm: 100 },
  { airport: "OCJ", destination: "Montego Bay", slug: "ocj-to-montego-bay", startingPrice: 250, driveTime: "1h 45min", driveMinutes: 105, distanceKm: 115 },
  { airport: "OCJ", destination: "Kingston", slug: "ocj-to-kingston", startingPrice: 300, driveTime: "2h", driveMinutes: 120, distanceKm: 105 },
  { airport: "OCJ", destination: "Negril", slug: "ocj-to-negril", startingPrice: 350, driveTime: "3h 30min", driveMinutes: 210, distanceKm: 180 },
];

export const CHAUFFEUR_PACKAGES: ChauffeurPackage[] = [
  { name: "Quarter Day", hours: 3, price: 450 },
  { name: "Half Day", hours: 6, price: 800 },
  { name: "Three-Quarter Day", hours: 9, price: 999 },
  { name: "Full Day", hours: 12, price: 1500 },
];

export const FLEET = [
  { type: "wagon", name: "Reggae Ride Wagon", capacity: "1-3 guests", description: "Compact and comfortable for solo travelers or couples" },
  { type: "van", name: "Ochi Luxe Van", capacity: "1-4 guests", description: "Spacious luxury van for families or small groups" },
  { type: "suv", name: "Irie Island SUV", capacity: "1-4 guests", description: "Premium SUV (black Hyundai Palisade or GWM Tank 500)" },
  { type: "shuttle", name: "Jammin' Shuttle", capacity: "5-14 guests", description: "Group transport for weddings, events, and large families" },
  { type: "coach", name: "Yaadman Executive Coach", capacity: "15-20 guests", description: "Executive coach for corporate groups and large parties" },
];

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server serve JS chunks/HMR to devices on the LAN
  // (e.g. testing on a phone via the "Network:" URL printed by `next
  // dev`). Without this, Next.js blocks those requests as
  // cross-origin: the page's HTML still loads, but no JS runs, so
  // everything that animates in (hero headline, About content) stays
  // invisible. Private-network wildcards rather than single IPs, so it
  // keeps working when the Mac's address changes between networks.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
};

export default nextConfig;

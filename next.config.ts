import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server serve JS chunks/HMR to devices on the LAN
  // (e.g. testing on a phone via the "Network:" URL printed by `next
  // dev`) instead of silently blocking them as cross-origin.
  allowedDevOrigins: ["192.168.1.7"],
};

export default nextConfig;

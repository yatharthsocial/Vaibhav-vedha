import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server serve JS chunks/HMR to devices on the LAN
  // (e.g. testing on a phone via the "Network:" URL printed by `next
  // dev`) instead of silently blocking them as cross-origin. This IP
  // is tied to whatever Wi-Fi network the dev machine is on — it
  // changes when the network changes, so keep adding the new one here
  // (from the "Network:" line `next dev` prints) if this starts
  // getting blocked again after switching networks.
  allowedDevOrigins: ["192.168.1.7", "192.168.1.9"],
};

export default nextConfig;

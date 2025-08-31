// utils/getCountryFromSubdomain.ts

import { supportedCountries, countryNames } from "../constant/supportContries";

// Example: pk.informreaders.com → "pk"
export function getCountryCodeFromHost(hostname) {
  const parts = hostname.split(".");
  if (parts.length < 3) return "pk"; // no subdomain
  const subdomain = parts[0].toLowerCase(); // "pk", "in", etc.

  return supportedCountries[subdomain] ? subdomain : "pk";
}

// Example usage in Next.js middleware or server-side props
export function getFAQsByHost(hostname) {
  const code = getCountryCodeFromHost(hostname);
  if (!code) return null;

  const countryName = getCountryName(code); // helper below
  return generateFAQs(countryName);
}

// Simple mapping helper (you can extend as needed)
export function getCountryName(code) {
  return countryNames[code] || code.toUpperCase();
}

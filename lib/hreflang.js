import { supportedCountries } from "@/constant/supportContries";

export function buildHreflangLinks(path, currentHost) {
  const mainDomain = "informreaders.com";

  // Remove subdomain if present → keep only main domain
  const hostParts = currentHost.split(".");
  const isSubdomain = hostParts.length > 2;

  const canonicalHost = isSubdomain ? `${hostParts.slice(-2).join(".")}` : currentHost;

  const canonical = `https://${canonicalHost}${path}`;

  const languages = {};

  Object.entries(supportedCountries).forEach(([countryCode, lang]) => {
    const subdomain = `${countryCode}.${mainDomain}`;

    languages[`en-${countryCode.toUpperCase()}`] = `https://${subdomain}${path}`;
  });

  // Add x-default
  languages["x-default"] = `https://${mainDomain}${path}`;

  return {
    canonical,
    languages,
  };
}

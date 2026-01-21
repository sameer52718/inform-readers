import { headers } from "next/headers";
import axiosInstance from "@/lib/axiosInstance";

// This generates the sitemap INDEX for Next.js
// It calls the backend JSON API that returns, per country & type,
// how many sitemap "pages" are needed, and then we map that to
// individual sitemap files under `/sitemaps/[fileName]`.
export default async function sitemap() {
  const host = (await headers()).get("host") || "informreaders.com";

  // Get sitemap info grouped by type for this host/country
  // Backend route: app.get('/api/v1/sitemaps/list', getSitemapByCountry);
  const { data: result } = await axiosInstance.get("/sitemaps/list", {
    params: { host },
  });

  if (result.error || !result.data) return [];

  const sitemapGroups = result.data; // [{ type, totalUrls, pages, lastUpdated }, ...]

  const baseUrl = `https://${host}`;

  // For each type and each page, create one sitemap URL entry
  const entries = [];

  sitemapGroups.forEach((group) => {
    const pages = group.pages || 1;
    for (let page = 1; page <= pages; page++) {
      const fileName = `${group.type}-${page}.xml`;
      entries.push({
        url: `${baseUrl}/sitemaps/${fileName}`,
        lastModified: group.lastUpdated || new Date().toISOString(),
      });
    }
  });

  return entries;
}

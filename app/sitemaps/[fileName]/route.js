import { NextResponse } from "next/server";
import axiosInstance from "@/lib/axiosInstance";

// Helper to safely escape XML characters
function escapeXml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// This route generates a single sitemap XML file on-the-fly.
// It expects fileName format like: `${country}-${type}-${page}.xml`
// Example: `pk-page-1.xml` or `us-blog-2.xml`
export async function GET(_req, { params }) {
  const { fileName } = await params;
  console.log(fileName);
  // Remove optional .xml extension and split to get country, type, page
  const base = fileName.replace(/\.xml$/i, "");
  const [type, pageStr] = base.split("-");

  const page = Number.parseInt(pageStr || "1", 10) || 1;

  // Call backend JSON sitemap endpoint
  // Backend route: app.get('/api/v1/sitemaps', getSitemap);
  const { data: result } = await axiosInstance.get("/sitemaps", {
    params: {
      type,
      page,
      limit: 50000,
    },
  });

  if (result.error || !result.data || result.data.length === 0) {
    const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;

    return new NextResponse(emptyXml, {
      status: 404,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  const urls = result.data;

  const xmlItems = urls
    .map((item) => {
      const loc = escapeXml(item.url);
      const lastMod = item.lastModified
        ? new Date(item.lastModified).toISOString()
        : null;
      const changefreq = item.changeFreq || "weekly";
      const priority =
        typeof item.priority === "number" ? item.priority.toFixed(1) : "0.5";

      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        lastMod ? `    <lastmod>${lastMod}</lastmod>` : null,
        changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
        priority ? `    <priority>${priority}</priority>` : null,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

import { headers } from "next/headers";

export default async function robots() {
  const h = await headers();
  const host = h.get("host") || "informreaders.com";
  const baseUrl = `https://${host}`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

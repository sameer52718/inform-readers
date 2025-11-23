import { headers } from "next/headers";

export default function robots() {
  const host = headers().get("host") || "informreaders.com";
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

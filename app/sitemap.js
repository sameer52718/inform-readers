import { headers } from "next/headers";
import axiosInstance from "@/lib/axiosInstance";
export default async function sitemap() {
  const host = (await headers()).get("host") || "informreaders.com";

  // Call backend to get all sitemap XML files for this host
  const { data: result } = await axiosInstance.get("/sitemaps", { params: { host } });

  if (result.error) return [];

  const sitemaps = result.data; // Array of DB sitemap entries

  return sitemaps.map((item, index) => ({
    url: `https://${host}/sitemaps/${item.fileName}`,
    lastModified: item.updatedAt,
  }));
}

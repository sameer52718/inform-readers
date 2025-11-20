// app/sitemaps/[id]/sitemap.xml/route.ts
import { NextResponse } from "next/server";
import axiosInstance from "@/lib/axiosInstance";

export async function GET(_req, { params }) {
  const { fileName } = params;

  const { data: xml } = await axiosInstance.get(`/sitemaps/${fileName}`, {
    responseType: "text", // <-- important!
  });

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

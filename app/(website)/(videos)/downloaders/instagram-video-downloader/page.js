import { VideoDownloadProvider } from "@/context/VideoDownloadContext";
import DownloaderForm from "../components/DownloaderForm";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";
import { headers } from "next/headers";

// Dynamic Metadata for Instagram Video Downloader Page
export async function generateMetadata() {
  const host = (await headers()).get("host") || "informreaders.com";
  const canonicalUrl = new URL(`https://${host}/downloaders/instagram-video-downloader`);

  const title = "Instagram Video Downloader – Free & Fast Online Tool";
  const description =
    "Download Instagram videos and reels quickly and easily with our free online Instagram downloader. Just paste the Instagram URL and download instantly.";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl.toString(),
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl.toString(),
      type: "website",
      images: [
        {
          url: `https://${host}/website/assets/images/logo/logo.png`,
          width: 1200,
          height: 630,
          alt: "Instagram Video Downloader",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`https://${host}/website/assets/images/logo/logo.png`],
    },
  };
}

export default function InstagramDownloader() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Downloaders", href: "/downloaders" },
    { label: "Instagram Video Downloader" },
  ];
  return (
    <VideoDownloadProvider>
      <div className="flex flex-col min-h-screen">
        <div className="bg-gradient-to-br from-red-600 to-red-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div>
                <h1 className="text-4xl md:text-5xl text-white font-bold mb-6">Instagram Video Downloader</h1>
                <p className="text-xl mb-8">
                  Download videos from Instagram quickly and easily. Just paste the Instagram URL and
                  download!
                </p>
              </div>
            </div>
          </div>
        </div>
        <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
          <Breadcrumb items={breadcrumbItems} />
          <DownloaderForm platform="instagram" />
        </main>
      </div>
    </VideoDownloadProvider>
  );
}

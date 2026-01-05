import { VideoDownloadProvider } from "@/context/VideoDownloadContext";
import DownloaderForm from "../components/DownloaderForm";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";
import { headers } from "next/headers";
import { buildHreflangLinks } from "@/lib/hreflang";

// Dynamic Metadata for Instagram Video Downloader Page
export async function generateMetadata() {
  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(
    `/downloaders/instagram-video-downloader/`,
    host
  );

  const title = "Instagram Video Downloader – Free & Fast Online Tool";
  const description =
    "Download Instagram videos and reels quickly and easily with our free online Instagram downloader. Just paste the Instagram URL and download instantly.";

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical.toString(),
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
                <h1 className="text-4xl md:text-5xl text-white font-bold mb-6">
                  Instagram Video Downloader
                </h1>
                <p className="text-xl mb-8">
                  Download videos from Instagram quickly and easily. Just paste
                  the Instagram URL and download!
                </p>
              </div>
            </div>
          </div>
        </div>
        <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
          <Breadcrumb items={breadcrumbItems} />
          <DownloaderForm platform="instagram" />
          <section className="mt-12 space-y-10 text-gray-800">
            {/* Overview */}
            <div>
              <h2 className="text-2xl font-semibold mb-3">
                About Instagram Video Downloader
              </h2>
              <p>
                This tool allows users to download and save publicly available
                Instagram videos for offline viewing or personal archiving.
              </p>
            </div>

            {/* Supported Content */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Supported Instagram Content
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Public Instagram Reels</li>
                <li>Standard video posts</li>
                <li>Video posts inside carousels</li>
                <li>Active public video Stories (before expiration)</li>
              </ul>
            </div>

            {/* Unsupported Content */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Unsupported Content
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Private account videos</li>
                <li>Standalone images or image-only carousels</li>
                <li>Live streams (unless later posted as a Reel or Post)</li>
                <li>Expired Stories</li>
              </ul>
            </div>

            {/* Content Behavior */}
            <div>
              <h3 className="text-xl font-semibold mb-2">How It Works</h3>
              <div className="space-y-3">
                <p>
                  <strong>Reels:</strong> Downloads the complete Reel video with
                  embedded audio at the highest resolution available.
                </p>
                <p>
                  <strong>Video Posts:</strong> Extracts the video portion from
                  standard posts or carousels while preserving original audio
                  and quality.
                </p>
                <p>
                  <strong>Stories:</strong> Downloads public video Stories when
                  a valid link is provided before expiration.
                </p>
              </div>
            </div>

            {/* Audio Handling */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Audio Handling</h3>
              <p className="mb-2">
                Downloaded videos usually include the original audio track
                embedded by Instagram.
              </p>
              <p className="text-sm text-gray-600">
                Note: Videos using copyrighted music may have muted or removed
                audio depending on Instagram’s policies.
              </p>
            </div>

            {/* Video Quality */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Video Quality & Resolution
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Reflects Instagram’s original compression</li>
                <li>Maximum resolution typically up to 1080p</li>
                <li>
                  No upscaling or quality enhancement beyond Instagram’s hosted
                  version
                </li>
              </ul>
            </div>

            {/* Failure Reasons */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Why Downloads May Fail
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Content belongs to a private account</li>
                <li>Expired or invalid Story links</li>
                <li>Instagram platform or API changes</li>
                <li>Temporary network or server issues</li>
                <li>IP rate-limiting by Instagram</li>
              </ul>
            </div>

            {/* Responsible Use */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">
                Responsible Use Notice
              </h3>
              <p className="mb-2">
                Downloaded content remains the intellectual property of its
                original creators.
              </p>
              <p className="text-sm text-gray-600">
                This tool is intended for personal use only. Redistribution,
                modification, or commercial use without permission may violate
                copyright laws and Instagram’s Terms of Service.
              </p>
            </div>

            {/* Summary */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Who Should Use This Tool
              </h3>
              <p>
                Ideal for users who want to save public Instagram videos for
                offline viewing, archive their own content, or keep educational
                and informational videos.
              </p>
            </div>
          </section>
        </main>
      </div>
    </VideoDownloadProvider>
  );
}

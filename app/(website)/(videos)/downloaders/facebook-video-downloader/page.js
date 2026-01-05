import { VideoDownloadProvider } from "@/context/VideoDownloadContext";
import DownloaderForm from "../components/DownloaderForm";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";
import { headers } from "next/headers";
import { buildHreflangLinks } from "@/lib/hreflang";

// Dynamic Metadata for Facebook Video Downloader Page
export async function generateMetadata() {
  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(
    `/downloaders/facebook-video-downloader/`,
    host
  );

  const title = "Facebook Video Downloader – Free & Fast Online Tool";
  const description =
    "Download Facebook videos quickly and easily with our free online Facebook downloader. Just paste the Facebook video URL and download instantly.";

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
          alt: "Facebook Video Downloader",
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

export default function FacebookDownloader() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Downloaders", href: "/downloaders" },
    { label: "Facebook Video Downloader" },
  ];

  return (
    <VideoDownloadProvider>
      <div className="flex flex-col min-h-screen">
        <div className="bg-gradient-to-br from-red-600 to-red-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div>
                <h1 className="text-4xl md:text-5xl text-white font-bold mb-6">
                  Facebook Video Downloader
                </h1>
                <p className="text-xl mb-8">
                  Download videos from Facebook quickly and easily. Just paste
                  the Facebook URL and download!
                </p>
              </div>
            </div>
          </div>
        </div>
        <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
          <Breadcrumb items={breadcrumbItems} />
          <DownloaderForm platform="facebook" />
          <section className="mt-12 space-y-10 text-gray-800">
            {/* Overview */}
            <div>
              <h2 className="text-2xl font-semibold mb-3">
                About Facebook Video Downloader
              </h2>
              <p>
                This tool allows users to download and locally store publicly
                accessible Facebook videos for personal, offline viewing and
                archiving.
              </p>
            </div>

            {/* Supported Sources */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Supported Facebook Video Sources
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Public Facebook Pages</li>
                <li>Public Facebook Groups</li>
                <li>Public videos shared on individual profiles</li>
              </ul>
            </div>

            {/* Unsupported Sources */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Unsupported Sources
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Private Facebook Groups</li>
                <li>Friends-only or custom-audience profile videos</li>
                <li>Content requiring special permissions or authentication</li>
              </ul>
            </div>

            {/* Privacy Layers */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Facebook Privacy Considerations
              </h3>
              <div className="space-y-3">
                <p>
                  <strong>Public Pages:</strong> Videos published on public
                  pages are generally accessible and downloadable.
                </p>
                <p>
                  <strong>Public Groups:</strong> Videos in public groups can be
                  downloaded as long as the group is open and publicly visible.
                </p>
                <p>
                  <strong>Private Profiles:</strong> Videos restricted to
                  friends or custom audiences cannot be accessed or downloaded.
                </p>
              </div>
            </div>

            {/* Video Behavior */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Video Quality & Live Content
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Downloads videos at the highest quality Facebook provides
                </li>
                <li>
                  Quality depends on the original upload and Facebook processing
                </li>
                <li>
                  Live streams can only be downloaded after they finish and are
                  published
                </li>
              </ul>
            </div>

            {/* Failure Scenarios */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Why a Facebook Video May Not Download
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Video privacy is not set to public</li>
                <li>Broken, removed, or invalid video URL</li>
                <li>Facebook technical or delivery changes</li>
                <li>Regional or geo-restriction limitations</li>
                <li>Attempting to download an active live broadcast</li>
              </ul>
            </div>

            {/* Responsible Use */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">
                Responsible Use & Copyright
              </h3>
              <p className="mb-2">
                Downloading a Facebook video does not transfer ownership or
                copyright. All rights remain with the original content creator.
              </p>
              <p className="text-sm text-gray-600">
                This tool is intended for personal use only. Redistribution,
                modification, or commercial use without permission may violate
                Facebook’s Terms of Service and applicable copyright laws.
              </p>
            </div>

            {/* Summary */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Who This Tool Is For
              </h3>
              <p>
                Suitable for users who want to save public Facebook videos for
                offline viewing or personal archiving, while respecting privacy
                settings and creator rights.
              </p>
            </div>
          </section>
        </main>
      </div>
    </VideoDownloadProvider>
  );
}

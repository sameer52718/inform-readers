import { VideoDownloadProvider } from "@/context/VideoDownloadContext";
import DownloaderForm from "../components/DownloaderForm";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";
import { headers } from "next/headers";
import { buildHreflangLinks } from "@/lib/hreflang";

// Dynamic Metadata for YouTube Video Downloader Page
export async function generateMetadata() {
  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(
    `/downloaders/youtube-video-downloader`,
    host
  );

  const title = "YouTube Video Downloader – Free & Fast Online Tool";
  const description =
    "Download YouTube videos quickly and easily with our free online YouTube downloader. Just paste the YouTube URL and download in seconds.";

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
          alt: "YouTube Video Downloader",
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

export default function YouTubeDownloader() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Downloaders", href: "/downloaders" },
    { label: "Youtube Video Downloader" },
  ];

  return (
    <VideoDownloadProvider>
      <div className="flex flex-col min-h-screen">
        <div className="bg-gradient-to-br from-red-600 to-red-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div>
                <h1 className="text-4xl md:text-5xl text-white font-bold mb-6">
                  YouTube Video Downloader
                </h1>
                <p className="text-xl mb-8">
                  Download videos from YouTube quickly and easily. Just paste
                  the YouTube URL and download!
                </p>
              </div>
            </div>
          </div>
        </div>
        <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
          <Breadcrumb items={breadcrumbItems} />
          <DownloaderForm platform="youtube" />
          <section className="mt-12 space-y-10 text-gray-800">
            {/* Overview */}
            <div>
              <h2 className="text-2xl font-semibold mb-3">
                About YouTube Video Downloader
              </h2>
              <p>
                This tool helps users download publicly accessible YouTube
                videos or audio streams for offline viewing or personal
                archiving, subject to content availability and platform
                limitations.
              </p>
            </div>

            {/* Content Scope */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Supported YouTube Content
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Publicly available YouTube videos</li>
                <li>Videos without strict geographic restrictions</li>
                <li>Content not protected by paywalls or subscriptions</li>
              </ul>
            </div>

            {/* Excluded Content */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Unsupported Content
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Private videos</li>
                <li>Paid or Premium-only content</li>
                <li>Movie rentals and purchased TV shows</li>
                <li>Videos blocked due to regional restrictions</li>
              </ul>
            </div>

            {/* DRM & Restrictions */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                DRM & Copyright Restrictions
              </h3>
              <p className="mb-2">
                Most free YouTube videos do not use traditional DRM, but paid
                media, Premium-exclusive content, and some licensed music are
                protected and cannot be downloaded using third-party tools.
              </p>
              <p className="text-sm text-gray-600">
                YouTube’s Content ID system may block, mute, or restrict videos,
                which can affect download availability and quality.
              </p>
            </div>

            {/* Formats */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Video & Audio Formats
              </h3>
              <div className="space-y-3">
                <p>
                  <strong>MP4:</strong> Commonly used for resolutions up to 720p
                  (and sometimes 1080p), often including both video and audio in
                  one file.
                </p>
                <p>
                  <strong>WebM:</strong> Used for higher resolutions such as
                  1080p and 4K. These streams usually separate video and audio
                  and must be merged.
                </p>
              </div>
            </div>

            {/* Audio Extraction */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Audio Extraction Limitations
              </h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  High-resolution videos often separate audio and video streams
                </li>
                <li>
                  Muted or removed audio due to copyright claims will remain
                  muted
                </li>
                <li>
                  Audio quality depends on the highest bitrate YouTube provides
                </li>
                <li>
                  Network or codec issues may affect successful audio merging
                </li>
              </ul>
            </div>

            {/* Legal Notice */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">
                Legal & Terms of Service Notice
              </h3>
              <p className="mb-2">
                Downloading copyrighted YouTube content without permission may
                violate intellectual property laws and YouTube’s Terms of
                Service.
              </p>
              <p className="text-sm text-gray-600">
                This tool should only be used for content you own, have
                permission to download, or that is in the public domain.
              </p>
            </div>

            {/* Summary */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Who This Tool Is For
              </h3>
              <p>
                Best suited for creators archiving their own videos, users
                downloading content with explicit permission, or individuals
                saving public-domain videos for personal, non-commercial use.
              </p>
            </div>
          </section>
        </main>
      </div>
    </VideoDownloadProvider>
  );
}

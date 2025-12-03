import Link from "next/link";
import { createElement } from "react";
import { Youtube, Facebook, Instagram, Music } from "lucide-react";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";
import { headers } from "next/headers";
import { buildHreflangLinks } from "@/lib/hreflang";

const iconMap = {
  Youtube,
  Facebook,
  Instagram,
  Music, // Placeholder for TikTok
};

// Dynamic Metadata for Video Downloader Tools Page
export async function generateMetadata() {
  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(`/downloaders/`, host);

  const title = "Video Downloader Tools – YouTube, Facebook, Instagram & TikTok";
  const description =
    "Free online video downloader tools for YouTube, Facebook, Instagram, and TikTok. Paste the URL and download videos quickly and easily.";

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type: "website",
      images: [
        {
          url: `https://${host}/website/assets/images/logo/logo.png`,
          width: 1200,
          height: 630,
          alt: "Video Downloader Tools",
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

const ToolCard = ({ name, description, href, icon }) => {
  return (
    <div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center mb-4">
        {iconMap[icon] && createElement(iconMap[icon], { className: "h-8 w-8 text-red-600 mr-3" })}
        <h2 className="text-xl font-semibold">{name}</h2>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Go to Downloader
      </Link>
    </div>
  );
};

const tools = [
  {
    name: "YouTube Downloader",
    description: "Download videos from YouTube quickly and easily by pasting the video URL.",
    href: "/downloaders/youtube-video-downloader",
    icon: "Youtube",
  },
  {
    name: "Facebook Downloader",
    description: "Save videos from Facebook with a simple URL paste.",
    href: "/downloaders/facebook-video-downloader",
    icon: "Facebook",
  },
  {
    name: "Instagram Downloader",
    description: "Download Instagram videos and reels effortlessly.",
    href: "/downloaders/instagram-video-downloader",
    icon: "Instagram",
  },
  {
    name: "TikTok Downloader",
    description: "Grab TikTok videos in seconds using the video URL.",
    href: "/downloaders/tiktok-video-downloader",
    icon: "Music",
  },
];

export default function Home() {
  const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Downloaders" }];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-br from-red-600 to-red-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl text-white font-bold mb-6">Video Downloader Tools</h1>
            <p className="text-xl mb-8">
              Choose a platform to download videos quickly and easily. Paste the URL and get started!
            </p>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </main>
    </div>
  );
}

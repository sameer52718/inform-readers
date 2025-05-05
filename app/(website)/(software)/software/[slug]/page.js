"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Download,
  Star,
  Shield,
  Clock,
  Zap,
  Check,
  ArrowRight,
  Home,
  Calendar,
  HardDrive,
} from "lucide-react";
import { useParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

// Mock related software data
const relatedSoftware = [
  {
    id: "1",
    name: "Firefox Browser",
    logo: "https://images.dwncdn.net/images/t_app-icon-s/p/fb711dc4-6849-47d1-a7af-183072b02ea4/2587926876/2356_4-10208569-Fx-Browser-icon-fullColor-512(1).png",
    tag: ["Free"],
    version: "123.0",
  },
  {
    id: "2",
    name: "Chrome Browser",
    logo: "https://assets.dwncdn.net/public/3cd92b.svg",
    tag: ["Free"],
    version: "122.0",
  },
  {
    id: "3",
    name: "Safari Browser",
    logo: "https://images.dwncdn.net/images/t_app-icon-s/p/b7de5260-51a2-4b8e-b758-79d6884ec215/3719711317/2356_4-34119-imgingest-8808337677785917100.png",
    tag: ["Free"],
    version: "17.0",
  },
];

const features = [
  "Enhanced privacy protection",
  "Built-in VPN service",
  "Battery saver mode",
  "Customizable interface",
  "Integrated ad-blocker",
  "Crypto wallet support",
];

const systemRequirements = {
  os: "macOS 10.15 or later",
  processor: "64-bit processor",
  memory: "4 GB RAM",
  storage: "500 MB available space",
};

const quickStats = [
  {
    icon: Download,
    value: "10M+",
    label: "Downloads",
  },
  {
    icon: Shield,
    value: "100%",
    label: "Secure",
  },
];

export default function SoftwareDetailPage() {
  const { slug } = useParams();

  const [software, setSoftware] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get(`/website/software/${slug}`);
        setSoftware(data.data);
      } catch (error) {
        console.error("Error fetching software details:", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="h-8 bg-gray-200 w-1/3 rounded mb-4"></div>
          <div className="bg-white rounded-2xl p-8">
            <div className="h-32 bg-gray-200 rounded-xl mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!software) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-gradient-to-br from-indigo-600 via-red-600 to-pink-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Discover Amazing Software</h1>
            <p className="text-xl text-red-100 mb-8">
              Find the perfect tools to enhance your digital experience
            </p>
            <div className="flex justify-center gap-4">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center px-6 py-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Icon className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-red-100">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="flex items-center gap-1 hover:text-red-600">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/software" className="hover:text-red-600">Software</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">{software.name}</span>
          </div>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <Image src={software.logo} alt={software.name} width={128} height={128} className="rounded-2xl" />
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold">{software.name}</h1>
                <div className="flex gap-2">
                  {software.tag.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6">{software.overview}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">{new Date(software.lastUpdate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="font-medium">{software.size} MB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Version</p>
                    <p className="font-medium">{software.version}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium text-green-600">Verified</p>
                  </div>
                </div>
              </div>
              <a
                href={software.download}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors group"
              >
                <Download className="h-5 w-5" />
                <span className="font-semibold">Download Now</span>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center ml-2 group-hover:bg-white/30 transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-8 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Key Features</h2>
            <div className="grid grid-cols-1 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6">System Requirements</h2>
            <div className="space-y-4">
              {Object.entries(systemRequirements).map(([key, value]) => (
                <div key={key} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                    <Check className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 capitalize">{key}</span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Software Description Section */}
        <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Why Choose {software.name}?</h2>
          <p className="text-gray-700 leading-relaxed">
            <strong>{software.name}</strong> is a reliable and feature-rich{" "}
            <span className="text-gray-900 font-medium">{software.category || "software"}</span> tool designed
            to help users{" "}
            <span className="text-gray-900 font-medium">
              {software.purpose || "enhance their productivity and experience"}
            </span>
            .
          </p>
          <p className="mt-4 text-gray-700 leading-relaxed">
            Developed by{" "}
            <span className="text-gray-900 font-medium">{software.developer || "a trusted developer"}</span>,
            this software is known for its{" "}
            <span className="text-gray-900 font-medium">{software.highlight || "speed and simplicity"}</span>{" "}
            and is trusted by millions of users worldwide.
          </p>
          <p className="mt-4 text-gray-700 leading-relaxed">
            Whether you're a beginner or a professional, <strong>{software.name}</strong> offers{" "}
            <span className="text-gray-900 font-medium">
              {software.benefit || "a smooth and flexible experience"}
            </span>{" "}
            to meet your needs.
          </p>
          <p className="mt-4 text-gray-700 leading-relaxed">
            With regular updates and a clean interface, it stands out as one of the top solutions in its
            category.
          </p>
        </div>

        {/* Related Software */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Related Software</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedSoftware.map((item) => (
              <Link
                key={item.id}
                href={`/software/${item.id}`}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col items-center">
                  <Image src={item.logo} alt={item.name} width={64} height={64} className="rounded-lg mb-4" />
                  <h3 className="text-lg font-semibold text-center mb-2">{item.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                      v{item.version}
                    </span>
                    {item.tag.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-1 border border-gray-200 text-gray-600 text-sm rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-2xl p-6 text-sm leading-relaxed shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Disclaimer</h2>
          <p className="mb-2">
            We do <strong>not host</strong> any software or games on our server. All download links provided
            on this page redirect to third-party websites such as <strong>download.cnet.com</strong>.
          </p>
          <p className="mb-2">
            We are <strong>not responsible</strong> for the content, availability, or any damages resulting
            from the downloads.
          </p>
          <p className="mb-2">
            All rights to the software and games belong to their{" "}
            <strong>respective developers or owners</strong>.
          </p>
          <p>
            If you encounter any issues with a file or link, please{" "}
            <strong>contact the official website</strong> directly.
          </p>
        </div>
      </div>
    </div>
  );
}

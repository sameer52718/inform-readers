"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, Shield, Zap, Check, ArrowRight, Calendar, HardDrive } from "lucide-react";
import { useParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { getCountryCodeFromHost, getCountryName } from "@/lib/getCountryFromSubdomain";
import Breadcrumb from "../specification/Breadcrumb";

const features = [
  "Enhanced privacy protection",
  "Built-in VPN service",
  "Battery saver mode",
  "Customizable interface",
  "Integrated ad-blocker",
  "Crypto wallet support",
];

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
  const { subCategorySlug, slug } = useParams();

  const [software, setSoftware] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [country, setCountry] = useState("Global");
  const [introParagraph, setIntroParagraph] = useState("");
  const [description, setDescription] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [versions, setVersions] = useState([]);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    // Detect country from subdomain
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      setCountry(getCountryName(getCountryCodeFromHost(host)));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get(`/website/software/${slug}`, {
          params: { host: window.location.hostname },
        });
        const softwareData = data.data;
        setSoftware(softwareData);
        setIntroParagraph(data.content.intro || "");
        setFaqs(data.content.faqs || []);
        setFeatures(data.content.features || []);
        setVersions(data.versions || []);
        setDescription(data.content.description || "");
      } catch (error) {
        console.error("Error fetching software details:", error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [slug, country]);

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

  const subCategory = subCategorySlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Softwares & Games", href: "/software" },
    { label: subCategory, href: `/software/${subCategorySlug}` },
    { label: software.name },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
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
        {features.length > 0 && (
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
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                    <Check className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 capitalize">OS</span>
                    <span className="text-gray-900">macOS 10.15 or later</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                    <Check className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 capitalize">Processor</span>
                    <span className="text-gray-900">64-bit processor</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                    <Check className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 capitalize">Memory</span>
                    <span className="text-gray-900">4 GB RAM</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                    <Check className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500 capitalize">Storage</span>
                    <span className="text-gray-900">500 MB available space</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Software Description Section */}
        {introParagraph && (
          <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">{introParagraph}</p>
          </div>
        )}
        {description && (
          <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </div>
        )}

        {versions.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Available Versions</h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left text-gray-600 text-sm">
                    <th className="p-3">Version</th>
                    <th className="p-3">Size</th>
                    <th className="p-3">Release Date</th>
                    <th className="p-3">Download</th>
                  </tr>
                </thead>

                <tbody>
                  {versions.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{item.version}</td>
                      <td className="p-3">{item.size} MB</td>
                      <td className="p-3">{new Date(item.releaseDate).toLocaleDateString()}</td>
                      <td className="p-3">
                        <Link
                          href={`/software/${subCategorySlug}/${item.slug}`}
                          className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                        >
                          Download
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
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

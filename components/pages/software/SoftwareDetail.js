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
import { getCountryCodeFromHost, getCountryName } from "@/lib/getCountryFromSubdomain";
import Breadcrumb from "../specification/Breadcrumb";

function applyTemplate(template, values) {
  return template
    .replace(/{Software Name}/g, values.softwareName || "")
    .replace(/{Version}/g, values.version || "")
    .replace(/{Operating System}/g, values.os || "")
    .replace(/{Country}/g, values.country || "")
    .replace(/{Status}/g, values.status || "")
    .replace(/{File Size}/g, values.fileSize || "")
    .replace(/{Last Update}/g, values.lastUpdate || "")
    .replace(/{Memory}/g, values.memory || "")
    .replace(/{Processor}/g, values.processor || "")
    .replace(/{Storage}/g, values.storage || "");
}

function getIntroParagraph(values) {
  const template =
    "Looking to download {Software Name} in {Country}? Get the latest {Version} ({File Size}), updated on {Last Update}, for {Operating System}. This {Status} software ensures seamless performance on systems with {Memory} RAM, {Processor}, and {Storage}. Whether you're gaming or working, {Software Name} delivers top-notch functionality tailored for {Country} users. Download now and optimize your {Operating System} experience with this reliable, high-performance software designed for efficiency and ease of use.";
  return applyTemplate(template, values);
}

// Function to get FAQs
function getFAQs(values) {
  const faqs = [
    {
      question: "Is {Software Name} compatible with {Operating System} in {Country}?",
      answer:
        "{Software Name} {Version} is fully compatible with {Operating System} in {Country}. This {Status} software, updated on {Last Update}, requires {Memory} RAM, a {Processor}, and {Storage}. With a file size of {File Size}, it’s optimized for seamless performance on {Operating System} devices in {Country}. Whether for gaming or productivity, {Software Name} ensures a reliable experience. Download it securely to enhance your setup in {Country}.",
    },
    {
      question: "What are the system requirements for {Software Name} in {Country}?",
      answer:
        "To run {Software Name} {Version} in {Country}, your device needs {Memory} RAM, a {Processor}, and {Storage}. This {Status} software, with a {File Size} download, was last updated on {Last Update}. It’s designed for {Operating System} and ensures smooth operation for {Country} users. Install now to enjoy {Software Name}’s robust features tailored for your needs.",
    },
    {
      question: "How do I download {Software Name} for {Operating System} in {Country}?",
      answer:
        "Downloading {Software Name} {Version} for {Operating System} in {Country} is simple. This {Status} software, updated {Last Update}, has a {File Size} download and requires {Memory} RAM, {Processor}, and {Storage}. Visit our secure download page to get started. {Software Name} is optimized for {Country} users, offering top performance for gaming and productivity on {Operating System}.",
    },
  ];

  return faqs.map((faq) => ({
    question: applyTemplate(faq.question, values),
    answer: applyTemplate(faq.answer, values),
  }));
}

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
  const [faqs, setFaqs] = useState([]);
  const [versions, setVersions] = useState([]);

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
        const { data } = await axiosInstance.get(`/website/software/${slug}`);
        const softwareData = data.data;
        setSoftware(softwareData);

        const values = {
          softwareName: softwareData.name,
          version: softwareData.version,
          os: "Windows", // Adjust if dynamic
          country,
          status: softwareData.tag?.[0] || "Free",
          fileSize: `${softwareData.size} MB`,
          lastUpdate: new Date(softwareData.lastUpdate).toLocaleDateString(),
          memory: "4 GB RAM",
          processor: "64-bit processor",
          storage: "500 MB available space",
        };

        setIntroParagraph(getIntroParagraph(values));
        setFaqs(getFAQs(values));
        setVersions(data.versions || []);
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

        {/* Software Description Section */}
        <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Why Choose {software.name}?</h2>
          <p className="text-gray-700 leading-relaxed">{introParagraph}</p>
        </div>

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
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
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

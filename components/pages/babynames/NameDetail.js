"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "@/components/ui/Loading";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MessageCircle,
  Heart,
  Globe,
  Hash,
  BookOpen,
  Users,
  Star,
  Calendar,
  Sparkles,
  Clock,
} from "lucide-react";
import { toast } from "react-toastify";

export default function NameDetail() {
  const { slug } = useParams();
  const [data, setData] = useState([]);
  const [name, setName] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  // Get the current page URL
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  // Social media share links
  const socialLinks = [
    {
      icon: Facebook,
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    },
    {
      icon: Twitter,
      label: "Share on Twitter",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        currentUrl
      )}&text=Check out the meaning of the name ${encodeURIComponent(name?.name || "")}!`,
    },
    {
      icon: Linkedin,
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        currentUrl
      )}&title=${encodeURIComponent(name?.name || "")}&summary=${encodeURIComponent(
        name?.shortMeaning || ""
      )}`,
    },
    {
      icon: Instagram,
      label: "Share on Instagram",
      href: "#", // Instagram doesn't support direct web sharing; handle via copy link or redirect
      onClick: () => {
        // Copy link to clipboard for Instagram
        navigator.clipboard.writeText(currentUrl);
        toast.success("Link copied! Paste it in Instagram to share.");
      },
    },
    {
      icon: MessageCircle,
      label: "Share on WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `Check out the meaning of the name ${name?.name || ""}: ${currentUrl}`
      )}`,
    },
  ];

  // Web Share API handler
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Name: ${name?.name}`,
          text: `Discover the meaning of the name ${name?.name}! ${name?.shortMeaning}`,
          url: currentUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      alert("Web Share API is not supported in this browser. Use the social links to share.");
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axiosInstance.get("/common/category", { params: { type: "Name" } });
        if (!data.error) {
          setData(data.categories || []);
        }
      } catch (error) {
        handleError(error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get(`/website/name/${slug}`);
        if (!data.error) {
          setName(data.data);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [slug]);

  const nameAttributes = [
    { icon: Globe, label: "Origin", value: name?.origion || "---" },
    { icon: Heart, label: "Religion", value: name?.religionId?.name },
    { icon: Hash, label: "Length", value: `${name?.nameLength} Letters` },
    { icon: BookOpen, label: "Short Name", value: name?.shortName },
    { icon: Star, label: "Lucky Number", value: "7" },
    { icon: Calendar, label: "Lucky Day", value: "Friday" },
  ];

  return (
    <Loading loading={isLoading}>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-indigo-600 via-red-600 to-pink-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-5xl font-bold text-white">{name?.name}</h1>
                  <span className="px-4 py-1 bg-white/20 rounded-full text-sm font-medium">
                    {name?.gender}
                  </span>
                </div>
                <p className="text-xl text-white/90 max-w-2xl">{name?.shortMeaning}</p>
              </div>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    onClick={social.onClick || (() => {})}
                    className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all hover:scale-110"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {nameAttributes.map((attr, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <attr.icon className="w-6 h-6 text-red-500 mb-3" />
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">{attr.label}</p>
                  <p className="font-semibold">{attr.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tabs Navigation */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b overflow-x-auto">
                  <div className="flex">
                    {["overview", "meaning", "numerology", "popularity"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-4 text-lg font-medium transition-colors relative ${
                          activeTab === tab ? "text-red-600" : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        {activeTab === tab && (
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  {activeTab === "overview" && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold mb-4">Name Overview</h2>
                        <p className="text-gray-600 leading-relaxed">{name?.longMeaning}</p>
                      </div>

                      <div className="bg-red-50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-red-500" />
                          Key Characteristics
                        </h3>
                        <ul className="grid md:grid-cols-2 gap-4">
                          <li className="flex items-center gap-2 text-gray-700">
                            <span className="w-2 h-2 bg-red-500 rounded-full" />
                            Strong and meaningful origin
                          </li>
                          <li className="flex items-center gap-2 text-gray-700">
                            <span className="w-2 h-2 bg-red-500 rounded-full" />
                            Cultural significance
                          </li>
                          <li className="flex items-center gap-2 text-gray-700">
                            <span className="w-2 h-2 bg-red-500 rounded-full" />
                            Modern appeal
                          </li>
                          <li className="flex items-center gap-2 text-gray-700">
                            <span className="w-2 h-2 bg-red-500 rounded-full" />
                            Positive associations
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold mb-4">Cultural Significance</h3>
                        <p className="text-gray-600 leading-relaxed">
                          The name {name?.name} holds deep cultural significance in {name?.origion}
                          traditions. It has been passed down through generations, carrying with it a rich
                          history and meaningful heritage that continues to resonate with modern families.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "meaning" && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold mb-4">Detailed Meaning</h2>
                        <p className="text-gray-600 leading-relaxed">{name?.longMeaning}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="text-xl font-semibold mb-4">Religious Context</h3>
                          <p className="text-gray-600">
                            In {name?.religionId?.name} tradition, this name carries special significance...
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h3 className="text-xl font-semibold mb-4">Modern Usage</h3>
                          <p className="text-gray-600">
                            Today, {name?.name} is chosen by parents who value its cultural heritage...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "numerology" && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold mb-4">Numerological Significance</h2>
                        <p className="text-gray-600 leading-relaxed">
                          In numerology, each letter in {name?.name} carries a unique vibration...
                        </p>
                      </div>

                      <div className="bg-red-50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Lucky Attributes</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Lucky Number</p>
                            <p className="text-2xl font-bold text-red-600">7</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Lucky Day</p>
                            <p className="text-2xl font-bold text-red-600">Friday</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "popularity" && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold mb-4">Name Popularity</h2>
                        <p className="text-gray-600 leading-relaxed">
                          {name?.name} has maintained a steady popularity over the years...
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4">Usage Statistics</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Current Rank</span>
                            <span className="font-semibold">#123</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Trend</span>
                            <span className="font-semibold text-green-500">↑ Rising</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="text-xl font-semibold mb-2">What does the name {name?.name} mean?</h3>
                    <p className="text-gray-600">{name?.shortMeaning}</p>
                  </div>
                  <div className="border-b pb-4">
                    <h3 className="text-xl font-semibold mb-2">Is {name?.name} a traditional name?</h3>
                    <p className="text-gray-600">
                      Yes, {name?.name} is a traditional name with roots in {name?.origion} culture.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      What are common nicknames for {name?.name}?
                    </h3>
                    <p className="text-gray-600">
                      Common nicknames include {name?.shortName} and variations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Related Names */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-red-500" />
                  More Names By Religion
                </h2>
                <div className="space-y-3">
                  {data.map((item, index) => (
                    <Link
                      key={index}
                      href={`/names/religion/${item._id}`}
                      className="block w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Name Timeline */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-red-500" />
                  Name Timeline
                </h2>
                <div className="space-y-4">
                  <div className="relative pl-8 pb-4 border-l-2 border-red-200">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 bg-red-500 rounded-full" />
                    <p className="font-semibold">Origin</p>
                    <p className="text-sm text-gray-600">{name?.origion} roots</p>
                  </div>
                  <div className="relative pl-8 pb-4 border-l-2 border-red-200">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 bg-red-500 rounded-full" />
                    <p className="font-semibold">Traditional Use</p>
                    <p className="text-sm text-gray-600">Historical significance</p>
                  </div>
                  <div className="relative pl-8">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 bg-red-500 rounded-full" />
                    <p className="font-semibold">Modern Day</p>
                    <p className="text-sm text-gray-600">Contemporary popularity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
}

"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "@/components/ui/Loading";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { Globe, Hash, BookOpen, Users, Star, Clock, Palette, Gem } from "lucide-react";

// ✅ import helpers
import { countryNames } from "@/constant/supportContries";
import { generateFAQs } from "@/templates/faq";
import { getCountryCodeFromHost } from "@/lib/getCountryFromSubdomain";
import Breadcrumb from "../specification/Breadcrumb";
import ShareButton from "@/components/shared/ShareButton";

export default function NameDetail() {
  const { slug } = useParams();
  const [data, setData] = useState([]);
  const [name, setName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    // detect subdomain
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      const sub = getCountryCodeFromHost(host);
      const country = countryNames[sub] || "Global";
      setFaqs(generateFAQs(country));
    }
  }, []);

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
        const { data } = await axiosInstance.get(`/website/name/${slug}`, {
          params: { host: window.location.host },
        });
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
    { icon: Hash, label: "Length", value: `${name?.nameLength} Letters` },
    { icon: BookOpen, label: "Short Name", value: name?.shortName },
    { icon: Gem, label: "Lucky Stone", value: name?.luckyStone },
    { icon: Star, label: "Lucky Number", value: name?.luckyNumber },
    { icon: Palette, label: "Lucky Color", value: name?.luckyColor },
  ];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Baby Names", href: "/baby-names" },
    { label: name?.name }, // last one: no href (current page)
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
                <ShareButton
                  title={`${name?.name} | Baby Name Info`}
                  text={`Explore the meaning and details of the name "${name?.name}", a ${name?.gender} name with origin "${name?.origion}".`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumb items={breadcrumbItems} />
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
              <p>{name?.content.paragraph}</p>
              {/* FAQ Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {name?.content?.faqs.map((faq, idx) => (
                    <div key={idx} className="border-b pb-4">
                      <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
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
                  {data.slice(0, 10).map((item, index) => (
                    <Link
                      key={index}
                      href={`/baby-names/religion/${item.slug}`}
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

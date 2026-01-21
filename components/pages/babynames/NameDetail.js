"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Loading from "@/components/ui/Loading";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { Globe, Hash, BookOpen, Users, Star, Clock, Palette, Gem, Volume2, Award, MapPin, Heart } from "lucide-react";

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
    { icon: Globe, label: "Language", value: name?.quick_facts?.language || name?.origin?.language || "---" },
    { icon: MapPin, label: "Region", value: name?.quick_facts?.region || name?.origin?.region || "---" },
    { icon: Hash, label: "Length", value: name?.quick_facts?.name_length ? `${name.quick_facts.name_length} Letters` : (name?.name?.length ? `${name.name.length} Letters` : "---") },
    { icon: BookOpen, label: "Syllables", value: name?.quick_facts?.syllable_count ? `${name.quick_facts.syllable_count} Syllables` : "---" },
    { icon: Gem, label: "Lucky Stone", value: name?.luckyStone || "---" },
    { icon: Star, label: "Lucky Number", value: name?.luckyNumber || "---" },
    { icon: Palette, label: "Lucky Color", value: name?.luckyColor || "---" },
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
                  <h1 className="text-5xl font-bold text-white">{name?.seo?.h1 || name?.name}</h1>
                  <span className="px-4 py-1 bg-white/20 rounded-full text-sm font-medium">
                    {name?.gender || name?.quick_facts?.gender}
                  </span>
                </div>
                <p className="text-xl text-white/90 max-w-2xl">
                  {name?.ai_overview_summary || name?.quick_facts?.meaning_short || name?.shortMeaning}
                </p>
              </div>
              <div className="flex gap-3">
                <ShareButton
                  title={`${name?.name} | Baby Name Info`}
                  text={name?.ai_overview_summary || `Explore the meaning and details of the name "${name?.name}", a ${name?.gender || name?.quick_facts?.gender} name with origin "${name?.origin?.language || name?.quick_facts?.language || name?.origion}".`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumb items={breadcrumbItems} />
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-12">
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
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">{name?.seo?.h1 || `${name?.name} Name Meaning, Origin, and Usage`}</h2>

                {/* Introduction */}
                {name?.introduction && (
                  <div className="prose max-w-none">
                    <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: name.introduction.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </div>
                )}

                {/* Meaning Section */}
                {name?.meaning && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-2xl font-semibold mb-4">Meaning</h3>
                    {name.meaning.primary && (
                      <div className="prose max-w-none mb-4">
                        <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: name.meaning.primary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </div>
                    )}
                    {name.meaning.linguistic_analysis && (
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: name.meaning.linguistic_analysis.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                      </div>
                    )}
                  </div>
                )}

                {/* Etymology */}
                {name?.etymology && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-2xl font-semibold mb-4">Etymology</h3>
                    <p className="text-gray-700 leading-relaxed">{name.etymology}</p>
                  </div>
                )}

                {/* Cultural Context */}
                {name?.cultural_context && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-2xl font-semibold mb-4">Cultural Context</h3>
                    <p className="text-gray-700 leading-relaxed">{name.cultural_context}</p>
                  </div>
                )}

                {/* Popularity Trends */}
                {name?.popularity_trends && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-2xl font-semibold mb-4">Popularity Trends</h3>
                    <p className="text-gray-700 leading-relaxed">{name.popularity_trends}</p>
                  </div>
                )}

                {/* Modern vs Traditional */}
                {name?.modern_vs_traditional && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-2xl font-semibold mb-4">Modern vs Traditional</h3>
                    <p className="text-gray-700 leading-relaxed">{name.modern_vs_traditional}</p>
                  </div>
                )}

                {/* Regional Usage */}
                {name?.regional_usage && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-2xl font-semibold mb-4">Regional Usage</h3>
                    <p className="text-gray-700 leading-relaxed">{name.regional_usage}</p>
                  </div>
                )}

                {/* Traditionally Admired Qualities */}
                {name?.traditionally_admired_qualities && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-2xl font-semibold mb-4">Traditionally Admired Qualities</h3>
                    <p className="text-gray-700 leading-relaxed">{name.traditionally_admired_qualities}</p>
                  </div>
                )}

                {/* Pronunciation */}
                {name?.pronunciation && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                      <Volume2 className="w-6 h-6 text-red-500" />
                      Pronunciation
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{name.pronunciation}</p>
                    {name?.quick_facts?.pronunciation && (
                      <p className="text-lg font-semibold text-red-600 mt-2">{name.quick_facts.pronunciation}</p>
                    )}
                  </div>
                )}

                {/* Notable Individuals */}
                {name?.notable_individuals && name.notable_individuals.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                      <Award className="w-6 h-6 text-red-500" />
                      Notable Individuals
                    </h3>
                    <div className="space-y-3">
                      {name.notable_individuals.map((person, idx) => (
                        <div key={person._id || idx} className="border-l-4 border-red-500 pl-4">
                          <p className="font-semibold text-gray-900">{person.name}</p>
                          <p className="text-gray-600 text-sm">{person.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* FAQ Section */}
              {name?.faqs && name.faqs.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-6">
                    {name.faqs.map((faq, idx) => (
                      <div key={faq._id || idx} className="border-b pb-4 last:border-b-0">
                        <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Facts */}
              {name?.quick_facts && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold mb-6">Quick Facts</h2>
                  <div className="space-y-3">
                    {name.quick_facts.name && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-semibold">{name.quick_facts.name}</span>
                      </div>
                    )}
                    {name.quick_facts.gender && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span className="font-semibold">{name.quick_facts.gender}</span>
                      </div>
                    )}
                    {name.quick_facts.language && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Language:</span>
                        <span className="font-semibold">{name.quick_facts.language}</span>
                      </div>
                    )}
                    {name.quick_facts.region && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Region:</span>
                        <span className="font-semibold">{name.quick_facts.region}</span>
                      </div>
                    )}
                    {name.quick_facts.meaning_short && (
                      <div className="pt-3 border-t">
                        <span className="text-gray-600 block mb-1">Meaning:</span>
                        <span className="font-semibold">{name.quick_facts.meaning_short}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Nicknames */}
              {name?.nicknames && name.nicknames.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Heart className="w-6 h-6 text-red-500" />
                    Nicknames
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {name.nicknames.map((nickname, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium"
                      >
                        {nickname}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Similar Names */}
              {name?.similar_names && name.similar_names.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Users className="w-6 h-6 text-red-500" />
                    Similar Names
                  </h2>
                  <div className="space-y-3">
                    {name.similar_names.map((similarName, idx) => (
                      <span
                        key={idx}
                        className="text-gray-600 block w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        {similarName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Names */}
              {name?.relatedNames && name.relatedNames.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Users className="w-6 h-6 text-red-500" />
                    Related Names
                  </h2>
                  <div className="space-y-3">
                    {name.relatedNames.slice(0, 10).map((relatedName) => (
                      <Link
                        key={relatedName._id}
                        href={`/baby-names/${relatedName.slug}`}
                        className="block w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        {relatedName.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* More Names By Religion */}
              {data.length > 0 && (
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
              )}

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
                    <p className="text-sm text-gray-600">
                      {name?.origin?.language || name?.quick_facts?.language || name?.origion} roots
                    </p>
                    {name?.origin?.historical_background && (
                      <p className="text-xs text-gray-500 mt-1">{name.origin.historical_background}</p>
                    )}
                  </div>
                  <div className="relative pl-8 pb-4 border-l-2 border-red-200">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 bg-red-500 rounded-full" />
                    <p className="font-semibold">Traditional Use</p>
                    <p className="text-sm text-gray-600">
                      {name?.modern_vs_traditional ? "Traditional Sanskrit name" : "Historical significance"}
                    </p>
                  </div>
                  <div className="relative pl-8">
                    <div className="absolute left-[-8px] top-0 w-4 h-4 bg-red-500 rounded-full" />
                    <p className="font-semibold">Modern Day</p>
                    <p className="text-sm text-gray-600">
                      {name?.popularity_trends ? "Contemporary usage" : "Contemporary popularity"}
                    </p>
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

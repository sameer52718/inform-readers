import React from "react";
import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";
import { ArrowRight, Tag, Layers, Car } from "lucide-react";
import { headers } from "next/headers";
import { buildHreflangLinks } from "@/lib/hreflang";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";

// --- Server function to get models ---
async function getModels(slug) {
  try {
    const res = await axiosInstance.get(`/website/vehicle/model/${slug}`);
    return res.data.data || [];
  } catch (error) {
    console.error("Error fetching Models:", error);
    return { models: [], make: {} };
  }
}

export async function generateMetadata({ params }) {
  const { makeSlug } = await params;
  const host = (await headers()).get("host") || "informreaders.com";

  // 1. Call API to get make + models
  let makeName = "";
  try {
    const res = await axiosInstance.get(`/website/vehicle/model/${makeSlug}`);
    makeName = res?.data?.data?.make?.name || "";
  } catch (error) {
    console.error("Metadata Make Fetch Error:", error);
  }

  // 2. Build hreflang links for /cars/{makeSlug}
  const alternates = buildHreflangLinks(`/cars/${makeSlug}/`, host);

  // 3. Prepare dynamic title/description
  const title = `${makeName ? makeName + " Models" : "Car Models"} | Inform Readers`;
  const description = makeName
    ? `Explore all available ${makeName} car models, specifications, price ranges, and detailed information. Stay updated with the latest ${makeName} cars on Inform Readers.`
    : "Explore all available car models and brands. Stay updated with latest car specs and information.";

  return {
    title,
    description,
    keywords: [`${makeName} models`, `${makeName} cars`, "car models", "inform readers cars"],
    alternates,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Inform Readers",
      url: alternates?.canonical,
    },
  };
}

const CarsModels = async ({ params }) => {
  const { makeSlug } = await params;

  const { models, make } = await getModels(makeSlug);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Cars", href: "/cars" },
    { label: make?.name },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-50 to-pink-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Car className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">{make?.name} Models</h1>
              <p className="text-red-100 mt-2 text-lg">
                Explore {models.length} {make?.name} models
              </p>
            </div>
          </div>
          <p className="text-white/90 max-w-2xl text-lg">
            Discover your perfect ride from the world's leading cars manufacturers. Compare models,
            specifications, and find the Car that matches your style.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Breadcrumb items={breadcrumbItems} />
        {models.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
            <Car className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-700 mb-2">No {make?.name} model found</h2>
            <p className="text-slate-500">Check back soon for updated {make?.name} models.</p>
          </div>
        ) : (
          <div className="space-y-12">
            <div>
              {/* Type Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Layers className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{make?.name}</h2>
                  <p className="text-sm text-slate-500">{models.length} models</p>
                </div>
              </div>

              {/* Makes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {models.map((model) => (
                  <Link key={model._id} href={`/cars/${makeSlug}/${model.slug}`} className="group">
                    <div className="bg-white rounded-xl border-2 border-slate-200 p-6 h-full transition-all duration-300 hover:border-red-400 hover:shadow-xl hover:-translate-y-2">
                      {/* Icon & Arrow */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-red-100 to-red-100 rounded-xl group-hover:from-red-200 group-hover:to-red-200 transition-all">
                          <Car className="w-6 h-6 text-red-600" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                      </div>

                      {/* model Name */}
                      <h3 className="text-xl font-bold capitalize text-slate-900 group-hover:text-red-600 transition-colors">
                        {model.name}
                      </h3>

                      {/* View Link */}
                      <div className="mt-6 pt-4 border-t border-slate-100">
                        <span className="text-sm font-semibold text-red-600 group-hover:underline">
                          View Cars →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarsModels;

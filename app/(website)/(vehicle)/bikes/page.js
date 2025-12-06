import React from "react";
import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";
import { Bike, ArrowRight, Tag, Layers } from "lucide-react";
import { headers } from "next/headers";
import { buildHreflangLinks } from "@/lib/hreflang";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";

// --- Server function to get makes ---
async function getMakes() {
  try {
    const res = await axiosInstance.get(`/website/bike/make`);
    return res.data.data || [];
  } catch (error) {
    console.error("Error fetching makes:", error);
    return [];
  }
}

export async function generateMetadata() {
  const host = (await headers()).get("host") || "informreaders.com";

  // Generate multilingual alternates for /bike/makes
  const alternates = buildHreflangLinks(`/bikes/`, host);

  return {
    title: "All Bike Makes | Inform Readers",
    description:
      "Browse all available bike makes and brands. Explore detailed information and stay updated with the latest bike manufacturers on Inform Readers.",
    keywords: [
      "bike makes",
      "motorcycle brands",
      "bike companies",
      "motorbike manufacturers",
      "two-wheeler brands",
      "inform readers bikes",
    ],
    alternates,
    openGraph: {
      title: "All Bike Makes | Inform Readers",
      description:
        "Explore all motorcycle brands and bike makes. Browse updated data and stay informed on the latest bike manufacturers.",
      type: "website",
      siteName: "Inform Readers",
      url: alternates.canonical,
    },
  };
}

const BikesMakes = async () => {
  const makes = await getMakes();

  const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Bikes" }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-50 to-pink-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Bike className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">Bike Makes</h1>
              <p className="text-red-100 mt-2 text-lg">Explore {makes.length} motorcycle brands</p>
            </div>
          </div>
          <p className="text-white/90 max-w-2xl text-lg">
            Discover your perfect ride from the world's leading motorcycle manufacturers. Compare models,
            specifications, and find the bike that matches your style.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Breadcrumb items={breadcrumbItems} />
        {makes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
            <Bike className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-700 mb-2">No bike makes found</h2>
            <p className="text-slate-500">Check back soon for updated bike manufacturers.</p>
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
                  <h2 className="text-2xl font-bold text-slate-900">Bikes</h2>
                  <p className="text-sm text-slate-500">{makes.length} brands</p>
                </div>
              </div>

              {/* Makes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {makes.map((make) => (
                  <Link key={make._id} href={`/bikes/${make.slug}`} className="group">
                    <div className="bg-white rounded-xl border-2 border-slate-200 p-6 h-full transition-all duration-300 hover:border-red-400 hover:shadow-xl hover:-translate-y-2">
                      {/* Icon & Arrow */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-red-100 to-red-100 rounded-xl group-hover:from-red-200 group-hover:to-red-200 transition-all">
                          <Bike className="w-6 h-6 text-red-600" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                      </div>

                      {/* Make Name */}
                      <h3 className="text-xl font-bold capitalize text-slate-900 group-hover:text-red-600 transition-colors">
                        {make.name}
                      </h3>

                      {/* View Link */}
                      <div className="mt-6 pt-4 border-t border-slate-100">
                        <span className="text-sm font-semibold text-red-600 group-hover:underline">
                          View Models →
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

export default BikesMakes;

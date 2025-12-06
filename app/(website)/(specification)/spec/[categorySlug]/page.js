import axiosInstance from "@/lib/axiosInstance";
import React from "react";
import Link from "next/link";
import { Store, ArrowRight } from "lucide-react";
import { headers } from "next/headers";
import { buildHreflangLinks } from "@/lib/hreflang";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";

export async function generateMetadata({ params }) {
  const { categorySlug } = params;
  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(`/spec/${categorySlug}`, host);
  return {
    title: "Product Specifications & Comparisons | Inform Readers",
    description:
      "Browse detailed product specifications across multiple categories. Compare features, prices, and find the perfect product for your needs.",
    keywords: [
      "product specifications",
      "compare products",
      "product features",
      "product details",
      "product prices",
      "electronics specs",
      "inform readers",
    ],
    alternates,
    openGraph: {
      title: "Product Specifications & Comparisons",
      description:
        "Explore and compare product specifications by category. Find the best products with detailed data and prices.",
      type: "website",
      siteName: "Inform Readers",
    },
  };
}

async function getBrands(categorySlug) {
  try {
    const { data } = await axiosInstance.get(`/website/specification/${categorySlug}`);
    return data.data;
  } catch (error) {
    console.error(error);
    return { brands: [], category: {} };
  }
}

const Page = async ({ params }) => {
  const { categorySlug } = params;
  const { brands, category } = await getBrands(categorySlug);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Specifications", href: "/spec" },
    { label: category?.name },
  ];

  return (
    <div className="min-h-screen ">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-red-600 to-red-800">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <p className="text-sm text-white font-medium">Browse by Brand</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{category?.name || "Products"}</h1>
            </div>
          </div>
          <p className="text-white max-w-2xl">
            Explore top brands in {category?.name?.toLowerCase() || "this category"}. Compare specifications,
            features, and find the perfect product for your needs.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Breadcrumb items={breadcrumbItems} />
        {brands.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <Store className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-700 mb-2">No brands found</h2>
            <p className="text-slate-500">
              We couldn't find any brands in this category yet. Check back soon!
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-slate-600">
                Showing <span className="font-semibold text-slate-900">{brands.length}</span> brands
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {brands.map((brand) => (
                <Link key={brand._id} href={`/spec/${categorySlug}/${brand.slug}`} className="group">
                  <div className="bg-white rounded-xl border-2 border-slate-200 p-6 h-full transition-all duration-300 hover:border-red-400 hover:shadow-lg hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-red-50 transition-colors">
                        <Store className="w-5 h-5 text-slate-600 group-hover:text-red-600 transition-colors" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2">
                      {brand.name}
                    </h3>

                    {brand.description && (
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">{brand.description}</p>
                    )}

                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <span className="text-xs font-medium text-red-600 group-hover:underline">
                        View Products →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;

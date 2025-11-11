import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import Link from "next/link";
import { Landmark, MapPin } from "lucide-react";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";
import { headers } from "next/headers";

// Fetch grouped branch data
async function getBranchesData(countryCode, bankSlug) {
  try {
    const res = await axiosInstance.get(`/website/bankCode/branches`, {
      params: { countryCode, bankSlug },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching branch data:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { countryCode, bankSlug } = params;
  const data = await getBranchesData(countryCode, bankSlug);

  const host = (await headers()).get("host") || "informreaders.com";

  const canonicalUrl = new URL(`https://${host}/bank-codes/${countryCode}/${bankSlug}/`);

  if (!data || !data.success) {
    return {
      title: "Bank Branches Information",
      description: "Details about bank branches and SWIFT codes.",
      alternates: {
        canonical: canonicalUrl.toString(),
      },
    };
  }

  const { bank, country } = data;

  return {
    title: `${bank.name} Branches in ${country.name}`,
    description: `Explore all ${bank.name} branches across ${country.name}. Find branch details, SWIFT codes, and cities served.`,
    alternates: {
      canonical: canonicalUrl.toString(),
    },
    openGraph: {
      title: `${bank.name} Branches in ${country.name}`,
      description: `Comprehensive list of ${bank.name} branches in ${country.name}.`,
      images: [country.flag],
    },
  };
}

export default async function BankBranchesPage({ params }) {
  const { countryCode, bankSlug } = params;
  const data = await getBranchesData(countryCode, bankSlug);

  if (!data || !data.success) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600 text-lg">Failed to load branch data.</p>
      </div>
    );
  }

  const { country, bank, branches } = data;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Swift Codes", href: "/bank-codes" },
    { label: country?.name, href: `/bank-codes/${countryCode}` },
    { label: bank.name },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-red-600 to-pink-500 mb-8">
        <div className="container mx-auto px-4 py-16 text-center">
          <Image
            src={country.flag}
            alt={`${country.name} flag`}
            width={64}
            height={64}
            className="mx-auto mb-4 rounded-lg shadow-lg"
          />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            {bank.name} Branches in {country.name}
          </h1>
          <p className="mt-4 text-lg text-white/90">
            Explore {branches.length} branches across different cities in {country.name}.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <Breadcrumb items={breadcrumbItems} />
        {branches.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No branches found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch) => (
              <div
                key={branch.branchSlug}
                className="rounded-xl bg-white shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-6 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <Landmark className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{branch.branch}</h2>
                </div>

                <div className="mb-3">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    City:{" "}
                    <span className="text-gray-700 text-sm">{branch.cities.slice(0, 5).join(", ")}</span>
                  </h3>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Link
                    href={`/bank-codes/${countryCode}/${bankSlug}/${branch.branchSlug}`}
                    className="inline-flex items-center text-red-600 hover:text-red-800 font-medium transition"
                  >
                    View Details →
                  </Link>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <MapPin className="h-4 w-4" />
                    {country.code.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

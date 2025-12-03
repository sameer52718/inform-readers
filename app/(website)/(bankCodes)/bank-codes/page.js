import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import Link from "next/link";
import { Building2, MapPin } from "lucide-react";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";
import { headers } from "next/headers";
import { buildHreflangLinks } from "@/lib/hreflang";

//  Fetch data function
async function getBanksData(host) {
  try {
    const res = await axiosInstance.get(`/website/bankCode/banks`, {
      params: { host },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching banks:", error);
    return null;
  }
}

//  Dynamic Metadata
export async function generateMetadata() {
  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(`/bank-codes/`, host);

  try {
    const data = await getBanksData(host);

    if (!data || !data.success) {
      return {
        title: "Banks Information",
        description: "Explore detailed information about banks worldwide.",
        alternates,
      };
    }

    const { country, totalBanks } = data;

    const title = `Banks in ${country.name} - ${totalBanks} Major Financial Institutions`;
    const description = `Discover major banks in ${country.name}. View branch locations, SWIFT codes, and services offered by top financial institutions across ${country.name}.`;

    return {
      title,
      description,
      alternates,
      openGraph: {
        title,
        description,
        images: [country.flag],
      },
    };
  } catch (error) {
    return {
      title: "Banks Information",
      description: "Explore major banks and their branches by country.",
      alternates,
    };
  }
}

//  Page Component
export default async function BanksPage() {
  const host = (await headers()).get("host") || "informreaders.com";

  const data = await getBanksData(host);

  if (!data || !data.success) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600 text-lg">Failed to load bank data.</p>
      </div>
    );
  }

  const { country, banks } = data;

  const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Swift Codes" }];

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
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">Banks in {country.name}</h1>
          <p className="mt-4 text-lg text-white/90">
            Explore all major banks and their branches in {country.name}.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <Breadcrumb items={breadcrumbItems} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {banks.map((bank) => (
            <div
              key={bank.bank}
              className="rounded-xl bg-white shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-6 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Building2 className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{bank.bank}</h2>
              </div>

              <p className="text-gray-600 mb-3">
                Total Branches: <span className="font-medium text-gray-900">{bank.totalBranches}</span>
              </p>

              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Cities:</h3>
                <p className="text-gray-700 text-sm">
                  {bank.cities.slice(0, 5).join(", ")}
                  {bank.cities.length > 5 && " ..."}
                </p>
              </div>

              <div className="flex justify-between items-center mt-4">
                <Link
                  href={`/bank-codes/${bank.bankSlug}`}
                  className="inline-flex items-center text-red-600 hover:text-red-800 font-medium transition"
                >
                  View Branches →
                </Link>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <MapPin className="h-4 w-4" />
                  {country.code.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

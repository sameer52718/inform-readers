import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Building2, Landmark } from "lucide-react";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";
import { headers } from "next/headers";

// Fetch branch detail
async function getBranchData(countryCode, bankSlug, branchSlug) {
  try {
    const res = await axiosInstance.get(`/website/bankCode/${countryCode}/${bankSlug}/${branchSlug}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching branch detail:", error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { countryCode, bankSlug, branchSlug } = params;
  const data = await getBranchData(countryCode, bankSlug, branchSlug);

  const host = (await headers()).get("host") || "informreaders.com";

  const canonicalUrl = new URL(`https://${host}/bank-codes/${countryCode}/${bankSlug}/${branchSlug}/`);

  if (!data || !data.success) {
    return {
      title: "Branch Detail",
      description: "Details of selected bank branch.",
      alternates: {
        canonical: canonicalUrl.toString(),
      },
    };
  }

  const { branch } = data;
  const title = `${branch.bank} - ${branch.name}, ${branch.city}, ${branch.country.name}`;
  const description = `Details of ${branch.name}, a branch of ${branch.bank} located in ${branch.city}, ${branch.country.name}.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl.toString(),
    },
    openGraph: {
      title,
      description,
      images: [branch.country.flag],
    },
  };
}

// Page component
export default async function BranchDetailPage({ params }) {
  const { countryCode, bankSlug, branchSlug } = params;
  const data = await getBranchData(countryCode, bankSlug, branchSlug);

  if (!data || !data.success) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600 text-lg">Failed to load branch data.</p>
      </div>
    );
  }

  const { branch, related } = data;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Swift Codes", href: "/bank-codes" },
    { label: branch?.country?.name, href: `/bank-codes/${countryCode}` },
    { label: branch?.bank, href: `/bank-codes/${countryCode}/${bankSlug}` },
    { label: branch?.name },
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-red-600 to-pink-500 mb-8">
        <div className="container mx-auto px-4 py-16 text-center">
          <Image
            src={branch.country.flag}
            alt={`${branch.country.name} flag`}
            width={64}
            height={64}
            className="mx-auto mb-4 rounded-lg shadow-lg"
          />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">{branch.name}</h1>
          <p className="mt-4 text-lg text-white/90">
            {branch.bank} - {branch.city}, {branch.country.name}
          </p>
        </div>
      </div>

      {/* Main Info */}
      <div className="container mx-auto px-4 pb-16">
        <Breadcrumb items={breadcrumbItems} />
        <div className="rounded-xl bg-white p-8 shadow-lg border border-gray-100 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-red-100 p-3 rounded-full">
              <Building2 className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{branch.name}</h2>
              <p className="text-gray-600">{branch.bank}</p>
              <p className="flex items-center gap-2 text-gray-500 mt-1">
                <MapPin className="h-4 w-4" /> {branch.city}, {branch.country.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Branch Info</h3>
              <p>
                <span className="font-medium">Bank:</span> {branch.bank}
              </p>
              <p>
                <span className="font-medium">City:</span> {branch.city}
              </p>
              <p>
                <span className="font-medium">Country:</span> {branch.country.name}
              </p>
              <p>
                <span className="font-medium">Status:</span> {branch.status ? "Active" : "Inactive"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About This Branch</h3>
              <p className="text-gray-600">
                This is a branch of {branch.bank} located in {branch.city}, {branch.country.name}. SWIFT codes
                are not displayed for security reasons.
              </p>
              <Link
                href={`/bank-codes/${countryCode}/${bankSlug}/${branchSlug}/${branch?.swiftCode}`}
                className="inline-flex items-center text-red-600 hover:text-red-800 font-medium transition mt-4"
              >
                View Swift Code →
              </Link>
            </div>
          </div>
        </div>

        {/* Related Branches */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Branches of {branch.bank}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((b) => (
                <Link
                  key={b.slug}
                  href={`/bank-codes/${countryCode}/${bankSlug}/${b.slug}`}
                  className="rounded-xl bg-white p-6 shadow-md hover:shadow-lg transition transform hover:-translate-y-1 border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-red-100 p-2 rounded-full">
                      <Landmark className="h-5 w-5 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{b.name}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{b.city}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

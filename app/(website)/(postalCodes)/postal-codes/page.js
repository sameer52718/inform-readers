import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Globe2 } from "lucide-react";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";
import { headers } from "next/headers";

// 🔹 Fetch data function
async function getPostalStatesData(host) {
  try {
    const res = await axiosInstance.get(`/website/postalCode/state`, { params: { host } });
    return res.data;
  } catch (error) {
    console.error("Error fetching postal code states:", error);
    return null;
  }
}

// 🔹 Dynamic Metadata
export async function generateMetadata({ params }) {
  const host = (await headers()).get("host") || "informreaders.com";
  const canonicalUrl = new URL(`https://${host}/postal-codes/`);

  try {
    const data = await getPostalStatesData(host);

    if (!data?.success) {
      return {
        title: "Postal Codes by Country",
        description: "Browse postal codes organized by country and region.",
        alternates: { canonical: canonicalUrl.toString() },
      };
    }

    const { country, totalStates } = data;

    const title = `Postal Codes in ${country.name} - ${totalStates} Regions`;
    const description = `Explore postal codes in ${country.name} by region and area. Discover location details, postal formats, and mapping info for all major states in ${country.name}.`;

    return {
      title,
      description,
      alternates: { canonical: canonicalUrl.toString() },
      openGraph: {
        title,
        description,
        images: [country.flag],
      },
    };
  } catch {
    return {
      title: "Postal Codes by Country",
      description: "Browse postal codes organized by country and region.",
      alternates: { canonical: canonicalUrl.toString() },
    };
  }
}

// 🔹 Page Component
export default async function PostalStatesPage() {
  const host = (await headers()).get("host") || "informreaders.com";
  const data = await getPostalStatesData(host);

  if (!data || !data.success) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600 text-lg">Failed to load postal code data.</p>
      </div>
    );
  }

  const { country, states } = data;

  const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Postal Codes" }];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-rose-600 to-pink-500 mb-8">
        <div className="container mx-auto px-4 py-16 text-center">
          <Image
            src={country.flag}
            alt={`${country.name} flag`}
            width={64}
            height={64}
            className="mx-auto mb-4 rounded-lg shadow-lg"
          />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            Postal Codes in {country.name}
          </h1>
          <p className="mt-4 text-lg text-white/90">
            Explore all postal code regions and areas across {country.name}.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <Breadcrumb items={breadcrumbItems} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {states.map((state) => (
            <div
              key={state.stateSlug}
              className="rounded-xl bg-white shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-6 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Globe2 className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{state.state}</h2>
              </div>

              <p className="text-gray-600 mb-3">
                Total Areas: <span className="font-medium text-gray-900">{state.totalAreas}</span>
              </p>

              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Sample Areas:</h3>
                <p className="text-gray-700 text-sm">
                  {state.areas.slice(0, 5).join(", ")}
                  {state.areas.length > 5 && " ..."}
                </p>
              </div>

              <div className="flex justify-between items-center mt-4">
                <Link
                  href={`/postal-codes/${state.stateSlug}`}
                  className="inline-flex items-center text-red-600 hover:text-red-800 font-medium transition"
                >
                  View Areas →
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

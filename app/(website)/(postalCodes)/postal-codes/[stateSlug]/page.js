import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail } from "lucide-react";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";
import { headers } from "next/headers";

// 🔹 Fetch data
async function getPostalAreasData(stateSlug) {
  try {
    const res = await axiosInstance.get(`/website/postalCode/area`, {
      params: { stateSlug },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching postal code areas:", error);
    return null;
  }
}

// 🔹 Dynamic Metadata
export async function generateMetadata({ params }) {
  const { stateSlug } = params;
  const host = (await headers()).get("host") || "informreaders.com";
  const canonicalUrl = new URL(`https://${host}/postal-codes/${stateSlug}/`);

  try {
    const data = await getPostalAreasData(stateSlug);

    if (!data?.success) {
      return {
        title: "Postal Codes by Area",
        description: "Explore postal codes organized by region and area.",
        alternates: { canonical: canonicalUrl.toString() },
      };
    }

    const { country, state } = data;

    const title = `Postal Codes in ${state.name} - ${country.name}`;
    const description = `Browse all postal codes and areas within ${state.name}, ${country.name}. Discover location details and nearby regions for efficient mail delivery.`;

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
      title: "Postal Codes by Area",
      description: "Explore postal codes organized by region and area.",
      alternates: { canonical: canonicalUrl.toString() },
    };
  }
}

// 🔹 Page Component
export default async function PostalAreasPage({ params }) {
  const { stateSlug } = params;
  const data = await getPostalAreasData(stateSlug);

  if (!data || !data.success) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600 text-lg">Failed to load postal areas.</p>
      </div>
    );
  }

  const { country, state, areas } = data;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Postal Codes", href: "/postal-codes" },
    { label: state.name },
  ];

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
            Postal Areas in {state.name}, {country.name}
          </h1>
          <p className="mt-4 text-lg text-white/90">
            Explore postal codes and locations across {state.name}.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <Breadcrumb items={breadcrumbItems} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area) => (
            <div
              key={area.areaSlug}
              className="rounded-xl bg-white shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-6 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{area.area || "Unnamed Area"}</h2>
              </div>

              <div className="flex justify-between items-center mt-4">
                <Link
                  href={`/postal-codes/${stateSlug}/${area.areaSlug}`}
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
      </div>
    </div>
  );
}

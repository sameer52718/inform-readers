import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Globe2, Compass, ArrowRight, Mail } from "lucide-react";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";
import { headers } from "next/headers";

// 🔹 Fetch Data
async function getAreaDetail(areaSlug, host) {
  try {
    const res = await axiosInstance.get(`/website/postalCode/detail`, {
      params: { areaSlug, host },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching area detail:", error);
    return null;
  }
}

// 🔹 Dynamic Metadata
export async function generateMetadata({ params }) {
  const { areaSlug, stateSlug } = params;
  const host = (await headers()).get("host") || "informreaders.com";
  const canonicalUrl = new URL(`https://${host}/postal-codes/${stateSlug}/${areaSlug}/`);

  const data = await getAreaDetail(areaSlug, host);

  if (!data || !data.success) {
    return {
      title: "Postal Code Information",
      description: "Explore postal code and area details worldwide.",
      alternates: { canonical: canonicalUrl.toString() },
    };
  }

  const { postalCode, country } = data.data;
  const title = `${postalCode.area}, ${postalCode.state} - Postal Code ${postalCode.code}`;
  const description = `Explore postal information for ${postalCode.area}, ${country.name}. Includes postal code, region, location, and nearby areas.`;

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
}

// 🔹 Page Component
export default async function AreaDetailPage({ params }) {
  const { areaSlug, stateSlug } = params;
  const host = (await headers()).get("host") || "informreaders.com";
  const data = await getAreaDetail(areaSlug, host);

  if (!data || !data.success) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600 text-lg">Failed to load area details.</p>
      </div>
    );
  }

  const { postalCode, country, relatedAreas, content } = data.data;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Postal Codes", href: "/postal-codes" },
    { label: postalCode.state, href: `/postal-codes/${stateSlug}` },
    { label: postalCode.area },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔹 Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-red-600 to-pink-500 mb-8">
        <div className="container mx-auto px-4 py-16 text-center text-white">
          <Image
            src={country.flag}
            alt={`${country.name} flag`}
            width={80}
            height={80}
            className="mx-auto mb-4 rounded-lg shadow-lg"
          />
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            {content?.title}
            {/* {postalCode.area}, {postalCode.state} */}
          </h1>
          <p className="mt-3 text-lg opacity-90">
            Postal Code: <span className="font-semibold">{postalCode.code}</span>
          </p>
        </div>
      </div>

      {/* 🔹 Main Section */}
      <div className="container mx-auto px-4 pb-20">
        <Breadcrumb items={breadcrumbItems} />
        {content?.constants && (
          <Section title="Postal System Details">
            <InfoBlock title="Postal Authority" content={content.constants.postal_authority} />
            <InfoBlock title="Postal System" content={content.constants.postal_system} />
            <InfoBlock title="Region Structure" content={content.constants.region_structure} />
          </Section>
        )}

        {/* Area Information Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-10 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Area Information</h2>
          <div className="mb-6">
            <p className="text-gray-600">{content?.paragraph}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600">Country:</p>
              <p className="font-medium text-gray-900">{country.name}</p>
            </div>
            <div>
              <p className="text-gray-600">State:</p>
              <p className="font-medium text-gray-900">{postalCode.state}</p>
            </div>
            <div>
              <p className="text-gray-600">Area:</p>
              <p className="font-medium text-gray-900">{postalCode.area}</p>
            </div>
            <div>
              <p className="text-gray-600">Postal Code:</p>
              <p className="font-medium text-gray-900">{postalCode.code}</p>
            </div>
            <div>
              <p className="text-gray-600">Latitude:</p>
              <p className="font-medium text-gray-900">{postalCode.latitude}</p>
            </div>
            <div>
              <p className="text-gray-600">Longitude:</p>
              <p className="font-medium text-gray-900">{postalCode.longitude}</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <a
              href={`https://www.google.com/maps?q=${postalCode.latitude},${postalCode.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Compass className="h-4 w-4 mr-2" />
              View on Map
            </a>
            {/* <Link
              href={`/postal-codes/${stateSlug}/${areaSlug}/${postalCode.code}`}
              className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              View Postal Code
            </Link> */}
          </div>
        </div>
        {/* Constants Section */}

        {/* FAQs */}
        <Section title="Frequently Asked Questions">
          {content?.faqs.map((faq, index) => (
            <FunctionItem key={index} title={`${index + 1}. ${faq.question}`} description={faq.answer} />
          ))}
        </Section>

        {/* Related Areas Section */}
        {relatedAreas.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Nearby Areas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedAreas.map((area) => (
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
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="my-12 rounded-xl bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">{title}</h2>
      {children}
    </section>
  );
}

function InfoBlock({ title, content, highlight = false }) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className={`text-xl font-semibold ${highlight ? "text-red-600 text-2xl" : "text-gray-900"}`}>
        {content}
      </p>
    </div>
  );
}

function FunctionItem({ title, description }) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { Share2, Navigation } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata({ params }) {
  try {
    const res = await axiosInstance.get(`/website/postalCode/${params.slug}`);
    const data = res.data.data;

    return {
      title: `${data.postalCode.code} - ${data.postalCode.area} | Postal Code Info`,
      description: `Details about postal code ${data.postalCode.code} in ${data.postalCode.area}, ${data.postalCode.state}, ${data.postalCode.countryId.name}`,
      openGraph: {
        title: `${data.postalCode.code} - ${data.postalCode.area}`,
        description: `Information for ${data.postalCode.area}, ${data.postalCode.state}, ${data.postalCode.countryId.name}`,
        images: [data.postalCode.countryId.flag],
      },
    };
  } catch {
    return {
      title: "Postal Code Info",
      description: "Error fetching postal code data.",
    };
  }
}

async function getPostalCodeData(slug) {
  try {
    const res = await axiosInstance.get(`/website/postalCode/${slug}`);
    return res.data.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export default async function PostalCodeDetail({ params }) {
  const data = await getPostalCodeData(params.slug);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">Failed to load postal code data.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-red-600 to-pink-500 mb-4">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-center text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            {data.postalCode.code} - {data.postalCode.area}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-white">
            Postal code details for {data.postalCode.area}, {data.postalCode.state},{" "}
            {data.postalCode.countryId.name}
          </p>
        </div>
      </div>

      {/* Main Info */}
      <div className="container mx-auto px-4">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-6">
            <div className="flex items-center gap-4">
              <Image
                src={data.postalCode.countryId.flag}
                alt={`${data.postalCode.countryId.name} flag`}
                width={48}
                height={48}
                className="rounded-lg"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{data.postalCode.countryId.name}</h2>
                <p className="text-gray-600">{data.postalCode.countryId.region}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-red-600 hover:bg-red-200">
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <InfoBlock title="Postal Code" content={data.postalCode.code} highlight />
              <InfoBlock title="Area" content={data.postalCode.area} />
              <InfoBlock title="State/Province" content={data.postalCode.state} />
            </div>

            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">About This Location</h3>
              <p className="text-gray-600">
                This postal code serves the area of {data.postalCode.area} in {data.postalCode.state},{" "}
                {data.postalCode.countryId.name}. It follows the standard {data.postalCode.countryId.name}{" "}
                postal code format.
              </p>
            </div>
          </div>
        </div>

        {/* Other Countries */}
        <Section title={`Other Countries in ${data.postalCode.countryId.region}`}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.otherCountries.slice(0, 12).map((country) => (
              <Link
                key={country._id}
                href={`/postalcode/${country.countryCode}`}
                className="transform rounded-xl border bg-white p-4 transition-all hover:scale-105 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={country.flag}
                    alt={`${country.name} flag`}
                    width={32}
                    height={32}
                    className="rounded"
                  />
                  <span className="font-medium text-gray-900">{country.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        {/* More Sections */}
        <Section title={`What Is the Purpose of Postal Code ${data.postalCode.code}?`}>
          <p className="text-gray-600">
            Postal code {data.postalCode.code} serves as a unique identifier for {data.postalCode.area} within{" "}
            {data.postalCode.state}, {data.postalCode.countryId.name}. It is essential for efficient mail
            routing, digital mapping, and logistics.
          </p>
        </Section>

        <Section title={`Key Functions of Postal Code ${data.postalCode.code}`}>
          <FunctionItem
            title="1. Efficient Mail Delivery"
            description={`Ensures accurate mail delivery in ${data.postalCode.area}.`}
          />
          <FunctionItem
            title="2. Accurate Navigation"
            description={`Helps pinpoint locations in ${data.postalCode.area}.`}
          />
          <FunctionItem
            title="3. Support for E-commerce"
            description={`Used for shipping estimates and logistics in ${data.postalCode.area}.`}
          />
        </Section>

        <Section title={`Regions in ${data.postalCode.countryId.name}`}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.regions.map((region) => (
              <div
                key={region}
                className="flex items-center rounded-xl border bg-white p-4 shadow-sm hover:scale-105 transition"
              >
                <div className="mr-4 rounded-full bg-red-100 p-2">
                  <Navigation className="h-5 w-5 text-red-600" />
                </div>
                <span className="font-medium text-gray-900">{region}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title={`About ${data.postalCode.area}`}>
          <p className="text-gray-600">
            {data.postalCode.area}, located in {data.postalCode.state}, is known for its unique blend of
            culture and development. Postal code {data.postalCode.code} spans homes, businesses, and
            landmarks.
          </p>
        </Section>

        <Section title="Frequently Asked Questions">
          <FunctionItem
            title={`1. What Areas Does Postal Code ${data.postalCode.code} Cover?`}
            description={`It covers parts of ${data.postalCode.area}, ${data.postalCode.state}.`}
          />
          <FunctionItem
            title={`2. Is ${data.postalCode.code} Specific to Residential or Business Areas?`}
            description="It covers both residential and commercial areas."
          />
          <FunctionItem
            title={`3. Can I Use Postal Code ${data.postalCode.code} for International Shipments?`}
            description={`Yes, it's valid for international and domestic shipments.`}
          />
        </Section>
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

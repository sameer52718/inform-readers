import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import Image from "next/image";
import ShareButton from "../../../components/ShareButton";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";
import { headers } from "next/headers";

// Helper function to get term based on country
function getTerm(country) {
  return country === "United States" ? "ZIP Code" : "Postal Code";
}

// Helper to apply template replacements
function applyTemplate(template, values) {
  return template
    .replace(/{Postal Code}/g, values.postalCode || "")
    .replace(/{Area}/g, values.area || "")
    .replace(/{State\/Province}/g, values.state || "")
    .replace(/{Country}/g, values.country || "");
}

export async function generateMetadata({ params }) {
  try {
    const { stateSlug, areaSlug } = params;
    const host = (await headers()).get("host") || "informreaders.com";
    const res = await axiosInstance.get(`/website/postalCode/${params.slug}`, { params: { host } });
    const data = res.data.data;
    const country = data.postalCode.countryId.name;
    const term = getTerm(country);

    const canonicalUrl = new URL(`https://${host}/postal-codes/${stateSlug}/${areaSlug}/${params.slug}`);

    // Use first meta title and description from document
    let titleTemplate = `{Postal Code} ${term} {Area}, {Country}`;
    let descTemplate = `Discover {Postal Code} for {Area}, {State/Province}, {Country}. Find accurate ${term.toLowerCase()}s for fast delivery. Search now!`;

    const values = {
      postalCode: data.postalCode.code,
      area: data.postalCode.area,
      state: data.postalCode.state,
      country: country,
    };

    const title = applyTemplate(titleTemplate, values);
    const description = applyTemplate(descTemplate, values);

    return {
      title,
      description,
      alternates: { canonical: canonicalUrl.toString() },
      openGraph: {
        title,
        description,
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

async function getPostalCodeData(slug, host) {
  try {
    const res = await axiosInstance.get(`/website/postalCode/${slug}`, { params: { host } });
    return res.data.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export default async function PostalCodeDetail({ params }) {
  const { stateSlug, areaSlug } = params;
  const host = (await headers()).get("host") || "informreaders.com";
  const data = await getPostalCodeData(params.slug, host);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">Failed to load postal code data.</p>
      </div>
    );
  }

  const country = data.postalCode.countryId.name;

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Postal Codes", href: "/postal-codes" },
    { label: data?.postalCode.state, href: `/postal-codes/${stateSlug}` },
    { label: data?.postalCode.area, href: `/postal-codes/${stateSlug}/${areaSlug}` },
    { label: data.postalCode.code },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-red-600 to-pink-500 mb-4">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-center text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            {data.postalCode.code} - {data.postalCode.area}, {data.postalCode.state}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-white">{data?.content?.title}</p>
        </div>
      </div>
      {/* Main Info */}
      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbItems} />
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-6">
            <div className="flex items-center gap-4">
              <Image
                src={data.postalCode.countryId.flag}
                alt={`${country} flag`}
                width={48}
                height={48}
                className="rounded-lg"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{country}</h2>
                <p className="text-gray-600">{data.postalCode.countryId.region}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShareButton data={data} />
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
              <p className="text-gray-600">{data?.content?.paragraph}</p>
            </div>
          </div>
        </div>

        {/* Purpose Section */}
        <Section title={`What Is the Purpose of Postal Code ${data.postalCode.code}?`}>
          <p className="text-gray-600">
            Postal code {data.postalCode.code} serves as a unique identifier for {data.postalCode.area} within{" "}
            {data.postalCode.state}, {country}. It is essential for efficient mail routing, digital mapping,
            and logistics.
          </p>
        </Section>

        {/* Key Functions */}
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
        {/* Constants Section */}
        {data?.content?.constants && (
          <Section title="Postal System Details">
            <InfoBlock title="Postal Authority" content={data.content.constants.postal_authority} />
            <InfoBlock title="Postal System" content={data.content.constants.postal_system} />
            <InfoBlock title="Region Structure" content={data.content.constants.region_structure} />
          </Section>
        )}

        {/* FAQs */}
        <Section title="Frequently Asked Questions">
          {data?.content?.faqs.map((faq, index) => (
            <FunctionItem key={index} title={`${index + 1}. ${faq.question}`} description={faq.answer} />
          ))}
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

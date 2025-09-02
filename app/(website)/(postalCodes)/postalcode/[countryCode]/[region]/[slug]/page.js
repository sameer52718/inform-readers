import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { Share2, Navigation } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import ShareButton from "../../../components/ShareButton";

// Helper function to get term based on country
function getTerm(country) {
  return country === 'United States' ? 'ZIP Code' : 'Postal Code';
}

// Helper to apply template replacements
function applyTemplate(template, values) {
  return template
    .replace(/{Postal Code}/g, values.postalCode || '')
    .replace(/{Area}/g, values.area || '')
    .replace(/{State\/Province}/g, values.state || '')
    .replace(/{Country}/g, values.country || '');
}

export async function generateMetadata({ params }) {
  try {
    const res = await axiosInstance.get(`/website/postalCode/${params.slug}`);
    const data = res.data.data;
    const country = data.postalCode.countryId.name;
    const term = getTerm(country);

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

async function getPostalCodeData(slug) {
  try {
    const res = await axiosInstance.get(`/website/postalCode/${slug}`);
    return res.data.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

// Function to get introductory paragraph based on country
function getIntroParagraph(country, values) {
  const generalParagraph = "Looking for the postal code for {Area}, {State/Province}, {Country}? Our comprehensive database provides the accurate {Postal Code} postal code for {Area}, ensuring seamless mail delivery across {Country}. Whether you’re sending packages or letters, knowing the correct postal code for {Area} is essential for fast and reliable shipping. Explore our easy-to-use tool to find postal codes for any region in {State/Province}, {Country}, including {Postal Code} for {Area}. Save time and avoid delivery delays with our up-to-date postal code information. Search now to get the right {Postal Code} for your needs in {Country}!";

  const usaParagraph = "Need the ZIP code for {Area}, {State/Province}, {Country}? Our database provides the accurate {Postal Code} ZIP code for {Area}, ensuring fast and reliable mail delivery across {Country}. Whether you’re sending letters or packages, knowing the correct ZIP code for {Area} in {State/Province} is key to avoiding delays. Our tool makes it easy to find {Postal Code} and other ZIP codes in {Country}. Explore our comprehensive directory for {State/Province} and streamline your shipping process. Search now for precise ZIP codes in {Area}, {Country}!";

  let template = country === 'United States' ? usaParagraph : generalParagraph;
  return applyTemplate(template, values);
}

// Function to get FAQs based on country
function getFAQs(country, values) {
  const term = getTerm(country).toLowerCase();
  const generalFAQs = [
    {
      question: "What is the postal code for {Area}, {Country}?",
      answer: "The postal code for {Area}, {State/Province}, {Country} is {Postal Code}. This code ensures accurate mail delivery to {Area}, whether for urban or rural addresses. Use our reliable postal code finder to get the exact {Postal Code} for {Area}, {Country} and streamline your shipping process. Search now for precise postal codes!"
    },
    {
      question: "How can I find the correct postal code for {Area}, {State/Province}, {Country}?",
      answer: "To find the correct postal code for {Area}, {State/Province}, {Country}, use our user-friendly postal code tool. Enter {Area} to get the accurate {Postal Code}, ensuring seamless mail delivery across {Country}. Our database covers all regions in {State/Province}, so you can ship confidently. Try it now!"
    },
    {
      question: "Why is the postal code {Postal Code} important for mailing in {Area}, {Country}?",
      answer: "The postal code {Postal Code} is crucial for mailing in {Area}, {State/Province}, {Country} as it pinpoints the exact location for efficient delivery. It prevents delays and ensures packages reach {Area} correctly. Use our tool to verify {Postal Code} for {Area}, {Country} and simplify your logistics today!"
    }
  ];

  const usaFAQs = [
    {
      question: "What is the postal code for {Area}, {Country}?",
      answer: "The postal code for {Area}, {State/Province}, {Country} is {Postal Code}. Known as a ZIP code, it ensures efficient mail delivery to {Area}. Our tool provides the exact {Postal Code} for {Area}, {Country}, covering urban and rural areas. Search now for accurate postal codes!"
    },
    {
      question: "How can I find the correct postal code for {Area}, {State/Province}, {Country}?",
      answer: "To find the correct postal code for {Area}, {State/Province}, {Country}, use our intuitive postal code finder. Enter {Area} to get the precise {Postal Code} for reliable mailing across {Country}. Our database includes all {State/Province} regions for seamless delivery. Try it now!"
    },
    {
      question: "Why is the postal code {Postal Code} important for mailing in {Area}, {Country}?",
      answer: "The postal code {Postal Code} is essential for mailing in {Area}, {State/Province}, {Country} as it directs packages to the correct location, reducing delivery errors. Critical for both urban and rural {Area}, it ensures timely shipping. Verify {Postal Code} with our tool for hassle-free mailing!"
    }
  ];

  const faqs = country === 'United States' ? usaFAQs : generalFAQs;
  return faqs.map(faq => ({
    question: applyTemplate(faq.question, values),
    answer: applyTemplate(faq.answer, values)
  }));
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

  const country = data.postalCode.countryId.name;
  const values = {
    postalCode: data.postalCode.code,
    area: data.postalCode.area,
    state: data.postalCode.state,
    country: country,
  };

  const introParagraph = getIntroParagraph(country, values);
  const faqs = getFAQs(country, values);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-red-600 to-pink-500 mb-4">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-center text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            {data.postalCode.code} - {data.postalCode.area}, {data.postalCode.state}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-white">
            Postal code details for {data.postalCode.area} in {data.postalCode.state}, {country}
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
              <p className="text-gray-600">
                {introParagraph}
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

        {/* Purpose Section */}
        <Section title={`What Is the Purpose of Postal Code ${data.postalCode.code}?`}>
          <p className="text-gray-600">
            Postal code {data.postalCode.code} serves as a unique identifier for {data.postalCode.area} within {data.postalCode.state}, {country}. It is essential for efficient mail routing, digital mapping, and logistics.
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

        {/* Regions */}
        <Section title={`Regions in ${country}`}>
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

        {/* About Area */}
        <Section title={`About ${data.postalCode.area}`}>
          <p className="text-gray-600">
            {data.postalCode.area}, located in {data.postalCode.state}, is known for its unique blend of culture and development. Postal code {data.postalCode.code} spans homes, businesses, and landmarks.
          </p>
        </Section>

        {/* FAQs */}
        <Section title="Frequently Asked Questions">
          {faqs.map((faq, index) => (
            <FunctionItem
              key={index}
              title={`${index + 1}. ${faq.question}`}
              description={faq.answer}
            />
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
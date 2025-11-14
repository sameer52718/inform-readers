import Breadcrumb from "@/components/pages/specification/Breadcrumb";
import axiosInstance from "@/lib/axiosInstance";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata() {
  const host = (await headers()).get("host") || "informreaders.com";

  const title = "Software Hub – Explore Windows Software Categories & Downloads || Informreaders";
  const description =
    "Discover Windows software across categories like Browsers, Developers, Security, Internet Tools, Games, Multimedia and more. Browse popular software and explore detailed subcategories.";
  const canonicalUrl = `https://${host}/software`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: `https://${host}/website/assets/images/logo/logo.png`,
          width: 600,
          height: 600,
          alt: "Software Hub Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`https://${host}/website/assets/images/logo/logo.png`],
    },
  };
}

// 🔹 Fetch Subcategories
async function getSubCategories(category = "Windows") {
  try {
    const res = await axiosInstance.get(`/common/subCategory?category=${category}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return { error: true, subCategories: [] };
  }
}
async function getRandom() {
  try {
    const res = await axiosInstance.get(`/website/software/random`);
    return res.data;
  } catch (error) {
    console.error("Error fetching Softwares:", error);
    return { data: [] };
  }
}

// 🔹 Landing Page Component
export default async function SoftwareLandingPage() {
  const { subCategories } = await getSubCategories();
  const { data } = await getRandom();
  console.log(data);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Softwares & Games", href: "/software" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-red-600 to-pink-500 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Software Hub</h1>
        <p className="text-lg text-white/90">Explore software categories and subcategories for Windows.</p>
      </div>

      {/* Subcategories Section */}
      <div className="container mx-auto px-4 py-16">
        <Breadcrumb items={breadcrumbItems} />
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Software Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {subCategories.map((sub) => (
            <Link
              key={sub._id}
              href={`/software/${sub.slug}`}
              className="rounded-lg bg-white shadow-md hover:shadow-lg p-6 flex items-center justify-center font-medium text-gray-900 hover:text-red-600 transition"
            >
              {sub.name}
            </Link>
          ))}
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 my-6">Popular Software</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.map((software) => (
            <Link
              href={`/software/${software.subCategory.slug}/${software.slug}`}
              key={software._id}
              className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-red-100 transition-all duration-300"
            >
              <div className="p-6">
                <div className="bg-gray-50 p-4 rounded-xl mb-5 w-24 h-24 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <Image
                    src={software.logo}
                    alt={software.name}
                    width={64}
                    height={64}
                    className="rounded-lg object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-center mb-3 text-gray-900">{software.name}</h3>
                <p className="text-gray-600 text-center mb-4 line-clamp-2">{software.overview}</p>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <span className={`px-3 py-1 bg-red-50 text-red-600 text-sm rounded-full font-medium`}>
                    v{software.version}
                  </span>
                  {software.tag.slice(0, 2).map((t) => (
                    <span key={t} className="px-3 py-1 bg-gray-50 text-gray-700 text-sm rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

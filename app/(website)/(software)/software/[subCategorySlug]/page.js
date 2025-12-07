import axiosInstance from "@/lib/axiosInstance";
import { headers } from "next/headers";
import Breadcrumb from "@/components/pages/specification/Breadcrumb";
import Image from "next/image";
import Link from "next/link";
import { buildHreflangLinks } from "@/lib/hreflang";

// Fetch Software by Subcategory Slug
async function getSoftwareList(slug, page = 1, limit = 12, search = "") {
  try {
    const res = await axiosInstance.get(
      `/website/software?subCategoryslug=${slug}&page=${page}&limit=${limit}&search=${search}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching software list:", error);
    return { data: [], pagination: {} };
  }
}

// SEO Metadata
export async function generateMetadata({ params }) {
  const { subCategorySlug } = await params;
  const host = (await headers()).get("host") || "informreaders.com";

  const subCategory = subCategorySlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const alternates = buildHreflangLinks(`/software/${subCategorySlug}/`, host);

  const title = subCategory
    ? `${subCategory} Software Download Best Tools || Informreaders`
    : "Software Category – Informreaders";

  const description = subCategory
    ? `Explore and download software under the ${subCategory} category.`
    : "Explore software by category.";

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      images: [
        {
          url: `https://${host}/website/assets/images/logo/logo.png`,
          width: 600,
          height: 600,
        },
      ],
    },
  };
}

// PAGE COMPONENT
export default async function SoftwareCategoryPage({ params, searchParams }) {
  const { subCategorySlug } = await params;
  console.log(subCategorySlug);

  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const limit = 12;

  const response = await getSoftwareList(subCategorySlug, page, limit, search);
  const softwares = response.data || [];
  const pagination = response.pagination || {};
  console.log(softwares, pagination);

  const subCategory = subCategorySlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Softwares & Games", href: "/software" },
    { label: subCategory || "Category" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 via-red-600 to-pink-500 py-16 text-center">
        <h1 className="text-4xl font-bold text-white mb-3">{subCategory || "Software Category"}</h1>
        <p className="text-white/90">Browse the best software in this category.</p>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10">
        <Breadcrumb items={breadcrumbItems} />
        <form action="" method="GET" className="flex items-center gap-2 max-w-md mx-auto mt-6">
          <input
            type="text"
            name="search"
            placeholder="Search software..."
            defaultValue={searchParams.search || ""}
            className="flex-1 px-4 py-2 border outline-none border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          />

          <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Search
          </button>
        </form>
        {/* Software Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {softwares.length > 0 ? (
            softwares.map((software) => (
              <Link
                key={software._id}
                href={`/software/${subCategorySlug}/${software.slug}`}
                className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-red-100 transition-all"
              >
                <div className="p-6">
                  <div className="bg-gray-50 p-4 rounded-xl mb-4 w-24 h-24 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Image
                      src={software.logo}
                      alt={software.name}
                      width={64}
                      height={64}
                      className="object-contain rounded-lg"
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-center">{software.name}</h3>
                  <p className="text-gray-600 text-center mt-2 line-clamp-2">{software.overview}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full py-10">No software found.</p>
          )}
        </div>

        {/* PAGINATION */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center mt-10 gap-2 flex-wrap">
            {/* Previous Button */}
            {page > 1 && (
              <Link
                href={`?page=${page - 1}`}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
              >
                Previous
              </Link>
            )}

            {/* First Page */}
            {page > 2 && (
              <>
                <Link href={`?page=1`} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm">
                  1
                </Link>
                {page > 3 && <span className="px-2">...</span>}
              </>
            )}

            {/* Current Range — shows page-1, page, page+1 */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((p) => p === page || p === page - 1 || p === page + 1)
              .map((p) => (
                <Link
                  key={p}
                  href={`?page=${p}`}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    p === page ? "bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {p}
                </Link>
              ))}

            {/* Last Page */}
            {page < pagination.totalPages - 1 && (
              <>
                {page < pagination.totalPages - 2 && <span className="px-2">...</span>}
                <Link
                  href={`?page=${pagination.totalPages}`}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
                >
                  {pagination.totalPages}
                </Link>
              </>
            )}

            {/* Next Button */}
            {page < pagination.totalPages && (
              <Link
                href={`?page=${page + 1}`}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

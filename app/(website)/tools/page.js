import Breadcrumb from "@/components/pages/specification/Breadcrumb";
import { TOOL_CATEGORIES } from "@/constant/tools"; // Adjust path as needed
import { buildHreflangLinks } from "@/lib/hreflang";
import { headers } from "next/headers";
import Link from "next/link";

export async function generateMetadata() {
  const host = (await headers()).get("host") || "informreaders.com";
  const alternates = buildHreflangLinks(`/tools/`, host);
  return {
    title: "Free Online Tools to Simplify Your Business - Inform Readers",
    description:
      "Discover free online tools at Inform Readers to simplify your business tasks. From PDF and image tools to calculators, we make your life easier.",
    keywords: "free online tools, business tools, PDF tools, image tools, calculators, Inform Readers",
    alternates,
  };
}

export default function Home() {
  const getRandomTools = (count) => {
    const allTools = TOOL_CATEGORIES.flatMap(
      (category) => category.tools || category.subcategories?.flatMap((sub) => sub.tools) || []
    );
    const shuffled = allTools.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, allTools.length));
  };

  const popularTools = getRandomTools(20);
  const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Tools" }];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <section className="bg-gradient-to-b from-blue-50 to-white py-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          <span className="text-gray-900">Free Tools to Make</span>{" "}
          <span className="text-teal-600">Business Simple</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          We offer PDF, video, image, and other online tools to make your life easier
        </p>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOOL_CATEGORIES.map((category) => (
            <Link
              href={`/tools/${category.id}`}
              key={category.id}
              className={`p-6 rounded-xl shadow-lg text-white ${
                category.id === "image-tools"
                  ? "bg-orange-500"
                  : category.id === "pdf-tools"
                  ? "bg-purple-500"
                  : category.id === "calculators"
                  ? "bg-red-500"
                  : "bg-teal-500"
              }`}
            >
              <h3 className="text-xl text-white font-semibold">{category.name}</h3>
              <p className="mt-2 text-sm">Solve your {category.name.toLowerCase()} problems</p>
              <div className="mt-4">
                {(category.tools || []).slice(0, 1).map((tool) => (
                  <p key={tool.id} className="text-sm opacity-80">
                    Featured Tool: {tool.name}
                  </p>
                ))}
                {category.subcategories && category.subcategories[0]?.tools[0] && (
                  <p className="text-sm opacity-80">
                    Featured Tool: {category.subcategories[0].tools[0].name}
                  </p>
                )}
              </div>
              <p className="mt-4 text-sm font-medium">
                {(category.tools || []).length +
                  (category.subcategories?.reduce((sum, sub) => sum + sub.tools.length, 0) || 0)}{" "}
                + tools
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <h3 className="text-4xl font-bold text-teal-600">1m</h3>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-teal-600">10m</h3>
            <p className="text-gray-600">Files Converted</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-teal-600">200+</h3>
            <p className="text-gray-600">Online Tools</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-teal-600">500k</h3>
            <p className="text-gray-600">PDFs Created</p>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Our Most Popular Tools</h2>
        <p className="mt-2 text-gray-600">We present the best, all free, no catch</p>

        {/* Tool Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularTools.map((tool) => (
            <div key={tool.id} className="p-6 bg-white rounded-xl shadow-md flex items-center space-x-4">
              <span className="text-2xl">{tool.icon || "📝"}</span>
              <p className="text-gray-900 font-medium">{tool.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Share2 } from "lucide-react";
import { toast } from "react-toastify";

// Components
import ProductGallery from "@/components/pages/specification/ProductGallery";
import Loading from "@/components/ui/Loading";
import BiographyCard from "@/components/card/BiographyCard"; // Adjust path as needed

// Utils
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";

const ShareButton = ({ data }) => {
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${data.name} | Biography`,
          text: `Explore the biography of ${data.name}.`,
          url: typeof window !== "undefined" ? window.location.href : "",
        });
      } catch (error) {
        console.error("Error sharing:", error);
        toast.error("Error sharing the biography.");
      }
    } else {
      toast.error("Web Share API is not supported in this browser. Use the social links to share.");
    }
  };

  return (
    <button
      className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-red-600 hover:bg-red-200"
      onClick={handleNativeShare}
    >
      <Share2 className="h-4 w-4" />
      Share
    </button>
  );
};

export default function BiographyDetail() {
  const { slug } = useParams();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [related, setRelated] = useState([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/website/biography/${slug}`);
        if (!response.data.error) {
          setData(response?.data?.biography);
          setRelated(response?.data?.related || []);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  // Define sections and their corresponding keys
  const sections = [
    {
      title: "Personal Information",
      keys: [
        "Full Name",
        "Date of Birth",
        "Place of Birth",
        "Nationality",
        "Gender",
        "Marital Status",
        "Family Details",
        "Education",
        "Religion",
        "Nicknames/Aliases",
      ],
    },
    {
      title: "Professional Information",
      keys: [
        "Occupation/Profession",
        "Industry/Field",
        "Notable Works",
        "Career Start",
        "Major Achievements",
        "Awards and Honors",
        "Current Role/Position",
        "Past Roles/Positions",
        "Companies/Organizations Affiliated",
      ],
    },
    {
      title: "Net Worth and Assets",
      keys: [
        "Estimated Net Worth",
        "Income Sources",
        "Investments",
        "Properties",
        "Luxury Assets",
        "Philanthropic Contributions",
      ],
    },
    {
      title: "Physical Attributes",
      keys: [
        "Arms Size",
        "Body Type",
        "Breast Size/Bust Size",
        "Clothing Size",
        "Distinctive Features",
        "Eye Color",
        "Fitness Level",
        "Hair Color",
        "Health Conditions",
        "Height",
        "Hip Size",
        "Piercings",
        "Skin Tone",
        "Tattoos",
        "Voice Type",
        "Weight",
      ],
    },
    {
      title: "Personal Life",
      keys: [
        "Spouse/Partner",
        "Children",
        "Parents",
        "Siblings",
        "Hobbies/Interests",
        "Controversies",
        "Legal Issues",
        "Personal Quotes",
      ],
    },
    {
      title: "Career Milestones",
      keys: [
        "Breakthrough Moment",
        "Key Projects",
        "Collaborations",
        "Mentors/Influences",
        "Career Challenges",
        "Major Events/Tours",
      ],
    },
    {
      title: "Public Presence",
      keys: [
        "Social Media Handles",
        "Official Website",
        "Fan Base Size",
        "Media Appearances",
        "Public Speaking Engagements",
        "Press Coverage",
      ],
    },
    {
      title: "Achievements and Recognition",
      keys: ["Awards", "Nominations", "Certifications", "Rankings", "Honorary Degrees/Titles"],
    },
    {
      title: "Contributions and Impact",
      keys: [
        "Social Impact",
        "Charitable Work",
        "Political Involvement",
        "Cultural Influence",
        "Industry Innovations",
      ],
    },
    {
      title: "Additional Information",
      keys: [
        "Languages Spoken",
        "Books Written/About",
        "Documentaries/Films About",
        "Trivia/Fun Facts",
        "Legacy",
      ],
    },
  ];

  // Combine all specification arrays into a single map for lookup
  const specMap = {};
  if (data) {
    // Map personalInformation
    data.personalInformation?.forEach((spec) => {
      if (spec.name) {
        if (spec.name === "family details" && Array.isArray(spec.value)) {
          const family = spec.value[0];
          specMap["Family Details"] = Object.entries(family)
            .filter(([key]) => key !== "spouse") // Exclude spouse to avoid duplication
            .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
            .join(", ");
        } else if (spec.name === "education" && Array.isArray(spec.value)) {
          const education = spec.value[0];
          specMap["Education"] = Object.entries(education)
            .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
            .join(", ");
        } else if (spec.name === "nick name") {
          specMap["Nicknames/Aliases"] = spec.value || "---";
        } else {
          specMap[spec.name.charAt(0).toUpperCase() + spec.name.slice(1)] = spec.value || "---";
        }
      }
    });
    // Map professionalInformation
    data.professionalInformation?.forEach((spec) => {
      if (spec.name) {
        if (spec.name === "occupation") {
          specMap["Occupation/Profession"] = spec.value || "---";
        } else if (spec.name === "award and honours") {
          specMap["Awards and Honors"] = spec.value || "---";
        } else {
          specMap[spec.name.charAt(0).toUpperCase() + spec.name.slice(1)] = spec.value || "---";
        }
      }
    });
    // Map netWorthAndAssets
    data.netWorthAndAssets?.forEach((spec) => {
      if (spec.name) {
        if (spec.name === "income") {
          specMap["Income Sources"] = spec.value || "---";
        } else if (spec.name === "luxury assets") {
          specMap["Luxury Assets"] = spec.value || "---";
        } else {
          specMap[spec.name.charAt(0).toUpperCase() + spec.name.slice(1)] = spec.value || "---";
        }
      }
    });
    // Map physicalAttributes
    data.physicalAttributes?.forEach((spec) => {
      if (spec.name) {
        if (spec.name === "body measurements") {
          specMap["Body Type"] = spec.value || "---";
        } else {
          specMap[spec.name.charAt(0).toUpperCase() + spec.name.slice(1)] = spec.value || "---";
        }
      }
    });
    // Map additional fields not in response
    sections.forEach((section) => {
      section.keys.forEach((key) => {
        if (!specMap[key]) {
          specMap[key] = "---";
        }
      });
    });
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 pb-12">
      <Loading loading={isLoading}>
        {/* Biography Title */}
        <section className="mb-6 flex justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{data?.name}</h1>
          <ShareButton data={data || { name: "" }} />
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column - Product Gallery */}
          <div className="md:col-span-4">
            <ProductGallery images={[]} mainImage={data?.image} />
          </div>

          {/* Right Column - Biography Info */}
          <div className="md:col-span-8">
            {/* Biography Description */}
            {data?.description && (
              <div className="mb-6">
                <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 transition-all hover:shadow-md">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800">About {data.name}</h2>
                  <p className="text-gray-700">{data.description}</p>
                </div>
              </div>
            )}

            {/* Sections */}
            {sections.map((section) => {
              const sectionSpecs = section.keys.map((key) => ({
                name: key,
                value: specMap[key] || "---",
              }));

              return (
                <div key={section.title} className="mb-6">
                  <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 transition-all hover:shadow-md">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 capitalize">{section.title}</h2>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm text-gray-700">
                        <tbody>
                          {sectionSpecs.map((item, index) => (
                            <tr
                              key={index}
                              className="odd:bg-gray-50 even:bg-white border-b border-gray-100 last:border-0"
                            >
                              <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                              <td className="px-4 py-3">{item.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* FAQs Section */}
            <div id="faqs" className="pt-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                <p className="text-gray-500 text-center py-8">No FAQs available for this biography yet.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Biographies */}
        <div className="mt-16 space-y-6">
          <h2 className="text-2xl font-bold text-center mb-8">Related Biographies</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-full mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                  </div>
                ))}
            </div>
          ) : related.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 text-center text-gray-500">
              No related biographies available.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {related.map((biography) => (
                <BiographyCard
                  key={biography._id}
                  celebrity={biography}
                  category={biography.categoryName}
                  subCategory={biography.subCategoryName}
                  nationality={biography.nationality}
                />
              ))}
            </div>
          )}
        </div>
      </Loading>
    </div>
  );
}

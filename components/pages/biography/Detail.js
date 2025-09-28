"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Share2 } from "lucide-react";
import { toast } from "react-toastify";

// Components
import ProductGallery from "@/components/pages/specification/ProductGallery";
import Loading from "@/components/ui/Loading";
import BiographyCard from "@/components/shared/BiographyCard"; // Adjust path as needed

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
        const response = await axiosInstance.get(`/website/biography/detail/${slug}`);
        if (!response.data.error) {
          console.log(response.data);

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
        "Nick Name",
      ],
    },
    {
      title: "Professional Information",
      keys: [
        "Occupation",
        "industry",
        "Notable Works",
        "Carrer Start",
        "Major Achievements",
        "Awards and Honors",
        "Current Role",
        "Past Role",
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
        "Body Measurements",
        "Height",
        "Weight",
        "Shoe Size",
        "Arms Size",
        "Body Type",
        "Breast Size",
        "Clothing Size",
        "Distinctive Features",
        "Eye Color",
        "Fitness Level",
        "Hair Color",
        "Health Conditions",
        "Hip Size",
        "Piercings",
        "Skin Tone",
        "Tattoos",
        "Voice Type",
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

  // Initialize the specMap
  const specMap = {};

  // Helper function to normalize keys for comparison (lowercase, remove special chars)
  const normalizeKey = (str) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim();
  };

  // Helper function to title-case keys, preserving special characters
  const toTitleCase = (str) => {
    // Split by spaces or special characters like '/', keep delimiters
    const parts = str.split(/(\s+|\/)/);
    return parts
      .map((part) => {
        if (part.match(/^\s+$/) || part === "/") return part; // Preserve spaces and '/'
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      })
      .join("");
  };

  // Create a lookup map for section keys to their normalized forms
  const sectionKeyMap = {};
  sections.forEach((section) => {
    section.keys.forEach((key) => {
      sectionKeyMap[normalizeKey(key)] = key;
    });
  });

  if (data) {
    // Map personalInformation
    data.personalInformation?.forEach((spec) => {
      if (spec.name) {
        let key = spec.name.toLowerCase();
        let value = spec.value;
        if (key === "family details" && Array.isArray(spec.value)) {
          const family = spec.value[0];
          specMap["Family Details"] = Object.entries(family)
            .map(([k, v]) => `${toTitleCase(k)}: ${v}`)
            .join(", ");
          // Map individual family fields
          specMap["Spouse/Partner"] = family.spouse || "Update Soon When Available";
          specMap["Children"] = family.children || "Update Soon When Available";
          specMap["Parents"] = `${family.father || "Unknown"}, ${family.mother || "Unknown"}`;
          specMap["Siblings"] = family.siblings || "Update Soon When Available";
          specMap["Father"] = family.father || "Update Soon When Available";
          specMap["Mother"] = family.mother || "Update Soon When Available";
        } else if (key === "education" && Array.isArray(spec.value)) {
          const education = spec.value[0];
          specMap["Education"] = Object.entries(education)
            .map(([k, v]) => `${toTitleCase(k.replace(":", ""))}: ${v || "---"}`)
            .join(", ");
          specMap["School_college"] = education["school_college:"] || "Update Soon When Available";
          specMap["Educational_qualification"] =
            education["educational_qualification:"] || "Update Soon When Available";
        } else {
          // Find the matching section key by normalizing
          const normalizedKey = normalizeKey(key);
          const sectionKey = sectionKeyMap[normalizedKey] || toTitleCase(key);
          specMap[sectionKey] = value;
        }
      }
    });

    // Map professionalInformation
    data.professionalInformation?.forEach((spec) => {
      if (spec.name) {
        let key = spec.name.toLowerCase();
        let value = spec.value;
        const normalizedKey = normalizeKey(key);
        const sectionKey = sectionKeyMap[normalizedKey] || toTitleCase(key);
        specMap[sectionKey] = value;
      }
    });

    // Map netWorthAndAssets
    data.netWorthAndAssets?.forEach((spec) => {
      if (spec.name) {
        let key = spec.name.toLowerCase();
        let value = spec.value;
        const normalizedKey = normalizeKey(key);
        const sectionKey = sectionKeyMap[normalizedKey] || toTitleCase(key);
        specMap[sectionKey] = value;
      }
    });

    // Map physicalAttributes
    data.physicalAttributes?.forEach((spec) => {
      if (spec.name) {
        let key = spec.name.toLowerCase();
        let value = spec.value;
        const normalizedKey = normalizeKey(key);
        const sectionKey = sectionKeyMap[normalizedKey] || toTitleCase(key);
        specMap[sectionKey] = value;
      }
    });

    // Fill in missing fields from sections
    sections.forEach((section) => {
      section.keys.forEach((key) => {
        if (!specMap[key]) {
          specMap[key] = "Update Soon When Available";
        }
      });
    });
  }

  const getIntro = (bio) => {
    if (!bio) return "";

    // Safe getter with fallback
    const safe = (value, fallback = "Update Soon When Available") =>
      value && value !== "" ? value : fallback;

    const name = safe(bio.name);
    const nationality = safe(bio.nationality, "N/A");
    const occupation = safe(bio.occupation);
    const dob = safe(bio.dateOfBirth, "N/A");
    const pob = safe(bio.placeOfBirth, "N/A");
    const country = safe(bio.country, "N/A");
    const netWorth = safe(bio.netWorth);

    const templates = [
      `Unveil the remarkable story of ${name}, a distinguished ${nationality} ${occupation} born on ${dob} in ${pob}, ${country}. With an estimated net worth of ${netWorth}, ${name} has significantly shaped ${country}'s cultural and professional landscape.`,
      `${name}, an iconic ${nationality} ${occupation} from ${country}, was born on ${dob} in ${pob}. Boasting an estimated net worth of ${netWorth}, ${name} embodies both talent and determination.`,
      `Get to know ${name}, a celebrated ${nationality} ${occupation} born on ${dob} in ${pob}, ${country}. With an estimated net worth of ${netWorth}, ${name}'s journey is truly inspiring.`,
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 pb-12">
      <Loading loading={isLoading}>
        {/* Biography Title */}
        <section className="mb-6 flex justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{data?.name}</h1>
          <ShareButton data={data || { name: "" }} />
        </section>

        {data && (
          <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <p className="text-gray-700 text-lg leading-relaxed">{getIntro(data)}</p>
          </div>
        )}

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
                value: specMap[key] || "Update Soon When Available",
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
                {data ? (
                  <ul className="space-y-4 text-gray-700">
                    <li>
                      <strong>Who is {data.name}?</strong> <br />
                      {data.name} is a {data.nationality} {data.occupation} born on{" "}
                      {data.dateOfBirth || "N/A"} in {data.placeOfBirth || "N/A"}, {data.country || "N/A"}.
                    </li>
                    <li>
                      <strong>What is {data.name}'s net worth?</strong> <br />
                      Estimated net worth of {data.netWorth || "Update Soon When Available"}.
                    </li>
                    <li>
                      <strong>What is {data.name}'s height and weight?</strong> <br />
                      Height: {data.height || "N/A"}, Weight: {data.weight || "N/A"}.
                    </li>
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-8">No FAQs available for this biography yet.</p>
                )}
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
                  category={biography?.categoryId?.name}
                />
              ))}
            </div>
          )}
        </div>
      </Loading>
    </div>
  );
}

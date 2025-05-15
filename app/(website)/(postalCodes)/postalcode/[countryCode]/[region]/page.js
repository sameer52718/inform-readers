// File: app/postalcode/[countryCode]/[region]/page.tsx
import PostalLanding from "@/components/pages/postalcodes/PostalRegion";
import axiosInstance from "@/lib/axiosInstance";

// ✅ Server-side meta generation
export async function generateMetadata({ params }) {
  const { countryCode, region } = params;

  try {
    const { data } = await axiosInstance.get("/website/postalCode", {
      params: { countryCode: countryCode, region },
    });

    if (!data.error) {
      return {
        title: `Postal Codes in ${data.data.country?.name} - ${region}`,
        description: `Explore postal code information for ${region}, ${data.data.country?.name}. Search cities, towns, and ZIP codes.`,
      };
    }
  } catch (error) {
    console.error("Metadata fetch error:", error);
  }

  // fallback meta
  return {
    title: "Postal Codes Directory",
    description: "Explore regional postal codes, cities, and locations.",
  };
}

export default function Page() {
  return <PostalLanding />;
}

// app/bike/[id]/page.jsx (or wherever your route is)
import ProductGallery from "@/components/pages/specification/ProductGallery";
import VehicleCard from "@/components/vehicle/vehicleCard";
import ShareButton from "../components/Sharebutton";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { notFound } from "next/navigation";

// ✅ Generate Metadata for SEO
export async function generateMetadata({ params }) {
  try {
    const { id } = params;
    const response = await axiosInstance.get(`/website/bike/${id}`);
    const data = response?.data?.data;

    if (!data) return { title: "Bike Not Found | InformReaders" };

    return {
      title: `${data.name} - Specifications & Details | Inform Readers`,
      description: data?.description || `Explore detailed specifications for ${data.name}.`,
    };
  } catch (error) {
    return { title: "Bike Details | InformReaders" };
  }
}

// ✅ Fetch data on the server
async function fetchBikeData(id) {
  try {
    const response = await axiosInstance.get(`/website/bike/${id}`);
    if (response.data.error) return null;
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export default async function SpecificationDetail({ params }) {
  const { id } = params;
  const result = await fetchBikeData(id);

  if (!result?.data) return notFound();

  const data = result.data;
  const related = result.related || [];

  const sections = [
    {
      title: "General Information",
      keys: [
        "body type",
        "bike category",
        "seating capacity",
        "length",
        "width",
        "height",
        "wheelbase",
        "ground clearance",
        "dry weight",
        "fuel tank capacity",
        "battery capacity",
        "curb weight",
        "seat height",
        "charging time",
        "battery type",
        "starting system",
      ],
    },
    {
      title: "Engine Specifications",
      keys: [
        "powertrain architecture",
        "fuel type",
        "Engine Type",
        "engine displacement",
        "power",
        "torque",
        "bore x stroke",
        "engine size",
        "compression",
        "fuel system",
        "engine cooling",
        "engine oil capacity",
        "Battery Voltage (Electric)",
        "Motor Power (Electric)",
        "Electric Start",
        "gearbox",
      ],
    },
    { title: "Performance", keys: ["top speed", "acceleration 0 - 100 km/h", "weight to power ratio", "weight to torque ratio"] },
    { title: "Fuel Economy and Emissions (ICE)", keys: ["fuel consumption", "co", "emission standard"] },
    { title: "Drivetrain and Transmission", keys: ["drivetrain architecture", "drive wheel", "transmission type", "clutch type"] },
    {
      title: "Suspension and Brakes",
      keys: ["front suspension", "rear suspension", "Front brakes", "front brakes", "rear brakes", "abs", "traction control"],
    },
    { title: "Steering and Tires", keys: ["steering type", "driveline", "front tire size", "rear tire size", "wheel type", "wheel size"] },
    { title: "Additional Features", keys: ["frame type", "Instrument Cluster", "Features", "headlight", "Storage"] },
  ];

  const specMap = {};
  [...(data.technicalSpecs || []), ...(data.featureAndSafety || []), ...(data.evsFeatures || [])].forEach((spec) => {
    if (spec.name) specMap[spec.name] = spec.value || "---";
  });

  return (
    <div className="container mx-auto px-4 lg:px-8 pb-12">
      {/* Product Title */}
      <section className="mb-6 flex justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{data?.name}</h1>
        {/* Share button stays a client component */}
        <ShareButton data={data} />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column - Product Gallery */}
        <div className="md:col-span-4">
          <ProductGallery images={[]} mainImage={data?.image} />
        </div>

        {/* Right Column - Specifications */}
        <div className="md:col-span-8">
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
                          <tr key={index} className="odd:bg-gray-50 even:bg-white border-b border-gray-100 last:border-0">
                            <td className="px-4 py-3 font-medium capitalize text-gray-900">{item.name}</td>
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
              <p className="text-gray-500 text-center py-8">No FAQs available for this product yet.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Vehicles */}
      <div className="mt-16 space-y-6">
        <h2 className="text-2xl font-bold text-center mb-8">Related Vehicles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {related.length > 0 ? (
            related.map((vehicle) => <VehicleCard vehicle={vehicle} key={vehicle?._id} type="bikes" />)
          ) : (
            <p className="text-gray-500 text-center col-span-full">No related vehicles found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// Components
import ProductGallery from "@/components/pages/specification/ProductGallery";
import Loading from "@/components/ui/Loading";
import VehicleCard from "@/components/vehicle/vehicleCard";

// Utils
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { Share2 } from "lucide-react";
import { toast } from "react-toastify";

const ShareButton = ({ data }) => {
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${data.name} | Specification Info`,
          text: `Explore Specification of ${data.name}.`,
          url: typeof window !== "undefined" ? window.location.href : "",
        });
      } catch (error) {
        console.error("Error sharing:", error);
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

export default function SpecificationDetail() {
  const { id } = useParams();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [related, setRelated] = useState([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/website/bike/${id}`);
        if (!response.data.error) {
          setData(response?.data?.data);
          setRelated(response?.data?.related || []);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Define the sections and their corresponding keys in the data
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
    {
      title: "Performance",
      keys: ["top speed", "acceleration 0 - 100 km/h", "weight to power ratio", "weight to torque ratio"],
    },
    {
      title: "Fuel Economy and Emissions (ICE)",
      keys: ["fuel consumption", "co", "emission standard"],
    },
    {
      title: "Drivetrain and Transmission",
      keys: ["drivetrain architecture", "drive wheel", "transmission type", "clutch type"],
    },
    {
      title: "Suspension and Brakes",
      keys: [
        "front suspension",
        "rear suspension",
        "Front brakes",
        "front brakes",
        "rear brakes",
        "abs",
        "traction control",
      ],
    },
    {
      title: "Steering and Tires",
      keys: ["steering type", "driveline", "front tire size", "rear tire size", "wheel type", "wheel size"],
    },
    {
      title: "Additional Features",
      keys: ["frame type", "Instrument Cluster", "Features", "headlight", "Storage"],
    },
  ];

  // Combine all specification arrays into a single map for lookup
  const specMap = {};
  if (data) {
    [...(data.technicalSpecs || []), ...(data.featureAndSafety || []), ...(data.evsFeatures || [])].forEach(
      (spec) => {
        if (spec.name) {
          specMap[spec.name] = spec.value || "---";
        }
      }
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 pb-12">
      <Loading loading={isLoading}>
        {/* Product Title */}
        <section className="mb-6 flex justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{data?.name}</h1>
          <ShareButton data={data} />
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column - Product Gallery */}
          <div className="md:col-span-4">
            <ProductGallery images={[]} mainImage={data?.image} />
          </div>

          {/* Middle Column - Product Info */}
          <div className="md:col-span-8">
            {/* Specifications Section */}
            {sections.map((section) => {
              // Filter specs that exist in the data for this section
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
                              <td className="px-4 py-3 font-medium capitalize text-gray-900">{item.name}</td>
                              <td className="px-4 py-3">{item.value || "---"}</td>
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
        <div className="mt-16 space-y-6">
          <h2 className="text-2xl font-bold text-center mb-8">Related Vehicles</h2>
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {related.map((vehicle) => (
                <VehicleCard vehicle={vehicle} key={vehicle?._id} type="bikes" />
              ))}
            </div>
          )}
        </div>
      </Loading>
    </div>
  );
}

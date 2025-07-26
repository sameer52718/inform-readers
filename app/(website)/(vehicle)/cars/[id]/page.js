"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Car, Fuel, Gauge, Wrench, Shield, Battery, ChevronLeft, Share2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import VehicleCard from "@/components/vehicle/vehicleCard";
import ProductGallery from "@/components/pages/specification/ProductGallery";

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

export default function VehicleDetailPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axiosInstance.get(`/website/vehicle/${id}`, {
          signal: controller.signal,
        });
        setData(data);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchData();

    return () => controller.abort();
  }, [id]);

  // Define the sections and their corresponding keys in the desired order
  const sections = [
    {
      title: "General Information",
      icon: Car,
      keys: [
        "Body Type",
        "Seats",
        "Doors",
        "Length",
        "Width",
        "Height",
        "Wheelbase",
        "Front Track",
        "Rear Track",
        "Kerb Weight",
        "Max Weight",
        "Max Load",
        "Trunk (Boot) Space - Minimum",
        "Trunk (Boot) Space - Maximum",
        "Fuel Tank Capacity",
      ],
    },
    {
      title: "Engine Specifications",
      icon: Wrench,
      keys: [
        "Powertrain Architecture",
        "Fuel Type",
        "Engine displacement",
        "Power",
        "Power per litre",
        "Torque",
        "Engine layout",
        "Engine Model/Code",
        "Number of cylinders",
        "Engine configuration",
        "Cylinder Bore",
        "Piston Stroke",
        "Number of valves per cylinder",
        "Fuel injection system",
        "Engine aspiration",
        "Engine oil capacity",
        "Coolant",
      ],
    },
    {
      title: "Performance",
      icon: Gauge,
      keys: [
        "Acceleration 0 - 100 km/h",
        "Acceleration 0 - 62 mph",
        "Acceleration 0 - 60 mph (Calculated by Auto-Data.net)",
        "Maximum speed",
        "Weight-to-power ratio",
        "Weight-to-torque ratio",
      ],
    },
    {
      title: "Fuel Economy and Emissions",
      icon: Fuel,
      keys: [
        "Fuel consumption (economy) - urban",
        "Fuel consumption (economy) - extra urban",
        "Fuel consumption (economy) - combined",
        "CO",
        "Emission standard",
      ],
    },
    {
      title: "Drivetrain and Transmission",
      icon: Car,
      keys: [
        "Drivetrain Architecture",
        "Drive wheel",
        "Number of gears and type of gearbox",
        "Minimum turning circle (turning diameter)",
      ],
    },
    {
      title: "Suspension and Brakes",
      icon: Wrench,
      keys: ["Front suspension", "Rear suspension", "Front brakes", "Rear brakes"],
    },
    {
      title: "Steering and Tires",
      icon: Car,
      keys: ["Steering type", "Power steering", "Tires size", "Wheel rims size"],
    },
  ];

  // Combine all specification arrays into a single map for lookup
  const specMap = {};
  if (data?.data) {
    [
      ...(data.data.technicalSpecs || []),
      ...(data.data.featureAndSafety || []),
      ...(data.data.evsFeatures || []),
    ].forEach((spec) => {
      if (spec.name) {
        specMap[spec.name] = spec.value || spec.value === "" ? spec.value : "---";
      }
    });
  }

  const renderSpecSection = (title, icon, specs) => {
    const Icon = icon;
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 transition-all hover:shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <Icon className="h-6 w-6 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm text-gray-700">
            <tbody>
              {specs.map((spec, index) => (
                <tr
                  key={spec.name}
                  className="odd:bg-gray-50 even:bg-white border-b border-gray-100 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{spec.name}</td>
                  <td className="px-4 py-3">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}

      <div className="container mx-auto px-4 py-8">
        <section className="mb-6 flex justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{data?.data?.name}</h1>
          <ShareButton data={data} />
        </section>
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vehicle Image */}
          <div className="lg:col-span-1">
            {isLoading && !data?.data.image ? (
              <div className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
                <div className="w-full h-64 bg-gray-200 rounded-lg mx-auto" />
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <Image
                  src={data?.data?.image || null}
                  alt={data?.data?.name || ""}
                  width={400}
                  height={300}
                  className="rounded-lg w-full h-auto object-cover"
                />
              </div>
            )}
          </div>

          {/* Technical Specs & Features */}
          <div className="lg:col-span-2 space-y-6">
            {isLoading ? (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-gray-700">
                      <tbody>
                        {Array(6)
                          .fill(0)
                          .map((_, i) => (
                            <tr
                              key={i}
                              className="odd:bg-gray-50 even:bg-white border-b border-gray-100 last:border-0"
                            >
                              <td className="px-4 py-3">
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                              </td>
                              <td className="px-4 py-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {sections.map((section) => {
                  // Filter specs that exist in the data for this section
                  const sectionSpecs = section.keys.map((key) => ({
                    name: key,
                    value: specMap[key] || "---",
                  }));

                  return renderSpecSection(section.title, section.icon, sectionSpecs);
                })}
              </>
            )}
          </div>
        </div>

        {/* Related Vehicles Section */}
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
              {data?.related.map((vehicle) => (
                <VehicleCard vehicle={vehicle} key={vehicle?._id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

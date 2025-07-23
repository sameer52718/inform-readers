"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Car, Fuel, Gauge, Wrench, Shield, Battery, ChevronLeft } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";
import handleError from "@/lib/handleError";
import VehicleCard from "@/components/vehicle/vehicleCard";

const quickStats = [
  {
    icon: Fuel,
    value: "6.5 l/100 km",
    label: "Combined Fuel Economy",
  },
  {
    icon: Gauge,
    value: "205 km/h",
    label: "Max Speed",
  },
  {
    icon: Wrench,
    value: "135 Hp",
    label: "Power",
  },
];

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
        const { data } = await axiosInstance.get(`/website/bike/${id}`, {
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

  const renderSpecSection = (title, icon, specs) => {
    const Icon = icon;
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Icon className="h-6 w-6 text-red-500" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {specs?.map((spec) =>
            spec.value && spec.value.trim() !== "" ? (
              <div key={spec._id} className="flex flex-col">
                <span className="text-sm text-gray-500">{spec.name}</span>
                <span className="text-gray-800">{spec.value}</span>
              </div>
            ) : null
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-red-600 to-pink-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white hover:text-gray-200 mb-6"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Vehicles
          </button>
          <div className="text-center">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-white/20 rounded w-1/2 mx-auto mb-4" />
                <div className="h-4 bg-white/20 rounded w-1/4 mx-auto mb-8" />
              </div>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{data?.data.name}</h1>
                <p className="text-xl text-red-100 mb-8">
                  {data?.data.makeId.name} - {data?.data.year}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array(6)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex flex-col">
                          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {renderSpecSection("Technical Specifications", Car, data?.data.technicalSpecs)}
                {renderSpecSection("Features & Safety", Shield, data?.data.featureAndSafety)}
                {renderSpecSection("EV Features", Battery, data?.data.evsFeatures)}
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
                <VehicleCard vehicle={vehicle} key={vehicle?._id} type="bikes" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

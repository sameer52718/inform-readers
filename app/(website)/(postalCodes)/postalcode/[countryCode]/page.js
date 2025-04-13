"use client";

import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { Globe2, MapPin, Search, Navigation } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function RegionPortalCode() {
  const { countryCode } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get("/website/postalCode/region", { params: { countryCode } });
        if (!data.error) {
          setData(data.data);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();

    return () => {
      setIsLoading(true);
      setData(null);
    };
  }, [countryCode]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-center text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
            Postal Codes in {data?.country?.name}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-gray-600">
            Find postal codes for any location in {data?.country?.name}. Browse by region or search on the
            interactive map.
          </p>
        </div>
      </div>

      {/* Countries in Continent Section */}
      <div className="container mx-auto px-4 py-12 bg-white rounded-3xl mb-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {console.log(data.country)}
            Countries in {data?.country?.continent}
          </h2>
          <div className="flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-red-600" />
            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
              {data?.otherCountriesInContinent?.length} Countries
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data?.otherCountriesInContinent?.length ? (
            data?.otherCountriesInContinent?.map((country) => (
              <Link
                key={country._id}
                href={`/postalcode/${country.countryCode}`}
                className="group transform rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                    <Image src={country.flag} alt={`${country.name} flag`} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-red-600">{country.name}</p>
                    <p className="text-sm text-gray-500">Code: {country.countryCode.toUpperCase()}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-600 col-span-full text-center">
              No other countries found in this Continent.
            </p>
          )}
        </div>
      </div>

      {/* Regions Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Regions in {data?.country?.name}</h2>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-600" />
              <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
                {data?.regions?.length} Regions
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data?.regions?.length ? (
              data?.regions?.map((region) => (
                <Link
                  href={`/postalcode/${countryCode}/${region}`}
                  key={region}
                  className="flex transform items-center rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                >
                  <div className="mr-4 rounded-full bg-red-100 p-2">
                    <Navigation className="h-5 w-5 text-red-600" />
                  </div>
                  <span className="font-medium text-gray-900">{region}</span>
                </Link>
              ))
            ) : (
              <p className="text-gray-600 col-span-full text-center">
                No regions available for this country.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Find by Map</h2>
          <p className="mt-4 text-gray-600">Click on any location on the map to find its postal code</p>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207371.97120804548!2d67.93024777321424!3d34.51999098040327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d16f3c60297c73%3A0x2050b87c5fbf04!2sKabul%2C%20Afghanistan!5e0!3m2!1sen!2s!4v1647887777777!5m2!1sen!2s"
            width="100%"
            height="600"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}

export default RegionPortalCode;

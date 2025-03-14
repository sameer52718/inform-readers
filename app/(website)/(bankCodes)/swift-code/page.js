"use client";
import AdBanner from "@/components/partials/AdBanner";
import HoverBanner from "@/components/partials/HoverBanner";
import WeatherFilter from "@/components/partials/WeatherFilter";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function PostalCode() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axiosInstance.get("/common/country", { params: { groupCountry: true } });
        if (!data.error) {
          setData(data.response.groupCountry);
        }
      } catch (error) {
        handleError(error);
      }
    };
    getData();
  }, []);

  return (
    <div>
      <AdBanner />
      <div className="container mx-auto md:px-44 px-4 py-8">
        <WeatherFilter />

        <h4 className="md:text-4xl text-2xl font-bold my-7 text-center">
          World <span className="text-red-500"> Zip/postal </span> Codes
        </h4>

        {data?.map((item) => (
          <div key={item._id}>
            <h6 className="md:text-2xl text-xl font-semibold mb-3 px-2">{item._id}:</h6>

            <div className="bg-gray-200 flex items-start px-3 flex-wrap gap-3 rounded-3xl py-6">
              {item?.countries?.map((country) => (
                <Link href={`/swift-code/${country.countryCode}`} key={country.countryCode}>
                  <div className="bg-white px-4 py-2 rounded-2xl flex items-center gap-2">
                    <Image
                      src={country.flag}
                      width={500}
                      height={500}
                      alt="country"
                      className="h-auto w-10"
                    />
                    {country.name}
                  </div>
                </Link>
              ))}
            </div>
            <div className="py-8">
              <HoverBanner />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostalCode;

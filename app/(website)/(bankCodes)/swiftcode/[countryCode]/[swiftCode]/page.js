"use client";

import AdBanner from "@/components/partials/AdBanner";
import HoverBanner from "@/components/partials/HoverBanner";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function LocationTable({ data = [] }) {
  const { countryCode } = useParams();
  return (
    <div className="p-3 border border-black bg-gray-300 rounded-lg w-full overflow-x-auto">
      <table className="w-full min-w-max border-collapse">
        <thead>
          <tr className="bg-red-500 text-white text-sm sm:text-base">
            <th className="p-2 text-left">Bank</th>
            <th className="p-2 text-left">City</th>
            <th className="p-2 text-left">Branch</th>
            <th className="p-2 text-left">Swift Code</th>
          </tr>
        </thead>
        <tbody className="bg-gray-300 text-sm sm:text-base">
          {data.length > 0 ? (
            data.map((code, index) => (
              <tr key={index} className="even:bg-gray-200">
                <td className="p-2">{code?.bank}</td>
                <td className="p-2">{code?.city}</td>
                <td className="p-2">{code?.branch || "---"}</td>
                <td className="p-2 text-red-500 font-bold underline">
                  <Link href={`/swiftcode/${countryCode}/${code?.swiftCode}`}>{code?.swiftCode}</Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-600">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function PostalCodeDetail() {
  const { swiftCode } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get(`/website/bankCode/${swiftCode}`);
        if (!data.error) {
          setData(data.bankCodes);
          setRelated(data.related);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [swiftCode]);

  console.log(data);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AdBanner />
      <div className="container mx-auto  py-8">
        <h4 className="md:text-4xl text-2xl font-bold my-7 text-center">Bank Swift Code</h4>

        <HoverBanner />

        <div className="mt-8 flex flex-col sm:flex-row items-center sm:justify-between bg-red-600  px-4 sm:px-6 py-3 text-sm font-bold mb-8 rounded-lg">
          {/* Title */}
          <h5 className="text-xl sm:text-3xl text-center sm:text-left mb-3 sm:mb-0 text-white">
            Detailed information about SWIFT code {swiftCode}
          </h5>
        </div>

        <div className="bg-gray-300 rounded-lg p-4 w-full">
          <div className={`grid grid-cols-1 sm:grid-cols-5 bg-white p-2 rounded-lg mb-1`}>
            <span className="font-bold text-lg sm:text-xl col-span-3">SWIFT Code</span>
            <span className=" sm:text-xl  col-span-2">{data?.swiftCode}</span>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-5 bg-white p-2 rounded-lg mb-1`}>
            <span className="font-bold text-lg sm:text-xl col-span-3">Bank</span>
            <span className=" sm:text-xl  col-span-2">{data?.bank}</span>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-5 bg-white p-2 rounded-lg mb-1`}>
            <span className="font-bold text-lg sm:text-xl col-span-3">Branch</span>
            <span className=" sm:text-xl  col-span-2">{data?.branch}</span>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-5 bg-white p-2 rounded-lg mb-1`}>
            <span className="font-bold text-lg sm:text-xl col-span-3">Country</span>
            <span className=" sm:text-xl  col-span-2">{data?.countryId?.name}</span>
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-5 bg-white p-2 rounded-lg mb-1`}>
            <span className="font-bold text-lg sm:text-xl col-span-3">City</span>
            <span className=" sm:text-xl  col-span-2">{data?.city}</span>
          </div>
        </div>
        <div className="my-6">
          <HoverBanner />
        </div>

        <div className="mb-5 py-5">
          <h6 className="text-3xl font-semibold mb-3 px-2">Related Bank Branch</h6>
          <LocationTable data={related} />
        </div>
        <HoverBanner />
      </div>
    </div>
  );
}

export default PostalCodeDetail;

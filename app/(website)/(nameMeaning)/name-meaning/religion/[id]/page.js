"use client";

import AdBanner from "@/components/partials/AdBanner";
import HoverBanner from "@/components/partials/HoverBanner";
import NameFilter from "@/components/partials/NameFilter";
import NamePagination from "@/components/ui/NamePagination";
import Pagination from "@/components/ui/Pagination.js";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const GenderWiseTable = () => {
  const { id } = useParams();

  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 25,
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLetter, setInitialLetter] = useState("A");

  const getData = async (loading = true, page = 1, initialLetter = "A") => {
    try {
      setLoading(loading);
      const { data } = await axiosInstance.get("/website/name", {
        params: { initialLetter, page, limit: 50, categoryId: id },
      });
      if (!data.error) {
        setData(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = async (page) => {
    getData(true, page, initialLetter);
  };

  const onInitialChange = async (initialLetter) => {
    setInitialLetter(initialLetter);

    getData(true, 1, initialLetter);
  };

  useEffect(() => {
    getData();
  }, [id]);
  // console.log(pagination);

  return (
    <div className=" py-8">
      <div>
        <h5 className="text-xl font-semibold ">Browse Names by Alphabets</h5>
        <div className="mt-4">
          <NamePagination totalPages={26} currentPage={initialLetter} onPageChange={onInitialChange} />

          {/* Table for names, meaning, and details */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-red-600 text-white rounded-lg mt-3">
              <thead>
                <tr>
                  <th className="py-3 md:text-2xl text-base font-semibold border-b-2">Names</th>
                  <th className="py-3 md:text-2xl text-base font-semibold border-b-2">Meaning</th>
                  <th className="py-3 md:text-2xl text-base font-semibold border-b-2 text-center">Details</th>
                </tr>
              </thead>
              <tbody className="bg-[#d9d9d9]">
                {data.map((item, index) => (
                  <tr key={index} className="border-b-2">
                    <td className="py-4 md:text-xl text-sm px-3 text-black-500 font-semibold">
                      {item?.name}
                    </td>
                    <td className="py-4 md:text-xl text-sm px-3 text-black-500 font-semibold">
                      {item?.shortMeaning || "---"}
                    </td>
                    <td className="py-4 md:text-xl text-sm px-3 text-black font-semibold text-center">
                      <Link href={"/name-meaning/1"} className="underline text-red-500">
                        View Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            {!loading && data.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function NameMeaning() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axiosInstance.get("/common/category", { params: { type: "Name" } });
        if (!data.error) {
          setData(data.categories || []);
        }
      } catch (error) {
        handleError(error);
      }
    };
    getData();
  }, []);

  return (
    <div className="container mx-auto">
      <AdBanner />

      <div className=" py-8">
        <NameFilter />

        <div className="mt-8">
          <h4 className="font-semibold text-2xl">Search Baby Names By Religion:</h4>

          <div className="bg-[#D9d9d9] md:p-5 rounded-xl border border-black mt-2 px-2 sm:px-12 md:gap-3 gap-2 py-4 flex flex-wrap">
            {data.map((item, index) => (
              <Link
                key={index}
                href={`/name-meaning/religion/${item._id}`}
                className="bg-white md:py-4 p-3 md:px-6 w-fit md:text-xl text-sm font-semibold rounded-2xl mb-3 sm:mb-0"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className=" py-8">
        <HoverBanner />
      </div>

      <GenderWiseTable />

      <div className=" py-8">
        <HoverBanner />
      </div>
    </div>
  );
}

export default NameMeaning;

"use client";

import AdBanner from "@/components/partials/AdBanner";
import React, { useEffect, useState } from "react";
import NameFilter from "@/components/partials/NameFilter";
import Link from "next/link";
import HoverBanner from "@/components/partials/HoverBanner";
import { Icon } from "@iconify/react";
import { useParams } from "next/navigation";
import handleError from "@/lib/handleError";
import axiosInstance from "@/lib/axiosInstance";
import Loading from "@/components/ui/Loading";

function NameDetail() {
  const { slug } = useParams();
  const [data, setData] = useState([]);
  const [name, setName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get(`/website/name/${slug}`);
        if (!data.error) {
          setName(data.data);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData(data);
  }, [slug]);

  return (
    <Loading loading={isLoading}>
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

        <div className=" py-8">
          <h5 className="text-2xl font-semibold ">{name?.name} Name Meaning</h5>
          <p>{name?.longMeaning}</p>

          <div className=" mt-8 flex items-center justify-between bg-red-600 text-white md:px-6 px-2 py-3 text-sm font-bold mb-8">
            <h5 className="ml-2 md:text-3xl text-base">Meaning of {name?.name} Name:</h5>
            <div className="flex items-center space-x-2 mr-2">
              <Link href={"#"}>
                <Icon
                  icon="ic:baseline-share"
                  width="24"
                  height="24"
                  className="md:w-8 w-5 h-8 cursor-pointer"
                />
              </Link>
              <Link href={"#"}>
                <Icon
                  icon="logos:whatsapp-icon"
                  width="24"
                  height="24"
                  className="md:w-8 w-5 h-8 cursor-pointer"
                />
              </Link>
              <Link href={"#"}>
                <Icon
                  icon="skill-icons:instagram"
                  width="24"
                  height="24"
                  className="md:w-8 w-5 h-8 cursor-pointer"
                />
              </Link>
              <Link href={"#"}>
                <Icon
                  icon="logos:facebook"
                  width="15"
                  height="15"
                  className="md:w-8 w-5 h-8 cursor-pointer"
                />
              </Link>
              <Link href={"#"}>
                <Icon
                  icon="devicon:linkedin"
                  width="24"
                  height="24"
                  className="md:w-8 w-5 h-8 cursor-pointer"
                />
              </Link>
              <Link href={"#"}>
                <Icon icon="logos:twitter" width="24" height="24" className="md:w-8 w-5 h-8 cursor-pointer" />
              </Link>
            </div>
          </div>

          <div>
            <div className="border rounded-lg overflow-hidden bg-gray-300 p-2">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="bg-white text-xl font-semibold px-3 py-2 text-left">Attribute</th>
                    <th className="bg-white text-xl font-semibold px-3 py-2 text-left">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Row - Name */}
                  <tr>
                    <td className="bg-white text-xl font-semibold px-3 py-2">Name</td>
                    <td className="bg-white text-xl font-semibold px-3 py-2">{name?.name}</td>
                  </tr>

                  {/* Row - Meaning */}
                  <tr>
                    <td className="bg-white text-xl font-semibold px-3 py-2">Meaning</td>
                    <td className="bg-white text-xl font-semibold px-3 py-2">{name?.shortMeaning}</td>
                  </tr>

                  {/* Row - Gender */}
                  <tr>
                    <td className="bg-white text-xl font-semibold px-3 py-2">Gender</td>
                    <td className="bg-white text-xl font-semibold px-3 py-2">{name?.gender}</td>
                  </tr>

                  {/* Row - Origin */}
                  <tr>
                    <td className="bg-white text-xl font-semibold px-3 py-2">Origin</td>
                    <td className="bg-white text-xl font-semibold px-3 py-2">{name?.origion || "---"}</td>
                  </tr>

                  {/* Row - Religion */}
                  <tr>
                    <td className="bg-white text-xl font-semibold px-3 py-2">Religion</td>
                    <td className="bg-white text-xl font-semibold px-3 py-2">{name?.religionId?.name}</td>
                  </tr>

                  {/* Row - Short Name */}
                  <tr>
                    <td className="bg-white text-xl font-semibold px-3 py-2">Short Name</td>
                    <td className="bg-white text-xl font-semibold px-3 py-2">{name?.shortName}</td>
                  </tr>

                  {/* Row - Length of Name */}
                  <tr>
                    <td className="bg-white text-xl font-semibold px-3 py-2">Length of Name</td>
                    <td className="bg-white text-xl font-semibold px-3 py-2">{name?.nameLength} Letters</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className=" py-8">
          <HoverBanner />
        </div>

        <div className=" py-8">
          <h4 className="text-xl sm:text-2xl  font-semibold my-5">FAQs About The Name</h4>

          <h4 className="text-xl sm:text-2xl  font-semibold my-5">What is the Meaning of {name?.name}?</h4>

          <p className="text-base sm:text-lg  font-semibold">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p>

          <h4 className="text-xl sm:text-2xl  font-semibold my-5">
            What is the name length of {name?.name}?
          </h4>

          <p className="text-base sm:text-lg  font-semibold">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p>

          <h4 className="text-xl sm:text-2xl  font-semibold my-5">
            What is the lucky number of {name?.name}?
          </h4>

          <p className="text-base sm:text-lg  font-semibold">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
          </p>
        </div>

        <div className=" py-8">
          <HoverBanner />
        </div>
      </div>
    </Loading>
  );
}

export default NameDetail;

import formatDate from "@/lib/formatDate";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
export default function SpecificationCard({ item }) {
  return (
    <div className="bg-[#d9d9d9] px-4 pt-4 rounded-xl w-full my-4 shadow-md">
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Image Section */}
        <div className="w-full flex justify-center md:justify-start">
          <Image
            src={item?.image}
            alt={item?.name}
            width={1000}
            height={1000}
            className="rounded-lg w-full max-w-[250px] h-60 object-cover"
          />
        </div>

        {/* Text Section */}
        <div className="md:col-span-2">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-600 underline">
            <Link href={"#"}>{item?.name}</Link>
          </h2>

          {item?.data?.generalSpecs && item?.data?.generalSpecs.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6">
              {item?.data?.generalSpecs.slice(0, 4).map((spec, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Icon icon={"ic:baseline-play-arrow"} className="flex-none" />
                  <span className="text-gray-600 text-sm sm:text-base">
                    {spec.name}:{" "}
                    {spec.value
                      ? spec.value.length > 50
                        ? `${spec.value.slice(0, 50)}...`
                        : spec.value
                      : "---"}
                    {console.log(spec.value.length > 50 ? `${spec.value.slice(0, 50)}...` : item.value)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div className="border-t border-black mx-4 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {/* Release Date */}
          <div className="flex flex-col items-center py-3 border-b sm:border-b-0 sm:border-r border-black">
            <span className="text-black text-base font-semibold">Listing Date</span>
            <span className="text-gray-600 text-sm font-semibold">
              {formatDate(item.createdAt, "DD MMMM YYYY")}
            </span>
          </div>

          {/* Button */}
          <div className="flex justify-center items-center py-3">
            <button className="bg-red-500 text-white px-4 py-3 rounded-lg text-sm font-semibold">
              CHECK IT NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

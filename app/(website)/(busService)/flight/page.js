import AdBanner from "@/components/partials/AdBanner";
import HoverBanner from "@/components/partials/HoverBanner";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function FlightPage() {
  return (
    <div className="container mx-auto">
      <AdBanner />

      <div className=" py-8">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-6 pb-1 mb-8 border-black relative font-semibold border-b w-full sm:w-fit text-sm sm:text-base">
          <span className="text-red-500">Home</span> / Today / Hourly / Daily
          <div className="absolute bottom-0 left-0 w-10 sm:w-14 h-[2px] sm:h-[3px] bg-red-500"></div>
        </div>

        <div className="text-center px-4">
          <h6 className="text-3xl sm:text-5xl  font-bold mb-2">
            Flight Timings in <span className="text-red-500">Pakistan</span>
          </h6>
          <p className="text-sm sm:text-lg text-red-500 font-semibold">Last Updated: 10th January 2025</p>
        </div>
        <div className="">
          <h4 className="text-xl sm:text-2xl font-bold my-6 text-center sm:text-left">
            Today's Flight Timing In Pakistan
          </h4>

          <div className="bg-[#d9d9d9] py-6 sm:py-8 px-4 sm:px-8 md:px-4 rounded-3xl overflow-x-auto">
            <table className="w-full bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="py-3 px-4 sm:px-6 text-sm sm:text-lg font-bold">Airport</th>
                  <th className="py-3 px-4 sm:px-6 text-sm sm:text-lg font-bold">Code</th>
                  <th className="py-3 px-4 sm:px-6 text-sm sm:text-lg font-bold">Schedule</th>
                </tr>
              </thead>
              <tbody>
                {["Bhawalpur", "Lahore", "Karachi", "Islamabad", "Multan"].map((city, index) => (
                  <tr key={index} className="border-b last:border-none">
                    <td className="py-3 px-4 sm:px-6 text-sm sm:text-lg font-semibold">{city}</td>
                    <td className="py-3 px-4 sm:px-6 text-sm sm:text-lg font-semibold text-black">BHV</td>
                    <td className="py-3 px-4 sm:px-6 text-sm sm:text-lg font-semibold">
                      <Link href={"/flight/1"} className="underline text-blue-500">
                        Check Schedule
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className=" py-8">
        <HoverBanner />
      </div>

      <div className=" py-8">
        <div className="">
          <h4 className="text-xl sm:text-2xl font-bold my-6 text-center sm:text-left">
            Today's Flight Timing In Pakistan
          </h4>

          <div className="bg-[#d9d9d9] py-6 sm:py-8  rounded-3xl overflow-x-auto">
            <table className="w-full bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="py-3 px-4 sm:px-6 text-sm sm:text-lg font-bold">Airport</th>
                  <th className="py-3 px-4 sm:px-6 text-sm sm:text-lg font-bold">Code</th>
                  <th className="py-3 px-4 sm:px-6 text-sm sm:text-lg font-bold">Schedule</th>
                </tr>
              </thead>
              <tbody>
                {["Bhawalpur", "Lahore", "Karachi", "Islamabad", "Multan"].map((city, index) => (
                  <tr key={index} className="border-b last:border-none">
                    <td className="py-3 px-4 sm:px-6 text-sm sm:text-lg font-semibold">{city}</td>
                    <td className="py-3 px-4 sm:px-6 text-sm sm:text-lg font-semibold text-black">BHV</td>
                    <td className="py-3 px-4 sm:px-6 text-sm sm:text-lg font-semibold">
                      <Link href={"/flight/1"} className="underline text-blue-500">
                        Check Schedule
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="">
          <h4 className="text-xl sm:text-2xl font-bold my-6 text-center sm:text-left">
            Airlines Flight Status
          </h4>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full gap-4 mb-16">
            {[
              "Air Arabic",
              "PIA",
              "TH",
              "Emirates",
              "Flydubai",
              "Air China",
              "American Airline",
              "Salam Air",
              "Air Blue",
              "Kam Air",
              "Turkish Airlines",
              "Oman Air",
            ].map((item, index) => (
              <div
                key={index}
                className="border border-black bg-white py-4 rounded-xl text-lg sm:text-xl text-center font-bold"
              >
                {item}
              </div>
            ))}
          </div>

          {/* Airports Section */}
          <div className="mt-8">
            <h4 className="text-2xl sm:text-3xl font-bold mb-3">Airports in Pakistan</h4>

            <p className="mb-5 font-semibold text-sm sm:text-base">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
              the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled it to make a type specimen book.
            </p>

            <p className="mb-5 font-semibold text-sm sm:text-base">
              The printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a
              type specimen book.
            </p>

            <p className="mb-5 font-semibold text-sm sm:text-base">
              When an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </p>
          </div>
        </div>

        <div className="mt-10 ">
          <Image
            src={"/website/assets/images/banner/01.png"}
            alt="banner"
            width={2000}
            height={2000}
            className="w-full h-[350px]"
          />
        </div>
      </div>
    </div>
  );
}

export default FlightPage;

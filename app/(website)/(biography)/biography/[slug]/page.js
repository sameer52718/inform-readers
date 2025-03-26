import AdBanner from "@/components/partials/AdBanner";
import HoverBanner from "@/components/partials/HoverBanner";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BiographyTable = () => {
  const specifications = [
    { label: "Brand", value: "Motorola" },
    { label: "Model", value: "65 Inch LED Ultra HD (4K) TV (65SAUHDM)" },
    { label: "Price", value: "₹57,999 (India)" },
    { label: "Model Name", value: "65SAUHDM" },
    { label: "Display Size", value: "65 inch" },
    { label: "Screen Type", value: "LED" },
    { label: "Color", value: "Black" },
    { label: "Resolution (pixels)", value: "3840×2160" },
    { label: "Resolution Standard", value: "4K" },
    { label: "3D", value: "No" },
    { label: "Smart TV", value: "Yes" },
    { label: "Curve TV", value: "No" },
    { label: "Launch Year", value: "2019" },
  ];

  return (
    <div className="bg-white border border-black rounded-lg p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold mb-4">General</h2>
      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-gray-700">
          <tbody>
            {specifications.map((item, index) => (
              <tr key={index} className="odd:bg-gray-100 even:bg-white">
                <td className="px-2 sm:px-4 py-2 font-medium">{item.label}</td>
                <td className="px-2 sm:px-4 py-2">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function BiographyDetail() {
  return (
    <div className="container mx-auto">
      <AdBanner />
      <section className=" bg-white">
        <div className="flex flex-wrap items-center gap-1 py-4 md:py-6">
          <h6>Home</h6>
          <Icon icon="basil:caret-right-solid" className="mt-[2px]" width="18" height="18" />
          <h6>Actresses</h6>
          <Icon icon="basil:caret-right-solid" className="mt-[2px]" width="18" height="18" />
          <h6>Dilraba Dilmurat</h6>
        </div>
      </section>

      <section className=" py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-4">
          <div className="md:col-span-1">
            <div className="h-[240px] sm:h-[300px] md:h-[340px] w-full">
              <Image
                src={"/website/assets/images/specifacationCard/game/01.png"}
                alt="spec-image"
                width={1000}
                height={1000}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="md:col-span-2 p-4 md:p-6">
            <div className="bg-[#d9d9d9] px-4 pt-4 pb-4 border border-black rounded-xl w-full shadow-md grid grid-cols-1">
              <div className="text-center">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-600 underline">
                  <Link href={"#"}>Dilraba Dilmurat</Link>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-6">
                {[
                  "/website/assets/images/specifacationCard/game/icon-2.png",
                  "/website/assets/images/specifacationCard/game/icon-1.png",
                  "/website/assets/images/specifacationCard/game/icon-3.png",
                ].map((icon, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Image src={icon} alt="icon" width={1000} height={1000} className="w-10 h-10" />
                    <span className="text-gray-600 text-sm sm:text-base">
                      Modes: Single-player, Multiplayer
                    </span>
                  </div>
                ))}
              </div>

              <div className="border border-gray-400 my-4"></div>

              {/* Second Row of Icons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {Array(3)
                  .fill("/website/assets/images/specifacationCard/game/icon-4.png")
                  .map((icon, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Image src={icon} alt="icon" width={1000} height={1000} className="w-10 h-10" />
                      <span className="text-gray-600 text-sm sm:text-base">
                        Modes: Single-player, Multiplayer
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className=" py-8">
        <HoverBanner />
      </div>

      <div className=" flex flex-wrap items-center justify-between bg-red-600 text-white py-3 text-sm font-bold mb-8">
        <h5 className="text-lg sm:text-xl md:text-2xl lg:text-3xl ml-2">Dilraba Dilmurat</h5>
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          {[
            "ic:baseline-share",
            "logos:whatsapp-icon",
            "skill-icons:instagram",
            "logos:facebook",
            "devicon:linkedin",
            "logos:twitter",
          ].map((icon, index) => (
            <Link key={index} href={"#"}>
              <Icon icon={icon} width="24" height="24" className="w-6 sm:w-8 h-6 sm:h-8 cursor-pointer" />
            </Link>
          ))}
        </div>
      </div>

      <div className="">
        <BiographyTable />
      </div>

      <div className=" py-8">
        <HoverBanner />
      </div>
      <div className="">
        <BiographyTable />
        <div className="mt-6 sm:mt-10 px-2 sm:px-0">
          <h5 className="text-xl sm:text-2xl md:text-3xl font-bold mt-3">
            Personal Profile About Dilraba Dilmurat:
          </h5>
          <p className="mt-2 text-sm sm:text-base font-semibold mb-6 sm:mb-10">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
            the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
            type and scrambled it to make a type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in
            the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>

          <h5 className="text-xl sm:text-2xl md:text-3xl font-bold mt-3">
            Personal Profile About Dilraba Dilmurat:
          </h5>
          <p className="mt-2 text-sm sm:text-base font-semibold mb-6 sm:mb-10">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
            the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
            type and scrambled it to make a type specimen book. It has survived not only five centuries, but
            also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in
            the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>
        </div>
      </div>

      <div className=" py-8">
        <HoverBanner />
      </div>
    </div>
  );
}

export default BiographyDetail;

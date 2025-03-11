import Link from "next/link";
import React from "react";

function NameMeaningCard({ firstName, secondName, thirdName, meaing }) {
  return (
    <div className="border-2 border-black rounded-2xl bg-white md:px-12 px-4 pt-6 pb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="bg-[#cbcbcb] md:px-16 px-6 py-2 rounded-md md:text-lg text-sm font-semibold">
          <Link href={"/name-meaning/1"}>
            Dummy
          </Link>
        </div>
        <div className="bg-[#cbcbcb] md:px-16 px-6 py-2 rounded-md md:text-lg text-sm font-semibold">
          <Link href={"/name-meaning/1"}>
            Dummy
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="bg-[#cbcbcb] md:px-16 px-6 py-2 rounded-md md:text-lg text-sm font-semibold">
          <Link href={"/name-meaning/1"}>
            Dummy
          </Link>
        </div>

        <div className="bg-[#cbcbcb] md:px-16 px-6 py-2 rounded-md md:text-lg text-sm font-semibold">
          <Link href={"/name-meaning/1"}>
            Dummy
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="bg-[#cbcbcb] md:px-16 px-6 py-2 rounded-md md:text-lg text-sm font-semibold">
          <Link href={"/name-meaning/1"}>
            Dummy
          </Link>
        </div>

        <div className="bg-[#cbcbcb] md:px-16 px-6 py-2 rounded-md md:text-lg text-sm font-semibold">
          <Link href={"/name-meaning/1"}>
            Dummy
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NameMeaningCard;

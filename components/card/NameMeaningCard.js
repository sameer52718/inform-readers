import React from "react";

function NameMeaningCard({firstName, secondName, thirdName, meaing}) {
  return (
    <div className="border-2 border-black rounded-2xl bg-white px-12 pt-6 pb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="bg-[#cbcbcb] px-16 py-2 rounded-md text-lg font-semibold">Name</div>
        <div className="bg-[#cbcbcb] px-16 py-2 rounded-md text-lg font-semibold">Meaning</div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="bg-[#cbcbcb] px-16 py-2 rounded-md text-lg font-semibold">Name</div>
        <div className="bg-[#cbcbcb] px-16 py-2 rounded-md text-lg font-semibold">Meaning</div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="bg-[#cbcbcb] px-16 py-2 rounded-md text-lg font-semibold">Name</div>
        <div className="bg-[#cbcbcb] px-16 py-2 rounded-md text-lg font-semibold">Meaning</div>
      </div>
    </div>
  );
}

export default NameMeaningCard;

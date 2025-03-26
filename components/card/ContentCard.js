import React from "react";
import SearchInput from "../ui/SearchInput";

function ContentCard({ children }) {
  return (
    <div className="bg-[#d1d1d1] border border-black px-6 pt-4 pb-6 rounded-xl ">
      <div className="flex sm:flex-row  flex-col-reverse items-center justify-between">
        <div className="flex  items-center md:gap-12 gap-2 md:py-0 py-3 ">
          <h6 className="text-[#ff0000] font-semibold sm:text-base text-sm">Sort By</h6>

          <div className="flex items-center gap-6 sm:text-base text-sm">
            <button>Show All</button>
            <button>Popular </button>
            <button>Best Rated</button>
          </div>
        </div>
        <div className=" md:my-0 my-2">
          <SearchInput />
        </div>
      </div>
      <div className="divider h-[3px]  w-full bg-black">
        <div className="w-16 bg-[#ff0000] h-full"></div>
      </div>

      {children}
    </div>
  );
}

export default ContentCard;

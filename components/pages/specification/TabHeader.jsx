import React from "react";

const TabHeader = ({ onScrollShow, productName, activeTab = "Overview", onTabChange = () => {} }) => {
  const tabs = ["Overview", "Specifications", "Reviews", "FAQs"];

  return (
    <div
      className={`z-50 fixed bg-white shadow-md w-full top-0 transition-transform duration-300 ease-in-out ${
        onScrollShow ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8 py-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 pb-3 truncate">
          {productName}
        </h1>

        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`text-base sm:text-lg font-medium focus:outline-none transition-all pb-2 border-b-2 ${
                  activeTab === tab
                    ? "border-red-500 text-red-500"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => onTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabHeader;

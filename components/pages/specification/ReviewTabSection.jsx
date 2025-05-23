import React, { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";

const ReviewTabSection = ({
  reviews = [
    {
      id: 1,
      userName: "supervendor",
      date: "June 17, 2019",
      rating: 5,
      content: "I think this is the best product ever",
    },
  ],
}) => {
  const [selectedReviewTab, setSelectedReviewTab] = useState("Show all");
  const tabs = ["Show all", "Most Helpful", "Highest Rating", "Lowest Rating"];

  return (
    <div className="p-6 rounded-lg bg-white shadow-sm border border-gray-200 transition-all hover:shadow-md mb-6">
      {/* Tab Menu */}
      <div className="flex overflow-x-auto sm:justify-start border-b border-gray-200 mb-6 space-x-2 sm:space-x-4 pb-2 scrollbar-hide">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`whitespace-nowrap px-4 py-2 text-base font-medium transition-all duration-200 rounded-full
            ${selectedReviewTab === tab ? "text-white bg-red-600" : "text-gray-600 hover:bg-gray-100"}`}
            onClick={() => setSelectedReviewTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Review Items */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="pb-5 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="flex items-center space-x-3">
              <Image
                width={40}
                height={40}
                src="/user-avatar.png"
                alt={`${review.userName}'s avatar`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "text-red-500 fill-red-500" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {review.userName} - {review.date}
                </p>
              </div>
            </div>
            <p className="mt-3 text-gray-700 text-sm sm:text-base">{review.content}</p>
          </div>
        ))}
      </div>

      {/* Add Review Section */}
      <div className="border-t border-gray-200 pt-5 mt-6">
        <p className="font-bold text-base sm:text-lg text-gray-800">Add a review</p>
        <p className="text-sm text-gray-600 mt-1">
          You must be <span className="text-red-600 cursor-pointer hover:underline">logged in</span> to post a
          review.
        </p>
      </div>
    </div>
  );
};

export default ReviewTabSection;

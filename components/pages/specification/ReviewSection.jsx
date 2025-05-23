import React from 'react';
import { Star } from 'lucide-react';



const ReviewSection= ({
  totalReviews = 1,
  averageRating = 5.0,
  ratings = [1, 0, 0, 0, 0],
}) => {
  return (
    <div className="px-6 py-8 bg-white shadow-sm rounded-lg mb-6 border border-gray-200 transition-all hover:shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
        {/* Left Section - Overall Rating */}
        <div className="sm:col-span-3 flex flex-col items-center sm:items-start sm:border-r border-gray-200 pb-6 sm:pb-0">
          <div className="flex items-end space-x-2">
            <span className="text-3xl sm:text-4xl font-bold text-red-600">{averageRating.toFixed(1)}</span>
            <span className="text-gray-500 text-base">out of 5</span>
          </div>
          <div className="flex items-center my-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < Math.round(averageRating) ? "text-red-500 fill-red-500" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</span>
        </div>

        {/* Right Section - Rating Distribution */}
        <div className="sm:col-span-9 pl-0 sm:pl-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={5 - i} className="flex items-center space-x-2">
                {/* Stars Count */}
                <div className="flex items-center w-16">
                  <span className="text-sm font-medium mr-1">{5 - i}</span>
                  <Star className="h-4 w-4 text-red-500 fill-red-500" />
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  {ratings[i] > 0 && (
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(ratings[i] / totalReviews) * 100}%` }}
                    ></div>
                  )}
                </div>
                
                {/* Review Count */}
                <span className="text-gray-500 text-sm w-8 text-right">{ratings[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write a Review Button */}
      <div className="flex items-center justify-center mt-8">
        <button className="px-6 sm:px-8 py-2.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
          Write a Review
        </button>
      </div>
    </div>
  );
};

export default ReviewSection;
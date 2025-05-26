import React from "react";

const Loading = ({ loading, children, className = "" }) => {
  if (loading) {
    return (
      <div className={`flex justify-center items-center ${className}`}>
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-600 animate-spin"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-transparent border-r-4 border-l-4 border-r-pink-500 border-l-pink-500 animate-spin animate-pulse"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default Loading;

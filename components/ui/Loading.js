import React from "react";

const Loading = ({ loading = true, children }) => {
  if (!loading) {
    return children;
  }

  return (
    <div className="h-[50vh] flex justify-center items-center">
      <span className="loader"></span>
    </div>
  );
};

export default Loading;

import React from "react";
import { DollarSign } from "lucide-react";

const Header = () => {
  return (
    <header className="relative py-16 md:py-24 bg-gradient-to-br from-indigo-600 via-red-600 to-pink-500 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-white opacity-10 animate-float"></div>
        <div className="absolute right-10 top-10 w-20 h-20 rounded-full bg-white opacity-10 animate-float-delay"></div>
        <div className="absolute left-1/4 bottom-10 w-32 h-32 rounded-full bg-white opacity-10 animate-float-slow"></div>
        <div className="absolute right-1/4 bottom-20 w-24 h-24 rounded-full bg-white opacity-10 animate-float-delay-slow"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6 backdrop-blur-sm">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
            Currency Converter
          </h1>
          <p className="text-xl md:text-2xl text-white text-opacity-90 max-w-3xl mx-auto leading-relaxed">
            Fast, reliable currency conversion with real-time rates
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;

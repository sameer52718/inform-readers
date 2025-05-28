import React from "react";
import { DollarSign, BarChart2, RefreshCw } from "lucide-react";

const HeroSection = ({ title, subtitle }) => {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-indigo-600 via-red-600 to-pink-500 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-white opacity-10 animate-float"></div>
        <div className="absolute right-10 top-10 w-20 h-20 rounded-full bg-white opacity-10 animate-float-delay"></div>
        <div className="absolute left-1/4 bottom-10 w-32 h-32 rounded-full bg-white opacity-10 animate-float-slow"></div>
        <div className="absolute right-1/4 bottom-20 w-24 h-24 rounded-full bg-white opacity-10 animate-float-delay-slow"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
              <BarChart2 size={36} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white tracking-tight">
            {title}
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">{subtitle}</p>

          <div className="flex flex-wrap justify-center gap-6 mt-10">
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl text-white text-center">
              <DollarSign className="mx-auto mb-2" size={24} />
              <p className="font-medium">Accurate Pricing</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl text-white text-center">
              <RefreshCw className="mx-auto mb-2" size={24} />
              <p className="font-medium">Real-time Updates</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-xl text-white text-center">
              <BarChart2 className="mx-auto mb-2" size={24} />
              <p className="font-medium">Detailed Tables</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

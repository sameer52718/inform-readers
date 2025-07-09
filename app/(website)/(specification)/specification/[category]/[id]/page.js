"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

// Components
import TabHeader from "@/components/pages/specification/TabHeader";
import ProductGallery from "@/components/pages/specification/ProductGallery";
import ProductInfoCard from "@/components/pages/specification/ProductInfoCard";
import SpecificationTable from "@/components/pages/specification/SpecificationTable";
import ReviewSection from "@/components/pages/specification/ReviewSection";
import ReviewTabSection from "@/components/pages/specification/ReviewTabSection";
import Loading from "@/components/ui/Loading";

// Utils
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";

export default function SpecificationDetail() {
  const { id, category } = useParams();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [showFixedHeader, setShowFixedHeader] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  // Handle scroll for fixed header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 300) {
        setShowFixedHeader(true);
      } else {
        setShowFixedHeader(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // You can replace this with your actual API call
        const { data } = await axiosInstance.get(`/website/specification/${category}/${id}`);
        if (!data.error) {
          setData(data.specification);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, category]);

  // Handle smooth scrolling to sections
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setActiveTab(
      sectionId === "overview"
        ? "Overview"
        : sectionId === "specifications"
        ? "Specifications"
        : sectionId === "reviews"
        ? "Reviews"
        : "FAQs"
    );
  };

  return (
    <>
      {/* Fixed Header on Scroll */}
      <TabHeader
        onScrollShow={showFixedHeader}
        productName={data?.name || "Product Details"}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          scrollToSection(tab.toLowerCase());
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 pb-12">
        <Loading loading={isLoading}>
          {/* Breadcrumb Navigation */}

          {/* Product Title */}
          <section className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{data?.name}</h1>
          </section>

          {/* Tabbed Navigation */}
          <section className="mb-8" id="overview">
            <div className="relative">
              <div className="flex items-center border-b border-gray-200 pb-2 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => scrollToSection("overview")}
                  className={`mr-6 text-lg font-medium whitespace-nowrap transition-colors ${
                    activeTab === "Overview" ? "text-red-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => scrollToSection("specifications")}
                  className={`mr-6 text-lg font-medium whitespace-nowrap transition-colors ${
                    activeTab === "Specifications" ? "text-red-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => scrollToSection("faqs")}
                  className={`text-lg font-medium whitespace-nowrap transition-colors ${
                    activeTab === "FAQs" ? "text-red-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  FAQs
                </button>
                <button
                  onClick={() => scrollToSection("reviews")}
                  className={`mr-6 text-lg font-medium whitespace-nowrap transition-colors ${
                    activeTab === "Reviews" ? "text-red-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  User Reviews
                </button>
              </div>

              {/* Active tab indicator */}
              <div
                className="absolute bottom-0 left-0 h-0.5 bg-red-600 transition-all duration-300"
                style={{
                  width:
                    activeTab === "Overview"
                      ? "80px"
                      : activeTab === "Specifications"
                      ? "120px"
                      : activeTab === "Reviews"
                      ? "110px"
                      : "50px",
                  transform: `translateX(${
                    activeTab === "Overview"
                      ? "0"
                      : activeTab === "Specifications"
                      ? "100px"
                      : activeTab === "Reviews"
                      ? "240px"
                      : "370px"
                  }px)`,
                }}
              />
            </div>
          </section>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column - Product Gallery */}
            <div className="md:col-span-4">
              <ProductGallery images={[data?.image]} mainImage={data?.image} />
            </div>

            {/* Middle Column - Product Info */}
            <div className="md:col-span-8">
              {/* Product Info Card */}
              {data?.data?.generalSpecs && (
                <ProductInfoCard name={data.name} specs={data.data.generalSpecs} createdAt={data.createdAt} />
              )}
              {console.log(data?.data)}

              {/* Specifications Section */}
              {data?.data &&
                Object.keys(data.data).map((key) => {
                  if (
                    key === "_id" ||
                    key === "links" ||
                    !Array.isArray(data.data[key]) ||
                    data.data[key].length === 0
                  ) {
                    return null;
                  }
                  console.log(data.data[key]);

                  return (
                    <div key={key} className="mb-6">
                      <SpecificationTable
                        data={data.data[key]}
                        title={key.replace(/([A-Z])/g, " $1").trim()}
                      />
                    </div>
                  );
                })}

              {/* FAQs Section */}
              <div id="faqs" className="pt-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                  <p className="text-gray-500 text-center py-8">No FAQs available for this product yet.</p>
                </div>
              </div>

              {/* Reviews Section */}
              <div id="reviews" className="pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">User Reviews</h2>
                <ReviewSection />
                <ReviewTabSection />
              </div>
            </div>

            {/* Right Column - Related Products */}
            {/* <div className="md:col-span-3">
              <RelatedProducts products={sampleProducts} />
            </div> */}
          </div>
        </Loading>
      </div>
    </>
  );
}

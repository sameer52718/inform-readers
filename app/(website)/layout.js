"use client";
import Footer from "@/components/partials/Footer";
import Header from "@/components/partials/Header";
import "../../public/website/assets/css/custom.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import Loading from "@/components/ui/Loading";

// app/layout.js
export default function WebsiteLayout({ children }) {
  const { isLoading } = useSelector((state) => state.config);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex space-x-2">
          <span className="w-4 h-4 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-4 h-4 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-4 h-4 bg-red-500 rounded-full animate-bounce"></span>
        </div>
        <p className="mt-4 text-gray-600 text-sm font-medium animate-pulse">Loading, please wait...</p>
      </div>
    );
  }

  return (
    <Loading loading={isLoading}>
      <Header />
      <main className="flex-1 bg-white">{children}</main>
      <Footer />
      <ToastContainer />
    </Loading>
  );
}

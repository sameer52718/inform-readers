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
    return null;
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

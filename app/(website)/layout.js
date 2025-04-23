import Footer from "@/components/partials/Footer";
import Header from "@/components/partials/Header";
import "../../public/website/assets/css/custom.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ToastContainer } from "react-toastify";
import Head from "next/head";

// app/layout.js
export default function WebsiteLayout({ children }) {
  return (
    <>
      <Head>
        <meta name="adsterraverification" content="92gh47g92" />
      </Head>
      <Header />
      <main className="flex-1 bg-white">{children}</main>
      <Footer />
      <ToastContainer />
    </>
  );
}

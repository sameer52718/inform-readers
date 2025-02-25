import Footer from "@/components/partials/Footer";
import Header from "@/components/partials/Header";
import '../../public/website/assets/css/custom.css';
import "swiper/css"; 
import "swiper/css/navigation"; 
import "swiper/css/pagination";   

// app/layout.js
export default function WebsiteLayout({ children }) {

  return (
    <>
      <Header />
      <main className="flex-1 bg-gray-100">{children}</main>
      <Footer />

    </>
  );
}

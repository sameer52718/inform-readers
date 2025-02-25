import Footer from "@/components/partials/Footer";
import Header from "@/components/partials/Header";
import customCss from "../../public/website/assets/css/custom.css";

// app/layout.js
export default function WebsiteLayout({ children }) {

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />

    </>
  );
}

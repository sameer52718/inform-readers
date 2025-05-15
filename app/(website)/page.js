export const metadata = {
  title: "Global Information Hub - All in One || inform Readers",
  description: "Discover software, name meanings, postal & bank codes from around the world.",
  keywords: ["global info", "software directory", "name meanings", "postal codes", "bank swift codes"],
  openGraph: {
    title: "Global Information Hub - All in One",
    description: "Discover software, name meanings, postal & bank codes from around the world.",
    type: "website",
    url: "https://informreaders.com/",
    siteName: "Inform Readers",
  },
};

import Home from "@/components/pages/HomeClient";

export default function page() {
  return <Home />;
}

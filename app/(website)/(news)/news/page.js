import React from "react";
import Landing from "@/components/pages/news/Landing";

export const metadata = {
  title: "Latest News | Inform Readers",
  description:
    "Stay updated with the latest news articles across categories. Browse trending topics and breaking stories.",
  openGraph: {
    title: "Latest News",
    description: "Read the latest articles and stay informed with breaking news updates.",
    type: "website",
  },
};

const Page = () => {
  return <Landing />;
};

export default Page;

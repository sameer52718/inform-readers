import React from "react";
import JobListing from "@/components/pages/job/listing";

export const metadata = {
  title: "Find Jobs Online – Career Opportunities || Inform Readers",
  description:
    "Browse the latest job openings from top companies. Find remote, on-site, and hybrid opportunities across industries. Start your career search with Inform Readers today.",
  keywords: [
    "job search",
    "latest jobs",
    "remote jobs",
    "on-site jobs",
    "hybrid jobs",
    "career opportunities",
    "find a job",
  ],
  openGraph: {
    title: "Find Jobs Online – Career Opportunities",
    description:
      "Explore fresh job listings from around the world. Find remote, on-site, and hybrid roles that match your skills and goals.",
    type: "website",
    url: "https://informreaders.com/jobs",
    siteName: "Inform Readers",
  },
};

const page = () => {
  return <JobListing />;
};

export default page;

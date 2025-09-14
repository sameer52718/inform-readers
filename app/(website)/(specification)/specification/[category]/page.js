import React from 'react'
import SpecificationCategory from '@/components/pages/specification/Category'

export const metadata = {
  title: "Product Specifications & Comparisons | Inform Readers",
  description:
    "Browse detailed product specifications across multiple categories. Compare features, prices, and find the perfect product for your needs.",
  keywords: [
    "product specifications",
    "compare products",
    "product features",
    "product details",
    "product prices",
    "electronics specs",
    "inform readers",
  ],
  openGraph: {
    title: "Product Specifications & Comparisons",
    description:
      "Explore and compare product specifications by category. Find the best products with detailed data and prices.",
    type: "website",
    siteName: "Inform Readers",
  },
};


const Page = () => {
  return (
    <SpecificationCategory/>
  )
}

export default Page
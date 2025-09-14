import React from 'react'
import BiographyListing from '@/components/pages/biography/Listing'

export const metadata = {
  title: "Famous Celebrity Biographies || Inform Readers",
  description:
    "Explore thousands of biographies of actors, musicians, leaders, and other famous personalities from around the world. Learn about their life, career, and achievements.",
  keywords: [
    "celebrity biographies",
    "famous people",
    "actors biography",
    "singers biography",
    "historical figures",
    "leaders biography",
    "famous personalities",
  ],
  openGraph: {
    title: "Famous Celebrity Biographies - Explore & Discover",
    description:
      "Discover detailed biographies of famous actors, singers, politicians, scientists, and more. Search and explore global personalities.",
    type: "website",
    url: "https://informreaders.com/biography",
    siteName: "Inform Readers",
  },
};




const Page = () => {
  return (
    <BiographyListing/>
  )
}

export default Page
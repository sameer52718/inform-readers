"use client";
import React from "react";
import Image from "next/image";

const StoreCard = ({ name, cashback, logo }) => (
  <div className="bg-white shadow-md rounded-lg p-4 m-2 flex items-center justify-between transition-transform hover:scale-105">
    <div className="flex items-center">
      <Image src={logo} width={40} height={40} className="mr-4" />
      <div>
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-teal-500">{cashback}</p>
      </div>
    </div>
  </div>
);

const FeaturedStoreCard = ({ name, cashback, logo }) => (
  <div className="bg-black-500 shadow-md rounded-lg p-4 m-2 flex items-center justify-between transition-transform hover:scale-105">
    <div className=" items-center">
      <Image src={logo} width={120} height={120} className="mr-4 w-full" />
      <div>
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-teal-500">{cashback}</p>
      </div>
    </div>
  </div>
);

const CategoryTabs = ({ activeCategory, setActiveCategory }) => {
  const categories = [
    "All Offers",
    "Clothing",
    "Travel",
    "Home & Garden",
    "Electronics",
    "Beauty",
    "Health",
    "Shoes",
    "Accessories",
    "Jewelry",
    "Sports & Outdoors",
    "Food",
  ];

  return (
    <div className="flex flex-wrap gap-4 mb-4 px-4">
      {categories.map((category) => (
        <button
          key={category}
          className={`text-sm ${
            activeCategory === category ? "text-blue-600 font-semibold" : "text-gray-600"
          }`}
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default function Home() {
  const [activeCategory, setActiveCategory] = React.useState("All Offers");

  const featuredStores = [
    { name: "CARTER'S", cashback: "10% Cash Back", logo: "/website/assets/images/brand/1.webp" },
    { name: "BEAUTYREST", cashback: "10% Cash Back", logo: "/website/assets/images/brand/2.webp" },
    { name: "KAY JEWELERS", cashback: "8% Cash Back", logo: "/website/assets/images/brand/3.webp" },
    { name: "ANCESTRY.COM", cashback: "10% Cash Back", logo: "/website/assets/images/brand/4.webp" },
    { name: "TUFT & NEEDLE", cashback: "10% Cash Back", logo: "/website/assets/images/brand/5.webp" },
    { name: "LUCKY BRAND", cashback: "6% Cash Back", logo: "/website/assets/images/brand/6.webp" },
  ];

  const topCashbackStores = [
    { name: "Walmart", cashback: "2% Cash Back", logo: "/website/assets/images/brand/1.webp" },
    { name: "Target", cashback: "2% Cash Back", logo: "/website/assets/images/brand/1.webp" },
    { name: "Chewy", cashback: "3% Cash Back", logo: "/website/assets/images/brand/1.webp" },
    { name: "Samsung", cashback: "10% Cash Back", logo: "/website/assets/images/brand/1.webp" },
    { name: "Adidas", cashback: "8% Cash Back", logo: "/website/assets/images/brand/1.webp" },
    { name: "Macy's", cashback: "6% Cash Back", logo: "/website/assets/images/brand/1.webp" },
    { name: "Hotels.com", cashback: "4% Cash Back", logo: "/website/assets/images/brand/1.webp" },
    { name: "Booking.com", cashback: "4% Cash Back", logo: "/website/assets/images/brand/1.webp" },
  ];

  const allCashbackStores = [
    { name: "NordVPN", cashback: "60% Cash Back", logo: "/website/assets/images/brand/1.webp" },
    { name: "Universal Standard", cashback: "19% Cash Back", logo: "/website/assets/images/brand/1.webp" },
    { name: "CanvasDiscount", cashback: "17% Cash Back", logo: "/website/assets/images/brand/1.webp" },
    { name: "Bento", cashback: "16% Cash Back", logo: "/website/assets/images/brand/1.webp" },
    { name: "The Gift Basket Store", cashback: "16% Cash Back", logo: "/website/assets/images/brand/1.webp" },
    { name: "G-Star", cashback: "15% Cash Back", logo: "/website/assets/images/brand/1.webp" },
    { name: "LensCrafters", cashback: "15% Cash Back", logo: "/website/assets/images/brand/1.webp" },
    { name: "Adam & Eve", cashback: "15% Cash Back", logo: "/website/assets/images/brand/1.webp" },
    { name: "CVS", cashback: "15% Cash Back", logo: "/website/assets/images/brand/1.webp" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <main className="container mx-auto py-6 px-4">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Today’s Featured Cash Back</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {featuredStores.map((store, index) => (
              <FeaturedStoreCard key={index} {...store} />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Top Cash Back</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {topCashbackStores.map((store, index) => (
              <StoreCard key={index} {...store} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            💰 All Cash Back Offers <span className="text-sm text-gray-500">2741 Offers Available</span>
          </h2>
          <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {allCashbackStores.map((store, index) => (
              <StoreCard key={index} {...store} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

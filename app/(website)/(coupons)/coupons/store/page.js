import React from "react";

const DealCard = ({ discount, title, description, code, buttonText, couponCode }) => (
  <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center justify-between">
    <div>
      <div className="flex items-center mb-2">
        <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded mr-2">{discount}</span>
        {couponCode && <span className="text-gray-600 text-sm font-medium">Code</span>}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
    <button className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800">
      {buttonText}
    </button>
  </div>
);

const Page = () => {
  const deals = [
    {
      discount: "FREE SHIPPING",
      title: "Free Shipping Order Over $75",
      description: "Sale",
      buttonText: "Get Deal",
    },
    {
      discount: "30% OFF",
      title: "30% Off Sitewide",
      description: "Added by saver1",
      code: "HIHXOXD5",
      buttonText: "Show Code",
      couponCode: true,
    },
    {
      discount: "30% OFF",
      title: "30% Off Sitewide",
      description: "Added by saver1",
      code: "HIHXOXD5",
      buttonText: "Show Code",
      couponCode: true,
    },
    {
      discount: "30% OFF",
      title: "30% Off Sitewide",
      description: "Added by saver1",
      code: "HIHXOXD5",
      buttonText: "Show Code",
      couponCode: true,
    },
    {
      discount: "30% OFF",
      title: "30% Off Sitewide",
      description: "Added by saver1",
      code: "HIHXOXD5",
      buttonText: "Show Code",
      couponCode: true,
    },
  ];

  return (
    <div className="container mx-auto p-6 bg-white font-sans">
      <div className="flex items-start">
        <div className="w-1/4 pr-6">
          <div className="flex items-center mb-4">
            <img
              src="https://placehold.co/400x400?text=Armbrust"
              alt="Armbrust Logo"
              className="w-16 h-16 mr-2 rounded-full"
            />
            <span className="text-lg font-bold">Armbrust Coupons & Promo Codes</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">TOP OFFERS FOR JULY 21ST 2025</p>
          <p className="text-sm text-gray-600 mb-4">
            When you buy through links on RetailMeNot we may earn a commission.
          </p>
          <div className="bg-gray-100 p-4 rounded mb-4">
            <h2 className="text-lg font-semibold mb-2">TODAY'S TOP ARMBRUST OFFERS:</h2>
            <ul className="list-disc pl-5 text-sm text-gray-600 mb-2">
              <li>Free Shipping Order Over $75</li>
              <li>30% Off Sitewide</li>
            </ul>
            <div>
              <p>Total Offers: 15</p>
              <p>Coupon Codes: 10</p>
              <p>In-Store Coupons: 0</p>
              <p>Free Shipping Deals: 2</p>
            </div>
          </div>
          <div className="bg-blue-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">ARMBRUST FEATURED ARTICLES</h2>
            <div className="bg-green-100 p-4 rounded">
              <h3 className="text-base font-semibold mb-2">BECOME A RETAILMENOT MEMBER</h3>
              <p className="text-sm text-gray-600">
                Cash Back at nearly 3,800 Retailers. Sign up now to stack rewards, promo codes, and offers
                automatically.
              </p>
              <p className="text-sm text-gray-600">By RetailMeNot</p>
            </div>
            <div className="mt-4">
              <h3 className="text-base font-semibold mb-2">WHY TRUST US?</h3>
              <p className="text-sm text-gray-600">
                RetailMeNot.com has a dedicated merchandising team sourcing and verifying the best Armbrust
                coupons, promo codes and deals — we will save you time and money by constantly researching the
                hunters market in real time to provide you with up-to-date savings! In the best stores to shop
                and which products to buy. We also make sure...
              </p>
            </div>
          </div>
        </div>
        <div className="w-3/4">
          <div className="bg-cyan-100 p-4 rounded mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">EARN MORE REWARDS</h2>
              <p className="text-sm">Sign Up & Cash In On A $5 Bonus* When You Create An Account</p>
              <p className="text-sm">Join and maximize your savings</p>
            </div>
            <button className="bg-purple-700 text-white px-4 py-2 rounded-lg">Learn More</button>
          </div>
          {deals.map((deal, index) => (
            <DealCard
              key={index}
              discount={deal.discount}
              title={deal.title}
              description={deal.description}
              code={deal.code}
              buttonText={deal.buttonText}
              couponCode={deal.couponCode}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;

const DealCard = ({ image, discount, title, description, couponCode }) => (
  <div className="bg-white shadow-md rounded-lg  mb-4 flex flex-col items-center relative">
    <img src={image} alt={title} className=" h-24  object-cover" />
    <div className="p-4">
      <div className="flex items-center mb-2">
        <span className="bg-yellow-300 text-black text-xs font-bold px-2 py-1 rounded mr-2 absolute top-4 left-4">
          {discount}
        </span>
        {couponCode && <span className="text-red-600 text-sm font-medium">Coupon code</span>}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

const FilterBar = () => (
  <div className="mt-8 w-64 bg-white p-4 border border-black rounded-md h-full">
    <p className="text-sm text-gray-600 mb-4">
      When you buy through links on RetailMeNot we may earn a commission.
    </p>
    <div className="bg-white  mb-4">
      <h2 className="text-lg font-semibold mb-2">ABOUT MOTORCYCLES COUPONS</h2>
      <p className="text-sm text-gray-600">
        Listed above you'll find some of the best motorcycles coupons, discounts and promotion codes as ranked
        by the users of RetailMeNot.com. To use a coupon simply click the coupon code then enter the code
        during the store's checkout process.
      </p>
    </div>
    <h2 className="text-lg font-semibold mb-2">TODAY'S TOP MOTORCYCLES OFFERS:</h2>
    <ul className="list-disc pl-5 text-sm text-gray-600 mb-4">
      <li>15% Off Next Order With Harley-Davidson Email Sign Up</li>
      <li>Up to $40 Off with Minimum Spend</li>
    </ul>
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">SIMILAR STORES</h2>
      <ul className="list-disc pl-5 text-sm text-gray-600">
        <li>Online Auto Dealer Ed</li>
        <li>Deus Ex Machina</li>
        <li>Cycle Gear</li>
        <li>TURBOANT</li>
        <li>DYU US</li>
        <li>Metal Mulisha</li>
        <li>Electric Scooters</li>
        <li>Mini Flyer</li>
        <li>Alpinestars</li>
        <li>The Vault Pro Scooters</li>
        <li>Segway</li>
        <li>Micro Kickboard</li>
      </ul>
    </div>
  </div>
);

const App = () => {
  const deals = [
    {
      image: "https://placehold.co/600x400?text=Harley-Davidson",
      discount: "15% Off",
      title: "HARLEY-DAVIDSON",
      description: "15% Off Next Order With Harley-Davidson Email Sign Up",
    },
    {
      image: "https://placehold.co/600x400?text=Harley-Davidson",
      discount: "$40 Off",
      title: "HARLEY-DAVIDSON",
      description: "Up To $40 Off With Minimum Spend",
    },
    {
      image: "https://placehold.co/600x400?text=Cycle+Gear",
      discount: "1% Cash Back",
      title: "CYCLE GEAR",
      description: "1% Cash Back For Purchases Sitewide",
    },
    {
      image: "https://placehold.co/600x400?text=Revel",
      discount: "70% Off",
      title: "REVEL",
      description: "Up To 70% Off Rides + $40 Credit",
      couponCode: true,
    },
    {
      image: "https://placehold.co/600x400?text=Harley-Davidson",
      discount: "2% Cash Back",
      title: "HARLEY-DAVIDSON",
      description: "2% Cash Back For Purchases Sitewide",
    },
    {
      image: "https://placehold.co/600x400?text=Metal+Mulisha",
      discount: "25% Off",
      title: "METAL MULISHA",
      description: "25% Off Any Order",
      couponCode: true,
    },
    {
      image: "https://placehold.co/600x400?text=Revel",
      discount: "50% Off",
      title: "REVEL",
      description: "50% Off All Rides 1st Month For New Users",
      couponCode: true,
    },
    {
      image: "https://placehold.co/600x400?text=Revel",
      discount: "70% Off",
      title: "REVEL",
      description: "Up To $125 Free Credit + 70% Off",
      couponCode: true,
    },
    {
      image: "https://placehold.co/600x400?text=Metal+Mulisha",
      discount: "10% Off",
      title: "METAL MULISHA",
      description: "10% Off Any Order",
      couponCode: true,
    },
  ];

  return (
    <div className="flex container">
      <FilterBar />
      <div className="container mx-auto p-6 bg-white font-sans flex-1">
        <div>
          <h1 className="text-2xl font-bold mb-2">Motorcycles Sales & Deals</h1>
          <p className="text-sm text-gray-600 mb-4">TOP 154 OFFERS AVAILABLE FOR JULY 2025</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {deals.map((deal, index) => (
            <DealCard
              key={index}
              image={deal.image}
              discount={deal.discount}
              title={deal.title}
              description={deal.description}
              couponCode={deal.couponCode}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;

import { Bed, Bath, Square, Heart, MapPin } from "lucide-react";
import Link from "next/link";

const PropertyGrid = () => {
  const properties = [
    {
      id: 1,
      title: "Cozy Family Home",
      location: "Seattle, WA",
      price: "$750,000",
      image: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      beds: 3,
      baths: 2,
      sqft: 2000,
      type: "House",
    },
    {
      id: 2,
      title: "Urban Loft",
      location: "Portland, OR",
      price: "$450,000",
      image: "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg",
      beds: 1,
      baths: 1,
      sqft: 950,
      type: "Apartment",
    },
    {
      id: 3,
      title: "Suburban Ranch",
      location: "Austin, TX",
      price: "$580,000",
      image: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg",
      beds: 4,
      baths: 2,
      sqft: 2400,
      type: "House",
    },
    {
      id: 4,
      title: "Mountain View Condo",
      location: "Denver, CO",
      price: "$420,000",
      image: "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg",
      beds: 2,
      baths: 2,
      sqft: 1200,
      type: "Condo",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold mb-8">Latest Properties</h2>
        <Link href={"/real-state/listing"} className="text-red-500">
          View More
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <img src={property.image} alt={property.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-600">{property.type}</span>
                <span className="text-lg font-bold text-red-600">{property.price}</span>
              </div>

              <h3 className="text-lg font-semibold mb-2">{property.title}</h3>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.location}</span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>{property.beds} beds</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>{property.baths} baths</span>
                </div>
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  <span>{property.sqft} sqft</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FeaturedProperties = () => {
  const properties = [
    {
      id: 1,
      title: "Modern Luxury Villa",
      location: "Beverly Hills, CA",
      price: "$2,500,000",
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
      beds: 4,
      baths: 3,
      sqft: 3200,
    },
    {
      id: 2,
      title: "Waterfront Apartment",
      location: "Miami Beach, FL",
      price: "$1,800,000",
      image: "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg",
      beds: 3,
      baths: 2,
      sqft: 2100,
    },
    {
      id: 3,
      title: "Downtown Penthouse",
      location: "New York, NY",
      price: "$3,200,000",
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      beds: 5,
      baths: 4,
      sqft: 4500,
    },
  ];

  return (
    <div className="mb-16">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold mb-8">Featured Properties</h2>
        <Link href={"/real-state/listing"} className="text-red-500">
          View More
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow-lg overflow-hidden group">
            <div className="relative">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                <Heart className="h-5 w-5 text-red-500" />
              </button>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
              <p className="text-gray-600 mb-4">{property.location}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center">
                    <Bed className="h-5 w-5 mr-2" />
                    <span>{property.beds}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-5 w-5 mr-2" />
                    <span>{property.baths}</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="h-5 w-5 mr-2" />
                    <span>{property.sqft} sqft</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-red-600">{property.price}</span>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RealEstate = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div
          className="relative h-[500px] bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg')`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-6xl text-white font-bold mb-4">Find Your Dream Home</h1>
              <p className="text-xl md:text-2xl mb-8">
                Discover the perfect property in your favorite location
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <FeaturedProperties />
          <PropertyGrid />
        </div>
      </main>
    </div>
  );
};

export default RealEstate;

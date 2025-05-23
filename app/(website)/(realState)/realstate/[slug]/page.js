"use client";

import { useState, useRef } from "react";
import { usePathname } from "next/navigation";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Heart,
  BedDouble,
  Bath,
  MoveHorizontal,
  Trees,
  CalendarRange,
  Home,
  ChevronDown,
  ChevronUp,
  CheckCircle,
} from "lucide-react";

function RelatedProperties({ currentPropertyId }) {
  const scrollRef = useRef(null);

  // Mock data - in a real app, these would be filtered to be actually related
  const properties = [
    {
      id: "prop-1",
      title: "Seaside Villa with Private Beach",
      price: "$1,399,000",
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
      beds: 5,
      baths: 4,
      sqft: 3800,
      address: "456 Shoreline Blvd, Santa Barbara, CA",
    },
    {
      id: "prop-2",
      title: "Modern Downtown Penthouse",
      price: "$890,000",
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      beds: 3,
      baths: 2.5,
      sqft: 2100,
      address: "789 Metro Ave, Los Angeles, CA",
    },
    {
      id: "prop-3",
      title: "Mountain Retreat with Views",
      price: "$975,000",
      image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
      beds: 4,
      baths: 3,
      sqft: 2850,
      address: "321 Summit Dr, Aspen, CO",
    },

    {
      id: "prop-5",
      title: "Spanish Colonial Revival",
      price: "$1,175,000",
      image: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg",
      beds: 4,
      baths: 3.5,
      sqft: 3200,
      address: "890 Mission Dr, Santa Barbara, CA",
    },
  ].filter((property) => property.id !== currentPropertyId);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Similar Properties</h2>
      </div>

      <div ref={scrollRef} className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4  pb-4 ">
        {properties.map((property) => (
          <div key={property.id} className="flex-shrink-0  group">
            <Link href={`/realstate/${property.id}`}>
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                {/* Property Image */}
                <div className="relative h-48 w-full">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-md font-medium text-sm">
                    {property.price}
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-lg truncate">{property.title}</h3>
                  <p className="text-gray-500 text-sm truncate mb-4">{property.address}</p>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <BedDouble className="h-4 w-4 mr-1" />
                      <span>{property.beds} bd</span>
                    </div>

                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      <span>{property.baths} ba</span>
                    </div>

                    <div className="flex items-center">
                      <MoveHorizontal className="h-4 w-4 mr-1" />
                      <span>{property.sqft.toLocaleString()} sqft</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function PropertyDescription({ description, features }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Split description into paragraphs
  const paragraphs = description.split("\n\n").filter((p) => p.trim() !== "");

  // Display first paragraph if not expanded
  const visibleDescription = isExpanded ? paragraphs : [paragraphs[0]];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-8 space-y-8">
      {/* Description Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description</h2>

        <div className="space-y-4 text-gray-700 leading-relaxed">
          {visibleDescription.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {paragraphs.length > 1 && (
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex items-center text-red-600 hover:text-red-800 mt-4 font-medium transition-colors duration-200"
          >
            {isExpanded ? (
              <>
                <span>Read less</span>
                <ChevronUp className="ml-1 h-5 w-5" />
              </>
            ) : (
              <>
                <span>Read more</span>
                <ChevronDown className="ml-1 h-5 w-5" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Features Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features & Amenities</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <CheckCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function PropertyHighlights({ property }) {
  const highlights = [
    {
      icon: <BedDouble className="h-6 w-6 text-red-500" />,
      label: "Bedrooms",
      value: property.beds,
    },
    {
      icon: <Bath className="h-6 w-6 text-red-500" />,
      label: "Bathrooms",
      value: property.baths,
    },
    {
      icon: <MoveHorizontal className="h-6 w-6 text-red-500" />,
      label: "Square Feet",
      value: property.sqft.toLocaleString(),
    },
    {
      icon: <Trees className="h-6 w-6 text-red-500" />,
      label: "Lot Size",
      value: property.lotSize,
    },
    {
      icon: <CalendarRange className="h-6 w-6 text-red-500" />,
      label: "Year Built",
      value: property.yearBuilt,
    },
    {
      icon: <Home className="h-6 w-6 text-red-500" />,
      label: "Property Type",
      value: property.type,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Property Highlights</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {highlights.map((item, index) => (
          <div key={index} className="flex items-center space-x-4 group">
            <div className="flex-shrink-0 bg-red-50 rounded-full p-3 transition-all duration-300 group-hover:bg-red-100">
              {item.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-lg font-medium text-gray-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PropertyGallery({ images }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const scrollRef = useRef(null);

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const scrollThumbnails = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image with Controls */}
      <div className="relative rounded-xl overflow-hidden aspect-[16/9]">
        <Image
          src={images[currentImageIndex]}
          alt="Property view"
          fill
          className="object-cover transition-all duration-500 hover:scale-105"
          priority
        />

        {/* Navigation Arrows */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6 text-gray-800" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6 text-gray-800" />
        </button>

        {/* Fullscreen and Favorite */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            className="bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
            aria-label="View fullscreen"
          >
            <Maximize2 className="h-5 w-5 text-gray-800" />
          </button>

          <button
            onClick={() => setLiked((prev) => !prev)}
            className={`${
              liked ? "bg-red-500" : "bg-white/80 hover:bg-white"
            } rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110`}
            aria-label={liked ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-5 w-5 ${liked ? "text-white fill-current" : "text-gray-800"}`} />
          </button>
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="relative">
        <button
          onClick={() => scrollThumbnails("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-lg z-10"
          aria-label="Scroll thumbnails left"
        >
          <ChevronLeft className="h-4 w-4 text-gray-800" />
        </button>

        <div ref={scrollRef} className="flex space-x-2 overflow-x-auto scrollbar-hide py-2 px-8">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 relative h-20 w-32 rounded-md overflow-hidden transition-all duration-200 ${
                currentImageIndex === index
                  ? "ring-2 ring-red-500 ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image src={image} alt={`Property view ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollThumbnails("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-lg z-10"
          aria-label="Scroll thumbnails right"
        >
          <ChevronRight className="h-4 w-4 text-gray-800" />
        </button>
      </div>
    </div>
  );
}

export default function PropertyDetailPage() {
  const pathname = usePathname();
  const propertyId = pathname.split("/").pop();

  // This would normally be fetched from an API
  const property = {
    id: propertyId,
    title: "Modern Luxury Villa with Ocean View",
    price: "$1,250,000",
    address: "123 Coastal Drive, Malibu, CA 90265",
    beds: 4,
    baths: 3.5,
    sqft: 3200,
    lotSize: "0.25 acres",
    yearBuilt: 2021,
    type: "Single Family Home",
    description: `This stunning modern villa offers unparalleled luxury living with breathtaking ocean views from nearly every room. Designed by renowned architect John Smith, this home perfectly balances indoor and outdoor living.

The open-concept main floor features floor-to-ceiling windows, a gourmet kitchen with top-of-the-line appliances, and seamless access to the expansive terrace with infinity pool.

The primary suite includes a spa-like bathroom, walk-in closet, and private balcony. Three additional bedrooms provide comfortable accommodations for family and guests.

Located in a prestigious neighborhood with easy access to beaches, shopping, and dining.`,
    features: [
      "Infinity Pool",
      "Smart Home System",
      "Wine Cellar",
      "Home Office",
      "Solar Panels",
      "Electric Car Charging",
      "Gourmet Kitchen",
      "Home Theater",
    ],
    images: [
      "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg",
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
      "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg",
      "https://images.pexels.com/photos/1643385/pexels-photo-1643385.jpeg",
      "https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg",
    ],
    agent: {
      name: "Sarah Johnson",
      phone: "(310) 555-1234",
      email: "sarah@realestate.com",
      image: "https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg",
    },
  };

  return (
    <main className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mt-6 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{property.title}</h1>
          <p className="text-lg text-gray-600 mt-2">{property.address}</p>
          <p className="text-2xl md:text-3xl font-bold text-red-600 mt-2">{property.price}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-3">
            <PropertyGallery images={property.images} />
            <PropertyHighlights property={property} />
            <PropertyDescription description={property.description} features={property.features} />
          </div>
        </div>

        <div className="mt-16">
          <RelatedProperties currentPropertyId={property.id} />
        </div>
      </div>
    </main>
  );
}

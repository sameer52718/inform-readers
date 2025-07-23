import React, { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

const ProductGallery = ({ images, mainImage = "/website/assets/images/product/01.png" }) => {
  const [selectedImage, setSelectedImage] = useState(mainImage);
  console.log(mainImage);

  return (
    <div className="sticky top-32">
      <div className="flex gap-4 mb-8">
        <div className="flex flex-col gap-2">
          {images.map((item, index) => (
            <div
              key={index}
              className={`relative w-16 h-16 object-contain border rounded-lg overflow-hidden cursor-pointer hover:border-red-500 transition-all ${
                selectedImage === item ? "border-red-500 shadow-md" : "border-gray-200"
              }`}
              onClick={() => setSelectedImage(item)}
            >
              <Image
                src={item}
                alt={`Thumbnail ${index + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Play className="h-6 w-6 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="w-64 h-64 border border-gray-200 rounded-lg overflow-hidden group">
          <Image
            src={selectedImage}
            alt="Selected product image"
            width={256}
            height={256}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;

import React, { useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

const RelatedProducts = ({ products }) => {
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden sticky top-32 transition-all hover:shadow-md">
      {/* Header */}
      <div className="bg-red-600 text-white text-sm font-semibold p-3 text-center">TRENDING PRODUCTS</div>

      {/* Product List */}
      <div className="max-h-[600px] overflow-y-auto px-4 pb-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex gap-3 border border-gray-100 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            >
              <div className="w-16 h-16 flex-none bg-gray-50 rounded-md overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 line-clamp-2">{product.title}</p>
                <p className="text-black font-bold mt-1">{product.price}</p>
                {product.discount && <p className="text-green-600 text-xs">{product.discount}</p>}
                <div className="flex items-center justify-between gap-2 mt-2">
                  <div className="flex-shrink-0">
                    {product.platform === "amazon" ? (
                      <Image src="/images/amazon-logo.png" alt="Amazon" width={60} height={20} />
                    ) : (
                      <Image src="/images/flipkart-logo.png" alt="Flipkart" width={60} height={20} />
                    )}
                  </div>
                  <button className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors">
                    <ShoppingBag className="h-3 w-3" />
                    <span>BUY</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">No products found</div>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;

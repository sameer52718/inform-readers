import Image from "next/image";
import { faker } from "@faker-js/faker";
import React from "react";

function ProductCard() {
  // Generate fake product data using Faker.js
  const productName = faker.commerce.productName();
  const productPrice = faker.commerce.price(100, 2000); // Random price between $100 and $2000
  const productImage = faker.image.urlLoremFlickr({ category: "product", height: 300, width: 300 }); // Random product image URL
  const productAlt = `${productName} image`;
  console.log(productImage);

  return (
    <div className="border rounded-lg p-4 bg-white h-60">
      <div className="flex items-center justify-center flex-col">
        <Image src={productImage} width={300} height={300} alt={productAlt} className="w-20 h-32 mb-4" />
        <h4 className="text-[15px] leading-5 line-clamp-2 overflow-hidden">
  {productName}
</h4>

      </div>
      <div className="divider h-[1px] w-full bg-black"></div>
      <div className="py-2 px-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={"/website/assets/images/icons/heart.png"}
            width={1000}
            height={1000}
            alt="product"
            className="w-5 h-auto"
          />
          <Image
            src={"/website/assets/images/icons/share.png"}
            width={1000}
            height={1000}
            alt="product"
            className="w-5 h-auto"
          />
        </div>
        <div>
          <h6 className="text-[#ff0000]">${productPrice}</h6>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

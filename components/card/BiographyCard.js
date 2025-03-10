import Image from "next/image";
import Link from "next/link";
import React from "react";

function BiographyCard({ data }) {
  return (
    <div className="border rounded-2xl border-black p-4 flex items-center justify-center flex-col bg-white gap-3">
      <Link href={"/biography/1"}>
        <Image src={data?.image} width={1000} height={1000} alt="product" className="h-36  w-44 rounded-2xl" />
      </Link>
      <div className="divider h-[1px] w-full bg-black"></div>
      <h6>
        <Link  href={"/biography/1"}> {data?.name} </Link>
      </h6>
    </div>
  );
}

export default BiographyCard;

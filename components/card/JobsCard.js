import Image from "next/image";
import Link from "next/link";
import React from "react";

function JobsCard() {
    return (
        <div className="border rounded-lg md:p-4 p-2 bg-white  border-black">
            <div className="flex items-center  gap-3 pb-4">
                <div className="md:h-20 md:w-20 h-14 w-14 rounded-full">
                    <Link href={"/jobs/1"}>
                        <Image
                            src={"/website/assets/images/logo/01.png"}
                            width={1000}
                            height={1000}
                            alt="product"
                            className="w-full h-full rounded-full"
                        />
                    </Link>
                </div>
                <div className="flex justify-center flex-col">
                    <h5 className="text-gray-600 md:text-xl text-base mb-1">
                        <Link href={"/jobs/1"}>
                            Full Stack Developer
                        </Link>
                    </h5>
                    <div className="flex md:flex-row flex-col  md:items-center md:gap-4 ">
                        <div className="flex items-center gap-1 text-gray-600">
                            <Image src={"/website/assets/images/icons/location.png"} alt="location-icon" width={1000} height={1000} className="w-4 h-auto" />
                            Chivers Rd
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Image src={"/website/assets/images/icons/phone.png"} alt="location-icon" width={1000} height={1000} className="w-4 h-auto" />
                            92-231648230
                        </div>
                    </div>
                </div>
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
                    <h6 className="text-[#ff0000]">Part Time</h6>
                </div>
            </div>
        </div>
    );
}

export default JobsCard;

import Image from "next/image";
import React from "react";

function JobsCard() {
    return (
        <div className="border rounded-lg p-4 bg-white">
            <div className="flex items-center  gap-5 pb-4">
                <div className="h-20 w-20 rounded-full">
                    <Image
                        src={"/website/assets/images/logo/01.png"}
                        width={1000}
                        height={1000}
                        alt="product"
                        className="w-full h-full rounded-full"
                    />
                </div>
                <div className="flex justify-center flex-col">
                    <h5 className="text-gray-600 text-xl mb-1">Full Stack Developer</h5>
                    <div className="flex items-center gap-4">
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

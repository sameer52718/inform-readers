import AdBanner from "@/components/partials/AdBanner";
import HoverBanner from "@/components/partials/HoverBanner";
import React from "react";

function FlightArrival() {
    return (
        <div>
            <AdBanner />

            <div className="px-32 py-8">
                <div className="flex items-center gap-3 mt-6 pb-1 mb-8 border-black relative font-semibold border-b w-fit">
                    <span className="text-red-500">Home</span> / Today / Houly / Daily
                    <div className="absolute top-[28px] left-0 w-14 h-[3px] bg-red-500"></div>
                </div>

                <div className="text-center">
                    <h6 className="text-5xl font-bold mb-1">
                        Flight Timings in <span className="text-red-500">Pakistan</span>{" "}
                    </h6>
                    <p className="text-lg text-red-500 font-semibold">
                        Last Updated: 10th January 2025
                    </p>
                </div>

                <div>
                    <h4 className="text-2xl font-bold my-6">
                        Today's Flight Timing In Pakistan
                    </h4>

                    <div className="bg-[#d9d9d9]  justify-between py-8 px-12 rounded-3xl">
                        <div className="grid grid-cols-3 mb-4">
                            <div className="col-span-1">
                                <h4 className="text-2xl font-bold">Destination</h4>
                            </div>
                            <div className="col-span-1">
                                <h4 className="text-2xl font-bold">Time</h4>
                            </div>
                            <div className="col-span-1">
                                <h4 className="text-2xl font-bold">Price / Type</h4>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 w-full bg-white py-3 px-8 mb-3">
                            <h5 className="text-lg font-bold col-span-1">
                                Lahore to Kashmore
                            </h5>
                            <h5 className="col-span-1 text-lg font-semibold text-black">
                                05:00 PM / 10-01-2025
                            </h5>
                            <h5 className="col-span-1 text-lg font-semibold text-black">
                                Rs. . 2159 / Super Luxury
                            </h5>
                        </div>
                        <div className="grid grid-cols-3 w-full bg-white py-3 px-8 mb-3">
                            <h5 className="text-lg font-bold col-span-1">
                                Lahore to Kashmore
                            </h5>
                            <h5 className="col-span-1 text-lg font-semibold text-black">
                                05:00 PM / 10-01-2025
                            </h5>
                            <h5 className="col-span-1 text-lg font-semibold text-black">
                                Rs. . 2159 / Super Luxury
                            </h5>
                        </div>
                        <div className="grid grid-cols-3 w-full bg-white py-3 px-8 mb-3">
                            <h5 className="text-lg font-bold col-span-1">
                                Lahore to Kashmore
                            </h5>
                            <h5 className="col-span-1 text-lg font-semibold text-black">
                                05:00 PM / 10-01-2025
                            </h5>
                            <h5 className="col-span-1 text-lg font-semibold text-black">
                                Rs. . 2159 / Super Luxury
                            </h5>
                        </div>
                        <div className="grid grid-cols-3 w-full bg-white py-3 px-8 mb-3">
                            <h5 className="text-lg font-bold col-span-1">
                                Lahore to Kashmore
                            </h5>
                            <h5 className="col-span-1 text-lg font-semibold text-black">
                                05:00 PM / 10-01-2025
                            </h5>
                            <h5 className="col-span-1 text-lg font-semibold text-black">
                                Rs. . 2159 / Super Luxury
                            </h5>
                        </div>
                        <div className="grid grid-cols-3 w-full bg-white py-3 px-8 mb-3">
                            <h5 className="text-lg font-bold col-span-1">
                                Lahore to Kashmore
                            </h5>
                            <h5 className="col-span-1 text-lg font-semibold text-black">
                                05:00 PM / 10-01-2025
                            </h5>
                            <h5 className="col-span-1 text-lg font-semibold text-black">
                                Rs. . 2159 / Super Luxury
                            </h5>
                        </div>
                        <div className="grid grid-cols-3 w-full bg-white py-3 px-8 mb-3">
                            <h5 className="text-lg font-bold col-span-1">
                                Lahore to Kashmore
                            </h5>
                            <h5 className="col-span-1 text-lg font-semibold text-black">
                                05:00 PM / 10-01-2025
                            </h5>
                            <h5 className="col-span-1 text-lg font-semibold text-black">
                                Rs. . 2159 / Super Luxury
                            </h5>
                        </div>
                        <div className="grid grid-cols-3 w-full bg-white py-3 px-8 mb-3">
                            <h5 className="text-lg font-bold col-span-1">
                                Lahore to Kashmore
                            </h5>
                            <h5 className="col-span-1 text-lg font-semibold text-black">
                                05:00 PM / 10-01-2025
                            </h5>
                            <h5 className="col-span-1 text-lg font-semibold text-black">
                                Rs. . 2159 / Super Luxury
                            </h5>
                        </div>
                    </div>
                </div>

                <HoverBanner padding="0px" />

                <div>
                    <h4 className="text-3xl font-bold my-3">
                        Latest Comments
                    </h4>

                    <div className="bg-[#d9d9d9] p-6 rounded-2xl border border-black">
                        <div className="mb-5">
                            <div className="bg-white p-4 flex gap-3 rounded-2xl ">
                                <input type="checkbox" />
                                <p className="text-xl font-semibold">Unexpectedly Bahawalpur Airport is so good at services. For my flight timings, I prefer this page. It is very accurate. </p>
                            </div>
                            <p className="ml-10">By: Hamid Khan on 27-07-2019</p>
                        </div>
                        <div className="mb-5">
                            <div className="bg-white p-4 flex gap-3 rounded-2xl ">
                                <input type="checkbox" />
                                <p className="text-xl font-semibold">Unexpectedly Bahawalpur Airport is so good at services. For my flight timings, I prefer this page. It is very accurate. </p>
                            </div>
                            <p className="ml-10">By: Hamid Khan on 27-07-2019</p>
                        </div>
                        <div className="mb-5">
                            <div className="bg-white p-4 flex gap-3 rounded-2xl ">
                                <input type="checkbox" />
                                <p className="text-xl font-semibold">Unexpectedly Bahawalpur Airport is so good at services. For my flight timings, I prefer this page. It is very accurate. </p>
                            </div>
                            <p className="ml-10">By: Hamid Khan on 27-07-2019</p>
                        </div>
                        <div className="mb-5">
                            <div className="bg-white p-4 flex gap-3 rounded-2xl ">
                                <input type="checkbox" />
                                <p className="text-xl font-semibold">Unexpectedly Bahawalpur Airport is so good at services. For my flight timings, I prefer this page. It is very accurate. </p>
                            </div>
                            <p className="ml-10">By: Hamid Khan on 27-07-2019</p>
                        </div>
                    </div>
                </div>

                <div className='mt-10'>
                    <h4 className='text-3xl font-bold mb-3'>
                        Bahawalpur Airport Departure Schedule & Status
                    </h4>

                    <p className='mb-5 font-semibold'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                    </p>

                    <p className='mb-5 font-semibold'>
                        The printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>

                    <p className='mb-5 font-semibold'>
                        When an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default FlightArrival;

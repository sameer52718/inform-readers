import AdBanner from "@/components/partials/AdBanner";
import HoverBanner from "@/components/partials/HoverBanner";
import React from "react";

function FlightArrival() {
    return (
        <div className="container mx-auto">
            <AdBanner />

            <div className="md:px-44 sm:px-6 px-4 py-8">
                <div className="px-4 sm:px-8 md:px-12">
                    {/* Navigation Breadcrumb */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-6 pb-1 mb-6 sm:mb-8 border-black relative font-semibold border-b w-fit text-sm sm:text-base">
                        <span className="text-red-500">Home</span> / Today / Hourly / Daily
                        <div className="absolute bottom-0 left-0 w-10 sm:w-14 h-[2px] sm:h-[3px] bg-red-500"></div>
                    </div>

                    {/* Heading & Subtext */}
                    <div className="text-center">
                        <h6 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-1 leading-tight">
                            Flight Timings in <span className="text-red-500">Pakistan</span>
                        </h6>
                        <p className="text-sm sm:text-lg text-red-500 font-semibold">
                            Last Updated: 10th January 2025
                        </p>
                    </div>
                </div>


                <div className="px-4 sm:px-8 md:px-12">
                    <h4 className="text-xl sm:text-2xl font-bold my-6 text-center sm:text-left">
                        Today's Flight Timing In Pakistan
                    </h4>

                    <div className="bg-[#d9d9d9] py-6 px-6 sm:py-5 sm:px-3 rounded-3xl">
                        <div className="overflow-x-auto">
                            <table className="w-full bg-white rounded-lg shadow-md">
                                <thead className="bg-gray-200">
                                    <tr className="text-left">
                                        <th className="py-3 px-4 text-lg font-bold">Destination</th>
                                        <th className="py-3 px-4 text-lg font-bold">Time</th>
                                        <th className="py-3 px-4 text-lg font-bold">Price / Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array(7).fill().map((_, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="py-3 px-4 text-base sm:text-lg font-bold">Lahore to Kashmore</td>
                                            <td className="py-3 px-4 text-base sm:text-lg font-semibold text-black">
                                                05:00 PM / 10-01-2025
                                            </td>
                                            <td className="py-3 px-4 text-base sm:text-lg font-semibold text-black">
                                                Rs. 2159 / Super Luxury
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>



            <div className="md:px-56 sm:px-12 px-2 py-8">
                <HoverBanner />
            </div>

            <div className="md:px-44 sm:px-6 px-4 py-8">
                <div className="px-4 sm:px-8 md:px-12">
                    <h4 className="text-xl sm:text-3xl font-bold my-3 text-center sm:text-left">
                        Latest Comments
                    </h4>

                    <div className="bg-[#d9d9d9] p-4 sm:p-6 rounded-2xl border border-black">
                        {Array(4).fill().map((_, index) => (
                            <div key={index} className="mb-5">
                                <div className="bg-white p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-2xl shadow-sm">
                                    <input type="checkbox" className="w-5 h-5" />
                                    <p className="text-base sm:text-xl font-semibold">
                                        Unexpectedly, Bahawalpur Airport is so good at services. For my flight timings, I prefer this page. It is very accurate.
                                    </p>
                                </div>
                                <p className="text-sm sm:text-base ml-8 sm:ml-12">By: Hamid Khan on 27-07-2019</p>
                            </div>
                        ))}
                    </div>
                </div>


                <div className="mt-6 px-4 sm:px-6 md:px-12">
                    <h4 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 text-center sm:text-left">
                        Bahawalpur Airport Departure Schedule & Status
                    </h4>

                    <p className="mb-4 sm:mb-5 text-sm sm:text-base font-semibold text-justify sm:text-left">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                    </p>

                    <p className="mb-4 sm:mb-5 text-sm sm:text-base font-semibold text-justify sm:text-left">
                        The printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>

                    <p className="mb-4 sm:mb-5 text-sm sm:text-base font-semibold text-justify sm:text-left">
                        When an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </p>
                </div>

            </div>
        </div>
    );
}

export default FlightArrival;

import AdBanner from "@/components/partials/AdBanner";
import HoverBanner from "@/components/partials/HoverBanner";
import WeatherFilter from "@/components/partials/WeatherFilter";
import { Icon } from "@iconify/react";
import Image from "next/image";
import React from "react";

function RegionPortalCode() {
  return (
    <div>
      <AdBanner />
      <div className="container mx-auto md:px-44 px-4 py-8">
        <h4 className="md:text-4xl text-2xl font-bold my-7 text-center">
          World <span className="text-red-500"> Zip/postal </span> Codes
        </h4>
        <WeatherFilter />
        <div className="mb-5 py-5">
          <h6 className="text-3xl font-semibold mb-3 px-2">Oceania</h6>
          <div className="bg-gray-200 flex items-start px-3 flex-wrap gap-3 rounded-3xl py-6">
            {[...Array(4)].map((_, i) => (
              <>
                <div className="bg-white px-4 py-2 rounded-2xl flex items-center gap-2">
                  <Image
                    src="/website/assets/images/country/01.png"
                    width={500}
                    height={500}
                    alt="country"
                    className="h-auto w-10"
                  />
                  USA
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl flex items-center gap-2">
                  <Image
                    src="/website/assets/images/country/02.png"
                    width={500}
                    height={500}
                    alt="country"
                    className="h-auto w-10"
                  />
                  UK
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl flex items-center gap-2">
                  <Image
                    src="/website/assets/images/country/03.png"
                    width={500}
                    height={500}
                    alt="country"
                    className="h-auto w-10"
                  />
                  New Zealand
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl flex items-center gap-2">
                  <Image
                    src="/website/assets/images/country/02.png"
                    width={500}
                    height={500}
                    alt="country"
                    className="h-auto w-10"
                  />
                  UK
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl flex items-center gap-2">
                  <Image
                    src="/website/assets/images/country/03.png"
                    width={500}
                    height={500}
                    alt="country"
                    className="h-auto w-10"
                  />
                  New Zealand
                </div>
              </>
            ))}
          </div>
        </div>

        <div className="mb-5 py-5">
          <h6 className="text-3xl font-semibold mb-3 px-4 sm:px-2">Regions</h6>
          <div className="bg-gray-300 flex items-start px-4 sm:px-2 flex-wrap gap-4 rounded-3xl py-6">
            <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 w-full">
              {[
                "Azad Jammu And Kashmir",
                "Federal Capital",
                "Balochistan",
                "Gilgit Baltistan",
                "Sindh",
                "Punjab",
                "Khyber Pakhtunkhwa",
              ].map((region, index) => (
                <div key={index} className="text-red-500 lg:text-xl sm:text-base text-sm font-bold flex items-center">
                  <Icon icon="bi:dot" width="16" height="16" className="h-6 w-6 inline" /> {region}
                </div>
              ))}
            </div>
          </div>
        </div>


        <HoverBanner />

        <div className="my-8 px-4 sm:px-2">
          <h6 className="text-3xl font-bold text-center sm:text-left">Search by Map</h6>

          <p className="text-lg font-semibold text-center sm:text-left mt-2">
            Interactive map of zip codes in Pakistan. Click on the location you desire for a postal code/address.
          </p>

          <div className="w-full h-[500px] md:h-[400px] sm:h-[300px] rounded-3xl overflow-hidden mt-6">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.05049102596!2d-74.30915197703663!3d40.697193370199564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1741470646739!5m2!1sen!2s"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>


        <HoverBanner />

        <div className="bg-gray-300 rounded-3xl py-8 md:px-20 px-4 flex md:flex-row flex-col  items-center my-8">
          <div>
            <h4 className="text-3xl font-bold mb-3">How to find a Postal Code</h4>

            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
              the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled it to make a type specimen book. It has survived not only five centuries,
              but also the leap into electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
              and more recently with desktop publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </p>
          </div>
          <Image
            src={"/website/assets/images/postal-code/01.png"}
            width={500}
            height={500}
            alt="country"
            className="h-auto w-72"
          />
        </div>

        <HoverBanner />
      </div>
    </div>
  );
}

export default RegionPortalCode;

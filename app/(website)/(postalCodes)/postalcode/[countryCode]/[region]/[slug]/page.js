// "use client";

// import axiosInstance from "@/lib/axiosInstance";
// import handleError from "@/lib/handleError";
// import { Globe2, MapPin, Navigation, Mail, Share2, Info } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import React, { useEffect, useState } from "react";

// function PostalCodeDetail() {
//   const { slug } = useParams();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const getData = async () => {
//       try {
//         setLoading(true);
//         const { data } = await axiosInstance.get(`/website/postalCode/${slug}`);
//         if (!data.error) {
//           console.log(data.data);

//           setData(data.data);
//         }
//       } catch (error) {
//         handleError(error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getData();
//   }, [slug]);

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-red-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <div className="bg-gradient-to-b from-white to-gray-50">
//         <div className="container mx-auto px-4 py-16">
//           <h1 className="text-center text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
//             {data?.postalCode?.code} - {data?.postalCode?.area}
//           </h1>
//           <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-gray-600">
//             Postal code details for {data?.postalCode?.area}, {data?.postalCode?.state},{" "}
//             {data?.postalCode?.countryId?.name}
//           </p>
//         </div>
//       </div>

//       <div className="container mx-auto px-4">
//         {/* Main Info Card */}
//         <div className="rounded-xl bg-white p-8 shadow-lg">
//           <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-6">
//             <div className="flex items-center gap-4">
//               <Image
//                 src={data?.postalCode?.countryId?.flag}
//                 alt={`${data?.postalCode?.countryId?.name} flag`}
//                 width={48}
//                 height={48}
//                 className="rounded-lg"
//               />
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900">{data?.postalCode?.countryId?.name}</h2>
//                 <p className="text-gray-600">{data?.postalCode?.countryId?.region}</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <button className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-red-600 hover:bg-red-200">
//                 <Share2 className="h-4 w-4" />
//                 Share
//               </button>
//             </div>
//           </div>

//           <div className="grid gap-6 md:grid-cols-2">
//             <div className="space-y-4">
//               <div className="rounded-lg bg-gray-50 p-4">
//                 <h3 className="text-sm font-medium text-gray-500">Postal Code</h3>
//                 <p className="text-2xl font-bold text-red-600">{data?.postalCode?.code}</p>
//               </div>
//               <div className="rounded-lg bg-gray-50 p-4">
//                 <h3 className="text-sm font-medium text-gray-500">Area</h3>
//                 <p className="text-xl font-semibold text-gray-900">{data?.postalCode?.area}</p>
//               </div>
//               <div className="rounded-lg bg-gray-50 p-4">
//                 <h3 className="text-sm font-medium text-gray-500">State/Province</h3>
//                 <p className="text-xl font-semibold text-gray-900">{data?.postalCode?.state}</p>
//               </div>
//             </div>

//             <div className="rounded-lg bg-gray-50 p-6">
//               <h3 className="mb-4 text-lg font-semibold text-gray-900">About This Location</h3>
//               <p className="text-gray-600">
//                 This postal code serves the area of {data?.postalCode?.area} in {data?.postalCode?.state},{" "}
//                 {data?.postalCode?.countryId?.name}. It follows the standard{" "}
//                 {data?.postalCode?.countryId?.name} postal code format and is used for mail delivery and
//                 address identification.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Other Countries in Region */}
//         <div className="my-12">
//           <h2 className="mb-6 text-2xl font-bold text-gray-900">
//             Other Countries in {data?.postalCode?.countryId?.region}
//           </h2>
//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
//             {data?.otherCountries?.slice(0, 8).map((country) => (
//               <Link
//                 key={country._id}
//                 href={`/postalcode/${country.countryCode}`}
//                 className="transform rounded-xl border bg-white p-4 transition-all hover:scale-105 hover:shadow-md"
//               >
//                 <div className="flex items-center gap-3">
//                   <Image
//                     src={country.flag}
//                     alt={`${country.name} flag`}
//                     width={32}
//                     height={32}
//                     className="rounded"
//                   />
//                   <span className="font-medium text-gray-900">{country.name}</span>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>

//         {/* Postal Code Information */}
//         <div className="my-12 rounded-xl bg-white p-8 shadow-lg">
//           <h2 className="mb-6 text-2xl font-bold text-gray-900">Understanding Postal Codes</h2>
//           <div className="prose max-w-none">
//             <p>
//               Postal codes in {data?.postalCode?.countryId?.name} follow a structured format that helps in
//               efficient mail sorting and delivery. Each code is unique to a specific area and helps postal
//               services route mail accurately.
//             </p>

//             <h3 className="mt-6 text-xl font-semibold">Key Information</h3>
//             <ul className="list-disc space-y-2 pl-6">
//               <li>Format: 5-digit numeric code</li>
//               <li>First digits usually indicate the region or state</li>
//               <li>Later digits specify the local delivery area</li>
//               <li>Used by both domestic and international mail services</li>
//             </ul>

//             <h3 className="mt-6 text-xl font-semibold">Common Uses</h3>
//             <ul className="list-disc space-y-2 pl-6">
//               <li>Postal and courier services</li>
//               <li>Online shopping delivery</li>
//               <li>Geographic information systems</li>
//               <li>Business registration</li>
//             </ul>
//           </div>
//         </div>

//         {/* Regions */}
//         <div className="my-12">
//           <h2 className="mb-6 text-2xl font-bold text-gray-900">
//             Regions in {data?.postalCode?.countryId?.name}
//           </h2>
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {data?.regions?.map((region) => (
//               <div
//                 key={region}
//                 className="flex transform items-center rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
//               >
//                 <div className="mr-4 rounded-full bg-red-100 p-2">
//                   <Navigation className="h-5 w-5 text-red-600" />
//                 </div>
//                 <span className="font-medium text-gray-900">{region}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PostalCodeDetail;

"use client";

import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { Globe2, MapPin, Navigation, Mail, Share2, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function PostalCodeDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/website/postalCode/${slug}`);
        if (!data.error) {
          console.log(data.data);
          setData(data.data);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-red-600 to-pink-500 mb-4">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-center text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            {data?.postalCode?.code} - {data?.postalCode?.area}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-white">
            Postal code details for {data?.postalCode?.area}, {data?.postalCode?.state},{" "}
            {data?.postalCode?.countryId?.name}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Main Info Card */}
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-6">
            <div className="flex items-center gap-4">
              <Image
                src={data?.postalCode?.countryId?.flag}
                alt={`${data?.postalCode?.countryId?.name} flag`}
                width={48}
                height={48}
                className="rounded-lg"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{data?.postalCode?.countryId?.name}</h2>
                <p className="text-gray-600">{data?.postalCode?.countryId?.region}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-red-600 hover:bg-red-200">
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="text-sm font-medium text-gray-500">Postal Code</h3>
                <p className="text-2xl font-bold text-red-600">{data?.postalCode?.code}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="text-sm font-medium text-gray-500">Area</h3>
                <p className="text-xl font-semibold text-gray-900">{data?.postalCode?.area}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="text-sm font-medium text-gray-500">State/Province</h3>
                <p className="text-xl font-semibold text-gray-900">{data?.postalCode?.state}</p>
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">About This Location</h3>
              <p className="text-gray-600">
                This postal code serves the area of {data?.postalCode?.area} in {data?.postalCode?.state},{" "}
                {data?.postalCode?.countryId?.name}. It follows the standard{" "}
                {data?.postalCode?.countryId?.name} postal code format and is used for mail delivery and
                address identification.
              </p>
            </div>
          </div>
        </div>
        {/* Other Countries in Region */}
        <div className="my-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Other Countries in {data?.postalCode?.countryId?.region}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data?.otherCountries?.slice(0, 12).map((country) => (
              <Link
                key={country._id}
                href={`/postalcode/${country.countryCode}`}
                className="transform rounded-xl border bg-white p-4 transition-all hover:scale-105 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={country.flag}
                    alt={`${country.name} flag`}
                    width={32}
                    height={32}
                    className="rounded"
                  />
                  <span className="font-medium text-gray-900">{country.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {/* Postal Code Overview */}
        <section className="my-12 rounded-xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            What Is the Purpose of Postal Code {data?.postalCode?.code}?
          </h2>
          <p className="text-gray-600">
            Postal code {data?.postalCode?.code} serves as a unique identifier for {data?.postalCode?.area}{" "}
            within {data?.postalCode?.state}, {data?.postalCode?.countryId?.name}. It is used by postal
            services to efficiently route and deliver mail to the correct location. Additionally, postal codes
            like {data?.postalCode?.code} are widely used in digital mapping systems, e-commerce platforms,
            and logistics to ensure accurate delivery of goods and services.
          </p>
        </section>

        {/* Key Functions */}
        <section className="my-12 rounded-xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Key Functions of Postal Code {data?.postalCode?.code}
          </h2>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">1. Efficient Mail Delivery</h3>
            <p className="text-gray-600">
              Postal code {data?.postalCode?.code} ensures that mail and packages are delivered quickly and
              accurately to residents and businesses in {data?.postalCode?.area}.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">2. Accurate Navigation</h3>
            <p className="text-gray-600">
              This postal code helps pinpoint locations in {data?.postalCode?.area}, making it an essential
              tool for navigation and geographic identification.
            </p>
            <h3 className="text-lg font-semibold text-gray-900">3. Support for E-commerce</h3>
            <p className="text-gray-600">
              Online retailers rely on postal codes like {data?.postalCode?.code} to calculate shipping costs
              and delivery times for customers in {data?.postalCode?.area}.
            </p>
          </div>
        </section>
        <div className="my-12">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Regions in {data?.postalCode?.countryId?.name}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data?.regions?.map((region) => (
              <div
                key={region}
                className="flex transform items-center rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                <div className="mr-4 rounded-full bg-red-100 p-2">
                  <Navigation className="h-5 w-5 text-red-600" />
                </div>
                <span className="font-medium text-gray-900">{region}</span>
              </div>
            ))}
          </div>
        </div>
        {/* City/Area and Postal Code Info */}
        <section className="my-12 rounded-xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">About {data?.postalCode?.area}</h2>
          <p className="text-gray-600">
            {data?.postalCode?.area}, located in {data?.postalCode?.state}, is known for its unique blend of
            culture, history, and modern development. The postal code {data?.postalCode?.code} covers a
            diverse area that includes residential neighborhoods, business hubs, and local landmarks.
          </p>
        </section>

        {/* FAQ Section */}
        <section className="my-12 rounded-xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                1. What Areas Does Postal Code {data?.postalCode?.code} Cover?
              </h3>
              <p className="text-gray-600">
                Postal code {data?.postalCode?.code} includes locations within {data?.postalCode?.area},{" "}
                {data?.postalCode?.state}, and is designed to streamline mail delivery across the area.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                2. Is {data?.postalCode?.code} Specific to Residential or Business Areas?
              </h3>
              <p className="text-gray-600">
                Postal code {data?.postalCode?.code} covers both residential and business areas, making it
                versatile for the entire community.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                3. Can I Use Postal Code {data?.postalCode?.code} for International Shipments?
              </h3>
              <p className="text-gray-600">
                Yes, postal code {data?.postalCode?.code} is valid for both domestic and international
                shipments originating or destined for {data?.postalCode?.area}.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PostalCodeDetail;

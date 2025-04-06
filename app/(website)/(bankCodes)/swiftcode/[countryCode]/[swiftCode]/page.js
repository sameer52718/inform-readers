"use client";

import AdBanner from "@/components/partials/AdBanner";
import HoverBanner from "@/components/partials/HoverBanner";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { Building2, Globe2, MapPin } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function LocationTable({ data = [] }) {
  const { countryCode } = useParams();
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr className="border-b bg-red-600">
              <th className="p-4 text-left text-sm font-medium text-white">Bank</th>
              <th className="p-4 text-left text-sm font-medium text-white">City</th>
              <th className="p-4 text-left text-sm font-medium text-white">Branch</th>
              <th className="p-4 text-left text-sm font-medium text-white">Swift Code</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.length > 0 ? (
              data.map((code, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4 text-sm">{code?.bank}</td>
                  <td className="p-4 text-sm">{code?.city}</td>
                  <td className="p-4 text-sm">{code?.branch || "---"}</td>
                  <td className="p-4">
                    <Link
                      href={`/swiftcode/${countryCode}/${code?.swiftCode}`}
                      className="text-sm font-medium text-red-600 hover:text-red-700"
                    >
                      {code?.swiftCode}
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-sm text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PostalCodeDetail() {
  const { swiftCode } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get(`/website/bankCode/${swiftCode}`);
        if (!data.error) {
          setData(data.bankCodes);
          setRelated(data.related);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [swiftCode]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdBanner />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
          Bank Swift Code Details
        </h1>

        <div className="mt-12 rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Banking Services Offered by {data?.bank}
          </h2>
          <p className="mt-4 text-gray-600">
            At <span className="font-medium text-gray-900">{data?.bank}</span>, customers can access a variety
            of services designed to cater to both personal and corporate needs. Some of the core offerings
            include:
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border bg-gray-50 p-6">
              <h6 className="font-semibold text-gray-900">Personal Banking</h6>
              <p className="mt-2 text-sm text-gray-600">
                From savings accounts to personal loans, {data?.bank} ensures that individual customers have
                access to essential financial products.
              </p>
            </div>
            <div className="rounded-xl border bg-gray-50 p-6">
              <h6 className="font-semibold text-gray-900">Business Banking</h6>
              <p className="mt-2 text-sm text-gray-600">
                For businesses operating in {data?.city}, {data?.bank} provides tailored solutions like
                business loans, trade financing, and cash management services.
              </p>
            </div>
            <div className="rounded-xl border bg-gray-50 p-6">
              <h6 className="font-semibold text-gray-900">International Transfers</h6>
              <p className="mt-2 text-sm text-gray-600">
                Using the SWIFT Code <span className="font-medium">{data?.swiftCode}</span>, customers can
                securely send and receive funds across the globe.
              </p>
            </div>
            <div className="rounded-xl border bg-gray-50 p-6">
              <h6 className="font-semibold text-gray-900">Investment Services</h6>
              <p className="mt-2 text-sm text-gray-600">
                The bank offers investment plans and advisory services to help customers grow their wealth
                responsibly.
              </p>
            </div>
          </div>
        </div>
        <div className="my-4">
          <HoverBanner />
        </div>

        <div className="mt-12">
          <div className="rounded-xl bg-gradient-to-r from-red-600 to-red-700 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">SWIFT Code: {data?.swiftCode}</h2>
            <p className="mt-2 text-red-100">Detailed information about this bank's SWIFT code</p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4 rounded-lg bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Bank Name</p>
                <p className="text-lg font-semibold text-gray-900">{data?.bank}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-lg font-semibold text-gray-900">
                  {data?.branch ? `${data.branch}, ` : ""}
                  {data?.city}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Globe2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Country</p>
                <p className="text-lg font-semibold text-gray-900">{data?.countryId?.name}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="my-4">
          <HoverBanner />
        </div>
        <div className=" rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Importance of the SWIFT Code: {data?.swiftCode}
          </h2>
          <p className="mt-4 text-gray-600">
            The SWIFT Code, also known as a Bank Identifier Code (BIC), is an essential tool for international
            banking. Here's why the {data?.swiftCode} of {data?.bank} is important:
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border bg-gray-50 p-6">
              <h3 className="text-lg font-semibold text-gray-900">Secure Transactions</h3>
              <p className="mt-2 text-sm text-gray-600">
                The {data?.swiftCode} ensures that your international transfers are conducted through secure
                channels.
              </p>
            </div>
            <div className="rounded-xl border bg-gray-50 p-6">
              <h3 className="text-lg font-semibold text-gray-900">Global Recognition</h3>
              <p className="mt-2 text-sm text-gray-600">
                The {data?.swiftCode} helps identify the {data?.branch || "main"} branch in {data?.city},{" "}
                {data?.countryId?.name}, ensuring accurate processing of transactions.
              </p>
            </div>
            <div className="rounded-xl border bg-gray-50 p-6">
              <h3 className="text-lg font-semibold text-gray-900">Fast Transfers</h3>
              <p className="mt-2 text-sm text-gray-600">
                Using the {data?.swiftCode}, funds can be sent and received quickly, minimizing delays.
              </p>
            </div>
          </div>
        </div>
        <div className="my-4">
          <HoverBanner />
        </div>

        <div className="">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-6">
            {[
              {
                q: `What is the SWIFT Code for ${data?.bank}?`,
                a: `The SWIFT Code for ${data?.bank} is ${data?.swiftCode}, used for secure and efficient international money transfers.`,
              },
              {
                q: `Where is the ${data?.branch || "main"} branch of ${data?.bank} located?`,
                a: `The ${data?.branch || "main"} branch is located in ${data?.city}, ${
                  data?.countryId?.name
                }.`,
              },
              {
                q: "Can I use the SWIFT Code for online transactions?",
                a: `Yes, the SWIFT Code ${data?.swiftCode} can be used for global transfers and other international banking services.`,
              },
              {
                q: `What services are offered at the ${data?.branch || "main"} branch?`,
                a: "The branch provides services such as personal banking, business banking, investment solutions, and international money transfers.",
              },
              {
                q: `Is ${data?.bank} suitable for international banking?`,
                a: `Absolutely! With its reliable SWIFT Code ${data?.swiftCode} and global network, ${data?.bank} is an excellent choice for international transactions.`,
              },
            ].map((faq, index) => (
              <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h6 className="font-medium text-gray-900">{faq.q}</h6>
                <p className="mt-2 text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="my-4">
          <HoverBanner />
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">More {data?.bank} Branches</h2>
            <LocationTable data={related} />
          </div>
        )}

        <div className="mt-12">
          <HoverBanner />
        </div>
      </div>
    </div>
  );
}

export default PostalCodeDetail;

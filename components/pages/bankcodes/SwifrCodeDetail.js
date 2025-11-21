"use client";

import AdBanner from "@/components/partials/AdBanner";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { Building2, Globe2, MapPin } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../specification/Breadcrumb";

function LocationTable({ data = [] }) {
  const { t } = useTranslation();
  const { bankSlug, branchSlug } = useParams();
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max border-collapse">
          <thead>
            <tr className="border-b bg-red-600">
              <th className="p-4 text-left text-sm font-medium text-white">
                {t("swiftcodeDetail.tableHeaders.bank")}
              </th>
              <th className="p-4 text-left text-sm font-medium text-white">
                {t("swiftcodeDetail.tableHeaders.city")}
              </th>
              <th className="p-4 text-left text-sm font-medium text-white">
                {t("swiftcodeDetail.tableHeaders.branch")}
              </th>
              <th className="p-4 text-left text-sm font-medium text-white">
                {t("swiftcodeDetail.tableHeaders.swiftCode")}
              </th>
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
                      href={`/bank-codes/${bankSlug}/${branchSlug}/${code?.swiftCode}`}
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
                  {t("swiftcodeDetail.noData")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SwiftCodeDetail() {
  const { t } = useTranslation();
  const { swiftCode, bankSlug, branchSlug } = useParams();
  const [data, setData] = useState(null);
  const [related, setRelated] = useState([]);
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get(`/website/bankCode/${swiftCode}`);
        if (!data.error) {
          setData(data.bankCodes);
          setRelated(data.related);
          setContent(data.content);
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

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Swift Codes", href: "/bank-codes" },
    { label: data?.bank, href: `/bank-codes/${bankSlug}` },
    { label: data?.branch, href: `/bank-codes/${bankSlug}/${branchSlug}` },
    { label: data.swiftCode }, // last one: no href (current page)
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdBanner />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Heading */}
        <h1 className="text-center text-3xl font-bold tracking-tight mb-6 text-gray-900 sm:text-4xl md:text-5xl">
          {content?.title}
        </h1>

        <Breadcrumb items={breadcrumbItems} />
        <section className="mb-12 rounded-xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Swift Code System Details</h2>
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="text-sm font-medium text-gray-500">Banking Authority</h3>
            <p className={`text-xl font-semibold ${"text-gray-900"}`}>
              {content?.constants?.banking_authority}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="text-sm font-medium text-gray-500">Systems Used</h3>
            <p className={`text-xl font-semibold ${"text-gray-900"}`}>
              {content?.constants?.systems_used?.join?.(", ")}
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="text-sm font-medium text-gray-500">Routing Structure</h3>
            <p className={`text-xl font-semibold ${"text-gray-900"}`}>
              {content?.constants?.routing_structure}
            </p>
          </div>
        </section>

        {/* SWIFT Code Details Section */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-10 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bank Information</h2>
          <div className="mb-6">
            <p className="text-gray-600">{content?.paragraph}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600">Country:</p>
              <p className="font-medium text-gray-900">{data?.countryId?.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Bank:</p>
              <p className="font-medium text-gray-900">{data.bank}</p>
            </div>
            <div>
              <p className="text-gray-600">Branch:</p>
              <p className="font-medium text-gray-900">{data.branch}</p>
            </div>
            <div>
              <p className="text-gray-600">Swift Code:</p>
              <p className="font-medium text-gray-900">{data.swiftCode}</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {t("swiftcodeDetail.faqTitle").replace("{bank}", data?.bank)}
          </h2>
          <div className="mt-6 space-y-6">
            {content?.faqs?.map((faq, index) => (
              <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900">{faq.question}</h3>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Branches Section */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
              {t("swiftcodeDetail.relatedBranchesTitle").replace("{bank}", data?.bank)}
            </h2>
            <LocationTable data={related} />
          </div>
        )}
      </div>
    </div>
  );
}

export default SwiftCodeDetail;

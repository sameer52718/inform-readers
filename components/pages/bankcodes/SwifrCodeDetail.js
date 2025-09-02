"use client";

import AdBanner from "@/components/partials/AdBanner";
import HoverBanner from "@/components/partials/HoverBanner";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { Building2, Globe2, MapPin } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { generateFAQs } from "@/templates/faq"; // Import FAQ generator from baby names
import { getCountryCodeFromHost } from "@/lib/getCountryFromSubdomain";

function LocationTable({ data = [] }) {
  const { t } = useTranslation();
  const { countryCode } = useParams();
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
  const { swiftCode, countryCode } = useParams();
  const [data, setData] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    // Detect subdomain and generate FAQs
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      const country = getCountryCodeFromHost(host);
      setFaqs(generateFAQs(country, "swiftcode")); // Pass context to generate SWIFT code-specific FAQs
    }
  }, []);

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
        {/* Hero Heading */}
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
          {t("swiftcodeDetail.heroTitle").replace("{bank}", data?.bank).replace("{swiftCode}", data?.swiftCode)}
        </h1>
        <p className="mt-4 text-center text-lg text-gray-600">
          {t("swiftcodeDetail.heroDescription")
            .replace("{bank}", data?.bank)
            .replace("{city}", data?.city)
            .replace("{country}", data?.countryId?.name)}
        </p>

        {/* Services Section */}
        <div className="mt-12 rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {t("swiftcodeDetail.servicesTitle").replace("{bank}", data?.bank)}
          </h2>
          <p className="mt-4 text-gray-600">
            {t("swiftcodeDetail.servicesDescription").replace("{bank}", data?.bank)}
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {t("swiftcodeDetail.services", { returnObjects: true }).map((service, index) => (
              <div key={index} className="rounded-xl border bg-gray-50 p-6">
                <h6 className="font-semibold text-gray-900">{service.title}</h6>
                <p className="mt-2 text-sm text-gray-600">
                  {service.description
                    .replace("{bank}", data?.bank)
                    .replace("{city}", data?.city)
                    .replace("{swiftCode}", data?.swiftCode)}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="my-4">
          <HoverBanner />
        </div>

        {/* SWIFT Code Details Section */}
        <div className="mt-12">
          <div className="rounded-xl bg-gradient-to-r from-red-600 to-red-700 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              {t("swiftcodeDetail.swiftCodeTitle").replace("{swiftCode}", data?.swiftCode)}
            </h2>
            <p className="mt-2 text-red-100">
              {t("swiftcodeDetail.swiftCodeDescription").replace("{bank}", data?.bank)}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4 rounded-lg bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t("swiftcodeDetail.bankNameLabel")}</p>
                <p className="text-lg font-semibold text-gray-900">{data?.bank}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{t("swiftcodeDetail.locationLabel")}</p>
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
                <p className="text-sm font-medium text-gray-500">{t("swiftcodeDetail.countryLabel")}</p>
                <p className="text-lg font-semibold text-gray-900">{data?.countryId?.name}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="my-4">
          <HoverBanner />
        </div>

        {/* Importance Section */}
        <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {t("swiftcodeDetail.importanceTitle")
              .replace("{swiftCode}", data?.swiftCode)
              .replace("{bank}", data?.bank)}
          </h2>
          <p className="mt-4 text-gray-600">
            {t("swiftcodeDetail.importanceDescription")
              .replace("{swiftCode}", data?.swiftCode)
              .replace("{bank}", data?.bank)}
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {t("swiftcodeDetail.importanceFeatures", { returnObjects: true }).map((feature, index) => (
              <div key={index} className="rounded-xl border bg-gray-50 p-6">
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {feature.description
                    .replace("{swiftCode}", data?.swiftCode)
                    .replace("{branch}", data?.branch || "main")
                    .replace("{city}", data?.city)
                    .replace("{country}", data?.countryId?.name)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="my-4">
          <HoverBanner />
        </div>

        {/* FAQ Section */}
        <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {t("swiftcodeDetail.faqTitle").replace("{bank}", data?.bank)}
          </h2>
          <div className="mt-6 space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900">
                  {faq.question
                    .replace("{bank}", data?.bank)
                    .replace("{branch}", data?.branch || "main")
                    .replace("{swiftCode}", data?.swiftCode)
                    .replace("{city}", data?.city)
                    .replace("{country}", data?.countryId?.name)}
                </h3>
                <p className="mt-2 text-gray-600">
                  {faq.answer
                    .replace("{bank}", data?.bank)
                    .replace("{branch}", data?.branch || "main")
                    .replace("{city}", data?.city)
                    .replace("{country}", data?.countryId?.name)
                    .replace("{swiftCode}", data?.swiftCode)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="my-4">
          <HoverBanner />
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

        <div className="my-4">
          <HoverBanner />
        </div>
      </div>
    </div>
  );
}

export default SwiftCodeDetail;
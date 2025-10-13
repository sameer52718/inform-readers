"use client";

import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axiosInstance.post("/website/newsletter", { email });
      if (!data.error) {
        toast.success("Email Submitted For Future Newsletter updates.");
        setEmail("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <footer className={`bg-gradient-to-br from-red-600 to-red-800 text-gray-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold mb-4">{t("footer.aboutCompany")}</h3>
            <p className="text-sm leading-relaxed">{t("footer.aboutText")}</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">{t("footer.categories")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/names" className="hover:text-white flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    {t("footer.links.babyNames")}
                  </Link>
                </li>
                <li>
                  <Link href="/postalcode" className="hover:text-white flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    {t("footer.links.postalCodes")}
                  </Link>
                </li>
                <li>
                  <Link href="/software" className="hover:text-white flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    {t("footer.links.software")}
                  </Link>
                </li>
                <li>
                  <Link href="/swiftcode" className="hover:text-white flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    {t("footer.links.swiftCodes")}
                  </Link>
                </li>
                <li>
                  <Link href="/specification" className="hover:text-white flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    {t("footer.links.specifications")}
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="hover:text-white flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    {t("footer.links.news")}
                  </Link>
                </li>
                <li>
                  <Link href="/biography" className="hover:text-white flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    {t("footer.links.biography")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">{t("footer.quickLinks")}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:text-white flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    {t("footer.links.about")}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    {t("footer.links.contact")}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    {t("footer.links.privacy")}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    {t("footer.links.terms")}
                  </Link>
                </li>
                <li>
                  <Link href="/dcmapolicy" className="hover:text-white flex items-center">
                    <ChevronRight className="h-4 w-4 mr-1" />
                    {t("footer.links.dmca")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">{t("footer.contactUs")}</h3>
            <ul className="space-y-3">
              {/* <li className="flex items-start"><MapPin className="h-5 w-5 mr-2 mt-1" /><span>{t('footer.address')}</span></li>
              <li className="flex items-center"><Phone className="h-5 w-5 mr-2" /><span>{t('footer.phone')}</span></li> */}
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span>{t("footer.email")}</span>
              </li>
              <li className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                <span>{t("footer.website")}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">{t("footer.newsletter")}</h3>
            <p className="text-sm mb-4">{t("footer.newsletterText")}</p>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                type="email"
                autoComplete="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 text-black rounded-md focus:outline-none focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className={`w-full px-4 py-2 text-white rounded-md border border-white transition-colors hover:bg-white hover:text-red-500`}
              >
                {t("footer.subscribeButton")}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-sm">
              © {new Date().getFullYear()} InformReaders. {t("footer.rights")}
            </div>
            <div className="mt-4 md:mt-0">
              <a href="https://thebytepulse.com" target="_blank" className="text-sm">
                {t("footer.poweredBy")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

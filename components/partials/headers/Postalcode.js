"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { allLanguages, languageNames, rtlLanguages } from "@/constant/languages";
import { userTypes } from "@/constant/data";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";

function LanguageSelect() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = rtlLanguages.includes(lng) ? "rtl" : "ltr";
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-md bg-gray-100`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{languageNames[i18n.language] || "English"}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-48 bg-white rounded-lg shadow-dropdown max-h-96 overflow-y-auto">
          {allLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => changeLanguage(lang)}
              className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors ${
                i18n.language === lang ? `bg-red-50 text-red-600` : ""
              }`}
            >
              {languageNames[lang]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NamesHeader() {
  const { t } = useTranslation();
  const { token, userType } = useSelector(state => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axiosInstance.get("/common/country", { params: { country: true } });
        if (!data.error) {
          // Map API response to categories format and shuffle
          const fetchedCategories = (data?.response?.country || []).map((cat, index) => ({
            id: cat.id || index + 1,
            title: cat.name || t(`header.categories.${cat.key || "unknown"}`),
            url: cat.url || `/postalcode/${cat.countryCode}`,
          }));
          // Shuffle categories
          const shuffledCategories = fetchedCategories.sort(() => Math.random() - 0.5);
          setCategories(shuffledCategories.slice(0, 6));
        } else {
          handleError(new Error(data.message || "Failed to fetch categories"));
        }
      } catch (error) {
        handleError(error);
      }
    };
    getData();
  }, [t]);

  return (
    <header className="w-full bg-white shadow-base">
      {/* Top Bar */}
      <div className="bg-red-50 py-2">
        <div className="container">
          <div className="flex justify-between items-center">
            <p className="text-sm hidden md:block text-gray-600">{currentDate}</p>
            <div className="flex items-center gap-4">
              <LanguageSelect />
              <Link href="/about" className={`text-sm text-gray-600 hover:text-red-600 transition-colors`}>
                {t("header.about")}
              </Link>
              <Link href="/contact" className={`text-sm text-gray-600 hover:text-red-600 transition-colors`}>
                {t("header.contact")}
              </Link>
              {token && userType === userTypes.USER ? (
                <Link
                  href="/dashboard"
                  className={`text-sm text-red-600 hover:text-red-700 font-medium transition-colors`}
                >
                  {t("header.myAccount")}
                </Link>
              ) : (
                <Link
                  href="/signin"
                  className={`text-sm text-red-600 hover:text-red-700 font-medium transition-colors`}
                >
                  {t("header.signin")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container py-4 flex items-center justify-between">
        <Link href="/">
          <Image
            src={"/website/assets/images/logo/logo.png"}
            alt="Website Logo"
            width={200}
            height={80}
            className="h-[80px] w-auto"
          />
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`p-2 text-gray-600 hover:text-red-600 transition-colors md:hidden`}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            {categories.length > 0 ? (
              categories.map((category) => (
                <li key={category.id}>
                  <Link href={category.url} className={`text-gray-700 hover:text-red-600 transition-colors`}>
                    {category.title}
                  </Link>
                </li>
              ))
            ) : (
              <li>
                <span className="text-gray-500">Loading categories...</span>
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container py-4">
            <ul className="space-y-2">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={category.url}
                      className={`block py-2 text-gray-700 hover:text-red-600 transition-colors`}
                    >
                      {category.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <span className="block py-2 text-gray-500">Loading Countries...</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}

export default NamesHeader;

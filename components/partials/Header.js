"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import { userTypes } from "@/constant/data";

function Header() {
  const { token, userType } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const categories = [
    { id: 1, title: "Baby Names", url: "/name-meaning" },
    { id: 2, title: "Postal Codes", url: "/postalcode" },
    { id: 3, title: "Swift Codes", url: "/swiftcode" },
    { id: 4, title: "Software & Games", url: "/software" },
    { id: 5, title: "Specifications", url: "/specification" },
    { id: 6, title: "Travel", url: "/travel" },
    { id: 7, title: "Biography", url: "/biography" },

    {
      id: 9,
      title: "More",
      sublinks: [
        // { id: 1, title: "Sports", url: "/sports" },
        // { id: 2, title: "Entertainment", url: "/entertainment" },
        // { id: 3, title: "Lifestyle", url: "/lifestyle" },
        { id: 4, title: "Jobs", url: "/jobs" },
        { id: 5, title: "Real State", url: "/realstate" },
        { id: 6, title: "Coupons", url: "/coupons" },
        { id: 7, title: "Weather", url: "/weather" },
        { id: 8, title: "News", url: "/news" },
        { id: 10, title: "Video Downloader", url: "/video-downloader" },
      ],
    },
  ];

  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <header className="w-full bg-white shadow-base">
      {/* Top Bar */}
      <div className="bg-red-50 py-2">
        <div className="container">
          <div className="flex justify-between items-center">
            <p className="text-sm hidden md:block text-gray-600">{currentDate}</p>
            <div className="flex items-center gap-4">
              <Link href="/about" className="text-sm text-gray-600 hover:text-red-600">
                About
              </Link>
              <Link href="/contact" className="text-sm text-gray-600 hover:text-red-600">
                Contact
              </Link>
              {token && userType === userTypes.USER ? (
                <Link href="/dashboard" className="text-sm text-red-600 hover:text-red-700 font-medium">
                  My Account
                </Link>
              ) : (
                <Link href="/signin" className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      {/* Main Header */}
      <div className="container py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/website/assets/images/logo/logo.png"
            alt="Website Logo"
            width={200}
            height={80}
            className="h-[80px] w-auto"
          />
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-red-600"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            {categories.map((category) => (
              <li key={category.id} className="relative group">
                {category.sublinks ? (
                  <button className="flex items-center gap-1 text-gray-700 hover:text-red-600">
                    {category.title}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                ) : (
                  <Link href={category.url} className="text-gray-700 hover:text-red-600 transition-colors">
                    {category.title}
                  </Link>
                )}

                {category.sublinks && (
                  <ul className="absolute hidden group-hover:block bg-white shadow-dropdown rounded-lg py-2 w-48 z-50">
                    {category.sublinks.map((sublink) => (
                      <li key={sublink.id}>
                        <Link
                          href={sublink.url}
                          className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                        >
                          {sublink.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container py-4">
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  {category.sublinks ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(category.id)}
                        className="flex items-center justify-between w-full py-2 text-gray-700"
                      >
                        {category.title}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            openDropdowns[category.id] ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openDropdowns[category.id] && (
                        <ul className="pl-4 space-y-1">
                          {category.sublinks.map((sublink) => (
                            <li key={sublink.id}>
                              <Link
                                href={sublink.url}
                                className="block py-1 text-gray-600 hover:text-red-600"
                              >
                                {sublink.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link href={category.url} className="block py-2 text-gray-700 hover:text-red-600">
                      {category.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;

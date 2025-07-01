'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import { userTypes } from '@/constant/data';
import { useTranslation } from 'react-i18next';
import { allLanguages, languageNames, rtlLanguages } from '@/constant/languages';


function LanguageSelect({ color }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = rtlLanguages.includes(lng) ? 'rtl' : 'ltr';
    setIsOpen(false);
  };

  // Click outside logic
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
        className={`flex items-center gap-2 text-sm text-gray-600 hover:text-${color}-600 transition-colors px-3 py-2 rounded-md bg-gray-100`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{languageNames[i18n.language] || 'English'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-48 bg-white rounded-lg shadow-dropdown max-h-96 overflow-y-auto">
          {allLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => changeLanguage(lang)}
              className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-${color}-50 hover:text-${color}-600 transition-colors ${i18n.language === lang ? `bg-${color}-50 text-${color}-600` : ''
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


function Header() {
  const { t } = useTranslation();
  const { color, logo } = useSelector((state) => state.config);
  const { token, userType } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const categories = [
    { id: 1, title: t('header.categories.names'), url: '/names' },
    { id: 2, title: t('header.categories.postalcode'), url: '/postalcode' },
    { id: 3, title: t('header.categories.swiftcode'), url: '/swiftcode' },
    { id: 4, title: t('header.categories.software'), url: '/software' },
    { id: 5, title: t('header.categories.specification'), url: '/specification' },
    { id: 7, title: t('header.categories.biography'), url: '/biography' },
    {
      id: 9,
      title: t('header.categories.more'),
      sublinks: [
        { id: 7, title: t('header.categories.weather'), url: '/weather' },
        { id: 8, title: t('header.categories.news'), url: '/news' },
        { id: 10, title: t('header.categories.forex'), url: '/forex' },
        { id: 11, title: t('header.categories.metals'), url: '/metals' },
        { id: 16, title: t('header.categories.crypto'), url: '/crypto' },
        { id: 12, title: t('header.categories.cars'), url: '/cars' },
        { id: 13, title: t('header.categories.bikes'), url: '/bikes' },
        { id: 14, title: t('header.categories.tools'), url: '/tools' },
        { id: 15, title: t('header.categories.videoDownloader'), url: '/video-downloader' },
        { id: 19, title: t('header.categories.coupons'), url: '/coupons' },
        { id: 17, title: t('header.categories.jobs'), url: '/jobs' },
        { id: 18, title: t('header.categories.realstate'), url: '/realstate' },
        { id: 20, title: t('header.categories.blogs'), url: '/blogs' },
        { id: 21, title: t('header.categories.timeDate'), url: '/time-and-date' },
        { id: 22, title: t('header.categories.sports'), url: '/sports' },
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
              <LanguageSelect color={color} />
              <Link
                href="/about"
                className={`text-sm text-gray-600 hover:text-${color}-600 transition-colors`}
              >
                {t('header.about')}
              </Link>
              <Link
                href="/contact"
                className={`text-sm text-gray-600 hover:text-${color}-600 transition-colors`}
              >
                {t('header.contact')}
              </Link>
              {token && userType === userTypes.USER ? (
                <Link
                  href="/dashboard"
                  className={`text-sm text-${color}-600 hover:text-${color}-700 font-medium transition-colors`}
                >
                  {t('header.myAccount')}
                </Link>
              ) : (
                <Link
                  href="/signin"
                  className={`text-sm text-${color}-600 hover:text-${color}-700 font-medium transition-colors`}
                >
                  {t('header.signin')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container py-4 flex items-center justify-between">
        <Link href="/">
          <Image src={logo} alt="Website Logo" width={200} height={80} className="h-[80px] w-auto" />
        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`p-2 text-gray-600 hover:text-${color}-600 transition-colors md:hidden`}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            {categories.map((category) => (
              <li key={category.id} className="relative group">
                {category.sublinks ? (
                  <button
                    className={`flex items-center gap-1 text-gray-700 hover:text-${color}-600 transition-colors`}
                    onClick={() => toggleDropdown(category.id)}
                    aria-expanded={openDropdowns[category.id] || false}
                    aria-haspopup="true"
                  >
                    {category.title}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    href={category.url}
                    className={`text-gray-700 hover:text-${color}-600 transition-colors`}
                  >
                    {category.title}
                  </Link>
                )}

                {category.sublinks && (
                  <ul
                    className={`absolute ${openDropdowns[category.id] || 'hidden group-hover:block'
                      } bg-white shadow-dropdown rounded-lg py-2 w-48 z-50`}
                  >
                    {category.sublinks.map((sublink) => (
                      <li key={sublink.id}>
                        <Link
                          href={sublink.url}
                          className={`block px-4 py-2 text-gray-700 hover:bg-${color}-50 hover:text-${color}-600 transition-colors`}
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
                        className={`flex items-center justify-between w-full py-2 text-gray-700 hover:text-${color}-600 transition-colors`}
                        aria-expanded={openDropdowns[category.id] || false}
                        aria-haspopup="true"
                      >
                        {category.title}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${openDropdowns[category.id] ? 'rotate-180' : ''
                            }`}
                        />
                      </button>
                      {openDropdowns[category.id] && (
                        <ul className="pl-4 space-y-1">
                          {category.sublinks.map((sublink) => (
                            <li key={sublink.id}>
                              <Link
                                href={sublink.url}
                                className={`block py-1 text-gray-600 hover:text-${color}-600 transition-colors`}
                              >
                                {sublink.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={category.url}
                      className={`block py-2 text-gray-700 hover:text-${color}-600 transition-colors`}
                    >
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

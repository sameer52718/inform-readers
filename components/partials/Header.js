// import Image from "next/image";
// import Link from "next/link";
// import React from "react";

// function Header() {
//   const currentDate = new Date().toLocaleDateString("en-US", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   const handleOpen = (id) => {
//     const element = document.getElementById(id);
//     element.classList.toggle("hidden");
//   };

//   const links = [
//     {
//       id: 1,
//       title: "Mobiles",
//       url: "/",
//     },
//     {
//       id: 2,
//       title: "Laptops",
//       url: "/",
//     },
//     {
//       id: 3,
//       title: "Tv",
//       url: "/",
//     },
//     {
//       id: 4,
//       title: "Tablets",
//       url: "/",
//     },
//     {
//       id: 5,
//       title: "Smart Watches",
//       url: "/",
//     },
//     {
//       id: 6,
//       title: "Games",
//       url: "/",
//     },
//     {
//       id: 7,
//       title: "Headphone",
//       url: "/",
//     },
//     {
//       id: 8,
//       title: "Speakers",
//       url: "/",
//     },
//     {
//       id: 9,
//       title: "Cameras",
//       url: "/",
//     },
//     {
//       id: 10,
//       title: "Printers",
//       url: "/",
//     },
//     {
//       id: 11,
//       title: "More",
//       url: "/",
//       sublinks: [
//         {
//           id: 1,
//           title: "Mobiles",
//           url: "/",
//         },
//         {
//           id: 2,
//           title: "Laptops",
//           url: "/",
//         },
//       ],
//     },
//   ];

//   return (
//     <header className="  text-white text-center ">
//       <div className="flex sm:flex-row flex-col items-center justify-between bg-gray-100 md:px-16 sm:px-10 py-3">
//         <div>
//           <h6 className="text-black">{currentDate}</h6>
//         </div>
//         <div className="flex items-center gap-3 text-black">
//           <button>
//             <Link href={"/"} className="!text-black-500">
//               About
//             </Link>
//           </button>
//           <button>
//             <Link href={"/"} className="!text-black-500">
//               Contact
//             </Link>
//           </button>
//           <button className="px-4 py-2">
//             <Link href={"/"} className="text-xl  text-outline">
//               My account
//             </Link>
//           </button>
//         </div>
//       </div>

//       <div className="flex items-center justify-center border-gray-300 border-[2px]">
//         <Link href="/">
//           <Image
//             src="/website/assets/images/logo/logo.png"
//             alt="Vercel Logo"
//             width={2000}
//             height={2000}
//             className="md:w-[490px] w-[400px] h-auto p-4"
//           />
//         </Link>
//       </div>
//       <div className="border-b-2 border-black">
//         <ul className="flex flex-wrap items-center justify-center sm:justify-around px-5 sm:px-10 md:px-14 py-3 gap-4">
//           {links.map((link) => (
//             <li key={link.id} className="text-black relative text-lg cursor-pointer">
//               <Link href={link.url} className=" !text-black-500 flex items-center">
//                 {link.title}
//                 {link.sublinks && (
//                   <Image
//                     src="/website/assets/images/icons/caret-down.png"
//                     alt="Caret Down"
//                     width={20}
//                     height={20}
//                     className="w-[20px] h-[20px] mt-1"
//                   />
//                 )}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </header>
//   );
// }

// export default Header;


"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Menu, X, ChevronDown, } from "lucide-react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    { id: 8, title: "News", url: "/news" },
    {
      id: 9,
      title: "More",
      sublinks: [
        { id: 1, title: "Sports", url: "/sports" },
        { id: 2, title: "Entertainment", url: "/entertainment" },
        { id: 3, title: "Lifestyle", url: "/lifestyle" },
      ],
    },
  ];

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
              <Link href="/account" className="text-sm text-red-600 hover:text-red-700 font-medium">
                My Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container py-4">
        <div className="flex items-center justify-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Link href="/">
              <Image
                src="/website/assets/images/logo/logo.png"
                alt="Vercel Logo"
                width={2000}
                height={2000}
                className="md:w-[490px] w-[400px] h-auto "
              />
            </Link>
          </Link>



          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-red-600"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t border-gray-100">
        <div className="container">
          <ul className="hidden md:flex items-center gap-8 py-4">
            {categories.map((category) => (
              <li key={category.id} className="relative group">
                {category.sublinks ? (
                  <button className="flex items-center gap-1 text-gray-700 hover:text-red-600">
                    {category.title}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    href={category.url}
                    className="text-gray-700 hover:text-red-600 transition-colors"
                  >
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
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container py-4">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-red-500"
              />
            </div>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  {category.sublinks ? (
                    <button
                      onClick={() => { }}
                      className="flex items-center justify-between w-full py-2 text-gray-700"
                    >
                      {category.title}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link
                      href={category.url}
                      className="block py-2 text-gray-700 hover:text-red-600"
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

export default Header
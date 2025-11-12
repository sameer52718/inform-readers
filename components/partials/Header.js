"use client";

import React from "react";
import { usePathname } from "next/navigation";
import DefaultHeader from "./headers/Default";
import NamesHeader from "./headers/Names";
import SwiftcodeHeader from "./headers/Swiftcode";

function Header() {
  const pathname = usePathname();

  // Map routes to header components
  const headerComponents = {
    "/names": NamesHeader,
    "/bank-codes": SwiftcodeHeader,
  };

  // Find the first matching route
  const matchedRoute = Object.keys(headerComponents).find((route) => pathname.startsWith(route));
  const HeaderComponent = matchedRoute ? headerComponents[matchedRoute] : DefaultHeader;

  return <HeaderComponent />;
}

export default Header;

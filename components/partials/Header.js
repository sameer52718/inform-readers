"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import DefaultHeader from "./headers/Default";
import NamesHeader from "./headers/Names";
import PostalcodeHeader from "./headers/Postalcode";
import SwiftcodeHeader from "./headers/Swiftcode";

function Header() {
  const pathname = usePathname();

  // Map routes to header components
  const headerComponents = {
    "/names": NamesHeader,
    "/postalcode": PostalcodeHeader,
    "/swiftcode": SwiftcodeHeader,
  };

  // Find the first matching route
  const matchedRoute = Object.keys(headerComponents).find((route) => pathname.startsWith(route));
  const HeaderComponent = matchedRoute ? headerComponents[matchedRoute] : DefaultHeader;

  return <HeaderComponent />;
}

export default Header;

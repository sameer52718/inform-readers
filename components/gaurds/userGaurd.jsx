"use client"; // if using app directory

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { userTypes } from "@/constant/data";

const UserGaurd = ({ children }) => {
  const router = useRouter();
  const { token, userType } = useSelector((state) => state.auth);

  const isAuthenticated = Boolean(token && userType === userTypes.USER);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/signin");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return children;
};

export default UserGaurd;

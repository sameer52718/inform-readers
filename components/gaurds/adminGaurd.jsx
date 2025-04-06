"use client"; // if using app directory

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { userTypes } from "@/constant/data";

const AdminGuard = ({ children }) => {
  const router = useRouter();
  const { user, userType } = useSelector((state) => state.auth);

  const isAuthenticated = Boolean(user && userType === userTypes.ADMIN);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return children;
};

export default AdminGuard;

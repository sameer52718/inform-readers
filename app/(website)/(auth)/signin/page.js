"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import handleError from "@/lib/handleError";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { userTypes } from "@/constant/data";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/auth";
import { useTranslation } from "react-i18next";

export default function SignupPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      const { data } = await axiosInstance.post("/user/auth/signin", formData);
      if (!data.error) {
        const { user, token } = data;
        dispatch(setAuth({ user: user, token: token, userType: userTypes.USER }));
        router.replace("/");
        toast.success(t("signup.successMessage"));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="space-y-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-red-600 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("signin.backToHome")}
          </Link>

          <div>
            <h2 className="text-3xl font-bold text-gray-900">{t("signin.title")}</h2>
            <p className="mt-2 text-sm text-gray-600">
              {t("signin.description")}{" "}
              <Link href="/signin" className="text-red-600 hover:text-red-700 font-medium">
                {t("signin.signupLink")}
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t("signin.emailLabel")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 outline-none"
                placeholder={t("signin.emailPlaceholder")}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t("signin.passwordLabel")}
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 outline-none"
                  placeholder={t("signin.passwordPlaceholder")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex disabled:opacity-70 justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                {t("signin.submitButton")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { Globe, X, ArrowRight, MapPin } from "lucide-react";

export default function CountryDialog({ countryCode }) {
  const [open, setOpen] = useState(false);
  const [countryData, setCountryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!countryCode) return;

    const fetchCountryData = async () => {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
        const data = await response.json();
        setCountryData(data[0]);
        setLoading(false);

        // Check if dialog was already shown in this session
        const dialogShown = sessionStorage.getItem("countryDialogShown");
        if (!dialogShown) {
          setOpen(true);
          sessionStorage.setItem("countryDialogShown", "yes");
        }
      } catch (error) {
        console.error("Error fetching country data:", error);
        setLoading(false);
      }
    };

    fetchCountryData();
  }, [countryCode]);

  if (!open || loading || !countryData) return null;

  const countryName = countryData.name.common;
  const flag = countryData.flag;
  const subdomain = countryName.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="fixed inset-0 bg-black-500/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-in zoom-in-95 duration-300">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-red-500 via-red-600 to-orange-500 p-6 pb-20">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-3 text-white">
            <Globe size={28} className="animate-pulse" />
            <h2 className="text-2xl font-bold">Location Detected</h2>
          </div>
        </div>

        {/* Content card overlapping header */}
        <div className="relative -mt-12 mx-6 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="text-6xl">{flag}</div>
            <div>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <MapPin size={14} />
                <span>You're browsing from</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{countryName}</h3>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-red-100 rounded-lg p-4 mb-6">
            <p className="text-gray-700 text-sm leading-relaxed">
              Get the best experience with localized content on{" "}
              <span className="font-semibold text-red-600">{subdomain}.informreaders.com</span>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setOpen(false)}
              className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Stay Here
            </button>
            <a
              href={`https://${subdomain}.informreaders.com`}
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            >
              Switch
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Bottom padding */}
        <div className="h-6"></div>
      </div>
    </div>
  );
}

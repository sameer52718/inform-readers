"use client";
import { useEffect, useState } from "react";

export default function CountryDialog({ country }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!country) return;

    // Dialog sirf pehli dafa show ho
    if (!localStorage.getItem("countryDialogShown")) {
      setOpen(true);
      localStorage.setItem("countryDialogShown", "yes");
    }
  }, [country]);

  if (!open) return null;

  const subdomain = country.toLowerCase();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm">
        <h2 className="text-xl font-semibold mb-4">You are browsing from: {country}</h2>
        <p className="mb-6">Would you like to switch to {subdomain}.informreaders.com?</p>

        <div className="flex justify-end gap-2">
          <button onClick={() => setOpen(false)} className="px-4 py-2 rounded bg-gray-200">
            Stay Here
          </button>
          <a
            href={`https://${subdomain}.informreaders.com`}
            className="px-4 py-2 rounded bg-red-600 text-white"
          >
            Switch
          </a>
        </div>
      </div>
    </div>
  );
}

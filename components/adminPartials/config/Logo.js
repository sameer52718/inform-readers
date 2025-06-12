import React, { useRef, useState } from "react";
import SubmitButton from "@/components/ui/SubmitButton";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import handleError from "@/lib/handleError";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Select from "@/components/ui/Select";

const colors = [
  "zinc",
  "neutral",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "pink",
  "rose",
];

const WebsiteLogo = () => {
  const { logo, color } = useSelector((state) => state.config);
  const [profile, setProfile] = useState(null);
  const [selectedColor, setSelectedColor] = useState(color || colors[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef();

  const handleUpdate = async () => {
    try {
      // Validate inputs
      if (!profile && selectedColor === color) {
        toast.warn("No changes to update");
        return;
      }

      setIsSubmitting(true);
      const formData = new FormData();
      if (profile) {
        formData.append("logo", profile);
      }
      console.log(selectedColor);

      if (selectedColor !== color) {
        formData.append("themeColor", selectedColor);
      }

      const { data } = await axiosInstance.post("/admin/config", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(data.message);
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title="Shop Configuration">
      <div className="space-y-6">
        {/* Logo Section */}
        <div>
          <h3 className="text-lg font-medium mb-2">Shop Logo</h3>
          <div className="relative mb-5">
            <div
              className="absolute bg-gray-100 h-8 w-8 rounded-full bottom-0 left-[70px] grid place-items-center cursor-pointer"
              onClick={() => inputRef.current.click()}
            >
              <Icon icon="bx:edit" />
              <input
                type="file"
                ref={inputRef}
                hidden
                onChange={(e) => setProfile(e.target.files[0])}
                accept="image/*"
              />
            </div>
            <div className="w-[100px] h-[100px] border border-gray-200 rounded">
              <img
                src={profile ? URL.createObjectURL(profile) : logo || "/default-logo.png"}
                alt="Shop Logo"
                className="h-full w-full object-contain p-2"
              />
            </div>
          </div>
        </div>

        {/* Color Section */}
        <div>
          <h3 className="text-lg font-medium mb-2">Theme Color</h3>
          <Select
            options={colors.map((color) => ({
              value: color,
              label: color.charAt(0).toUpperCase() + color.slice(1),
            }))}
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            placeholder="Select a theme color"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <SubmitButton
            isSubmitting={isSubmitting}
            type="button"
            onClick={handleUpdate}
            text="Update Configuration"
          />
        </div>
      </div>
    </Card>
  );
};

export default WebsiteLogo;

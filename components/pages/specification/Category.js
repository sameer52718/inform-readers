"use client";

import HoverBanner from "@/components/partials/HoverBanner";
import Loading from "@/components/ui/Loading";
import axiosInstance from "@/lib/axiosInstance";
import handleError from "@/lib/handleError";
import { Icon } from "@iconify/react";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Heart, X, Menu } from "lucide-react";
import Image from "next/image";
import { userTypes } from "@/constant/data";

const SpecificationCard = ({ product, category }) => {
  const { userType, user } = useSelector((state) => state.auth);
  const [isHovered, setIsHovered] = useState(false);
  const [wishlist, setWishlist] = useState(product?.wishlist?.includes(user?._id) || false);

  const handleWishlist = async () => {
    try {
      if (userType !== userTypes.USER) {
        toast.warn("You Have to login first!");
        return;
      }

      setWishlist((prev) => !prev);
      await axiosInstance.post("/website/specification/wishlist", { id: product._id });
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full"
    >
      <div className="relative p-3 pb-2">
        <Link href={`/specification/${category}/${product._id}`} className="block overflow-hidden rounded-lg">
          <motion.div
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
            className="relative aspect-[4/3] w-full"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover rounded-lg"
              priority
            />
          </motion.div>
        </Link>

        <h3 className="mt-3 text-sm font-medium text-gray-800 line-clamp-2 h-10">
          <Link
            href={`/specification/${category}/${product._id}`}
            className="hover:text-red-600 transition-colors"
          >
            {product.name}
          </Link>
        </h3>
      </div>

      <div className="h-px w-full bg-gray-200" />

      <div className="p-3 pt-2 flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-red-500 transition-colors"
          aria-label="Add to favorites"
          onClick={handleWishlist}
        >
          <Heart className="h-5 w-5" fill={wishlist ? "red" : "transparent"} />
        </motion.button>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-red-600 font-semibold text-sm md:text-base"
        >
          {product.price} {product.priceSymbol}
        </motion.div>
      </div>
    </motion.div>
  );
};

function Filters({ isFilterOpen, handleFilterChange, filters, toggleFilter, categoryName }) {
  const [brand, setBrand] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});


  // Normalize category names from API to filter groups
  const effectiveCategory = React.useMemo(() => {
    const raw = (categoryName || "").toLowerCase();
    if (!raw) return "";
    if (
      raw.includes("mobile") ||
      raw.includes("tablet") ||
      raw.includes("ipad") ||
      raw.includes("mvobiles")
    ) {
      return "Mobiles & Tablets";
    }
    if (raw.includes("laptop") || raw.includes("computer")) {
      return "Laptops & Computers";
    }
    if (raw.includes("camera")) {
      return "Cameras & Drones";
    }
    if (raw.includes("game") || raw.includes("console")) {
      return "Gaming";
    }
    if (raw.includes("tv") || raw.includes("entertainment") || raw.includes("projector")) {
      return "TVs & Home Entertainment";
    }
    if (raw.includes("printer") || raw.includes("office")) {
      return "Printers & Office Equipment";
    }
    if (raw.includes("appliance") || raw.includes("home & kitchen")) {
      return "Home & Kitchen Appliances";
    }
    // Accessories and others can be extended as needed
    if (
      raw.includes("airpods") ||
      raw.includes("watch") ||
      raw.includes("smart watch") ||
      raw.includes("accessor")
    ) {
      return "Accessories";
    }
    return categoryName;
  }, [categoryName]);

  const isMobiles =
    effectiveCategory === "Mobiles & Tablets" ||
    effectiveCategory === "Mobiles" ||
    effectiveCategory === "Tablets";
  const isLaptops = effectiveCategory === "Laptops & Computers";
  const isCameras = effectiveCategory === "Cameras & Drones";
  const isTVs = effectiveCategory === "TVs & Home Entertainment";
  const isGaming = effectiveCategory === "Gaming";
  const isPrinters = effectiveCategory === "Printers & Office Equipment";
  const isHomeAppliances = effectiveCategory === "Home & Kitchen Appliances";


  const CheckboxGroup = ({
    title,
    items,
    groupKey,
    isItemChecked,
    onToggleItem,
    renderItemLabel = (item) => item,
    getItemValue = (item) => item,
    maxVisible = 10,
  }) => {
    const isExpanded = !!expandedGroups[groupKey];
    const showToggle = items.length > maxVisible;
    const visibleItems = isExpanded ? items : items.slice(0, maxVisible);

    return (
      <div>
        <h3 className="text-sm font-medium text-gray-800">{title}</h3>
        {visibleItems.map((item) => {
          const value = getItemValue(item);
          return (
            <label key={value} className="block text-sm">
              <input
                type="checkbox"
                value={value}
                checked={isItemChecked(value)}
                onChange={() => onToggleItem(value)}
                className="mr-2"
              />
              {renderItemLabel(item)}
            </label>
          );
        })}
        {showToggle && (
          <button
            type="button"
            onClick={() => setExpandedGroups((prev) => ({ ...prev, [groupKey]: !isExpanded }))}
            className="mt-2 text-xs text-red-600 hover:underline"
          >
            {isExpanded ? "See less" : `See more (${items.length - visibleItems.length} more)`}
          </button>
        )}
      </div>
    );
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const [brandRes] = await Promise.all([axiosInstance.get("/common/brand")]);
        setBrand(brandRes?.data?.brands || []);
      } catch (error) {
        handleError(error);
      }
    };
    getData();
  }, []);

  return (
    <AnimatePresence>
      {isFilterOpen && (
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          exit={{ x: -300 }}
          className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 p-4 overflow-y-auto md:static md:col-span-3"
        >
          <div className="flex justify-between items-center mb-4 md:hidden">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button onClick={toggleFilter} className="text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="space-y-6">
            {/* Brand Filter with See More */}
            <CheckboxGroup
              title="Brand"
              items={brand}
              groupKey="brand"
              isItemChecked={(val) => filters.brand.includes(val)}
              onToggleItem={(val) => handleFilterChange("brand", val)}
              renderItemLabel={(item) => item.name}
              getItemValue={(item) => item._id || item.name}
              maxVisible={10}
            />
            {/* Price Range Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-800">Price Range</h3>
              {[
                { value: "0-10000", label: "Under PKR 10,000" },
                { value: "10000-20000", label: "PKR 10,000-20,000" },
                { value: "20000-50000", label: "PKR 20,000-50,000" },
                { value: "50000-100000", label: "PKR 50,000-100,000" },
                { value: "100000-", label: "Above PKR 100,000" },
              ].map(({ value, label }) => (
                <label key={value} className="block text-sm">
                  <input
                    type="checkbox"
                    value={value}
                    checked={filters.priceRange.includes(value)}
                    onChange={() => handleFilterChange("priceRange", value)}
                    className="mr-2"
                  />
                  {label}
                </label>
              ))}
            </div>
            {/* Availability Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-800">Availability</h3>
              {["In Stock", "Out of Stock", "Pre-Order"].map((avail) => (
                <label key={avail} className="block text-sm">
                  <input
                    type="checkbox"
                    value={avail}
                    checked={filters.availability.includes(avail)}
                    onChange={() => handleFilterChange("availability", avail)}
                    className="mr-2"
                  />
                  {avail}
                </label>
              ))}
            </div>
            {/* Condition Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-800">Condition</h3>
              {["New", "Refurbished", "Used"].map((cond) => (
                <label key={cond} className="block text-sm">
                  <input
                    type="checkbox"
                    value={cond}
                    checked={filters.condition.includes(cond)}
                    onChange={() => handleFilterChange("condition", cond)}
                    className="mr-2"
                  />
                  {cond}
                </label>
              ))}
            </div>
            {/* Category-Specific Filters */}
            {isMobiles && (
              <>
                <CheckboxGroup
                  title="RAM"
                  items={["2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB"]}
                  groupKey="mobiles_ram"
                  isItemChecked={(v) => filters.ram.includes(v)}
                  onToggleItem={(v) => handleFilterChange("ram", v)}
                  maxVisible={6}
                />
                <CheckboxGroup
                  title="Storage"
                  items={["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"]}
                  groupKey="mobiles_storage"
                  isItemChecked={(v) => filters.storage.includes(v)}
                  onToggleItem={(v) => handleFilterChange("storage", v)}
                  maxVisible={6}
                />
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Camera</h3>
                  {["12MP", "48MP", "50MP", "108MP", "200MP"].map((camera) => (
                    <label key={camera} className="block text-sm">
                      <input
                        type="checkbox"
                        value={camera}
                        checked={filters.camera.includes(camera)}
                        onChange={() => handleFilterChange("camera", camera)}
                        className="mr-2"
                      />
                      {camera}
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Battery Capacity</h3>
                  {[
                    { value: "0-4000", label: "Under 4000mAh" },
                    { value: "4000-5000", label: "4000-5000mAh" },
                    { value: "5000-6000", label: "5000-6000mAh" },
                    { value: "6000-", label: "Above 6000mAh" },
                  ].map(({ value, label }) => (
                    <label key={value} className="block text-sm">
                      <input
                        type="checkbox"
                        value={value}
                        checked={filters.battery.includes(value)}
                        onChange={() => handleFilterChange("battery", value)}
                        className="mr-2"
                      />
                      {label}
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Screen Size</h3>
                  {[
                    { value: "0-5", label: "Under 5 inches" },
                    { value: "5-6", label: "5-6 inches" },
                    { value: "6-7", label: "6-7 inches" },
                    { value: "7-", label: "Above 7 inches" },
                  ].map(({ value, label }) => (
                    <label key={value} className="block text-sm">
                      <input
                        type="checkbox"
                        value={value}
                        checked={filters.screenSize.includes(value)}
                        onChange={() => handleFilterChange("screenSize", value)}
                        className="mr-2"
                      />
                      {label}
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Display Type</h3>
                  {["AMOLED", "IPS LCD", "TFT", "Super AMOLED"].map((type) => (
                    <label key={type} className="block text-sm">
                      <input
                        type="checkbox"
                        value={type}
                        checked={filters.displayType.includes(type)}
                        onChange={() => handleFilterChange("displayType", type)}
                        className="mr-2"
                      />
                      {type}
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Processor</h3>
                  {["Snapdragon", "MediaTek", "Exynos", "Apple A-Series"].map((proc) => (
                    <label key={proc} className="block text-sm">
                      <input
                        type="checkbox"
                        value={proc}
                        checked={filters.processor.includes(proc)}
                        onChange={() => handleFilterChange("processor", proc)}
                        className="mr-2"
                      />
                      {proc}
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Operating System</h3>
                  {["Android", "iOS"].map((os) => (
                    <label key={os} className="block text-sm">
                      <input
                        type="checkbox"
                        value={os}
                        checked={filters.os.includes(os)}
                        onChange={() => handleFilterChange("os", os)}
                        className="mr-2"
                      />
                      {os}
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Network Support</h3>
                  {["4G", "5G", "No 5G"].map((net) => (
                    <label key={net} className="block text-sm">
                      <input
                        type="checkbox"
                        value={net}
                        checked={filters.network.includes(net)}
                        onChange={() => handleFilterChange("network", net)}
                        className="mr-2"
                      />
                      {net}
                    </label>
                  ))}
                </div>
                <CheckboxGroup
                  title="Features"
                  items={["Fingerprint Sensor", "Face Unlock", "PTA Approved", "Dual SIM", "Waterproof"]}
                  groupKey="mobiles_features"
                  isItemChecked={(v) => filters.features.includes(v)}
                  onToggleItem={(v) => handleFilterChange("features", v)}
                  maxVisible={4}
                />
              </>
            )}
            {isLaptops && (
              <>
                <CheckboxGroup
                  title="Processor"
                  items={[
                    "Intel Core i3",
                    "Intel Core i5",
                    "Intel Core i7",
                    "Intel Core i9",
                    "AMD Ryzen 3",
                    "AMD Ryzen 5",
                    "AMD Ryzen 7",
                    "AMD Ryzen 9",
                    "Apple M1",
                    "Apple M2",
                  ]}
                  groupKey="laptops_processor"
                  isItemChecked={(v) => filters.processor.includes(v)}
                  onToggleItem={(v) => handleFilterChange("processor", v)}
                  maxVisible={6}
                />
                <div>
                  <h3 className="text-sm font-medium text-gray-800">RAM</h3>
                  {["4GB", "8GB", "16GB", "32GB", "64GB"].map((ram) => (
                    <label key={ram} className="block text-sm">
                      <input
                        type="checkbox"
                        value={ram}
                        checked={filters.ram.includes(ram)}
                        onChange={() => handleFilterChange("ram", ram)}
                        className="mr-2"
                      />
                      {ram}
                    </label>
                  ))}
                </div>
                <CheckboxGroup
                  title="Storage Type"
                  items={["HDD", "SSD", "Hybrid"]}
                  groupKey="laptops_storage_type"
                  isItemChecked={(v) => filters.storageType.includes(v)}
                  onToggleItem={(v) => handleFilterChange("storageType", v)}
                  maxVisible={3}
                />
                <CheckboxGroup
                  title="Storage Capacity"
                  items={["128GB", "256GB", "512GB", "1TB", "2TB"]}
                  groupKey="laptops_storage_capacity"
                  isItemChecked={(v) => filters.storage.includes(v)}
                  onToggleItem={(v) => handleFilterChange("storage", v)}
                  maxVisible={4}
                />
                <CheckboxGroup
                  title="Screen Size"
                  items={[
                    { value: "0-13", label: "Under 13 inches" },
                    { value: "13-14", label: "13-14 inches" },
                    { value: "15-16", label: "15-16 inches" },
                    { value: "16-", label: "Above 16 inches" },
                  ]}
                  groupKey="laptops_screen_size"
                  isItemChecked={(v) => filters.screenSize.includes(v)}
                  onToggleItem={(v) => handleFilterChange("screenSize", v)}
                  renderItemLabel={(item) => item.label}
                  getItemValue={(item) => item.value}
                  maxVisible={4}
                />
                <CheckboxGroup
                  title="Graphics Card"
                  items={["Integrated", "NVIDIA GeForce", "AMD Radeon"]}
                  groupKey="laptops_graphics"
                  isItemChecked={(v) => filters.graphicsCard.includes(v)}
                  onToggleItem={(v) => handleFilterChange("graphicsCard", v)}
                  maxVisible={3}
                />
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Operating System</h3>
                  {["Windows", "macOS", "Linux"].map((os) => (
                    <label key={os} className="block text-sm">
                      <input
                        type="checkbox"
                        value={os}
                        checked={filters.os.includes(os)}
                        onChange={() => handleFilterChange("os", os)}
                        className="mr-2"
                      />
                      {os}
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Laptop Type</h3>
                  {["Gaming", "Ultrabook", "Business", "2-in-1", "Chromebook"].map((type) => (
                    <label key={type} className="block text-sm">
                      <input
                        type="checkbox"
                        value={type}
                        checked={filters.laptopType.includes(type)}
                        onChange={() => handleFilterChange("laptopType", type)}
                        className="mr-2"
                      />
                      {type}
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Display Resolution</h3>
                  {["HD", "Full HD", "2K", "4K"].map((res) => (
                    <label key={res} className="block text-sm">
                      <input
                        type="checkbox"
                        value={res}
                        checked={filters.displayResolution.includes(res)}
                        onChange={() => handleFilterChange("displayResolution", res)}
                        className="mr-2"
                      />
                      {res}
                    </label>
                  ))}
                </div>
              </>
            )}
            {isCameras && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Camera Type</h3>
                  {["DSLR", "Mirrorless", "Point & Shoot", "Action Camera"].map((type) => (
                    <label key={type} className="block text-sm">
                      <input
                        type="checkbox"
                        value={type}
                        checked={filters.cameraType.includes(type)}
                        onChange={() => handleFilterChange("cameraType", type)}
                        className="mr-2"
                      />
                      {type}
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Megapixels</h3>
                  {[
                    { value: "0-16", label: "Under 16MP" },
                    { value: "16-24", label: "16-24MP" },
                    { value: "24-36", label: "24-36MP" },
                    { value: "36-", label: "Above 36MP" },
                  ].map(({ value, label }) => (
                    <label key={value} className="block text-sm">
                      <input
                        type="checkbox"
                        value={value}
                        checked={filters.megapixels.includes(value)}
                        onChange={() => handleFilterChange("megapixels", value)}
                        className="mr-2"
                      />
                      {label}
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Sensor Type</h3>
                  {["APS-C", "Full Frame", "Micro Four Thirds"].map((type) => (
                    <label key={type} className="block text-sm">
                      <input
                        type="checkbox"
                        value={type}
                        checked={filters.sensorType.includes(type)}
                        onChange={() => handleFilterChange("sensorType", type)}
                        className="mr-2"
                      />
                      {type}
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Lens Mount</h3>
                  {["Canon EF", "Nikon F", "Sony E"].map((mount) => (
                    <label key={mount} className="block text-sm">
                      <input
                        type="checkbox"
                        value={mount}
                        checked={filters.lensMount.includes(mount)}
                        onChange={() => handleFilterChange("lensMount", mount)}
                        className="mr-2"
                      />
                      {mount}
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Video Resolution</h3>
                  {["1080p", "4K", "6K", "8K"].map((res) => (
                    <label key={res} className="block text-sm">
                      <input
                        type="checkbox"
                        value={res}
                        checked={filters.videoResolution.includes(res)}
                        onChange={() => handleFilterChange("videoResolution", res)}
                        className="mr-2"
                      />
                      {res}
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Features</h3>
                  {["Wi-Fi", "Touchscreen", "Image Stabilization", "Weather-Sealed"].map((feat) => (
                    <label key={feat} className="block text-sm">
                      <input
                        type="checkbox"
                        value={feat}
                        checked={filters.cameraFeatures.includes(feat)}
                        onChange={() => handleFilterChange("cameraFeatures", feat)}
                        className="mr-2"
                      />
                      {feat}
                    </label>
                  ))}
                </div>
              </>
            )}
            {isTVs && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Screen Size</h3>
                  {[
                    { value: "0-32", label: "Under 32 inches" },
                    { value: "32-43", label: "32-43 inches" },
                    { value: "50-55", label: "50-55 inches" },
                    { value: "55-", label: "Above 55 inches" },
                  ].map(({ value, label }) => (
                    <label key={value} className="block text-sm">
                      <input
                        type="checkbox"
                        value={value}
                        checked={filters.screenSize.includes(value)}
                        onChange={() => handleFilterChange("screenSize", value)}
                        className="mr-2"
                      />
                      {label}
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Resolution</h3>
                  {["HD", "Full HD", "4K", "8K"].map((res) => (
                    <label key={res} className="block text-sm">
                      <input
                        type="checkbox"
                        value={res}
                        checked={filters.resolution.includes(res)}
                        onChange={() => handleFilterChange("resolution", res)}
                        className="mr-2"
                      />
                      {res}
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Display Type</h3>
                  {["LED", "OLED", "QLED"].map((type) => (
                    <label key={type} className="block text-sm">
                      <input
                        type="checkbox"
                        value={type}
                        checked={filters.displayType.includes(type)}
                        onChange={() => handleFilterChange("displayType", type)}
                        className="mr-2"
                      />
                      {type}
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Smart TV</h3>
                  {["Yes", "No"].map((smart) => (
                    <label key={smart} className="block text-sm">
                      <input
                        type="checkbox"
                        value={smart}
                        checked={filters.smartTv.includes(smart)}
                        onChange={() => handleFilterChange("smartTv", smart)}
                        className="mr-2"
                      />
                      {smart}
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Features</h3>
                  {["Wi-Fi", "HDR", "Voice Control", "Smart Apps"].map((feat) => (
                    <label key={feat} className="block text-sm">
                      <input
                        type="checkbox"
                        value={feat}
                        checked={filters.tvFeatures.includes(feat)}
                        onChange={() => handleFilterChange("tvFeatures", feat)}
                        className="mr-2"
                      />
                      {feat}
                    </label>
                  ))}
                </div>
              </>
            )}
            {isGaming && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Console Type</h3>
                  {["PlayStation", "Xbox", "Nintendo Switch"].map((type) => (
                    <label key={type} className="block text-sm">
                      <input
                        type="checkbox"
                        value={type}
                        checked={filters.consoleType.includes(type)}
                        onChange={() => handleFilterChange("consoleType", type)}
                        className="mr-2"
                      />
                      {type}
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Storage</h3>
                  {["500GB", "1TB", "2TB"].map((storage) => (
                    <label key={storage} className="block text-sm">
                      <input
                        type="checkbox"
                        value={storage}
                        checked={filters.consoleStorage.includes(storage)}
                        onChange={() => handleFilterChange("consoleStorage", storage)}
                        className="mr-2"
                      />
                      {storage}
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Features</h3>
                  {["Backward Compatibility", "4K Support", "Online Multiplayer"].map((feat) => (
                    <label key={feat} className="block text-sm">
                      <input
                        type="checkbox"
                        value={feat}
                        checked={filters.consoleFeatures.includes(feat)}
                        onChange={() => handleFilterChange("consoleFeatures", feat)}
                        className="mr-2"
                      />
                      {feat}
                    </label>
                  ))}
                </div>
              </>
            )}
            {isPrinters && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Printer Type</h3>
                  {["Inkjet", "Laser", "All-in-One", "3D Printer"].map((type) => (
                    <label key={type} className="block text-sm">
                      <input
                        type="checkbox"
                        value={type}
                        checked={filters.printerType.includes(type)}
                        onChange={() => handleFilterChange("printerType", type)}
                        className="mr-2"
                      />
                      {type}
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Connectivity</h3>
                  {["USB", "Wi-Fi", "Ethernet"].map((conn) => (
                    <label key={conn} className="block text-sm">
                      <input
                        type="checkbox"
                        value={conn}
                        checked={filters.printerConnectivity.includes(conn)}
                        onChange={() => handleFilterChange("printerConnectivity", conn)}
                        className="mr-2"
                      />
                      {conn}
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Features</h3>
                  {["Duplex Printing", "Scanner", "Fax", "Wireless"].map((feat) => (
                    <label key={feat} className="block text-sm">
                      <input
                        type="checkbox"
                        value={feat}
                        checked={filters.printerFeatures.includes(feat)}
                        onChange={() => handleFilterChange("printerFeatures", feat)}
                        className="mr-2"
                      />
                      {feat}
                    </label>
                  ))}
                </div>
              </>
            )}
            {isHomeAppliances && (
              <>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Appliance Type</h3>
                  {[
                    "Refrigerators",
                    "Washing Machines",
                    "Air Conditioners",
                    "Microwave Ovens",
                    "Dishwashers",
                    "Blenders",
                    "Coffee Makers",
                    "Electric Kettles",
                    "Food Processors",
                    "Air Fryers",
                    "Ovens",
                    "Vacuum Cleaners",
                    "Heaters",
                    "Fans",
                    "Water Heaters",
                    "Water Purifiers",
                  ].map((type) => (
                    <label key={type} className="block text-sm">
                      <input
                        type="checkbox"
                        value={type}
                        checked={filters.applianceType.includes(type)}
                        onChange={() => handleFilterChange("applianceType", type)}
                        className="mr-2"
                      />
                      {type}
                    </label>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Features</h3>
                  {["Inverter Technology", "Energy Saving", "Smart Control"].map((feat) => (
                    <label key={feat} className="block text-sm">
                      <input
                        type="checkbox"
                        value={feat}
                        checked={filters.applianceFeatures.includes(feat)}
                        onChange={() => handleFilterChange("applianceFeatures", feat)}
                        className="mr-2"
                      />
                      {feat}
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SpecificationCategory() {
  const [fetching, setFetching] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const { category } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 25,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [filters, setFilters] = useState({
    brand: [],
    priceRange: [],
    availability: [],
    condition: [],
    ram: [],
    storage: [],
    camera: [],
    battery: [],
    screenSize: [],
    displayType: [],
    processor: [],
    os: [],
    network: [],
    features: [],
    laptopType: [],
    storageType: [],
    graphicsCard: [],
    displayResolution: [],
    cameraType: [],
    megapixels: [],
    sensorType: [],
    lensMount: [],
    videoResolution: [],
    cameraFeatures: [],
    accessoryType: [],
    compatibility: [],
    color: [],
    accessoryFeatures: [],
    resolution: [],
    smartTv: [],
    tvFeatures: [],
    consoleType: [],
    consoleStorage: [],
    consoleFeatures: [],
    printerType: [],
    printerConnectivity: [],
    printSpeed: [],
    printerFeatures: [],
    networkProductType: [],
    networkSpeed: [],
    band: [],
    networkFeatures: [],
    applianceType: [],
    capacity: [],
    applianceFeatures: [],
  });
  const [categoryName, setCategoryName] = useState("");
  console.log(filters);

  const getData = useCallback(
    async (loading = true, page = 1, sortBy = activeTab) => {
      try {
        setIsLoading(loading);
        const queryParams = new URLSearchParams({
          page,
          limit: pagination.pageSize,
          sortBy,
          ...(filters.brand.length && { brand: filters.brand.join(",") }),
          ...(filters.priceRange.length && { priceRange: filters.priceRange.join(",") }),
          ...(filters.availability.length && { availability: filters.availability.join(",") }),
          ...(filters.condition.length && { condition: filters.condition.join(",") }),
          ...(filters.ram.length && { ram: filters.ram.join(",") }),
          ...(filters.storage.length && { storage: filters.storage.join(",") }),
          ...(filters.camera.length && { camera: filters.camera.join(",") }),
          ...(filters.battery.length && { battery: filters.battery.join(",") }),
          ...(filters.screenSize.length && { screenSize: filters.screenSize.join(",") }),
          ...(filters.displayType.length && { displayType: filters.displayType.join(",") }),
          ...(filters.processor.length && { processor: filters.processor.join(",") }),
          ...(filters.os.length && { os: filters.os.join(",") }),
          ...(filters.network.length && { network: filters.network.join(",") }),
          ...(filters.features.length && { features: filters.features.join(",") }),
          ...(filters.laptopType.length && { laptopType: filters.laptopType.join(",") }),
          ...(filters.storageType.length && { storageType: filters.storageType.join(",") }),
          ...(filters.graphicsCard.length && { graphicsCard: filters.graphicsCard.join(",") }),
          ...(filters.displayResolution.length && { displayResolution: filters.displayResolution.join(",") }),
          ...(filters.cameraType.length && { cameraType: filters.cameraType.join(",") }),
          ...(filters.megapixels.length && { megapixels: filters.megapixels.join(",") }),
          ...(filters.sensorType.length && { sensorType: filters.sensorType.join(",") }),
          ...(filters.lensMount.length && { lensMount: filters.lensMount.join(",") }),
          ...(filters.videoResolution.length && { videoResolution: filters.videoResolution.join(",") }),
          ...(filters.cameraFeatures.length && { cameraFeatures: filters.cameraFeatures.join(",") }),
          ...(filters.accessoryType.length && { accessoryType: filters.accessoryType.join(",") }),
          ...(filters.compatibility.length && { compatibility: filters.compatibility.join(",") }),
          ...(filters.color.length && { color: filters.color.join(",") }),
          ...(filters.accessoryFeatures.length && { accessoryFeatures: filters.accessoryFeatures.join(",") }),
          ...(filters.resolution.length && { resolution: filters.resolution.join(",") }),
          ...(filters.smartTv.length && { smartTv: filters.smartTv.join(",") }),
          ...(filters.tvFeatures.length && { tvFeatures: filters.tvFeatures.join(",") }),
          ...(filters.consoleType.length && { consoleType: filters.consoleType.join(",") }),
          ...(filters.consoleStorage.length && { consoleStorage: filters.consoleStorage.join(",") }),
          ...(filters.consoleFeatures.length && { consoleFeatures: filters.consoleFeatures.join(",") }),
          ...(filters.printerType.length && { printerType: filters.printerType.join(",") }),
          ...(filters.printerConnectivity.length && {
            printerConnectivity: filters.printerConnectivity.join(","),
          }),
          ...(filters.printSpeed.length && { printSpeed: filters.printSpeed.join(",") }),
          ...(filters.printerFeatures.length && { printerFeatures: filters.printerFeatures.join(",") }),
          ...(filters.networkProductType.length && {
            networkProductType: filters.networkProductType.join(","),
          }),
          ...(filters.networkSpeed.length && { networkSpeed: filters.networkSpeed.join(",") }),
          ...(filters.band.length && { band: filters.band.join(",") }),
          ...(filters.networkFeatures.length && { networkFeatures: filters.networkFeatures.join(",") }),
          ...(filters.applianceType.length && { applianceType: filters.applianceType.join(",") }),
          ...(filters.capacity.length && { capacity: filters.capacity.join(",") }),
          ...(filters.applianceFeatures.length && { applianceFeatures: filters.applianceFeatures.join(",") }),
        });

        const { data } = await axiosInstance.get(`/website/specification/${category}`, {
          params: queryParams,
        });
        if (!data.error) {
          setData((prev) => (page === 1 ? data.data : [...prev, ...data.data]));
          setPagination(data.pagination);
          if (data?.data?.length > 0) {
            setCategoryName(data.data[0]?.categoryName || "");
          }
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [category, activeTab, filters]
  );

  useEffect(() => {
    getData(true, 1, activeTab);
  }, [category, activeTab, filters]);

  const onPageChange = async (page) => {
    setFetching(true);
    await getData(false, page, activeTab);
    setFetching(false);
  };

  const onSortByChange = async (value) => {
    if (activeTab === value) return;
    setActiveTab(value);
    await getData(true, 1, value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => {
      const newValues = prev[filterType].includes(value)
        ? prev[filterType].filter((v) => v !== value)
        : [...prev[filterType], value];
      return {
        ...prev,
        [filterType]: newValues,
      };
    });
  };

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  

  return (
    <section className="container mx-auto px-4">
      <div className={"grid grid-cols-12 gap-6"}>
        {/* Filter Sidebar */}
        <Filters
          isFilterOpen={isFilterOpen}
          handleFilterChange={handleFilterChange}
          filters={filters}
          toggleFilter={toggleFilter}
          categoryName={categoryName}
        />
        <Loading loading={isLoading}>
          {/* Main Content */}
          <div className="col-span-12 md:col-span-9">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl md:text-2xl font-semibold">{categoryName || "Products"}</h1>
              <button onClick={toggleFilter} className="md:hidden bg-red-500 text-white px-3 py-1 rounded-md">
                <Menu className="h-5 w-5" />
              </button>
            </div>
            <div className="w-full overflow-x-auto py-3">
              <div className="flex items-center justify-between border-black gap-4 sm:gap-6 min-w-max">
                <span className="text-lg sm:text-xl font-semibold text-black whitespace-nowrap">Sort By</span>
                <div className="flex overflow-x-auto gap-4">
                  {[
                    { key: "popularity", label: "Popularity" },
                    { key: "latest", label: "Latest" },
                    { key: "highToLowPrice", label: "High Price" },
                    { key: "LowToHighPrice", label: "Low Price" },
                    { key: "name", label: "Name (A-Z)" },
                    { key: "name-z-a", label: "Name (Z-A)" },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      className={`text-sm sm:text-lg font-medium transition ${
                        activeTab === key ? "text-black" : "text-gray-500 hover:text-black"
                      } whitespace-nowrap`}
                      onClick={() => onSortByChange(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="divider h-[2px] w-full bg-black">
              <div className="w-24 bg-[#ff0000] h-full"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.map((item) => (
                <SpecificationCard key={item._id} product={item} category={category} />
              ))}
            </div>
            <div className="flex items-center justify-center my-5">
              {pagination.totalPages > pagination.currentPage && (
                <button
                  onClick={() => onPageChange(pagination.currentPage + 1)}
                  className="bg-red-500 px-4 py-2 text-white rounded-md font-bold"
                  disabled={fetching}
                >
                  {fetching ? "Loading" : "Load More"}
                </button>
              )}
            </div>
          </div>
        </Loading>
      </div>
    </section>
  );
}

export default SpecificationCategory;

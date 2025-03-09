import { useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";

function RealStateFilter() {
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", { category, keyword, location });
    // Implement search functionality here
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg flex items-center gap-2">
      <select
        className="p-2 border rounded-md bg-white text-gray-700"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Categories...</option>
        <option value="tech">Technology</option>
        <option value="health">Health</option>
        <option value="finance">Finance</option>
      </select>
      
      <input
        type="text"
        className="p-2 border rounded-md flex-1"
        placeholder="Keywords or Title"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      
      <div className="relative">
        <Icon icon="mdi:map-marker" className="absolute left-2 top-3 text-gray-500" />
        <input
          type="text"
          className="p-2 pl-8 border rounded-md"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      
      <button
        className="text-red-600 bg-white px-4 py-2 rounded-md flex items-center gap-2"
        onClick={handleSearch}
      >
        Search
        <Image src="/website/assets/images/icons/search.png" alt='search-icon' width={1000} height={1000} className='h-6 w-6' />
      </button>
    </div>
  );
}

export default RealStateFilter

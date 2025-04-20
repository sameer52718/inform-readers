"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, MapPin } from "lucide-react";

export default function LocationSearch({ savedLocations, onLocationSelect, textColor }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef < HTMLInputElement > null;

  // Mock search results based on query
  const filteredLocations = searchQuery
    ? [
        { id: "search-1", name: `${searchQuery} City`, country: "Country" },
        { id: "search-2", name: `${searchQuery} Town`, country: "Country" },
      ]
    : [];

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  return (
    <div className="relative">
      {!isSearchOpen ? (
        <button
          onClick={() => setIsSearchOpen(true)}
          className={`flex items-center ${textColor} opacity-80 hover:opacity-100 transition-opacity`}
        >
          <MapPin size={18} className="mr-1" />
          <span>Change location</span>
        </button>
      ) : (
        <div className="absolute top-0 left-0 right-0 z-10">
          <div className="flex items-center bg-white/20 backdrop-blur-md rounded-lg overflow-hidden">
            <Search size={18} className={`ml-3 ${textColor}`} />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a location..."
              className="w-full p-2 bg-transparent border-none outline-none placeholder:text-slate-500"
            />
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery("");
              }}
              className="p-2"
            >
              <X size={18} className={textColor} />
            </button>
          </div>

          {(searchQuery || savedLocations.length > 0) && (
            <div className="mt-1 bg-white/20 backdrop-blur-md rounded-lg p-2 max-h-60 overflow-y-auto">
              {searchQuery && filteredLocations.length > 0 && (
                <div className="mb-2">
                  <p className={`text-xs font-medium mb-1 ${textColor} opacity-70`}>Search Results</p>
                  {filteredLocations.map((location) => (
                    <button
                      key={location.id}
                      className={`w-full text-left p-2 rounded hover:bg-white/20 flex items-center ${textColor}`}
                      onClick={() => {
                        onLocationSelect(location.name);
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <MapPin size={16} className="mr-2 opacity-70" />
                      <span>
                        {location.name}, {location.country}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {savedLocations.length > 0 && (
                <div>
                  <p className={`text-xs font-medium mb-1 ${textColor} opacity-70`}>Saved Locations</p>
                  {savedLocations.map((location) => (
                    <button
                      key={location.id}
                      className={`w-full text-left p-2 rounded hover:bg-white/20 flex items-center ${textColor}`}
                      onClick={() => {
                        onLocationSelect(location.name);
                        setIsSearchOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <MapPin size={16} className="mr-2 opacity-70" />
                      <span>
                        {location.name}, {location.country}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

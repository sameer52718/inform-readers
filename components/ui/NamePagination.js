"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import React from "react";

const NamePagination = ({ totalPages, currentPage, onPageChange }) => {
    // Generate alphabetic pagination (A-Z)
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");  
    const pageLetters = alphabet.slice(0, totalPages); // Adjust based on totalPages

    return (
        <div className="flex items-center space-x-1 justify-center sm:justify-start bg-[#d9d9d9] rounded-xl border border-black w-[100%] overflow-hidden overflow-x-auto">
            {/* First Page Button (A) */}
            <button
                className={`px-1 py-1 rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-red-500"}`}
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
            >
                <Image src="/website/assets/images/icons/slider.png" width={1000} height={1000} alt="arrow" className="w-7 h-auto rotate-180" />
            </button>

            {/* Previous Button */}
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                <Icon icon="basil:caret-left-solid" width="50" height="50" className="px-2 font-bold py-1 rounded text-red-500" />
            </button>

            {/* Alphabetic Pagination Buttons */}
            {pageLetters.map((letter, index) => (
                <button
                    key={letter}
                    className={`px-3 py-1 text-lg font-bold rounded-full ${index + 1 === currentPage ? "bg-red-500 text-white" : "text-black"}`}
                    onClick={() => onPageChange(index + 1)}
                >
                    {letter}
                </button>
            ))}

            {/* Next Button */}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                <Icon icon="basil:caret-right-solid" width="50" height="50" className="px-2 font-bold py-1 rounded text-red-500" />
            </button>

            {/* Last Page Button (Last Letter) */}
            <button
                className={`px-1 py-1 rounded ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-red-500"}`}
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
            >
                <Image src="/website/assets/images/icons/slider.png" width={1000} height={1000} alt="arrow" className="w-7 h-auto" />
            </button>
        </div>
    );
};

export default NamePagination;

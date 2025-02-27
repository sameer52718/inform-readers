"use client"; // 👈 Add this line at the top

import { Icon } from "@iconify/react";
import Image from "next/image";
import React from "react";


const Pagination = ({ totalPages, currentPage, onPageChange}) => {
    const pageNumbers = [...Array(totalPages).keys()].map((num) => num + 1);

    return (
        <div className="flex items-center space-x-1">
            <button
                className={`px-1 py-1 rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-red-500"}`}
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
            >
                <Image src="/website/assets/images/icons/slider.png" width={1000} height={1000} alt="arrow" className="w-7 h-auto rotate-180" />

            </button>
            <button
               
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <Icon icon="basil:caret-left-solid" width="50" height="50"  className={`px-2 font-bold py-1 rounded text-red-500`}/>
            </button>
            {pageNumbers.map((num) => (
                <button
                    key={num}
                    className={`px-3 py-1 text-lg font-bold rounded-full ${num === currentPage ? "bg-red-500 text-white" : "text-black"}`}
                    onClick={() => onPageChange(num)}
                >
                    {num}
                </button>
            ))}
            <button
                
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <Icon icon="basil:caret-right-solid" width="50" height="50" className={`px-2 font-bold py-1 round text-red-500`} />
            </button>
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

export default Pagination;

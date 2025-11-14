import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex overflow-x-auto whitespace-nowrap py-4 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="mx-2 h-4 w-4 text-gray-400 flex-shrink-0" />}

          {item.href && index !== items.length - 1 ? (
            <Link href={item.href} className="text-gray-600 hover:text-red-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span
              className={
                index === items.length - 1
                  ? "font-medium text-gray-900 line-clamp-1"
                  : "text-gray-600 line-clamp-1"
              }
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;

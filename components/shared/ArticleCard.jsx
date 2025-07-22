import getTimeAgo from "@/lib/fromNow";
import { ArrowRight, Clock } from "lucide-react";
import Image from "next/image";
import React from "react";

const ArticleCard = ({ item }) => {
  return (
    <article className="bg-white rounded-xl shadow-sm overflow-hidden group">
      <div className="relative h-48">
        <Image
          src={`/website/assets/images/fallback/news2.png`}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute space-x-2 top-4 left-4">
          <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {item?.category?.name || item.categoryName}
          </span>
          <span className="bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {item?.source}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl line-clamp-2 font-semibold mb-2 group-hover:text-red-600 transition-colors">
          {item.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2">{item.content}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {getTimeAgo(item.pubDate)}
            </span>
          </div>

          <a
            href={item.link}
            className="flex items-center text-red-600 font-medium hover:text-red-700"
            target="_blank"
          >
            Read more
            <ArrowRight className="h-4 w-4 ml-1" />
          </a>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  User,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  BookmarkPlus,
  MessageCircle,
  ThumbsUp,
  ArrowRight,
} from "lucide-react";

export default function NewsArticle() {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(156);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Article Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/news" className="hover:text-red-600">
              News
            </Link>
            <span>/</span>
            <Link href="/news/technology" className="hover:text-red-600">
              Technology
            </Link>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            The Future of AI: How Artificial Intelligence Will Transform Industries
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
                    alt="Author"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">John Smith</p>
                  <p className="text-sm text-gray-500">Tech Editor</p>
                </div>
              </div>

              <span className="text-gray-300">|</span>

              <div className="flex items-center text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>5 hours ago</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <BookmarkPlus className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative h-[500px] rounded-xl overflow-hidden mb-8">
          <Image
            src="https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg"
            alt="Article hero"
            fill
            className="object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="lead">
            Artificial Intelligence is rapidly evolving and reshaping how businesses operate across various
            sectors. From healthcare to finance, AI's impact is becoming increasingly significant.
          </p>

          <h2 className="text-xl">The Current State of AI</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </p>

          <h2 className="text-xl">Industry Applications</h2>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </p>

          <blockquote>
            "AI is not just about automation, it's about augmenting human capabilities and creating new
            possibilities."
          </blockquote>

          <h2 className="text-xl">Future Implications</h2>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
            totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo.
          </p>
        </div>

        {/* Article Actions */}
        <div className="flex items-center justify-between border-t border-b border-gray-200 my-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 ${isLiked ? "text-red-600" : "text-gray-600"}`}
            >
              <ThumbsUp className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              <span>{likeCount}</span>
            </button>

            <button className="flex items-center space-x-2 text-gray-600">
              <MessageCircle className="h-5 w-5" />
              <span>24</span>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-red-100 rounded-full text-red-600 transition-colors">
              <Facebook className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-red-100 rounded-full text-red-400 transition-colors">
              <Twitter className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-red-100 rounded-full text-red-700 transition-colors">
              <Linkedin className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Related Articles */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((item) => (
              <article key={item} className="group">
                <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                  <Image
                    src={`https://images.pexels.com/photos/518${item + 443}/pexels-photo-518${
                      item + 443
                    }.jpeg`}
                    alt={`Related article ${item}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-xl text-gray-900 group-hover:text-red-600 transition-colors">
                  Machine Learning Breakthroughs in Healthcare
                </h3>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>3 days ago</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}

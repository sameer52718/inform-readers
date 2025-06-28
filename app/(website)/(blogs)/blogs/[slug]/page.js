"use client";

import Image from "next/image";
import { Clock, Tag, User, ChevronLeft, Loader2, Send, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import handleError from "@/lib/handleError";
import axiosInstance from "@/lib/axiosInstance";
import getTimeAgo from "@/lib/fromNow";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function BlogDetailPage() {
  const { token } = useSelector((state) => state.auth);
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  // Fetch blog by slug
  const getBlogData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get(`/website/blog/${slug}`);
      if (!data.error) {
        setBlog(data.blog);
        setRelatedBlogs(data.related);
      } else {
        handleError(new Error(data.message || "Blog not found"));
        setBlog(null);
      }
    } catch (error) {
      handleError(error);
      setBlog(null);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  // Fetch comments
  const getComments = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get(`/website/blog/${slug}/comments`);
      if (!data.error) {
        setComments(data.comments);
      }
    } catch (error) {
      handleError(error);
    }
  }, [slug]);

  // Submit comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      if (!token) {
        toast.warn("Please login your or Create one to Comment!.");
        return;
      }
      setIsSubmitting(true);
      const { data } = await axiosInstance.post(`/website/blog/${slug}/comment`, { content: newComment });
      if (!data.error) {
        setComments((prev) => [...prev, data.comment]);
        setNewComment("");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    getBlogData();
    getComments();
  }, [getBlogData, getComments]);

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content (Blog + Comments) */}
            <div className="lg:w-3/4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-red-600" />
                  <p className="mt-4 text-lg font-medium text-gray-700">Loading blog...</p>
                </div>
              ) : !blog ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg
                    className="h-16 w-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="mt-4 text-lg font-medium text-gray-700">Blog not found</p>
                  <p className="mt-2 text-sm text-gray-500">The blog you are looking for does not exist.</p>
                  <Link
                    href="/blogs"
                    className="mt-4 flex items-center text-red-600 font-medium hover:text-red-700"
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Back to Blogs
                  </Link>
                </div>
              ) : (
                <article className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Hero Image */}
                  {blog.image && (
                    <div className="relative h-96">
                      <Image src={blog.image} alt={blog.name} fill className="object-cover" priority />
                    </div>
                  )}

                  {/* Blog Content */}
                  <div className="p-8">
                    <Link
                      href="/blogs"
                      className="flex items-center text-red-600 font-medium hover:text-red-700 mb-6"
                    >
                      <ChevronLeft className="h-5 w-5 mr-1" />
                      Back to Blogs
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{blog.name}</h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{getTimeAgo(blog.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{blog.adminId?.name || "Unknown Author"}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {blog.categoryId?.name || "Uncategorized"}
                        </span>
                      </div>
                      {blog.subCategoryId && (
                        <div className="flex items-center">
                          <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                            {blog.subCategoryId?.name}
                          </span>
                        </div>
                      )}
                      {blog.tag && blog.tag.length > 0 && (
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-1" />
                          <span>{blog.tag.join(", ")}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 text-lg mb-6">{blog.shortDescription}</p>

                    <div
                      className="prose prose-lg max-w-none text-gray-800"
                      dangerouslySetInnerHTML={{ __html: blog.blog }}
                    />
                  </div>

                  {/* Comment Section */}
                  <div className="p-8 border-t border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Comments</h2>

                    {/* Comment Form */}
                    <form onSubmit={handleCommentSubmit} className="mb-8">
                      <div className="flex flex-col gap-4">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write your comment..."
                          className="w-full h-24 p-4 rounded-md border border-gray-300 focus:border-red-600 focus:ring-red-600"
                          disabled={isSubmitting}
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting || !newComment.trim()}
                          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 self-start"
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          ) : (
                            <Send className="h-5 w-5 mr-2" />
                          )}
                          Post Comment
                        </button>
                      </div>
                    </form>

                    {/* Comments List */}
                    {comments.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-6">
                        <svg
                          className="h-12 w-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5v-4a2 2 0 012-2h10a2 2 0 012 2v4h-4M3 6h18"
                          />
                        </svg>
                        <p className="mt-4 text-lg font-medium text-gray-700">No comments yet</p>
                        <p className="mt-2 text-sm text-gray-500">Be the first to comment!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {comments.map((comment) => (
                          <div key={comment._id} className="border-b border-gray-200 pb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                              <User className="h-4 w-4" />
                              <span>{comment.author?.name || "Anonymous"}</span>
                              <span>•</span>
                              <span>{getTimeAgo(comment.createdAt)}</span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              )}
            </div>

            {/* Related Blogs Sidebar */}
            <aside className="lg:w-1/4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Blogs</h2>
              {relatedBlogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <svg
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="mt-4 text-lg font-medium text-gray-700">No related blogs found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {relatedBlogs.map((item) => (
                    <article key={item._id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
                      <div className="relative h-32">
                        <Image
                          src={item.image || `/website/assets/images/fallback/news2.png`}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            {item.categoryId?.name || "Uncategorized"}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-base font-semibold mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                          {item.name}
                        </h3>
                        <Link
                          href={`/blogs/${item.slug}`}
                          className="flex items-center text-red-600 text-sm font-medium hover:text-red-700"
                        >
                          Read more
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

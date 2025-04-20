"use client";

import { useState, useEffect, useMemo } from "react";
import { allJobTypes, allExperienceLevels, jobListings, getTimeAgo } from "@/constant/job-data";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
function JobCard({ job, featured = false }) {
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const toggleSaved = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
  };

  return (
    <div
      className={`relative bg-white rounded-lg overflow-hidden transition-all duration-300 shadow hover:shadow-md ${
        featured ? "border-l-4 border-red-500" : ""
      }`}
    >
      {featured && (
        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          Featured
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
            <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors duration-200">
              {job.title}
            </h3>
            <p className="text-sm font-medium text-gray-700 mt-1">{job.company}</p>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="inline-flex items-center text-xs text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {job.location}
              </span>

              <span className="inline-flex items-center text-xs text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {getTimeAgo(job.postedDate)}
              </span>
            </div>
          </div>

          <button
            onClick={toggleSaved}
            className="flex-shrink-0 text-gray-400 hover:text-yellow-500 transition-colors duration-200"
            aria-label={saved ? "Remove from saved jobs" : "Save job"}
          >
            {saved ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm font-medium text-green-600">{job.salary}</div>
          <div className="text-xs text-gray-500">{job.applicants} applicants</div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.jobType.map((type) => (
            <span key={type} className="inline-block bg-red-50 text-red-700 text-xs px-2 py-1 rounded">
              {type}
            </span>
          ))}
          <span className="inline-block bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded">
            {job.experienceLevel}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-1">
          {job.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Apply before {new Date(job.applicationDeadline).toLocaleDateString()}
          </span>
          <button
            className="inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors duration-300"
            onClick={() => router.push(`/jobs/${job.id}`)}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}

function FeaturedJobs({ jobs }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleJobs = 3;

  const totalJobs = jobs.length;
  const maxIndex = totalJobs - visibleJobs;

  useEffect(() => {
    if (totalJobs <= visibleJobs) return;

    const interval = setInterval(() => {
      setCurrentIndex((current) => (current >= maxIndex ? 0 : current + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [maxIndex, totalJobs]);

  const handlePrev = () => {
    setCurrentIndex((current) => (current <= 0 ? maxIndex : current - 1));
  };

  const handleNext = () => {
    setCurrentIndex((current) => (current >= maxIndex ? 0 : current + 1));
  };

  if (totalJobs === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Featured Opportunities</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} featured />
        ))}
      </div>
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-center my-8">
      <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-500 hover:bg-gray-50"
          } text-sm font-medium`}
        >
          <span className="sr-only">Previous</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
              currentPage === page
                ? "z-10 bg-red-50 border-red-500 text-red-600"
                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-500 hover:bg-gray-50"
          } text-sm font-medium`}
        >
          <span className="sr-only">Next</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </nav>
    </div>
  );
}

function JobFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    jobTypes: [],
    experienceLevels: [],
    location: "",
    searchTerm: "",
  });

  const [expanded, setExpanded] = useState(false);

  const handleSearchChange = (e) => {
    const newFilters = { ...filters, searchTerm: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleLocationChange = (e) => {
    const newFilters = { ...filters, location: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleJobTypeChange = (jobType) => {
    let newJobTypes;

    if (filters.jobTypes.includes(jobType)) {
      newJobTypes = filters.jobTypes.filter((type) => type !== jobType);
    } else {
      newJobTypes = [...filters.jobTypes, jobType];
    }

    const newFilters = { ...filters, jobTypes: newJobTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleExperienceLevelChange = (level) => {
    let newLevels;

    if (filters.experienceLevels.includes(level)) {
      newLevels = filters.experienceLevels.filter((l) => l !== level);
    } else {
      newLevels = [...filters.experienceLevels, level];
    }

    const newFilters = { ...filters, experienceLevels: newLevels };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters = {
      jobTypes: [],
      experienceLevels: [],
      location: "",
      searchTerm: filters.searchTerm, // Keep the search term
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Search jobs, keywords, companies..."
              value={filters.searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Location (city, state, remote...)"
              value={filters.location}
              onChange={handleLocationChange}
            />
          </div>

          <button
            type="button"
            className="flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-800 transition-colors duration-200"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide Filters" : "Show Filters"}
            <svg
              className={`ml-1 h-5 w-5 transform transition-transform ${expanded ? "rotate-180" : ""}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {expanded && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Job Type</h3>
                <div className="space-y-2">
                  {allJobTypes.map((jobType) => (
                    <div key={jobType} className="flex items-center">
                      <input
                        id={`jobType-${jobType}`}
                        name={`jobType-${jobType}`}
                        type="checkbox"
                        className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        checked={filters.jobTypes.includes(jobType)}
                        onChange={() => handleJobTypeChange(jobType)}
                      />
                      <label htmlFor={`jobType-${jobType}`} className="ml-2 text-sm text-gray-700">
                        {jobType}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Experience Level</h3>
                <div className="space-y-2">
                  {allExperienceLevels.map((level) => (
                    <div key={level} className="flex items-center">
                      <input
                        id={`experience-${level}`}
                        name={`experience-${level}`}
                        type="checkbox"
                        className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        checked={filters.experienceLevels.includes(level)}
                        onChange={() => handleExperienceLevelChange(level)}
                      />
                      <label htmlFor={`experience-${level}`} className="ml-2 text-sm text-gray-700">
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [filters, setFilters] = useState({
    jobTypes: [],
    experienceLevels: [],
    location: "",
    searchTerm: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Get featured jobs once
  const featuredJobs = useMemo(() => {
    return jobListings.filter((job) => job.isFeatured);
  }, []);

  // Filter jobs based on current filters
  const filteredJobs = useMemo(() => {
    return jobListings.filter((job) => {
      // Filter by job type
      if (filters.jobTypes.length > 0 && !job.jobType.some((type) => filters.jobTypes.includes(type))) {
        return false;
      }

      // Filter by experience level
      if (filters.experienceLevels.length > 0 && !filters.experienceLevels.includes(job.experienceLevel)) {
        return false;
      }

      // Filter by location
      if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Filter by search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }

      return true;
    });
  }, [filters]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const currentJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <div className="bg-gradient-to-br from-red-600 to-red-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl text-white md:text-5xl font-bold mb-6">Find Your Dream Job</h1>
              <p className="text-xl text-white mb-8">Browse top jobs from top companies</p>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <JobFilter onFilterChange={setFilters} />

        <FeaturedJobs jobs={featuredJobs} />

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {filteredJobs.length} Jobs Available
            </h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Sort by:</span>
              <select className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                <option>Most Recent</option>
                <option>Relevance</option>
                <option>Salary: High to Low</option>
                <option>Salary: Low to High</option>
              </select>
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No jobs found</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() =>
                  setFilters({ jobTypes: [], experienceLevels: [], location: "", searchTerm: "" })
                }
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 transition-colors duration-200"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6">
                {currentJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              )}
            </>
          )}
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-8 mb-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Create a free account to unlock full access
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Save jobs, track your applications, get personalized job recommendations and more.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200">
                Sign Up Free
              </button>
              <button className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

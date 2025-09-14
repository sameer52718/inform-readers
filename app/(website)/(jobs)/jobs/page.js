"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

function JobCard({ job }) {
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const toggleSaved = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInMs = now - posted;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  return (
    <div className="relative bg-white rounded-lg overflow-hidden transition-all duration-300 shadow hover:shadow-md mb-4">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
            <img
              src={job.logo || "/placeholder-logo.png"}
              alt={`${job.company} logo`}
              className="w-full h-full object-cover"
            />
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
                {job.locations}
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
                {getTimeAgo(job.date)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600 line-clamp-2">{job.description.replace(/<[^>]+>/g, "")}</p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm font-medium text-green-600">{job.salary || "Not specified"}</div>
          <div className="text-xs text-gray-500">{job.applicants || 0} applicants</div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <span className="text-xs text-gray-500">Posted on {new Date(job.date).toLocaleDateString()}</span>
          <button
            className="inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors duration-300"
            onClick={() => window.open(job.url, "_blank")}
          >
            View
          </button>
        </div>
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
    salaryRange: "",
    datePosted: "",
    remoteWork: "",
    companyType: "",
  });

  const [expanded, setExpanded] = useState(true);

  const jobTypes = ["Full-time", "Part-time", "Contract", "Temporary", "Internship"];
  const experienceLevels = ["Entry level", "Mid level", "Senior level"];
  const salaryRanges = ["Any", "$30k-$50k", "$50k-$80k", "$80k-$120k", "$120k+"];
  const datePostedOptions = ["Any time", "Past 24 hours", "Past week", "Past month"];
  const remoteWorkOptions = ["Any", "Remote", "On-site", "Hybrid"];
  const companyTypes = ["Any", "Startup", "Enterprise", "Non-profit", "Government"];

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (e) => {
    handleFilterChange({ ...filters, searchTerm: e.target.value });
  };

  const handleLocationChange = (e) => {
    handleFilterChange({ ...filters, location: e.target.value });
  };

  const handleJobTypeChange = (jobType) => {
    let newJobTypes = filters.jobTypes.includes(jobType)
      ? filters.jobTypes.filter((type) => type !== jobType)
      : [...filters.jobTypes, jobType];
    handleFilterChange({ ...filters, jobTypes: newJobTypes });
  };

  const handleExperienceLevelChange = (level) => {
    let newLevels = filters.experienceLevels.includes(level)
      ? filters.experienceLevels.filter((l) => l !== level)
      : [...filters.experienceLevels, level];
    handleFilterChange({ ...filters, experienceLevels: newLevels });
  };

  const handleSalaryRangeChange = (e) => {
    handleFilterChange({ ...filters, salaryRange: e.target.value });
  };

  const handleDatePostedChange = (e) => {
    handleFilterChange({ ...filters, datePosted: e.target.value });
  };

  const handleRemoteWorkChange = (e) => {
    handleFilterChange({ ...filters, remoteWork: e.target.value });
  };

  const handleCompanyTypeChange = (e) => {
    handleFilterChange({ ...filters, companyType: e.target.value });
  };

  const clearFilters = () => {
    const newFilters = {
      jobTypes: [],
      experienceLevels: [],
      location: "",
      searchTerm: "",
      salaryRange: "",
      datePosted: "",
      remoteWork: "",
      companyType: "",
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Jobs</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
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
              className="block w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Keywords, job titles, companies..."
              value={filters.searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <div className="relative">
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
              className="block w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="City, state, remote..."
              value={filters.location}
              onChange={handleLocationChange}
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Job Type</h3>
          <div className="space-y-2">
            {jobTypes.map((jobType) => (
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
          <h3 className="text-sm font-medium text-gray-900 mb-2">Experience Level</h3>
          <div className="space-y-2">
            {experienceLevels.map((level) => (
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

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Salary Range</h3>
          <select
            className="block w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            value={filters.salaryRange}
            onChange={handleSalaryRangeChange}
          >
            {salaryRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Date Posted</h3>
          <select
            className="block w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            value={filters.datePosted}
            onChange={handleDatePostedChange}
          >
            {datePostedOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Remote Work</h3>
          <select
            className="block w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            value={filters.remoteWork}
            onChange={handleRemoteWorkChange}
          >
            {remoteWorkOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Company Type</h3>
          <select
            className="block w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            value={filters.companyType}
            onChange={handleCompanyTypeChange}
          >
            {companyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="w-full mt-4 text-sm font-medium text-red-600 hover:text-red-800 transition-colors duration-200"
          onClick={clearFilters}
        >
          Clear all filters
        </button>
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
    salaryRange: "",
    datePosted: "",
    remoteWork: "",
    companyType: "",
  });
  const [jobsData, setJobsData] = useState({
    jobs: [],
    page: 1,
    pagesize: 20,
    total_hits: 0,
    pages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = async (filters, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        keywords: filters.searchTerm,
        location: filters.location,
        pagesize: jobsData.pagesize,
        page,
      });
      const response = await fetch(`https://downloader.informreaders.com/jobs?${queryParams}`);
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setJobsData({
        jobs: data.jobs,
        page: data.page,
        pagesize: data.pagesize,
        total_hits: data.total_hits,
        pages: data.pages,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(filters, currentPage);
  }, [filters, currentPage]);

  const filteredJobs = useMemo(() => {
    return jobsData.jobs.filter((job) => {
      // Filter by job type
      if (
        filters.jobTypes.length > 0 &&
        !filters.jobTypes.some((type) => job.title.toLowerCase().includes(type.toLowerCase()))
      ) {
        return false;
      }

      // Filter by experience level
      if (
        filters.experienceLevels.length > 0 &&
        !filters.experienceLevels.some((level) => job.description.toLowerCase().includes(level.toLowerCase()))
      ) {
        return false;
      }

      // Filter by location
      if (filters.location && !job.locations.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Filter by search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower)
        );
      }

      // Filter by salary range
      if (filters.salaryRange && filters.salaryRange !== "Any") {
        const [min, max] = filters.salaryRange
          .replace(/[^0-9-]/g, "")
          .split("-")
          .map(Number);
        if (job.salary_min) {
          const salaryMin = parseInt(job.salary_min);
          const salaryMax = job.salary_max ? parseInt(job.salary_max) : salaryMin;
          if (salaryMin > max || (max && salaryMax < min)) {
            return false;
          }
        } else {
          return false;
        }
      }

      // Filter by date posted
      if (filters.datePosted && filters.datePosted !== "Any time") {
        const now = new Date();
        const posted = new Date(job.date);
        const diffInMs = now - posted;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        if (filters.datePosted === "Past 24 hours" && diffInDays > 1) return false;
        if (filters.datePosted === "Past week" && diffInDays > 7) return false;
        if (filters.datePosted === "Past month" && diffInDays > 30) return false;
      }

      // Filter by remote work
      if (filters.remoteWork && filters.remoteWork !== "Any") {
        const isRemote =
          job.description.toLowerCase().includes("remote") || job.title.toLowerCase().includes("remote");
        const isOnSite =
          job.description.toLowerCase().includes("on-site") ||
          job.description.toLowerCase().includes("onsite");
        const isHybrid = job.description.toLowerCase().includes("hybrid");
        if (filters.remoteWork === "Remote" && !isRemote) return false;
        if (filters.remoteWork === "On-site" && !isOnSite) return false;
        if (filters.remoteWork === "Hybrid" && !isHybrid) return false;
      }

      // Filter by company type
      if (filters.companyType && filters.companyType !== "Any") {
        const companyLower = job.company.toLowerCase();
        if (
          filters.companyType === "Startup" &&
          !companyLower.includes("tech") &&
          !companyLower.includes("start")
        )
          return false;
        if (
          filters.companyType === "Enterprise" &&
          !companyLower.includes("corp") &&
          !companyLower.includes("inc")
        )
          return false;
        if (
          filters.companyType === "Non-profit" &&
          !companyLower.includes("foundation") &&
          !companyLower.includes("non-profit")
        )
          return false;
        if (
          filters.companyType === "Government" &&
          !companyLower.includes("city") &&
          !companyLower.includes("gov")
        )
          return false;
      }

      return true;
    });
  }, [jobsData.jobs, filters]);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
        <div className="w-1/4 pr-6">
          <JobFilter onFilterChange={setFilters} />
        </div>
        <div className="w-3/4">
          {loading ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <svg
                className="animate-spin h-8 w-8 text-red-600 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="mt-4 text-gray-600">Loading jobs...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
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
              <h3 className="mt-4 text-lg font-medium text-gray-900">Error loading jobs</h3>
              <p className="mt-2 text-gray-600">{error}</p>
              <button
                onClick={() => fetchJobs(filters, currentPage)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
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
              <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs found</h3>
              <p className="mt-2 text-gray-600">Try adjusting your search or filter criteria</p>
              <button
                onClick={() =>
                  setFilters({
                    jobTypes: [],
                    experienceLevels: [],
                    location: "",
                    searchTerm: "",
                    salaryRange: "",
                    datePosted: "",
                    remoteWork: "",
                    companyType: "",
                  })
                }
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors duration-200"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div></div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Sort by:</span>
                    <select
                      className="bg-white border border-gray-300 rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      onChange={(e) => {
                        // Sorting logic can be added here if needed
                      }}
                    >
                      <option>Most Recent</option>
                      <option>Relevance</option>
                      <option>Salary: High to Low</option>
                      <option>Salary: Low to High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.url} job={job} />
                  ))}
                </div>
              </div>

              {jobsData.pages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={jobsData.pages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

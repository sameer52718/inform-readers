"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { jobListings, getTimeAgo } from "@/constant/job-data";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Briefcase,
  GraduationCap,
  Building2,
  Share2,
  Heart,
  ChevronLeft,
  Mail,
  ExternalLink,
  CheckCircle2,
  DollarSign,
  Globe,
  Award,
  Layers,
  Target,
  Users2,
  BookOpen,
  Coffee,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

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

export default function JobDetail() {
  const params = useParams();

  const job = jobListings.find((j) => j.id === params.slug);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (job) {
      document.title = `${job.title} at ${job.company} - JobBoard`;

      // Find related jobs based on tags and experience level
      const related = jobListings
        .filter(
          (j) =>
            j.id !== job.id &&
            (j.tags.some((tag) => job.tags.includes(tag)) || j.experienceLevel === job.experienceLevel)
        )
        .slice(0, 3);

      setRelatedJobs(related);
    }
  }, [job]);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Job Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The job listing you're looking for doesn't exist.
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const benefits = [
    { icon: DollarSign, title: "Competitive Salary", description: "Industry-leading compensation package" },
    { icon: Globe, title: "Remote Work", description: "Flexible work-from-anywhere policy" },
    { icon: Coffee, title: "Work-Life Balance", description: "Flexible hours and unlimited PTO" },
    { icon: Award, title: "Career Growth", description: "Professional development opportunities" },
  ];

  const companyValues = [
    { icon: Target, title: "Innovation", description: "We push boundaries and embrace new ideas" },
    { icon: Users2, title: "Collaboration", description: "Work together to achieve common goals" },
    { icon: Layers, title: "Excellence", description: "Commitment to delivering quality results" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/jobs"
            className="inline-flex items-center text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Jobs
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                  <motion.img
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    src={job.logo}
                    alt={`${job.company} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
                  <div className="flex items-center mt-1">
                    <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1" />
                    <span className="text-gray-600 dark:text-gray-300">{job.company}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSaved(!saved)}
                  className={`p-2 transition-colors duration-200 ${
                    saved
                      ? "text-red-500 dark:text-red-400"
                      : "text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                  }`}
                >
                  <Heart className="w-5 h-5" fill={saved ? "currentColor" : "none"} />
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">{job.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">
                  Apply by {new Date(job.applicationDeadline).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">{job.jobType.join(", ")}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">{job.applicants} applicants</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-green-600 dark:text-green-400 font-medium">{job.salary}</span>
              </div>
              <div className="flex items-center">
                <GraduationCap className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-gray-600 dark:text-gray-300">{job.experienceLevel}</span>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About the Role</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {job.description}
                  <br />
                  <br />
                  We are looking for someone who is passionate about technology and wants to make a
                  difference. The ideal candidate will have strong problem-solving skills and a desire to
                  learn and grow with our team.
                  <br />
                  <br />
                  This role offers an exciting opportunity to work on cutting-edge projects while
                  collaborating with talented professionals in a supportive environment.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Key Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <benefit.icon className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900 dark:text-white">{benefit.title}</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    {tag}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Company Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {companyValues.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="mx-auto w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                      <value.icon className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">{value.title}</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {relatedJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center mb-6">
              <Rocket className="w-6 h-6 text-red-600 dark:text-red-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Similar Opportunities</h2>
            </div>
            <div className="grid grid-cols-1  gap-6">
              {relatedJobs.map((relatedJob, index) => (
                <JobCard job={relatedJob} key={index} />
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gradient-to-r from-red-600 to-red-600 dark:from-red-900 dark:to-red-900 rounded-lg p-8 text-white"
        >
          <div className="flex items-center mb-4">
            <BookOpen className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold text-white">Advance Your Career</h2>
          </div>
          <p className="mb-6 text-red-100 dark:text-red-200">
            Get personalized job recommendations, salary insights, and career guidance tailored to your
            experience.
          </p>
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="https://informreaders.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-white text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors duration-200"
          >
            Visit Our Website
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
}

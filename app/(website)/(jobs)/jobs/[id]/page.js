import { notFound } from "next/navigation";

/**
 * Generate dynamic metadata for SEO and social sharing
 */
export async function generateMetadata({ params }) {
  const job = await getJobData(params.id);

  if (!job) {
    return {
      title: "Job not found",
      description: "This job posting no longer exists.",
    };
  }

  return {
    title: `${job.title} at ${job.company} | Inform Readers`,
    description: job.description?.replace(/<[^>]+>/g, "").slice(0, 150) || "View job details and apply now.",
    openGraph: {
      title: `${job.title} at ${job.company}`,
      description: job.description?.replace(/<[^>]+>/g, "").slice(0, 150),
      url: `https://yourdomain.com/jobs/${params.id}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${job.title} at ${job.company}`,
      description: job.description?.replace(/<[^>]+>/g, "").slice(0, 150),
    },
  };
}

/**
 * Fetch job details from API (server-side)
 */
async function getJobData(jobId) {
  try {
    const res = await fetch(`https://downloader.informreaders.com/jobs/info/${jobId}`, {
      next: { revalidate: 60 }, // ISR: revalidate every 60s
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function JobInfoPage({ params }) {
  const job = await getJobData(params.id);

  if (!job) return notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="md:col-span-2 space-y-8">
        {/* Job Header Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-lg text-gray-700 mt-1">{job.company}</p>
            <p className="text-sm text-gray-500">{job.locations}</p>
          </div>
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 whitespace-nowrap sm:mt-0 px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-base font-medium rounded-xl shadow transition-colors duration-300"
          >
            Apply Now
          </a>
        </div>

        {/* Key Details */}
        <div className="bg-gray-50 rounded-xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Posted</p>
            <p className="text-gray-900 font-semibold">
              {job.date ? new Date(job.date).toLocaleDateString() : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Salary</p>
            <p className="text-gray-900 font-semibold">{job.salary || "Not specified"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Job Type</p>
            <p className="text-gray-900 font-semibold">{job.type || "Full-time"}</p>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Job Description</h2>
          <div
            className="text-gray-700 leading-relaxed space-y-3"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        </div>
      </div>

      {/* Sidebar */}
      <aside className="space-y-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold">About Company</h3>
          <p className="text-gray-600 text-sm mt-2">
            {job.company} is a leading organization in {job.locations}. We are committed to
            delivering quality and providing a great workplace for our employees.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold">Why Work Here?</h3>
          <ul className="list-disc list-inside text-gray-600 text-sm space-y-2 mt-2">
            <li>Career growth opportunities</li>
            <li>Supportive and diverse culture</li>
            <li>Competitive salary and benefits</li>
            <li>Work-life balance focus</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

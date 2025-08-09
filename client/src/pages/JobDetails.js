import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchJobById } from "../api";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobById(id)
      .then(setJob)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading job details...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Job not found.</p>
        <Link to="/jobs" className="text-blue-600 hover:underline">
          Back to Job Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">{job.title}</h1>
          <h2 className="text-xl text-blue-600 font-semibold mb-2">{job.company}</h2>
          <p className="text-gray-600 mb-4">📍 {job.location}</p>
          <p className="text-sm text-gray-500">
            Posted on {new Date(job.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Job Description</h3>
          <div className="text-gray-700 leading-relaxed">
            <p>{job.description}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            to={`/apply/${job._id}`}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Apply for this Position
          </Link>
          <Link
            to="/jobs"
            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Back to Job Listings
          </Link>
        </div>
      </div>
    </div>
  );
}

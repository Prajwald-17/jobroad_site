import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchJobs } from "../api";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs()
      .then(setJobs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Job Listings</h1>
      
      {jobs.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No jobs available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h2>
                <p className="text-lg text-blue-600 font-semibold mb-1">{job.company}</p>
                <p className="text-gray-600 mb-3">📍 {job.location}</p>
                <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                  {job.description}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Link
                  to={`/jobs/${job._id}`}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded text-center hover:bg-gray-200 transition-colors"
                >
                  View Details
                </Link>
                <Link
                  to={`/apply/${job._id}`}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-center hover:bg-blue-700 transition-colors"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

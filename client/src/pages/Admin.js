import { useState, useEffect } from "react";
import { fetchJobs, createJob, updateJob, deleteJob, fetchApplications } from "../api";

export default function Admin() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("jobs");
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "",
    description: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsData, applicationsData] = await Promise.all([
        fetchJobs(),
        fetchApplications()
      ]);
      setJobs(jobsData);
      setApplications(applicationsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobFormChange = (e) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value });
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await updateJob(editingJob._id, jobForm);
      } else {
        await createJob(jobForm);
      }
      
      // Reset form and reload data
      setJobForm({ title: "", company: "", location: "", description: "" });
      setShowJobForm(false);
      setEditingJob(null);
      await loadData();
    } catch (error) {
      alert("Error saving job: " + error.message);
    }
  };

  const handleEditJob = (job) => {
    setJobForm({
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description
    });
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job? This will also delete all related applications.")) {
      try {
        await deleteJob(jobId);
        await loadData();
      } catch (error) {
        alert("Error deleting job: " + error.message);
      }
    }
  };

  const handleCancelForm = () => {
    setJobForm({ title: "", company: "", location: "", description: "" });
    setShowJobForm(false);
    setEditingJob(null);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading admin data...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage jobs and view applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Jobs</p>
              <p className="text-2xl font-bold text-blue-900">{jobs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Applications</p>
              <p className="text-2xl font-bold text-green-900">{applications.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Avg Applications/Job</p>
              <p className="text-2xl font-bold text-purple-900">
                {jobs.length > 0 ? Math.round((applications.length / jobs.length) * 10) / 10 : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("jobs")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "jobs"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Manage Jobs ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "applications"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              View Applications ({applications.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Jobs Tab */}
      {activeTab === "jobs" && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Job Management</h2>
            <button
              onClick={() => setShowJobForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add New Job
            </button>
          </div>

          {/* Job Form Modal */}
          {showJobForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
                <h3 className="text-xl font-semibold mb-4">
                  {editingJob ? "Edit Job" : "Add New Job"}
                </h3>
                <form onSubmit={handleJobSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={jobForm.title}
                      onChange={handleJobFormChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company *
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={jobForm.company}
                      onChange={handleJobFormChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={jobForm.location}
                      onChange={handleJobFormChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={jobForm.description}
                      onChange={handleJobFormChange}
                      rows="4"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {editingJob ? "Update Job" : "Create Job"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelForm}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Jobs List */}
          <div className="grid gap-4">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{job.title}</h3>
                    <p className="text-lg text-blue-600 mb-1">{job.company}</p>
                    <p className="text-gray-600 mb-2">📍 {job.location}</p>
                    <p className="text-gray-700 text-sm mb-2">{job.description}</p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditJob(job)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === "applications" && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">Job Applications</h2>
          <div className="grid gap-4">
            {applications.map((application) => (
              <div key={application._id} className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {application.name}
                    </h3>
                    <p className="text-blue-600 mb-1">{application.email}</p>
                    <p className="text-gray-700 mb-2">
                      Applied for: <strong>{application.jobId?.title || "Unknown Job"}</strong>
                    </p>
                    <p className="text-gray-600 mb-2">
                      Company: {application.jobId?.company || "Unknown Company"}
                    </p>
                    {application.resumeUrl && (
                      <p className="text-sm text-gray-600 mb-2">
                        Resume URL: 
                        <a 
                          href={application.resumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline ml-1"
                        >
                          View Resume
                        </a>
                      </p>
                    )}
                    {application.resumeFileId && (
                      <p className="text-sm text-gray-600 mb-2">
                        Resume File: 
                        <a 
                          href={`http://localhost:5000/resumes/${application.resumeFileId}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline ml-1"
                        >
                          Download Resume
                        </a>
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Applied: {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {applications.length === 0 && (
              <div className="text-center text-gray-600 py-8">
                No applications received yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
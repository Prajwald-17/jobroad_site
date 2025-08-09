import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchJobById } from "../api";

export default function ApplyForm() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", resumeUrl: "" });
  const [resumeFile, setResumeFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [useFileUpload, setUseFileUpload] = useState(true);

  useEffect(() => {
    fetchJobById(id)
      .then(setJob)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (useFileUpload && !resumeFile) {
      alert("Please upload a PDF resume");
      return;
    }

    if (!useFileUpload && !formData.resumeUrl) {
      alert("Please provide a resume URL");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    
    if (useFileUpload) {
      data.append("resume", resumeFile);
    } else {
      data.append("resumeUrl", formData.resumeUrl);
    }

    try {
      const res = await fetch(`http://localhost:5000/jobs/${id}/apply`, {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const error = await res.json();
        alert(`Error submitting application: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

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

  if (submitted) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Application Submitted!</h2>
          <p className="text-green-700 mb-4">
            Thank you for applying to <strong>{job.title}</strong> at <strong>{job.company}</strong>.
          </p>
          <p className="text-green-600 mb-6">
            We'll review your application and get back to you soon.
          </p>
          <Link
            to="/jobs"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Back to Job Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Job Information */}
      <div className="bg-gray-50 border rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Apply for this Position</h1>
        <h2 className="text-xl font-semibold text-blue-600 mb-1">{job.title}</h2>
        <p className="text-lg text-gray-700 mb-1">{job.company}</p>
        <p className="text-gray-600 mb-3">📍 {job.location}</p>
        <p className="text-gray-700 text-sm">{job.description}</p>
      </div>

      {/* Application Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email address"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Resume Upload Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Resume *
          </label>
          
          <div className="mb-4">
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="resumeOption"
                  checked={useFileUpload}
                  onChange={() => setUseFileUpload(true)}
                  className="mr-2"
                />
                Upload PDF File
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="resumeOption"
                  checked={!useFileUpload}
                  onChange={() => setUseFileUpload(false)}
                  className="mr-2"
                />
                Provide URL
              </label>
            </div>
          </div>

          {useFileUpload ? (
            <input
              type="file"
              name="resume"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          ) : (
            <input
              type="url"
              name="resumeUrl"
              placeholder="Enter URL to your resume (e.g., Google Drive, Dropbox)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.resumeUrl}
              onChange={handleChange}
              required
            />
          )}
          
          <p className="text-sm text-gray-500 mt-2">
            {useFileUpload 
              ? "Please upload your resume as a PDF file (max 5MB)"
              : "Provide a direct link to your resume (PDF preferred)"
            }
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Submit Application
          </button>
          <Link
            to="/jobs"
            className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

// src/api.js
const API_BASE = "http://localhost:5000"; // Change to your backend URL

export async function fetchJobs() {
  const res = await fetch(`${API_BASE}/jobs`);
  return res.json();
}

export async function fetchJobById(id) {
  const res = await fetch(`${API_BASE}/jobs/${id}`);
  return res.json();
}

export async function applyForJob(id, formData) {
  const res = await fetch(`${API_BASE}/jobs/${id}/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  return res.json();
}

// Admin API functions
export async function createJob(jobData) {
  const res = await fetch(`${API_BASE}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jobData),
  });
  if (!res.ok) {
    throw new Error("Failed to create job");
  }
  return res.json();
}

export async function updateJob(id, jobData) {
  const res = await fetch(`${API_BASE}/jobs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jobData),
  });
  if (!res.ok) {
    throw new Error("Failed to update job");
  }
  return res.json();
}

export async function deleteJob(id) {
  const res = await fetch(`${API_BASE}/jobs/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete job");
  }
  return res.json();
}

export async function fetchApplications() {
  const res = await fetch(`${API_BASE}/applications`);
  return res.json();
}

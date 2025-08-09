import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Job Board</h1>
      <p className="mb-6">Find your dream job and apply in minutes.</p>
      <Link
        to="/jobs"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Browse Jobs
      </Link>
    </div>
  );
}


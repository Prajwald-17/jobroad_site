import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        <Link to="/">Job Board</Link>
      </h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/jobs" className="hover:underline">Jobs</Link>
        <Link to="/admin" className="hover:underline bg-blue-700 px-3 py-1 rounded">Admin</Link>
      </div>
    </nav>
  );
}

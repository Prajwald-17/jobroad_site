import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import JobList from "./pages/joblist";
import JobDetails from "./pages/JobDetails";
import ApplyForm from "./pages/ApplyForm";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/apply/:id" element={<ApplyForm />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;

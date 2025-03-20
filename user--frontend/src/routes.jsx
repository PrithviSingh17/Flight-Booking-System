import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Help from "./pages/Help";
import SearchResults from "./pages/SearchResults";

// Add routes


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/help" element={<Help />} />
        <Route path="/search-results" element={<SearchResults />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
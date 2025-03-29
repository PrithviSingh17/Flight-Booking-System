import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Help from "./pages/Help";
import SearchResults from "./pages/SearchResults";
import BookingSummary from "./pages/BookingSummary";
import Payment from "./pages/Payment";
import BookingConfirmed from "./pages/BookingConfirmed";


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
        <Route path="/booking-summary/:flightId/:returnFlightId?" element={<BookingSummary />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/booking-confirmed" element={<BookingConfirmed />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
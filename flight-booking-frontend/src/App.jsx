import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/admin" />} /> {/* Redirect unknown routes */}
      </Routes>
    </Router>
  );
}

export default App;

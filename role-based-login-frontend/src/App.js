import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/admin/AdminDashboard";
import DriverDashboard from "./components/driver/DriverDashboard";
import BookCab from "./components/hr/BookCab";
import AddDriver from "./components/admin/AddDriver";
import ViewDrivers from "./components/admin/ViewDrivers";
import MyBookings from "./components/hr/MyBookings";
import HrDashBoard from "./components/HrDashBoard";
import "./App.css"; // Ensure global styles are loaded

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login & Register */}
        <Route path="/" element={<Login />} />
        <Route path="/reg" element={<Register />} />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-driver" element={<AddDriver />} />
        <Route path="/admin/view-drivers" element={<ViewDrivers />} />

        {/* HR Routes */}
        <Route path="/hr-dashboard" element={<HrDashBoard />} />
        <Route path="/hr/book-cab" element={<BookCab />} />
        <Route path="/hr/my-bookings" element={<MyBookings />} />

        {/* Driver Routes */}
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


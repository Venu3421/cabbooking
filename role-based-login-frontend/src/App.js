import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/admin/AdminDashboard";
import DriverDashboard from "./components/driver/DriverDashboard";
import MyRides from "./components/driver/MyRides";
import BookCab from "./components/hr/BookCab";
import AddDriver from "./components/admin/AddDriver";
import ViewDrivers from "./components/admin/ViewDrivers";
import ManageHRs from './components/admin/ManageHRs';
import MyBookings from "./components/hr/MyBookings";
import HrDashBoard from "./components/HrDashBoard";
import DashboardLayout from "./components/ui/DashboardLayout";
import ItDashboard from "./components/ItDashboard";
import "./App.css"; // Ensure global styles are loaded

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login & Register */}
        <Route path="/" element={<Login />} />
        <Route path="/reg" element={<Register />} />

        {/* Protected Dashboard Layouts */}
        <Route element={<DashboardLayout />}>
          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add-driver" element={<AddDriver />} />
          <Route path="/admin/view-drivers" element={<ViewDrivers />} />
          <Route path="/admin/manage-hrs" element={<ManageHRs />} />

          {/* HR Routes */}
          <Route path="/hr-dashboard" element={<HrDashBoard />} />
          <Route path="/hr/book-cab" element={<BookCab />} />
          <Route path="/hr/my-bookings" element={<MyBookings />} />

          {/* Driver Routes */}
          {/* Driver Routes */}
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
          <Route path="/driver/my-rides" element={<MyRides />} />

          {/* IT Routes */}
          <Route path="/it-dashboard" element={<ItDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;


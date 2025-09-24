import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import AddVehicle from "./screens/AddVehicle";
import SearchBook from "./screens/SearchBook";
import AuthModal from "./components/AuthModal";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuth } from "./redux/slicer/globalModelSlicer";
import { logout } from "./redux/slicer/authSlicer";
import Dashboard from "./screens/Dashboard";
import MyBookings from "./screens/MyBooked";
import AllVehicles from "./screens/AllVehicles";
import VehicleScheduled from "./screens/VehicleScheduled";

export default function App() {
  const [showAuth, setShowAuth] = useState(false);
  const { isAuth } = useSelector((state) => state.globalState);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  return (
    <div className="w-full flex flex-col p-0 ">
      <header className="bg-white shadow-md sticky top-0 z-50 flex justify-between">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://img.icons8.com/color/48/delivery.png"
              alt="FleetLink Logo"
              className="w-16 h-16"
            />
            <h1 className="text-4xl font-bold text-blue-700">FleetLink </h1>
          </Link>

          <nav className="flex items-center gap-6 text-base font-medium">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Dashboard
            </Link>

            {user?.role === "admin" && (
              <>
                <Link
                  to="/addVehicles"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Add Vehicle
                </Link>
                <Link
                  to="/allvehicles"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Vehicles
                </Link>
                <Link
                  to="/events"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Events
                </Link>
              </>
            )}
            {user?.role === "user" && (
              <>
                <Link
                  to="/search"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Book
                </Link>
                <Link
                  to="/mybooked"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  My Booked
                </Link>
              </>
            )}
            {!user ? (
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={() => dispatch(setIsAuth(true))}
              >
                Login
              </button>
            ) : (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                onClick={() => dispatch(logout(true))}
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="w-full h-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/addVehicles" element={<AddVehicle />} />
          <Route path="/addVehicles/:id" element={<AddVehicle />} />
          <Route path="/allvehicles" element={<AllVehicles />} />
          <Route path="/search" element={<SearchBook />} />
          <Route path="/mybooked" element={<MyBookings />} />
          <Route path="/events" element={<VehicleScheduled />} />
        </Routes>
      </main>

      {isAuth && <AuthModal onClose={() => dispatch(setIsAuth(false))} />}
    </div>
  );
}

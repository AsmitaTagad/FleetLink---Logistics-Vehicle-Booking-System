import React, { useEffect, useState } from "react";
import axios from "axios";

const VehicleScheduled = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/vehicles/allbookings"
        );
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  const now = new Date();

  const upcoming = bookings.filter((b) => new Date(b.endTime) >= now);
  const past = bookings.filter((b) => new Date(b.endTime) < now);

  const renderTable = (data) => (
    <div className="overflow-x-auto shadow-md rounded-lg mb-6">
      <table className="min-w-full bg-white">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Vehicle</th>
            <th className="py-2 px-4">Tyres</th>
            <th className="py-2 px-4">From</th>
            <th className="py-2 px-4">To</th>
            <th className="py-2 px-4">Destination</th>
            <th className="py-2 px-4">Distance (km)</th>
            <th className="py-2 px-4">Start</th>
            <th className="py-2 px-4">End</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-4">
                No bookings
              </td>
            </tr>
          ) : (
            data.map((b) => (
              <tr key={b._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{b.vehicleId.name}</td>
                <td className="py-2 px-4 text-center">{b.vehicleId.tyres}</td>
                <td className="py-2 px-4">{b.fromPincode}</td>
                <td className="py-2 px-4">{b.toPincode}</td>
                <td className="py-2 px-4">{b.destination}</td>
                <td className="py-2 px-4 text-center">{b.distanceKm}</td>
                <td className="py-2 px-4">
                  {new Date(b.startTime).toLocaleString()}
                </td>
                <td className="py-2 px-4">
                  {new Date(b.endTime).toLocaleString()}
                </td>
                <td className="py-2 px-4">
                  <button
                    className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition"
                    onClick={() => alert("Action not implimented!")}
                  >
                    Cancel Route
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Upcoming Scheduled</h2>
      {renderTable(upcoming)}
      {past?.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4">Past Bookings</h2>
          {renderTable(past)}
        </>
      )}
    </div>
  );
};

export default VehicleScheduled;

import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;

    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/vehicles/mybooked/${user._id}`
        );
        // Sort: upcoming first
        const sorted = res.data.sort(
          (a, b) => new Date(a.startTime) - new Date(b.startTime)
        );
        setBookings(sorted);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, [user?._id]);

  const now = new Date();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

      {bookings.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-96 gap-4 text-gray-600">
          <Truck size={48} />
          <p className="text-lg font-medium">No bookings found.</p>
          <button
            className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={() => navigate("/search")}
          >
            Book a Vehicle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((b) => {
            const isPast = new Date(b.endTime) < now;

            return (
              <div
                key={b._id}
                className={`relative p-6 rounded-xl shadow transition 
                  ${isPast ? "bg-gray-200 cursor-not-allowed opacity-70" : "bg-white hover:shadow-lg"}`}
              >
                {isPast && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded-full">
                    Booked
                  </span>
                )}

                <h3 className="text-xl font-bold mb-2">{b.vehicleId.name}</h3>
                <p>Capacity: {b.vehicleId.capacityKg} Kg</p>
                <p>Tyres: {b.vehicleId.tyres}</p>
                <p>
                  From: {b.fromPincode} → To: {b.toPincode}
                </p>
                <p>
                  Start: {new Date(b.startTime).toLocaleString()} <br />
                  End: {new Date(b.endTime).toLocaleString()}
                </p>
                {b.distanceKm && <p>Distance: {b.distanceKm} km</p>}
                {b.totalPrice && <p>Total Price: ₹{b.totalPrice}</p>}
                <p>Estimated Duration: {b.estimatedRideDurationHours} hrs</p>

               
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

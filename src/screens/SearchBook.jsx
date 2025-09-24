import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function SearchAndBook() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const navigate=useNavigate()
  const { user } = useSelector((state) => state.auth);
  console.log("user", user)
  const [form, setForm] = useState({
    fromPincode: "",
    toPincode: "",
    startTime: "",
    endTime: "",
    destination: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/vehicles/available")
      .then((res) => setVehicles(res.data))
      .catch((err) => console.error("Error fetching vehicles:", err));
  }, []);

  const filteredVehicles =
    search || minCapacity
      ? vehicles.filter(
          (v) =>
            v.name.toLowerCase().includes(search.toLowerCase()) &&
            (minCapacity ? v.capacityKg >= minCapacity : true)
        )
      : vehicles;

  const handleBooking = async () => {
    try {
      await axios.post("http://localhost:3000/api/vehicles/booking", {
        vehicleId: selectedVehicle._id,
        customerId: user?._id,
        ...form,
      });

      toast.success("Booking successful!");
      setSelectedVehicle(null);
      setForm({
        destination: "",
        fromPincode: "",
        toPincode: "",
        startTime: "",
        endTime: "",
      });
      navigate("")
    } catch (err) {
      console.error("Error booking vehicle:", err.response?.data || err);
      toast.error(
        err.response?.data?.error || "Failed to book vehicle. Try again."
      );
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-bold mb-4">Search Vehicles</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full"
          />
          <input
            type="number"
            placeholder="Min Capacity (Kg)"
            value={minCapacity}
            onChange={(e) => setMinCapacity(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredVehicles?.map((v) => (
          <div
            key={v._id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold">{v.name}</h3>
            <p className="text-gray-600">Capacity: {v.capacityKg} Kg</p>
            <p className="text-gray-600">Tyres: {v.tyres}</p>
            <p className="text-gray-600">Price: ₹ {v?.rate}/km </p>

            <button
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => setSelectedVehicle(v)}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {selectedVehicle && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative z-10">
            <h3 className="text-xl font-bold mb-4">
              Book {selectedVehicle.name}
            </h3>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Destination"
                value={form.destination || ""}
                onChange={(e) =>
                  setForm({ ...form, destination: e.target.value })
                }
                className="border rounded-lg px-4 py-2"
              />

              <input
                type="text"
                placeholder="From Pincode"
                value={form.fromPincode}
                onChange={(e) =>
                  setForm({ ...form, fromPincode: e.target.value })
                }
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                placeholder="To Pincode"
                value={form.toPincode}
                onChange={(e) =>
                  setForm({ ...form, toPincode: e.target.value })
                }
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="datetime-local"
                value={form.startTime}
                onChange={(e) =>
                  setForm({ ...form, startTime: e.target.value })
                }
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="datetime-local"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="border rounded-lg px-4 py-2"
              />

              <div className="flex gap-4 mt-4">
                <button
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
                  onClick={() => setSelectedVehicle(null)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  onClick={handleBooking}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Truck } from "lucide-react"; // icons
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AllVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/vehicles/available"
      );
      setVehicles(res.data || []);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?"))
      return;
    try {
      await axios.delete(`http://localhost:3000/api/vehicles/delete/${id}`);
      fetchVehicles();
      toast.success("Deleted Successfully!");
    } catch (err) {
      console.error("Error deleting vehicle:", err);
    }
  };

  const handleUpdate = (vehicle) => {
    alert(`Edit vehicle: ${vehicle.name}`);
    navigate(`/addVehicles/${vehicle._id}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">All Vehicles</h2>

      {vehicles.length === 0 ? (
        <div className="flex justify-center items-center h-64 text-gray-500">
          <p>No vehicles available</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="bg-white shadow-lg rounded-xl p-5 flex flex-col justify-between hover:shadow-xl transition"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                  <Truck size={22} />
                </div>
                <h3 className="text-lg font-semibold">{vehicle.name}</h3>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Capacity:</span>{" "}
                  {vehicle.capacityKg} kg
                </p>
                <p>
                  <span className="font-medium">Price:</span> ₹ {vehicle?.rate}
                  /km
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => handleUpdate(vehicle)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit Vehicle"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => handleDelete(vehicle._id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete Vehicle"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllVehicles;

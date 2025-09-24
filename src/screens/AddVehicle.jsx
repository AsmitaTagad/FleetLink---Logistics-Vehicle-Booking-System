import React, { useEffect, useState } from "react";
import Api from "../Api";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AddVehicle = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    capacityKg: "",
    tyres: "",
    rate: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();
  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!form.name || !form.capacityKg || !form.tyres || !form.rate) {
      toast.error("⚠️ All fields are required!");
      return;
    }

    const payload = {
      name: form.name.trim(),
      capacityKg: Number(form.capacityKg),
      tyres: Number(form.tyres),
      rate: Number(form.rate),
    };

    try {
      setLoading(true);

      let res;
      if (id) {
        res = await axios.put(
          `http://localhost:3000/api/vehicles/update/${id}`,
          payload
        );
        toast.success("Vehicle updated successfully!");
      } else {
        res = await axios.post(
          "http://localhost:3000/api/vehicles/add",
          payload
        );
        toast.success("Vehicle added successfully!");
      }

      setForm({ name: "", capacityKg: "", tyres: "", rate: "" });
      navigate("/allvehicles");
    } catch (err) {
      console.error("Error submitting vehicle:", err);

      if (err.message === "Network Error") {
        toast.error("Network error");
      } else {
        const errorMsg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to save vehicle!";
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchVehicle = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/vehicles/getById/${id}`
        );
        const vehicle = res.data;

        setForm({
          name: vehicle.name || "",
          capacityKg: vehicle.capacityKg || "",
          pricePerKm: vehicle.pricePerKm || "",
          tyres: vehicle.tyres || "",
          type: vehicle.type || "",
        });
      } catch (err) {
        console.error("Error fetching vehicle by id:", err);
      }
    };

    fetchVehicle();
  }, [id]);

  return (
    <div className="container bg-white p-6">
      <h2 className="text-lg font-medium mb-4">
        {" "}
        {id ? "Update Vehicle" : "Add Vehicle"}
      </h2>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm">Capacity (KG)</label>
          <input
            name="capacityKg"
            value={form.capacityKg}
            onChange={onChange}
            type="number"
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Tyres</label>
          <input
            name="tyres"
            value={form.tyres}
            onChange={onChange}
            type="number"
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Rate</label>
          <input
            name="rate"
            value={form.rate}
            onChange={onChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {msg && (
          <div
            className={`mb-4 p-2 rounded ${
              msg.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {msg.text}
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Saving..." : id ? "Update" : "Add Vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVehicle;

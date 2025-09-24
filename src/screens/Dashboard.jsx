import { Truck, Users, Calendar, DollarSign } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigator = useNavigate();
  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center shadow-md mb-6">
        <div className="max-w-xl text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
            FleetLink – Your Smart Logistics Partner 🚚
          </h2>
          <p className="mb-5 text-lg text-gray-100">
            Book vehicles in seconds. <br className="hidden md:block" />
            Reliable • Fast • Hassle-Free
          </p>

          <button
            className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition"
            onClick={() => {
              !user ? navigator("/addVehicles") : navigator("/search");
            }}
          >
            {user ? "Book Now" : "Add Vehicles"}
          </button>
        </div>

        <div className="mt-6 md:mt-0">
          <img
            src="https://img.icons8.com/ios/452/delivery--v1.png"
            alt="Fleet"
            className="w-40 md:w-56 drop-shadow-lg animate-bounce"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card icon={<Truck />} title="Total Vehicles" value="120" />
        <Card icon={<Users />} title="Active Bookings" value="85" />
        <Card icon={<Calendar />} title="Available Vehicles" value="35" />
        <Card icon={<DollarSign />} title="Revenue" value="$12,340" />
      </div>

      <section className="bg-white rounded-2xl shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Available Vehicles</h3>
          <button
            className="text-blue-600 font-medium hover:underline"
            onClick={() => navigator("/search")}
          >
            View All
          </button>
        </div>
        {/* only UI purpose (Dynamic Data) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <VehicleCard
            name="Mini Truck"
            status="Available"
            price="$100 / day"
            img="https://img.icons8.com/color/96/delivery--v1.png"
          />
          <VehicleCard
            name="Cargo Van"
            status="Booked"
            price="$80 / day"
            img="https://img.icons8.com/color/96/van.png"
          />
          <VehicleCard
            name="Container Truck"
            status="Maintenance"
            price="$150 / day"
            img="https://img.icons8.com/color/96/truck.png"
          />
        </div>
      </section>
    </main>
  );
};

function Card({ icon, title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
      <div className="text-blue-600 text-3xl">{icon}</div>
      <div>
        <p className="text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
  );
}

function VehicleCard({ name, status, price, img }) {
  return (
    <div className="border rounded-xl shadow hover:shadow-lg p-4 flex flex-col items-center text-center transition">
      <img src={img} alt={name} className="w-20 mb-3" />
      <h4 className="font-bold text-lg">{name}</h4>
      <p
        className={`mt-1 text-sm font-medium ${
          status === "Available"
            ? "text-green-600"
            : status === "Booked"
            ? "text-red-600"
            : "text-yellow-600"
        }`}
      >
        {status}
      </p>
      <p className="text-gray-700 mt-2">{price}</p>
      <button
        disabled={status !== "Available"}
        className={`mt-3 w-full py-2 rounded-lg font-semibold ${
          status === "Available"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {status === "Available" ? "Book Now" : "Not Available"}
      </button>
    </div>
  );
}

export default Dashboard;

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import vehiclesRoute from "./src/routes/Vehicle.js";
import bookingsRoute from "./src/routes/bookings.js";
import userRoute from "./src/routes/user.js";


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/vehicles", vehiclesRoute);
app.use("/api/bookings", bookingsRoute);
app.use("/api/user", userRoute);



const PORT = 3000;
const MONGO = process.env.MONGO_URI;

connectDB(MONGO)
  .then(() => {
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection failed:", err));

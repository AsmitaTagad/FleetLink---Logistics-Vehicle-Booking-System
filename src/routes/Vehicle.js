import { Router } from "express";
import {
  createBooking,
  createVehicle,
  DeleteVehicle,
  getAllBookings,
  getAvailableVehicles,
  GetById,
  getUserBookings,
  UpdateVehicle,
} from "../controllers/Vehicle.js";

const router = Router();

router.post("/add", createVehicle);
router.get("/available", getAvailableVehicles);
router.post("/booking", createBooking);
router.get("/mybooked/:userId", getUserBookings);
router.delete("/delete/:id", DeleteVehicle);
router.get("/getById/:id", GetById);
router.put("/update/:id", UpdateVehicle);
router.get("/allbookings", getAllBookings);
export default router;

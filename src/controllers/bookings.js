import mongoose from "mongoose";
 import VehicleModel from "../models/Vehicle.js";
 import bookingsModel from "../models/bookings.js";


export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const {
      vehicleId,
      fromPincode,
      toPincode,
      startTime: startTimeStr,
      customerId,
    } = req.body;
    const startTime = new Date(startTimeStr);

    const vehicle = await VehicleModel.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });

    const duration = estimatedRideDurationHours(fromPincode, toPincode);
    const endTime = new Date(startTime.getTime() + duration * 3600 * 1000);

    session.startTransaction();

    const conflict = await bookingsModel.findOne({
      vehicleId,
      $and: [{ startTime: { $lt: endTime } }, { endTime: { $gt: startTime } }],
    }).session(session);

    if (conflict) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(409)
        .json({ error: "Vehicle already booked for the requested time" });
    }

    const booking = new bookingsModel({
      vehicleId,
      fromPincode,
      toPincode,
      startTime,
      endTime,
      estimatedRideDurationHours: duration,
      customerId,
    });

    await booking.save({ session });
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(booking);
  } catch (err) {
    await session.abortTransaction().catch(() => {});
    session.endSession();
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

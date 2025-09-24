import VehicleModel from "../models/Vehicle.js";
import BookingModel from "../models/bookings.js";
import estimateDistanceKm, {
  estimateRideDurationHours,
} from "../utils/rideDuration.js";

export const createVehicle = async (req, res) => {
  try {
    const { name, capacityKg, tyres, rate } = req.body;
    const isExists = await VehicleModel.findOne({ name });
    if (isExists) {
      return res.status(400).json({ message: "Vehicle Already Exists!" });
    }
    const vehicle = new VehicleModel({ name, capacityKg, tyres, rate });
    await vehicle.save();
    return res.status(201).json(vehicle);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getAvailableVehicles = async (req, res) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;

    let vehicles = await VehicleModel.find(
      capacityRequired ? { capacityKg: { $gte: Number(capacityRequired) } } : {}
    ).lean();

    if (!fromPincode || !toPincode || !startTime) {
      vehicles = vehicles.map((v) => ({ ...v, isBooked: false }));
      return res.status(200).json(vehicles);
    }
    const duration = estimateRideDurationHours(fromPincode, toPincode);
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 3600 * 1000);
    const enriched = await Promise.all(
      vehicles.map(async (v) => {
        const conflict = await BookingModel.findOne({
          vehicleId: v._id,
          $and: [{ startTime: { $lt: end } }, { endTime: { $gt: start } }],
        }).lean();

        return {
          ...v,
          isBooked: !!conflict,
          estimatedRideDurationHours: duration,
        };
      })
    );

    return res.status(200).json(enriched);
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const {
      vehicleId,
      fromPincode,
      toPincode,
      startTime,
      endTime,
      customerId,
      destination,
    } = req.body;
    console.log(req.body);
    if (
      !vehicleId ||
      !fromPincode ||
      !toPincode ||
      !startTime ||
      !endTime ||
      !customerId
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = estimateRideDurationHours(fromPincode, toPincode);
    const vehicle = await VehicleModel.findById(vehicleId).lean();
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    const distanceKm = estimateDistanceKm(fromPincode, toPincode);
    const totalPrice = (vehicle.rate || 0) * distanceKm;
    const conflict = await BookingModel.findOne({
      vehicleId,
      $and: [{ startTime: { $lt: end } }, { endTime: { $gt: start } }],
    });

    if (conflict) {
      return res.status(400).json({
        error: `Vehicle already booked between ${conflict.startTime.toLocaleString()} and ${conflict.endTime.toLocaleString()}`,
      });
    }

    const booking = await BookingModel.create({
      vehicleId,
      fromPincode,
      toPincode,
      startTime: start,
      endTime: end,
      estimatedRideDurationHours: duration,
      customerId,
      distanceKm,
      totalPrice,
      destination,
    });

    await VehicleModel.findByIdAndUpdate(vehicleId, {
      $push: {
        bookings: {
          bookingId: booking._id,
          customerId,
          fromPincode,
          toPincode,
          startTime: start,
          endTime: end,
          estimatedRideDurationHours: duration,
          distanceKm,
          totalPrice,
          destination,
        },
      },
    });

    return res.status(201).json({
      message: "Booking successful!",
      booking,
    });
  } catch (err) {
    console.error("Error in booking:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const bookings = await BookingModel.find({ customerId: userId })
      .populate("vehicleId", "name capacityKg tyres rate")
      .sort({ startTime: -1 })
      .lean();

    return res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const DeleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await VehicleModel.findByIdAndDelete(id);

    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    return res.status(200).json({ message: "Vehicle deleted successfully!" });
  } catch (err) {
    console.error("Error deleting vehicle:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const GetById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const vehicle = await VehicleModel.findById(id);
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }
    return res.status(200).json(vehicle);
  } catch (err) {
    console.error("Error fetching vehicle:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const UpdateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacityKg, tyres, rate } = req.body;
    if (!name || !capacityKg || !tyres || !rate) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    const updatedVehicle = await VehicleModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          capacityKg,
          tyres,
          rate,
        },
      },
      { new: true }
    );

    if (!updatedVehicle) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    return res.status(200).json({
      message: "Vehicle updated successfully!",
      vehicle: updatedVehicle,
    });
  } catch (err) {
    console.error("Error updating vehicle:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.find()
      .populate("vehicleId", "name tyres capacityKg rate")
      .sort({ startTime: 1 })
      .lean();

    return res.status(200).json(bookings);
  } catch (err) {
    console.error("Error fetching all bookings:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

import mongoose, { model, Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    fromPincode: { type: String, required: true },
    toPincode: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    estimatedRideDurationHours: { type: Number, required: true },
    customerId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    destination: { type: String },
    distanceKm: { type: Number },
    totalPrice: { type: Number },
  },
  {
    timestamps: true,
  }
);

export default model("Booking", bookingSchema);

import { model, Schema } from "mongoose";

const vehicleSchema = new Schema(
  {
    name: { type: String, required: true },
    number: { type: String },
    capacityKg: { type: Number, required: true },
    tyres: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    rate: { type: Number }, //per km
    average: { type: Number },
    bookings: [
      {
        bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
        customerId: { type: Schema.Types.ObjectId, ref: "users" },
        fromPincode: String,
        toPincode: String,
        startTime: Date,
        endTime: Date,
        estimatedRideDurationHours: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("Vehicle", vehicleSchema);

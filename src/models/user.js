import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, requires: true },
    role: { type: String, enum: ["admin", "user"], required: true },
  },
  {
    timestamps: true,
  }
);

export default model("user", userSchema);

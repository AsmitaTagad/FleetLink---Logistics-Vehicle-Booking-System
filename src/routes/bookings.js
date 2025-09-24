import {Router} from "express";
import { body, validationResult } from "express-validator";
import { createBooking } from "../controllers/bookings.js";


const router = Router();

router.post("/",
  body("vehicleId").isString(),
  body("fromPincode").isString(),
  body("toPincode").isString(),
  body("startTime").isISO8601(),
  body("customerId").isString(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    return createBooking(req, res);
  }
);

export default router;

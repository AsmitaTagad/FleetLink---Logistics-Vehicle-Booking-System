import { Router } from "express";
import { SignUp, SignIn, getByToken } from "../controllers/user.js";
import { authMiddleware } from "../middlerware/auth.js";

const router = Router();

router.post("/signUp", SignUp);
router.post("/login", SignIn);
router.get("/byToken",authMiddleware,  getByToken);

export default router;

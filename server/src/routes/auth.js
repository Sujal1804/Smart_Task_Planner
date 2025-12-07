import { Router } from "express";
import {
  handleSignup,
  handleLogin,
  handleGetMe
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/signup", handleSignup);
router.post("/login", handleLogin);
router.get("/me", authenticateToken, handleGetMe);

export default router;


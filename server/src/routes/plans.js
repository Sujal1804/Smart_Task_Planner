import { Router } from "express";
import {
  handleGeneratePlan,
  handleCreatePlan,
  handleListPlans,
  handleGetPlan,
  handleUpdatePlan,
  handleDeletePlan
} from "../controllers/planController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/generate", handleGeneratePlan);
router.post("/", authenticateToken, handleCreatePlan);
router.get("/", authenticateToken, handleListPlans);
router.get("/:id", authenticateToken, handleGetPlan);
router.put("/:id", authenticateToken, handleUpdatePlan);
router.delete("/:id", authenticateToken, handleDeletePlan);

export default router;

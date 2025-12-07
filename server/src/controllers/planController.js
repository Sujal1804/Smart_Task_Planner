import {
  generatePlan,
  createPlan,
  listPlans,
  getPlanById,
  updatePlan,
  deletePlan
} from "../services/planService.js";

export async function handleGeneratePlan(req, res, next) {
  try {
    const { goal, horizonDays } = req.body;
    if (!goal || typeof goal !== "string") {
      return res.status(400).json({ error: "goal is required and must be a string" });
    }
    const plan = await generatePlan(goal, horizonDays);
    return res.json(plan);
  } catch (err) {
    next(err);
  }
}

export async function handleCreatePlan(req, res, next) {
  try {
    const payload = req.body;
    if (!payload.title || !payload.goal) {
      return res.status(400).json({ error: "title and goal are required" });
    }
    const plan = await createPlan(payload, req.userId);
    return res.status(201).json(plan);
  } catch (err) {
    next(err);
  }
}

export async function handleListPlans(req, res, next) {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const result = await listPlans(page, limit, req.userId);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function handleGetPlan(req, res, next) {
  try {
    const { id } = req.params;
    const plan = await getPlanById(id, req.userId);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }
    return res.json(plan);
  } catch (err) {
    next(err);
  }
}

export async function handleUpdatePlan(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await updatePlan(id, updates, req.userId);
    if (!updated) {
      return res.status(404).json({ error: "Plan not found" });
    }
    return res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function handleDeletePlan(req, res, next) {
  try {
    const { id } = req.params;
    await deletePlan(id, req.userId);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}


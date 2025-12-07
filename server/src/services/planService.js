import { addDays, toISODate } from "../utils/dateUtils.js";
import Plan from "../models/Plan.js";
import { generatePlanFromGoal, explainPlan } from "./llm.js";

function mapLlmTaskToStoredTask(llmTask, now) {
  const startDate = addDays(now, llmTask.earliest_start_offset_days || 0);
  const dueDate = addDays(startDate, llmTask.duration_days || 1);

  return {
    id: llmTask.id,
    title: llmTask.title,
    description: llmTask.description,
    estHours: llmTask.estimated_hours,
    startDate,
    dueDate,
    dependsOn: llmTask.dependencies || [],
    status: "pending",
    assignee: null,
    priority: llmTask.priority ?? 3
  };
}

export async function generatePlan(goal, horizonDays) {
  const now = new Date();
  const llmPlan = await generatePlanFromGoal(goal, horizonDays);
  const tasks = (llmPlan.tasks || []).map((t) => mapLlmTaskToStoredTask(t, now));
  const reasoning = await explainPlan({ ...llmPlan, tasks });

  return {
    title: goal,
    goal,
    horizonDays: llmPlan.horizonDays,
    tasks: tasks.map((t) => ({
      ...t,
      startDate: toISODate(t.startDate),
      dueDate: toISODate(t.dueDate)
    })),
    meta: { reasoning }
  };
}

export async function createPlan(payload, userId) {
  const existingPlan = await Plan.findOne({
    userId,
    title: payload.title,
    goal: payload.goal
  });

  if (existingPlan) {
    await Plan.findOneAndDelete({ _id: existingPlan._id, userId });
  }

  const plan = await Plan.create({ ...payload, userId });
  return plan.toObject();
}

export async function listPlans(page = 1, limit = 10, userId) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Plan.find({ userId }, "title goal horizonDays createdAt").sort({ createdAt: -1 }).skip(skip).limit(limit),
    Plan.countDocuments({ userId })
  ]);

  return {
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    }
  };
}

export async function getPlanById(id, userId) {
  const plan = await Plan.findOne({ _id: id, userId }).lean();
  return plan;
}

export async function updatePlan(id, updates, userId) {
  const updated = await Plan.findOneAndUpdate(
    { _id: id, userId },
    updates,
    { new: true, runValidators: true }
  ).lean();
  return updated;
}

export async function deletePlan(id, userId) {
  await Plan.findOneAndDelete({ _id: id, userId });
}

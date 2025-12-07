import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    estHours: { type: Number, default: 1 },
    startDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    dependsOn: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "done"],
      default: "pending"
    },
    assignee: { type: String, default: null },
    priority: { type: Number, min: 1, max: 5, default: 3 }
  },
  { _id: false }
);

const PlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  goal: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  horizonDays: { type: Number, default: 14 },
  tasks: { type: [TaskSchema], default: [] },
  meta: { type: mongoose.Schema.Types.Mixed, default: {} }
});

const Plan = mongoose.model("Plan", PlanSchema);

export default Plan;

import { generatePlan } from "../src/services/planService.js";

describe("planService.generatePlan", () => {
  it("generates a plan with tasks and reasoning", async () => {
    const result = await generatePlan("Test goal", 10);
    expect(result.goal).toBe("Test goal");
    expect(Array.isArray(result.tasks)).toBe(true);
    expect(result.tasks.length).toBeGreaterThanOrEqual(6);
    expect(result.meta.reasoning).toContain("Test goal");
    const task = result.tasks[0];
    expect(task.startDate).toBeDefined();
    expect(task.dueDate).toBeDefined();
  });

  it("defaults horizonDays when invalid", async () => {
    const result = await generatePlan("Another goal", -5);
    expect(result.horizonDays).toBeGreaterThan(0);
  });
});



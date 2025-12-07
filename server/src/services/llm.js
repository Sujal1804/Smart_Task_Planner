import { v4 as uuidv4 } from "uuid";
import Groq from "groq-sdk";

function getGroqClient() {
  const apiKey = process.env.LLM_API_KEY || process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn("LLM_API_KEY or GROQ_API_KEY environment variable is not set");
    return null;
  }
  const cleanedKey = apiKey.trim().replace(/^["']|["']$/g, "");
  if (!cleanedKey || cleanedKey.length < 20) {
    console.warn("LLM_API_KEY appears to be invalid (too short or empty)");
    return null;
  }
  return new Groq({
    apiKey: cleanedKey,
  });
}

export const PLAN_PROMPT_TEMPLATE = `
Break down the goal: "{{goal}}" into actionable tasks over the next {{horizonDays}} days.
For each task provide: id, title, description, estimated_hours, earliest_start_offset_days, duration_days,
dependencies (list of ids), priority (1-5). The entire response must be valid JSON in the shape:
{
  "goal": "{{goal}}",
  "horizonDays": {{horizonDays}},
  "tasks": [
    {
      "id": "task-1",
      "title": "Example task",
      "description": "Example description",
      "estimated_hours": 2,
      "earliest_start_offset_days": 0,
      "duration_days": 1,
      "dependencies": [],
      "priority": 3
    }
  ]
}
`.trim();

export async function generatePlanFromGoal(goal, horizonDays = 14) {
  const baseGoal = goal || "Your goal";
  const days = Number.isFinite(horizonDays) && horizonDays > 0 ? horizonDays : 14;

  const groqClient = getGroqClient();
  if (!groqClient) {
    console.warn("LLM_API_KEY not set or invalid, using mocked plan generation");
    return generateMockedPlan(baseGoal, days);
  }
  
  console.log("Using Groq API to generate plan...");

  try {
    const prompt = PLAN_PROMPT_TEMPLATE
      .replace(/\{\{goal\}\}/g, baseGoal)
      .replace(/\{\{horizonDays\}\}/g, String(days));

    const modelNames = [
      "llama-3.1-70b-versatile",
      "llama-3.1-8b-instant",
      "mixtral-8x7b-32768"
    ];
    let responseText = null;
    let lastError = null;

    const fullPrompt = `You are a task planning assistant. Break down goals into actionable tasks with dependencies, priorities, and time estimates. Always respond with valid JSON only, no markdown formatting.

${prompt}`;

    for (const modelName of modelNames) {
      try {
        console.log(`Trying Groq model: ${modelName}`);
        const completion = await groqClient.chat.completions.create({
          messages: [
            {
              role: "user",
              content: fullPrompt,
            },
          ],
          model: modelName,
          temperature: 0.7,
        });

        responseText = completion.choices[0]?.message?.content;
        if (responseText) {
          console.log(`Successfully used Groq model: ${modelName}`);
          break;
        }
      } catch (err) {
        lastError = err;
        console.log(`Model ${modelName} failed, trying next...`);
        continue;
      }
    }

    if (!responseText) {
      throw new Error(`No available Groq model found. Last error: ${lastError?.message}`);
    }

    let llmResponse;
    try {
      const cleanedResponse = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      llmResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse Groq response:", parseError);
      console.error("Response text:", responseText);
      throw new Error("Invalid JSON response from LLM");
    }

    if (!llmResponse.tasks || !Array.isArray(llmResponse.tasks)) {
      throw new Error("LLM response missing tasks array");
    }

    const taskIdMap = new Map();
    const tasksWithIds = llmResponse.tasks.map((task) => {
      const taskId = uuidv4();
      taskIdMap.set(task.id || task.title, taskId);
      return {
        ...task,
        id: taskId,
        title: task.title || "Untitled task",
        description: task.description || "",
        estimated_hours: task.estimated_hours || 1,
        earliest_start_offset_days: task.earliest_start_offset_days || 0,
        duration_days: task.duration_days || 1,
        dependencies: task.dependencies || [],
        priority: task.priority || 3
      };
    });

    const tasksWithMappedDeps = tasksWithIds.map((task) => {
      const mappedDeps = (task.dependencies || []).map((depId) => {
        const depTask = tasksWithIds.find(
          (t) => t.id === depId || t.title === depId || String(t.id) === String(depId)
        );
        return depTask ? depTask.id : depId;
      });
      return {
        ...task,
        dependencies: mappedDeps.filter((id, idx, arr) => arr.indexOf(id) === idx)
      };
    });

    return {
      goal: llmResponse.goal || baseGoal,
      horizonDays: llmResponse.horizonDays || days,
      tasks: tasksWithMappedDeps
    };
  } catch (error) {
    if (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('rate limit'))) {
      console.warn("Groq API quota exceeded. Using mocked plan generation.");
    } else {
      console.error("Groq API error:", error.message);
    }
    console.warn("Falling back to mocked plan generation");
    return generateMockedPlan(baseGoal, days);
  }
}

function generateMockedPlan(baseGoal, days) {
  const tasksRaw = [
    {
      title: "Clarify vision and success criteria",
      description: "Define the outcome, constraints, and how success will be measured.",
      estimated_hours: 2,
      earliest_start_offset_days: 0,
      duration_days: 1,
      dependencies: [],
      priority: 1
    },
    {
      title: "Research target audience and competitors",
      description: "Identify who you are serving and review 3–5 comparable examples.",
      estimated_hours: 3,
      earliest_start_offset_days: 0,
      duration_days: 2,
      dependencies: [],
      priority: 2
    },
    {
      title: "Outline key milestones and timeline",
      description: "Translate the goal into 3–5 milestones across the horizon.",
      estimated_hours: 2,
      earliest_start_offset_days: 1,
      duration_days: 1,
      dependencies: [],
      priority: 2
    },
    {
      title: "Break milestones into detailed tasks",
      description: "Expand each milestone into concrete, small tasks with owners.",
      estimated_hours: 4,
      earliest_start_offset_days: 2,
      duration_days: 2,
      dependencies: [],
      priority: 2
    },
    {
      title: "Prioritize tasks and assign rough estimates",
      description: "Rank tasks by impact/urgency and refine hour estimates.",
      estimated_hours: 3,
      earliest_start_offset_days: 3,
      duration_days: 2,
      dependencies: [],
      priority: 1
    },
    {
      title: "Create calendar blocks and checkpoints",
      description: "Allocate time on the calendar and define review checkpoints.",
      estimated_hours: 2,
      earliest_start_offset_days: 4,
      duration_days: 2,
      dependencies: [],
      priority: 3
    },
    {
      title: "Set up tracking dashboard",
      description: "Create a simple tracker (spreadsheet or tool) to monitor progress.",
      estimated_hours: 2,
      earliest_start_offset_days: 5,
      duration_days: 2,
      dependencies: [],
      priority: 3
    },
    {
      title: "Schedule first review and adjust plan",
      description: "After initial execution, review progress and adjust tasks.",
      estimated_hours: 1,
      earliest_start_offset_days: Math.min(7, days - 1),
      duration_days: 1,
      dependencies: [],
      priority: 2
    }
  ].slice(0, Math.min(10, Math.max(6, Math.floor(days / 2))));

  const withIds = tasksRaw.map((t) => ({
    ...t,
    id: uuidv4()
  }));

  const tasksWithDeps = withIds.map((task, index) => {
    if (index === 0) {
      return { ...task, dependencies: [] };
    }
    if (index === 1) {
      return { ...task, dependencies: [withIds[0].id] };
    }
    return { ...task, dependencies: [withIds[index - 1].id] };
  });

  return {
    goal: baseGoal,
    horizonDays: days,
    tasks: tasksWithDeps
  };
}

export async function explainPlan(plan) {
  const taskCount = plan?.tasks?.length || 0;

  const groqClient = getGroqClient();
  if (!groqClient) {
    return (
      `This plan breaks the goal "${plan.goal}" into ${taskCount} steps, ` +
      "ordered from definition and research into execution, scheduling, and review. " +
      "Dependencies ensure that foundational work is done before downstream tasks begin."
    );
  }

  try {
    const taskSummary = plan.tasks
      .slice(0, 5)
      .map((t) => `- ${t.title} (${t.estimated_hours || 1}h, priority ${t.priority || 3})`)
      .join("\n");

    const modelNames = [
      "llama-3.1-8b-instant",
      "llama-3.1-70b-versatile",
      "mixtral-8x7b-32768"
    ];
    let explanation = null;
    let lastError = null;

    const prompt = `You are a task planning assistant. Provide a brief, clear explanation of how a plan was structured.

Explain how this plan for "${plan.goal}" was structured. The plan has ${taskCount} tasks over ${plan.horizonDays} days. Key tasks:
${taskSummary}

Provide a 2-3 sentence explanation of the plan's structure and reasoning.`;

    for (const modelName of modelNames) {
      try {
        const completion = await groqClient.chat.completions.create({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          model: modelName,
          temperature: 0.7,
          max_tokens: 150,
        });

        explanation = completion.choices[0]?.message?.content?.trim();
        if (explanation) {
          break;
        }
      } catch (err) {
        lastError = err;
        continue;
      }
    }

    if (!explanation) {
      throw new Error(`No available Groq model found. Last error: ${lastError?.message}`);
    }
    
    return explanation || `This plan breaks the goal "${plan.goal}" into ${taskCount} actionable steps.`;
  } catch (error) {
    if (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('rate limit'))) {
      console.warn("Groq API quota exceeded for explanation. Using fallback explanation.");
    } else {
      console.error("Groq explanation error:", error.message);
    }
    return (
      `This plan breaks the goal "${plan.goal}" into ${taskCount} steps, ` +
      "ordered from definition and research into execution, scheduling, and review. " +
      "Dependencies ensure that foundational work is done before downstream tasks begin."
    );
  }
}

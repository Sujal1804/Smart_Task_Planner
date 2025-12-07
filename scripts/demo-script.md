# Smart Task Planner – Demo Script (3–5 minutes)

1. **Intro (who, what, why)**
   - Introduce the Smart Task Planner and the problem it solves (breaking down big goals into actionable tasks).
   - Mention the tech stack: Node/Express backend, MongoDB Atlas, React + Tailwind frontend, mocked LLM layer.

2. **Generate a plan from a goal**
   - In the browser, show the goal input box.
   - Enter a concrete goal (e.g., “Launch a personal productivity blog in 3 weeks”) and click **Generate Plan**.
   - Highlight the structured tasks, priorities, and the dependency view.

3. **Edit and save the plan**
   - Change a task’s title, estimated hours, and status.
   - Click **Save Plan**; point out the new entry in the **Saved Plans** list.
   - Click a saved plan to load it and show that edits persisted.

4. **Architecture & API**
   - Open your editor briefly to show the `llm.js` prompt template and mocked generation.
   - Show the Postman collection or browser dev tools network tab to emphasize the REST API.
   - Wrap up by explaining how a real LLM key could be wired in with minimal changes.



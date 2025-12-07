import React from "react";
import TaskList from "./TaskList.jsx";
import DependencyList from "./DependencyList.jsx";

export default function PlanEditor({ plan, onChangePlan, onSave, saving, selectedTaskId, onSelectTask }) {
  if (!plan) {
    return (
      <div className="mt-4 rounded-xl border border-dashed p-6 text-sm" style={{
        backgroundColor: 'rgba(15, 23, 36, 0.5)',
        borderColor: 'rgba(167, 176, 195, 0.2)',
        color: '#A7B0C3'
      }}>
        Generate a plan from your goal to start editing.
      </div>
    );
  }

  const handleChangeTask = (index, updatedTask) => {
    const tasks = [...(plan.tasks || [])];
    tasks[index] = updatedTask;
    onChangePlan({ ...plan, tasks });
  };

  return (
    <div className="mt-4 space-y-4" style={{ gap: '16px' }}>
      <div className="rounded-xl border p-4" style={{ 
        backgroundColor: '#0F1724', 
        borderColor: 'rgba(167, 176, 195, 0.1)',
        padding: '16px'
      }}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium mb-1" style={{ color: '#A7B0C3' }}>
              Plan title
            </label>
            <input
              type="text"
              className="w-full"
              value={plan.title || ""}
              onChange={(e) => onChangePlan({ ...plan, title: e.target.value })}
            />
          </div>
          <div className="w-32">
            <label className="block text-xs font-medium mb-1" style={{ color: '#A7B0C3' }}>
              Horizon (days)
            </label>
            <input
              type="number"
              min={1}
              className="w-full"
              value={plan.horizonDays ?? 14}
              onChange={(e) =>
                onChangePlan({
                  ...plan,
                  horizonDays: Math.max(1, Number(e.target.value) || 14)
                })
              }
            />
          </div>
          <div className="flex items-center gap-2">
            {plan._id && (
              <span className="text-xs" style={{ color: '#A7B0C3' }}>
                Auto-save enabled
              </span>
            )}
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: saving ? 'rgba(34, 197, 94, 0.5)' : '#22C55E',
                transition: 'all 0.2s'
              }}
            >
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[9px]">
                ⬤
              </span>
              {saving ? "Saving…" : plan._id ? "Update plan" : "Save plan"}
            </button>
          </div>
        </div>
      </div>
      
      <div style={{ width: '100%' }}>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#A7B0C3' }}>
          Tasks
        </h3>
        <div style={{ width: '100%', maxWidth: '100%' }}>
          <TaskList 
            tasks={plan.tasks || []} 
            onChangeTask={handleChangeTask}
            selectedTaskId={selectedTaskId}
            onSelectTask={onSelectTask}
          />
        </div>
      </div>

      <div className="mt-4" style={{ width: '100%' }}>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#A7B0C3' }}>
          Task Dependencies
        </h3>
        <DependencyList tasks={plan.tasks || []} />
      </div>
    </div>
  );
}

import React from "react";

function PriorityBadge({ level }) {
  const labels = { 1: "P1", 2: "P2", 3: "P3", 4: "P4", 5: "P5" };
  const colors = {
    1: { bg: "rgba(239, 68, 68, 0.15)", text: "#FCA5A5", border: "rgba(239, 68, 68, 0.4)" },
    2: { bg: "rgba(249, 115, 22, 0.15)", text: "#FDBA74", border: "rgba(249, 115, 22, 0.4)" },
    3: { bg: "rgba(34, 197, 94, 0.15)", text: "#86EFAC", border: "rgba(34, 197, 94, 0.4)" },
    4: { bg: "rgba(59, 130, 246, 0.15)", text: "#93C5FD", border: "rgba(59, 130, 246, 0.4)" },
    5: { bg: "rgba(167, 176, 195, 0.15)", text: "#A7B0C3", border: "rgba(167, 176, 195, 0.4)" }
  };
  const color = colors[level] || colors[3];
  return (
    <span
      className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold"
      style={{ backgroundColor: color.bg, color: color.text, borderColor: color.border }}
    >
      {labels[level] || "P3"}
    </span>
  );
}

function StatusBadge({ status, onChange }) {
  const config = {
    pending: { bg: "rgba(167, 176, 195, 0.15)", text: "#A7B0C3", label: "Pending" },
    in_progress: { bg: "rgba(59, 130, 246, 0.15)", text: "#93C5FD", label: "In Progress" },
    completed: { bg: "rgba(34, 197, 94, 0.15)", text: "#86EFAC", label: "Completed" },
    done: { bg: "rgba(34, 197, 94, 0.15)", text: "#86EFAC", label: "Done" }
  };
  const style = config[status] || config.pending;
  
  return (
    <select
      value={status || "pending"}
      onChange={(e) => onChange(e.target.value)}
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border-0 cursor-pointer"
      style={{ 
        backgroundColor: style.bg, 
        color: style.text,
        outline: 'none'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <option value="pending" style={{ backgroundColor: '#0F1724', color: '#A7B0C3' }}>Pending</option>
      <option value="in_progress" style={{ backgroundColor: '#0F1724', color: '#93C5FD' }}>In Progress</option>
      <option value="completed" style={{ backgroundColor: '#0F1724', color: '#86EFAC' }}>Completed</option>
      <option value="done" style={{ backgroundColor: '#0F1724', color: '#86EFAC' }}>Done</option>
    </select>
  );
}

export default function TaskList({ tasks, onChangeTask, selectedTaskId, onSelectTask }) {
  if (!tasks || tasks.length === 0) {
    return (
      <p className="text-sm" style={{ color: '#A7B0C3' }}>
        Generate a plan to see tasks. You can then refine estimates, priorities, and status.
      </p>
    );
  }

  return (
    <div className="space-y-3" style={{ gap: '12px' }}>
      {tasks.map((task, idx) => {
        const isSelected = selectedTaskId === task.id;
        return (
          <div
            key={task.id}
            onClick={() => onSelectTask?.(task.id)}
            className="rounded-lg border cursor-pointer transition-all"
            style={{
              backgroundColor: isSelected ? 'rgba(111, 139, 255, 0.08)' : '#0F1724',
              borderColor: isSelected ? 'rgba(111, 139, 255, 0.4)' : 'rgba(167, 176, 195, 0.1)',
              padding: '16px',
              minHeight: '140px',
              width: '100%'
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0" style={{ width: '60%' }}>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 bg-transparent text-sm font-semibold"
                    style={{ color: '#FFFFFF' }}
                    value={task.title}
                    onChange={(e) => onChangeTask(idx, { ...task, title: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <PriorityBadge level={task.priority} />
                </div>
                <textarea
                  rows={2}
                  className="w-full bg-transparent text-xs resize-none"
                  style={{ color: '#A7B0C3' }}
                  value={task.description}
                  onChange={(e) => onChangeTask(idx, { ...task, description: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Task description..."
                />
              </div>
              <div className="flex flex-col items-end gap-2" style={{ minWidth: '140px' }}>
                <StatusBadge 
                  status={task.status || "pending"} 
                  onChange={(newStatus) => onChangeTask(idx, { ...task, status: newStatus })}
                />
                <div className="flex items-center gap-2 text-[11px]" style={{ color: '#A7B0C3' }}>
                  <span>Est:</span>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    className="w-16 bg-transparent border rounded px-2 py-1 text-center"
                    style={{ 
                      borderColor: 'rgba(167, 176, 195, 0.2)',
                      color: '#FFFFFF'
                    }}
                    value={task.estHours ?? ""}
                    onChange={(e) => onChangeTask(idx, { ...task, estHours: Number(e.target.value) })}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span>hrs</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]" style={{ color: '#A7B0C3' }}>
                  <span>Priority:</span>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    className="w-12 bg-transparent border rounded px-2 py-1 text-center"
                    style={{ 
                      borderColor: 'rgba(167, 176, 195, 0.2)',
                      color: '#FFFFFF'
                    }}
                    value={task.priority ?? 3}
                    onChange={(e) =>
                      onChangeTask(idx, {
                        ...task,
                        priority: Math.min(5, Math.max(1, Number.parseInt(e.target.value || "3", 10)))
                      })
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 text-[11px] pt-2 border-t" style={{ 
              borderColor: 'rgba(167, 176, 195, 0.1)',
              color: '#A7B0C3'
            }}>
              <div className="flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-mono">
                  {task.startDate ? new Date(task.startDate).toLocaleDateString() : "-"}
                </span>
                <span>→</span>
                <span className="font-mono">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
                </span>
              </div>
              {task.dependsOn && task.dependsOn.length > 0 && (
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span>Depends on {task.dependsOn.length} task(s)</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

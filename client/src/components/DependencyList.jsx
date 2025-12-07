import React from "react";

export default function DependencyList({ tasks }) {
  if (!tasks || tasks.length === 0) return null;

  const tasksById = new Map(tasks.map((t) => [t.id, t]));

  return (
    <div className="rounded-lg border p-4" style={{
      backgroundColor: '#0F1724',
      borderColor: 'rgba(167, 176, 195, 0.1)',
      padding: '16px'
    }}>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#A7B0C3' }}>
        Task dependencies
      </h3>
      <ol className="space-y-2 text-xs" style={{ color: '#FFFFFF', gap: '8px' }}>
        {tasks.map((task) => (
          <li key={task.id} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold" style={{
                backgroundColor: 'rgba(111, 139, 255, 0.2)',
                color: '#6F8BFF'
              }}>
                {task.priority ?? 3}
              </span>
              <span className="font-medium">{task.title}</span>
            </div>
            {task.dependsOn && task.dependsOn.length > 0 ? (
              <div className="ml-7 flex flex-wrap gap-1" style={{ color: '#A7B0C3' }}>
                <span className="text-[10px] uppercase tracking-wide">Depends on:</span>
                {task.dependsOn.map((depId) => {
                  const depTask = tasksById.get(depId);
                  return (
                    <span
                      key={depId}
                      className="rounded-full px-2 py-0.5 text-[10px]"
                      style={{
                        backgroundColor: 'rgba(167, 176, 195, 0.15)',
                        color: '#A7B0C3'
                      }}
                    >
                      {depTask ? depTask.title : depId}
                    </span>
                  );
                })}
              </div>
            ) : (
              <span className="ml-7 text-[11px]" style={{ color: '#22C55E' }}>No dependencies</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}


import React from "react";

export default function PlanList({ plans, selectedId, onSelect, onDelete }) {
  return (
    <div className="rounded-xl border p-4 shadow-lg" style={{
      backgroundColor: '#0F1724',
      borderColor: 'rgba(167, 176, 195, 0.1)',
      padding: '16px'
    }}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <h2 className="text-sm font-semibold text-white">Saved plans</h2>
        <span className="text-[11px]" style={{ color: '#A7B0C3' }}>
          {plans.length === 0 ? "None yet" : `${plans.length} total`}
        </span>
      </div>
      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1" style={{ gap: '12px' }}>
        {plans.length === 0 ? (
          <p className="text-xs" style={{ color: '#A7B0C3' }}>
            Save a generated plan and it will appear here for quick access.
          </p>
        ) : (
          plans.map((plan) => {
            const isActive = selectedId === plan._id;
            return (
              <button
                key={plan._id}
                type="button"
                onClick={() => onSelect(plan._id)}
                className="group flex w-full items-start justify-between gap-2 rounded-md border px-3 py-2 text-left text-xs transition-all"
                style={{
                  backgroundColor: isActive ? 'rgba(111, 139, 255, 0.15)' : 'rgba(15, 23, 36, 0.6)',
                  borderColor: isActive ? 'rgba(111, 139, 255, 0.4)' : 'rgba(167, 176, 195, 0.1)',
                  padding: '12px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'rgba(167, 176, 195, 0.3)';
                    e.currentTarget.style.backgroundColor = 'rgba(15, 23, 36, 0.8)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'rgba(167, 176, 195, 0.1)';
                    e.currentTarget.style.backgroundColor = 'rgba(15, 23, 36, 0.6)';
                  }
                }}
              >
                <div>
                  <div className="flex items-center gap-1">
                    <span className="line-clamp-1 font-medium text-white">
                      {plan.title}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[11px]" style={{ color: '#A7B0C3' }}>
                    {plan.goal}
                  </p>
                  <p className="mt-0.5 text-[10px]" style={{ color: '#A7B0C3' }}>
                    Horizon: {plan.horizonDays} days
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px]" style={{ color: '#A7B0C3' }}>
                    {plan.createdAt
                      ? new Date(plan.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(plan._id);
                    }}
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] transition-colors"
                    style={{
                      backgroundColor: 'rgba(15, 23, 36, 0.8)',
                      color: '#A7B0C3'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                      e.currentTarget.style.color = '#FCA5A5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(15, 23, 36, 0.8)';
                      e.currentTarget.style.color = '#A7B0C3';
                    }}
                  >
                    ×
                  </button>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}


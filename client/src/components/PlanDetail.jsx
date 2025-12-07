import React from "react";
import DependencyList from "./DependencyList.jsx";

export default function PlanDetail({ plan }) {
  if (!plan) {
    return (
      <div className="rounded-xl border p-4 text-sm" style={{
        backgroundColor: 'rgba(15, 23, 36, 0.6)',
        borderColor: 'rgba(167, 176, 195, 0.1)',
        color: '#A7B0C3',
        padding: '16px'
      }}>
        Select a saved plan to view its details.
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border p-4" style={{
      backgroundColor: '#0F1724',
      borderColor: 'rgba(167, 176, 195, 0.1)',
      padding: '16px'
    }}>
      <h2 className="text-sm font-semibold text-white">{plan.title}</h2>
      <p className="mt-1 text-xs" style={{ color: '#A7B0C3' }}>{plan.goal}</p>
      <p className="mt-2 text-[11px]" style={{ color: '#A7B0C3' }}>
        Horizon: {plan.horizonDays} days · Created{" "}
        {plan.createdAt ? new Date(plan.createdAt).toLocaleString() : "—"}
      </p>
      {plan.meta?.reasoning && (
        <div className="mt-3 rounded-md p-3 text-xs" style={{
          backgroundColor: 'rgba(7, 8, 18, 0.7)',
          color: '#FFFFFF'
        }}>
          <div className="mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#A7B0C3' }}>
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px]" style={{
              backgroundColor: 'rgba(111, 139, 255, 0.2)',
              color: '#6F8BFF'
            }}>
              ?
            </span>
            Reasoning
          </div>
          <p>{plan.meta.reasoning}</p>
        </div>
      )}
      <DependencyList tasks={plan.tasks || []} />
    </div>
  );
}


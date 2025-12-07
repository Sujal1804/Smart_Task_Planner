import React, { useState } from "react";

export default function GoalForm({ onGenerate, loading }) {
  const [goal, setGoal] = useState("");
  const [horizonDays, setHorizonDays] = useState(21);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!goal.trim()) return;
    onGenerate(goal.trim(), Number(horizonDays) || 14);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border p-4 shadow-lg"
      style={{ 
        backgroundColor: '#0F1724', 
        borderColor: 'rgba(167, 176, 195, 0.1)',
        padding: '16px'
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-white">Start with a goal</h2>
        <span className="text-[11px] uppercase tracking-wide" style={{ color: '#A7B0C3' }}>
          AI-assisted plan
        </span>
      </div>
      <div className="space-y-2">
        <label className="block text-xs font-medium" style={{ color: '#A7B0C3' }}>
          High-level goal
        </label>
        <textarea
          className="w-full resize-none"
          rows={3}
          placeholder="e.g. Launch a personal productivity blog in 3 weeks"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[120px]">
          <label className="block text-xs font-medium" style={{ color: '#A7B0C3' }}>
            Planning horizon (days)
          </label>
          <input
            type="number"
            min={7}
            max={90}
            value={horizonDays}
            onChange={(e) => setHorizonDays(e.target.value)}
            className="mt-1 w-full"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white shadow disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: loading ? 'rgba(111, 139, 255, 0.5)' : 'linear-gradient(135deg, #6F8BFF 0%, #4BA3FF 100%)',
            transition: 'all 0.2s'
          }}
        >
          <span className="h-4 w-4 rounded-full border border-indigo-300 bg-indigo-600 flex items-center justify-center text-[10px]">
            →
          </span>
          {loading ? "Generating…" : "Generate plan"}
        </button>
      </div>
    </form>
  );
}


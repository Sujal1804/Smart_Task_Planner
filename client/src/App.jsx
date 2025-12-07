import React, { useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthContext.jsx";
import Layout from "./components/Layout.jsx";
import GoalForm from "./components/GoalForm.jsx";
import PlanEditor from "./components/PlanEditor.jsx";
import PlanList from "./components/PlanList.jsx";
import PlanDetail from "./components/PlanDetail.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import {
  generatePlan as apiGenerate,
  createPlan,
  updatePlan,
  listPlans,
  getPlan,
  deletePlan as apiDelete
} from "./services/api.js";

export default function App() {
  const { user, logout, loading } = useAuth();
  const [authView, setAuthView] = useState("login");
  const [currentPlan, setCurrentPlan] = useState(null);
  const [savedPlans, setSavedPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const [autoSaving, setAutoSaving] = useState(false);

  const loadPlans = async () => {
    try {
      setLoadingList(true);
      const result = await listPlans(1, 20);
      setSavedPlans(result.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadPlans();
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [autoSaveTimer]);

  const handleGenerate = async (goal, horizonDays) => {
    try {
      setError("");
      setLoadingGenerate(true);
      const plan = await apiGenerate(goal, horizonDays);
      setCurrentPlan(plan);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate plan");
    } finally {
      setLoadingGenerate(false);
    }
  };

  const autoSavePlan = async (plan) => {
    if (!plan || !plan._id) return;
    
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    const timer = setTimeout(async () => {
      try {
        setAutoSaving(true);
        const payload = {
          title: plan.title || plan.goal || "Untitled plan",
          goal: plan.goal,
          horizonDays: plan.horizonDays,
          tasks: plan.tasks,
          meta: plan.meta || {}
        };
        const saved = await updatePlan(plan._id, payload);
        setCurrentPlan({ ...plan, ...saved });
        await loadPlans();
      } catch (err) {
        console.error("Auto-save failed:", err);
      } finally {
        setAutoSaving(false);
      }
    }, 2000);

    setAutoSaveTimer(timer);
  };

  const handleSave = async () => {
    if (!currentPlan) return;
    try {
      setError("");
      setSavingPlan(true);
      
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
        setAutoSaveTimer(null);
      }

      const payload = {
        title: currentPlan.title || currentPlan.goal || "Untitled plan",
        goal: currentPlan.goal,
        horizonDays: currentPlan.horizonDays,
        tasks: currentPlan.tasks,
        meta: currentPlan.meta || {}
      };

      let saved;
      if (currentPlan._id) {
        saved = await updatePlan(currentPlan._id, payload);
      } else {
        saved = await createPlan(payload);
      }

      setCurrentPlan({ ...currentPlan, ...saved });
      setSelectedPlanId(saved._id);
      await loadPlans();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save plan");
    } finally {
      setSavingPlan(false);
    }
  };

  const handlePlanChange = (updatedPlan) => {
    setCurrentPlan(updatedPlan);
    if (updatedPlan._id) {
      autoSavePlan(updatedPlan);
    }
  };

  const handleSelectPlan = async (id) => {
    setSelectedPlanId(id);
    try {
      const plan = await getPlan(id);
      setSelectedPlan(plan);
      setCurrentPlan(plan);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load plan");
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    try {
      await apiDelete(id);
      if (selectedPlanId === id) {
        setSelectedPlanId(null);
        setSelectedPlan(null);
      }
      await loadPlans();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete plan");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#070812' }}>
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return authView === "login" ? (
      <Login onSwitchToSignup={() => setAuthView("signup")} />
    ) : (
      <Signup onSwitchToLogin={() => setAuthView("login")} />
    );
  }

  const sidebar = (
    <div className="space-y-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white">{user.name || user.email}</p>
          <p className="text-xs" style={{ color: '#A7B0C3' }}>{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="px-3 py-1.5 text-xs font-medium rounded-md"
          style={{
            backgroundColor: 'rgba(167, 176, 195, 0.1)',
            color: '#A7B0C3',
            border: '1px solid rgba(167, 176, 195, 0.2)'
          }}
        >
          Logout
        </button>
      </div>
      <PlanList
        plans={savedPlans}
        selectedId={selectedPlanId}
        onSelect={handleSelectPlan}
        onDelete={handleDeletePlan}
      />
      {loadingList && (
        <p className="text-[11px]" style={{ color: '#A7B0C3' }}>Refreshing saved plans…</p>
      )}
      <PlanDetail plan={selectedPlan} />
    </div>
  );

  const main = (
    <>
      <GoalForm onGenerate={handleGenerate} loading={loadingGenerate} />
      <PlanEditor
        plan={currentPlan}
        onChangePlan={handlePlanChange}
        onSave={handleSave}
        saving={savingPlan}
        selectedTaskId={selectedTaskId}
        onSelectTask={setSelectedTaskId}
      />
      {autoSaving && currentPlan?._id && (
        <p className="mt-2 text-xs" style={{ color: '#6F8BFF' }}>
          Auto-saving changes...
        </p>
      )}
      {error && (
        <p className="mt-3 rounded-md border px-3 py-2 text-xs" style={{
          borderColor: 'rgba(239, 68, 68, 0.4)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#FCA5A5'
        }}>
          {error}
        </p>
      )}
    </>
  );

  return <Layout sidebar={sidebar} main={main} />;
}

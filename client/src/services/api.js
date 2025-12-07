const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  try {
    const res = await fetch(url, {
      headers,
      ...options
    });

    if (!res.ok) {
      const text = await res.text();
      let errMsg = text;
      try {
        const json = JSON.parse(text);
        errMsg = json.error || text;
      } catch {
      }
      throw new Error(errMsg || `Request failed with status ${res.status}`);
    }

    if (res.status === 204) return null;
    return res.json();
  } catch (err) {
    console.error(`API request failed: ${url}`, err);
    if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
      throw new Error(`Cannot connect to backend at ${API_BASE}. Make sure the server is running on port 4000.`);
    }
    throw err;
  }
}

export function generatePlan(goal, horizonDays) {
  return request("/api/plans/generate", {
    method: "POST",
    body: JSON.stringify({ goal, horizonDays })
  });
}

export function createPlan(plan) {
  return request("/api/plans", {
    method: "POST",
    body: JSON.stringify(plan)
  });
}

export function listPlans(page = 1, limit = 10) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  return request(`/api/plans?${params.toString()}`);
}

export function getPlan(id) {
  return request(`/api/plans/${id}`);
}

export function updatePlan(id, plan) {
  return request(`/api/plans/${id}`, {
    method: "PUT",
    body: JSON.stringify(plan)
  });
}

export function deletePlan(id) {
  return request(`/api/plans/${id}`, {
    method: "DELETE"
  });
}

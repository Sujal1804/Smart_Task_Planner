const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
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
}

export function signup(email, password, name) {
  return request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, name })
  });
}

export function login(email, password) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export function getMe() {
  return request("/api/auth/me");
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const loginRequest = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

export const fetchDashboardSummary = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/assets/summary`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to load dashboard");
  }

  return data;
};

export const fetchAssets = async (token, status="all") => {
  const response = await fetch(`${API_BASE_URL}/api/assets?status=${status}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  if (!response.ok) throw new Error("Failed to fetch assets");
  return response.json();
};

export const fetchAsset = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/api/assets/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  if (!response.ok) throw new Error("Failed to fetch asset");
  return response.json();
};

export const requestAsset = async (id, token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/assets/${id}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(data)
  });

  if (!response.ok) throw new Error("Failed to request asset");
  return response.json();
}







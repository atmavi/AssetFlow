import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchDashboardSummary } from "../lib/api";

const defaultSummary = {
  totalAssets: 0,
  assignedAssets: 0,
  availableAssets: 0,
  maintenanceAssets: 0
};

function MetricCard({ title, value }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function DashboardPage() {
  const { token, user, logout } = useAuth();
  const [summary, setSummary] = useState(defaultSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setError("");
        const data = await fetchDashboardSummary(token);
        setSummary(data);
      } catch (requestError) {
        setError(requestError.message || "Failed to load summary.");
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">AssetFlow Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.name || "User"}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        {loading ? (
          <p className="text-gray-600">Loading dashboard...</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Total Assets" value={summary.totalAssets} />
            <MetricCard title="Assigned" value={summary.assignedAssets} />
            <MetricCard title="Available" value={summary.availableAssets} />
            <MetricCard title="Maintenance" value={summary.maintenanceAssets} />
          </div>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;

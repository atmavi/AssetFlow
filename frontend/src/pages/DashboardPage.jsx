import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchDashboardSummary, fetchAssets } from "../lib/api"; // Added fetchAssets

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
  const [assets, setAssets] = useState([]); // New state for asset list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setError("");
        // Fetch both summary and assets list in parallel
        const [summaryData, assetsData] = await Promise.all([
          fetchDashboardSummary(token),
          fetchAssets(token)
        ]);
        
        setSummary(summaryData);
        setAssets(assetsData);
      } catch (requestError) {
        setError(requestError.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    if (token) loadData();
  }, [token]);

  // Helper to color-code status badges
  const getStatusStyle = (status) => {
    switch (status) {
      case "Available": return "bg-green-100 text-green-800";
      case "Assigned": return "bg-blue-100 text-blue-800";
      case "Maintenance": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
          <>
            {/* Metric Cards Section */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <MetricCard title="Total Assets" value={summary.totalAssets} />
              <MetricCard title="Assigned" value={summary.assignedAssets} />
              <MetricCard title="Available" value={summary.availableAssets} />
              <MetricCard title="Maintenance" value={summary.maintenanceAssets} />
            </div>

            {/* Assets Table Section */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Assets</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Asset Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Serial Number</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {assets.map((asset) => (
                      <tr key={asset._id} className="hover:bg-gray-50 transition-colors">
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{asset.name}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{asset.serialNumber}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{asset.category}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusStyle(asset.status)}`}>
                            {asset.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {assets.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-10 text-center text-sm text-gray-500">No assets found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;
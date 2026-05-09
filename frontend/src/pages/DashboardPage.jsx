import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchDashboardSummary } from "../lib/api";
import AssetsTable from "../components/AssetsTable";
import MetricCard from "../components/MetricCard";
import Header from "../components/Header";

const defaultSummary = {
  totalAssets: 0,
  assignedAssets: 0,
  availableAssets: 0,
  maintenanceAssets: 0
};

function DashboardPage() {
  const { token, user, logout } = useAuth();
  const [summary, setSummary] = useState(defaultSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setError("");
        const summaryData = await fetchDashboardSummary(token)

        setSummary(summaryData);
      } catch (requestError) {
        setError(requestError.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    if (token) loadData();
  }, [token]);

  return <>
    <Header />
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto max-w-5xl px-4 py-8">
        {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        {loading ? (
          <p className="text-gray-600">Loading dashboard...</p>
        ) : (
          <>
            {/* Metric Cards Section */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <MetricCard title="Total Assets" value={summary.totalAssets} status="all" />
              <MetricCard title="Assigned" value={summary.assignedAssets} status="assigned" />
              <MetricCard title="Available" value={summary.availableAssets} status="available" />
              <MetricCard title="Maintenance" value={summary.maintenanceAssets} status="maintenance" />
            </div>

            {/* Assets Table Section */}
            <AssetsTable />
          </>
        )}
      </main>
    </div>
  </>
}

export default DashboardPage;
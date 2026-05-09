import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchAssets } from "../lib/api";
import { Link } from "react-router-dom";

function AssetsTable() {
    const { token } = useAuth();
    const [assets, setAssets] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                setError("");

                const assetsData = await fetchAssets(token);

                setAssets(assetsData);
            } catch (requestError) {
                setError(requestError.message || "Failed to load assets data.");
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

    return <>

        {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        {loading ? (
            <p className="text-gray-600">Loading dashboard...</p>
        ) :
            <>
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
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                                            <Link
                                                to={`/assets/${asset._id}`}
                                                className="text-blue-600 hover:text-blue-900 hover:underline"
                                            >
                                                {asset.name}
                                            </Link>
                                        </td>
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
            </>}
    </>
}

export default AssetsTable;
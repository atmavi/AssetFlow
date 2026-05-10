import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from 'react-router-dom';
import { fetchAssets } from "../lib/api";
import { Link } from "react-router-dom";
import StatusPill from "./StatusPill";
import Header from "./Header";

function AssetsTable() {
    const { token } = useAuth();
    const [assets, setAssets] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                setError("");

                const assetsData = await fetchAssets(token, status);

                setAssets(assetsData);
            } catch (requestError) {
                setError(requestError.message || "Failed to load assets data.");
            } finally {
                setLoading(false);
            }
        };

        if (token) loadData();
    }, [token]);

    return <>
        {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        {loading ? (
            <p className="text-gray-600">Loading dashboard...</p>
        ) :
            <>
                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            <div className="flex justify-between items-center w-full">
                                <span>Recent Assets</span>

                                {/* Grouping the link and button together */}
                                <div className="flex items-center gap-4">
                                    <Link to="/assets" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        View All
                                    </Link>

                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors shadow-sm flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Add Asset
                                    </button>
                                </div>
                            </div>
                        </h3>
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
                                            <StatusPill status={asset.status} />
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
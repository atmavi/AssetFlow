// pages/AssetList.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from 'react-router-dom';
import DataTable from '../components/ui/DataTable';
import { fetchAssets } from '../lib/api';
import StatusPill from '../components/StatusPill';
import Header from '../components/Header';

const AssetList = () => {
    const { token } = useAuth();
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [error, setError] = useState("");

    // Get current status from URL or default to 'all'
    const currentStatus = searchParams.get('status') || 'all';

    const statuses = ['all', 'available', 'assigned', 'maintenance'];

    useEffect(() => {
        const loadData = async () => {
            try {
                setError("");

                const assetsData = await fetchAssets(token, searchParams?.status);

                setAssets(assetsData);
            } catch (requestError) {
                setError(requestError.message || "Failed to load assets data.");
            } finally {
                setLoading(false);
            }
        };

        if (token) loadData();

    }, [currentStatus]);

    const handleStatusChange = (status) => {
        setSearchParams({ status });
    };

    return <>
        <Header />
        
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>

                {/* Status Filter Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {statuses.map((status) => (
                        <button
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${currentStatus === status
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {status.replace('_', ' ').toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading assets...</div>
            ) : (
                <DataTable
                    headers={['Asset ID', 'Name', 'Category', 'Status', 'Last Updated']}
                    data={assets}
                    renderRow={(asset) => (
                        <tr key={asset._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4 font-mono text-xs text-blue-600 uppercase">
                                {asset._id.slice(-6)}
                            </td>
                            <td className="px-4 py-4 font-medium text-gray-900">{asset.name}</td>
                            <td className="px-4 py-4 text-gray-600">{asset.category}</td>
                            <td className="px-4 py-4">
                                <StatusPill status={asset.status}/>
                            </td>
                            <td className="px-4 py-4 text-gray-500 text-xs">
                                {new Date(asset.updatedAt).toLocaleDateString()}
                            </td>
                        </tr>
                    )}
                />
            )}
        </div>
    </>
};

export default AssetList;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchAsset } from "../lib/api";
import StatusPill from "../components/StatusPill";
import RequestModal from "../components/RequestModal";

import { requestAsset } from "../lib/api";
import Header from "../components/Header";

function AssetDetailsPage() {
    const navigate = useNavigate();

    const { id } = useParams();
    const { token, user } = useAuth();
    const [asset, setAsset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setError("");
                const assetData = await fetchAsset(token, id);

                setAsset(assetData);
            } catch (requestError) {
                setError(requestError.message || "Failed to load asset data.");
            } finally {
                setLoading(false);
            }
        }

        if (token) loadData()
    }, [id, token]);

    if (!asset) return <div className="p-10">Loading asset details...</div>;
    const currentAssignment = asset.assignmentHistory?.find(h => !h.returnedAt) || asset.assignmentHistory?.[0];

    return <>
        <Header />

        {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        {loading ? (
            <p className="text-gray-600">Loading asset...</p>
        ) : (
            <div className="min-h-screen bg-[#f9f9f9] text-[#2d3238] antialiased">
                <div className="mx-auto max-w-[1280px] px-8 py-6 pb-16">

                    {/* --- Header --- */}
                    <div className="mb-7 flex flex-wrap items-center gap-3 border-b border-[#ececec] pb-5">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#ececec] bg-white text-lg text-[#8a8a8a] hover:bg-gray-50"
                        >
                            ←
                        </button>
                        <div>
                            <div className="mb-0.5 text-[11px] font-medium uppercase tracking-wider text-[#8a8a8a]">
                                AssetFlow / Assets
                            </div>
                            <h1 className="text-[22px] font-semibold tracking-tight text-[#1a1a1a]">
                                {asset.name}
                            </h1>
                        </div>
                        <div className="flex-1" />
                        <div className="flex gap-2 items-center">
                            {/* The "Good" Edit Button */}
                            <button className="h-[34px] rounded-lg border border-[#ececec] bg-transparent px-3.5 text-[13px] font-medium text-[#8a8a8a] hover:bg-gray-50 transition-colors">
                                Edit
                            </button>

                            {asset.status === "available" ? (
                                /* Primary Action: Request Asset (Blue) */
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="h-[34px] rounded-lg border border-[#5a90e0] bg-[#5a90e0] px-3.5 text-[13px] font-medium text-white hover:bg-[#4a80d0] transition-colors"
                                >
                                    Request Asset
                                </button>
                            ) : (
                                /* Secondary Action: Check In (White/Bordered) */
                                <button className="h-[34px] rounded-lg border border-[#ececec] bg-transparent px-3.5 text-[13px] font-medium text-[#8a8a8a] hover:bg-gray-50 transition-colors">
                                    Check In
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                        {/* --- Left Column (Main Info) --- */}
                        <div className="flex flex-col gap-6 lg:col-span-2">

                            {/* Core Info Card */}
                            <div className="overflow-hidden rounded-lg border border-[#ececec] bg-white shadow-sm">
                                <div className="flex items-center justify-between border-b border-[#ececec] px-5 py-4">
                                    <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#8a8a8a]">Core Information</h2>
                                    <StatusPill status={asset.status} />
                                </div>
                                <div className="p-5">
                                    {/* Asset Illustration Mockup */}
                                    <div className="mb-5 flex aspect-video w-full items-center justify-center rounded-md bg-gradient-to-br from-[#ececec] to-[#f5f5f5] text-[#8a8a8a] opacity-40">
                                        <svg className="h-24 w-auto" viewBox="0 0 200 120" fill="none">
                                            <rect x="30" y="15" width="140" height="85" rx="8" stroke="currentColor" strokeWidth="1.5" />
                                            <rect x="60" y="100" width="80" height="6" rx="3" fill="currentColor" />
                                        </svg>
                                    </div>

                                    <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                                        <DetailItem label="Asset Tag" value={asset.serialNumber} />
                                        <DetailItem label="Category" value={asset.category} />
                                        <DetailItem label="Manufacturer" value="Apple Inc." />
                                        <DetailItem label="Model" value={asset.name} />
                                        <DetailItem label="Serial Number" value={asset.serialNumber} mono />
                                    </div>
                                </div>
                            </div>

                            {/* Specifications Card */}
                            <div className="overflow-hidden rounded-lg border border-[#ececec] bg-white shadow-sm">
                                <div className="border-b border-[#ececec] px-5 py-4">
                                    <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#8a8a8a]">Specifications</h2>
                                </div>
                                <div className="p-5">
                                    <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                                        <div className="sm:col-span-2 text-sm text-[#4a4a4a] leading-relaxed">
                                            {asset.specifications || "No specific technical data available."}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- Right Column (Assignments) --- */}
                        <div className="flex flex-col gap-6">

                            {/* Current Assignment */}
                            <div className="overflow-hidden rounded-lg border border-[#ececec] bg-white shadow-sm">
                                <div className="border-b border-[#ececec] px-5 py-4">
                                    <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#8a8a8a]">Current Assignment</h2>
                                </div>
                                <div className="p-5">
                                    {currentAssignment ? (
                                        <>
                                            <div className="mb-4 flex items-center gap-3 border-b border-[#ececec] pb-4">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5a90e0] font-semibold text-white">
                                                    {currentAssignment.assigneeName.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-[15px] font-semibold text-[#1a1a1a]">{currentAssignment.assigneeName}</div>
                                                    <div className="text-[12px] text-[#8a8a8a]">User</div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2.5">
                                                <StackItem label="Checkout Date" value={new Date(currentAssignment.assignedAt).toLocaleDateString()} />
                                                <StackItem label="Status" value="Active" />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-sm text-[#8a8a8a] text-center py-4 italic">Unassigned</div>
                                    )}
                                </div>
                            </div>

                            {/* History List */}
                            <div className="overflow-hidden rounded-lg border border-[#ececec] bg-white shadow-sm">
                                <div className="flex items-center justify-between border-b border-[#ececec] px-5 py-4">
                                    <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[#8a8a8a]">History</h2>
                                    <span className="text-[12px] text-[#8a8a8a]">{asset.assignmentHistory?.length || 0} entries</span>
                                </div>
                                <div className="p-5 pt-0">
                                    {asset.assignmentHistory?.map((item, index) => (
                                        <div key={index} className="flex gap-3 border-b border-[#ececec] py-3 last:border-0">
                                            <div className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${!item.returnedAt ? 'bg-[#5a90e0]' : 'bg-[#ececec]'}`} />
                                            <div>
                                                <div className="text-[13px] font-medium text-[#1a1a1a]">{item.assigneeName}</div>
                                                <div className="text-[11px] text-[#8a8a8a]">
                                                    {new Date(item.assignedAt).toLocaleDateString()} — {item.returnedAt ? new Date(item.returnedAt).toLocaleDateString() : 'Present'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )}

        <RequestModal
            asset={asset}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={(reason)=> requestAsset(id, token, {
                reason,
                userName: user.name,
                userId: user.id
            })}
        // onSubmit={handleRequestSubmit}
        />
    </>;
}

function DetailItem({ label, value, mono = false }) {
    return (
        <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-[#8a8a8a]">{label}</div>
            <div className={`text-[14px] font-medium ${mono ? 'font-mono text-[13px]' : ''}`}>{value}</div>
        </div>
    );
}

function StackItem({ label, value }) {
    return (
        <div className="flex justify-between items-baseline gap-2 text-[13px]">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#8a8a8a]">{label}</span>
            <span className="font-medium text-[#1a1a1a]">{value}</span>
        </div>
    );
}

export default AssetDetailsPage;


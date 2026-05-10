// components/AddAssetModal.jsx
import React, { useState } from 'react';
import { addAsset } from '../lib/api';
import { useAuth } from "../context/AuthContext";

const FORM_EMPTY_STATE = {
    name: '',
    serialNumber: '',
    category: '',
    status: 'available',
    specifications: '',
}

const AddAssetModal = ({ isOpen, onClose, onAssetAdded }) => {
    const { token } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState(FORM_EMPTY_STATE);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await addAsset(token, formData);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            onClose();
            setIsSubmitting(false);
            setFormData({...FORM_EMPTY_STATE})
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg border border-[#ececec] bg-white p-6 shadow-xl">
                <div className="mb-6">
                    <div className="text-[11px] font-medium uppercase tracking-wider text-[#8a8a8a]">Inventory Management</div>
                    <h2 className="text-lg font-semibold text-[#1a1a1a]">Register New Asset</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Asset Name - String */}
                    <div>
                        <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-[#8a8a8a]">Asset Name</label>
                        <input
                            required
                            className="w-full rounded-md border border-[#ececec] p-3 text-sm outline-none focus:border-[#5a90e0]"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. MacBook Pro 14"
                        />
                    </div>

                    {/* Serial Number - Unique String */}
                    <div>
                        <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-[#8a8a8a]">Serial Number</label>
                        <input
                            required
                            className="w-full rounded-md border border-[#ececec] p-3 text-sm outline-none focus:border-[#5a90e0]"
                            value={formData.serialNumber}
                            onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                            placeholder="MBP14-2026-XXX"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Category - String */}
                        <div>
                            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-[#8a8a8a]">Category</label>
                            <select
                                className="w-full h-[46px] rounded-md border border-[#ececec] bg-white px-3 text-sm outline-none focus:border-[#5a90e0] appearance-none"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Laptop">Laptop</option>
                                <option value="Monitor">Monitor</option>
                                <option value="Phone">Phone</option>
                                <option value="Peripherals">Peripherals</option>
                            </select>
                        </div>
                        {/* Status - ENUM Match */}
                        <div>
                            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-[#8a8a8a]">Status</label>
                            <select
                                className="w-full h-[46px] rounded-md border border-[#ececec] bg-white px-3 text-sm outline-none focus:border-[#5a90e0] appearance-none"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="available">Available</option>
                                <option value="assigned">Assigned</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>
                    </div>

                    {/* Specifications - String */}
                    <div>
                        <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-[#8a8a8a]">Specifications</label>
                        <textarea
                            className="w-full rounded-md border border-[#ececec] p-3 text-sm outline-none focus:border-[#5a90e0]"
                            rows="2"
                            placeholder="e.g. Apple M3 Pro, 18GB RAM..."
                            value={formData.specifications}
                            onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                        />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="h-9 px-4 text-[13px] font-medium text-[#8a8a8a] hover:text-[#1a1a1a]">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-9 rounded-lg bg-[#5a90e0] px-6 text-[13px] font-medium text-white hover:bg-[#4a80d0] disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? "Creating..." : "Create Asset"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAssetModal;
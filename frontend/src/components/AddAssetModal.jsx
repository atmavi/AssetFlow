// components/AddAssetModal.jsx
import React, { useState } from 'react';
import { addAsset } from '../lib/api';

const AddAssetModal = ({ isOpen, onClose, onAssetAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    category: '',
    status: 'available',
    specifications: '',
    assigneeName: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addAsset(formData);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Add New Asset</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Name</label>
            <input required type="text" className="mt-1 w-full p-2 border rounded-md"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Serial Number</label>
              <input required type="text" className="mt-1 w-full p-2 border rounded-md"
                value={formData.serialNumber} onChange={(e) => setFormData({...formData, serialNumber: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select className="mt-1 w-full p-2 border rounded-md"
                value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option>Laptop</option>
                <option>Monitor</option>
                <option>Phone</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select className="mt-1 w-full p-2 border rounded-md"
              value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          {formData.status === 'assigned' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Assignee Name</label>
              <input required type="text" className="mt-1 w-full p-2 border rounded-md"
                value={formData.assigneeName} onChange={(e) => setFormData({...formData, assigneeName: e.target.value})} />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Asset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetModal;
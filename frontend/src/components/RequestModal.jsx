import React, { useState } from "react";

function RequestModal({ asset, isOpen, onClose, onSubmit }) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await onSubmit(reason);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-[#ececec] bg-white p-6 shadow-xl">
        <div className="mb-4">
          <div className="text-[11px] font-medium uppercase tracking-wider text-[#8a8a8a]">Request Asset</div>
          <h2 className="text-lg font-semibold text-[#1a1a1a]">{asset.name}</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-[#8a8a8a]">
              Reason for Request
            </label>
            <textarea
              className="w-full rounded-md border border-[#ececec] p-3 text-sm outline-none focus:border-[#5a90e0]"
              rows="3"
              placeholder="e.g. Current laptop screen is flickering..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="h-9 px-4 text-[13px] font-medium text-[#8a8a8a] hover:text-[#1a1a1a]"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting || !reason}
            className="h-9 rounded-lg bg-[#5a90e0] px-4 text-[13px] font-medium text-white hover:bg-[#4a80d0] disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Confirm Request"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RequestModal;
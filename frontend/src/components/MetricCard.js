import React from "react";


function MetricCard({ title, value }) {
    return (
        <div className="rounded-lg bg-white p-5 shadow">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );
}

export default MetricCard;
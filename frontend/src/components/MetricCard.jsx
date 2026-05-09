import React from "react";
import { Link } from "react-router-dom";

function MetricCard({ title = "", value = 0, status="all" }) {
    return (
        <div className="rounded-lg bg-white p-5 shadow">
            <Link to={`/assets?status=${status}`}>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
            </Link>
        </div>
    );
}

export default MetricCard;
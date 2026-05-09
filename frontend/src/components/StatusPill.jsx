const getStatusStyle = (status) => {
    switch (status) {
        case "available": return "bg-green-100 text-green-800";
        case "assigned": return "bg-blue-100 text-blue-800";
        case "maintenance": return "bg-yellow-100 text-yellow-800";
        default: return "bg-gray-100 text-gray-800";
    }
};

function StatusPill({status= "Available"}) {
    const statusStyle= getStatusStyle(status);

    return <>
        <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-medium ${statusStyle}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status}
        </span>
    </>
}

export default StatusPill;
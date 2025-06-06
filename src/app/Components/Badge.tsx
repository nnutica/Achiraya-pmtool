interface BadgeProps {
    type: "priority" | "status";
    value: string;
}

const badgeStyleMap: Record<BadgeProps["type"], Record<string, string>> = {
    priority: {
        Urgent: "bg-red-100 text-red-800",
        High: "bg-orange-100 text-orange-800",
        Medium: "bg-yellow-100 text-yellow-800",
        Low: "bg-green-100 text-green-800",
    },
    status: {
        Unread: "bg-gray-200 text-gray-800",
        "in-progress": "bg-blue-100 text-blue-800",
        "Wait Approve": "bg-purple-100 text-purple-800",
        done: "bg-green-200 text-green-900",
    },
};

export default function Badge({ type, value }: BadgeProps) {
    const baseStyle = "px-2 py-0.5 rounded text-sm font-medium";
    const customStyle = badgeStyleMap[type]?.[value] || "bg-gray-100 text-gray-800";

    return <span className={`${baseStyle} ${customStyle}`}>{value}</span>;
}

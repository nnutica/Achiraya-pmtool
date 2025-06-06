import { Task } from "@/types/task";
import Badge from "./Badge";

interface TaskCardProps {
    task: Task;
    onClick: (task: Task) => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
    // กำหนดสไตล์ตามสถานะของงาน
    let cardStyle = "rounded-xl p-4 shadow hover:shadow-md transition cursor-pointer";

    // เพิ่มสไตล์ตามสถานะ
    if (task.status === "rejected") {
        cardStyle += " bg-red-200 border border-red-400"; // สีแดงเข้ม
    } else if (task.status === "cancelled") {
        cardStyle += " bg-red-100 border border-red-300"; // สีแดงอ่อน
    } else if (task.status === "Unread") {
        cardStyle += " bg-white border";
    } else {
        cardStyle += " bg-gray-50 opacity-75 border";
    }

    return (
        <div
            className={cardStyle}
            onClick={() => onClick(task)}
        >
            <h2 className={`text-lg font-semibold ${task.status === "rejected" || task.status === "cancelled"
                    ? "text-red-800"
                    : task.status !== "Unread" ? "text-gray-600" : ""
                }`}>
                {task.title}
                {(task.status === "rejected" || task.status === "cancelled") &&
                    <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                        Click to delete
                    </span>
                }
            </h2>
            <p className={`text-sm ${task.status === "rejected" || task.status === "cancelled"
                    ? "text-red-700"
                    : task.status !== "Unread" ? "text-gray-500" : "text-gray-600"
                }`}>
                {task.description}
            </p>
            <div className="mt-2 text-sm flex gap-2">
                <Badge type="status" value={task.status} />
                <Badge type="priority" value={task.priority} />

                <span className="ml-auto text-gray-500">
                    💬 {task.comments?.length ?? 0}
                </span>
            </div>
        </div>
    );
}

// ฟังก์ชันช่วยในการแปลง priority เป็น variant ของ Badge
function getPriorityVariant(
    priority: string
): "red" | "orange" | "yellow" | "green" | "gray" {
    switch (priority) {
        case "Urgent":
            return "red";
        case "High":
            return "orange";
        case "Medium":
            return "yellow";
        case "Low":
            return "green";
        default:
            return "gray";
    }
}
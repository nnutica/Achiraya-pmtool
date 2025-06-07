import { Task } from "@/types/task";
import Badge from "./Badge";

// ✅ ใส่ object map ไว้ที่นี่เลย
const taskStatusColorMap: Record<string, string> = {
    "Unread": "bg-white",
    "in-progress": "bg-yellow-100",
    "Wait Approve": "bg-gray-100 opacity-70",
    done: "bg-green-100",
    rejected: "bg-red-100",
};

interface TaskCardProps {
    task: Task;
    onClick: (task: Task) => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
    const bgColor = taskStatusColorMap[task.status] || "bg-gray-100"; // fallback ถ้า status ผิด

    return (
        <div
            className={`rounded-xl p-4 shadow hover:shadow-md transition cursor-pointer ${bgColor}`}
            onClick={() => onClick(task)}
        >
            <h2 className="text-lg font-semibold">{task.title}</h2>
            <p className="text-sm text-gray-500">{task.description}</p>

            <div className="mt-2 text-sm flex gap-2">
                <Badge type="status" value={task.status} />
                <Badge type="priority" value={task.priority} />
            </div>
        </div>
    );
}

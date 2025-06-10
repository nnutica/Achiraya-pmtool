import { Task } from "@/types/task";
import Badge from "./Badge";
import { updateTaskStatus } from "@/libs/taskservice";

// ✅ ใส่ object map ไว้ที่นี่เลย
const taskStatusColorMap: Record<string, string> = {
    "Unread": "bg-white",
    "In-progress": "bg-yellow-100",
    "Wait Approve": "bg-gray-100 opacity-70",
    done: "bg-green-100",
    rejected: "bg-red-100",
};

interface TaskCardProps {
    task: Task;
    onClick: (task: Task) => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
    const bgColor = taskStatusColorMap[task.status] || "bg-gray-100";

    return (
        <div
            className={`rounded-xl p-4 shadow hover:shadow-md transition cursor-pointer ${bgColor}`}
            onClick={() => {
                if (task.status === "Unread") {
                    updateTaskStatus(task.id, "in-progress"); // เปลี่ยนสถานะเป็น In-Progress
                }
                onClick(task); // เรียกฟังก์ชันที่ส่งมาจาก Props
            }}
        >
            <h2 className="text-lg font-semibold text-black">{task.title}</h2>
            <div className="text-sm text-gray-500">
                {task.description.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>
            <div className="mt-2 text-sm flex gap-2 mt-4">
                <Badge type="status" value={task.status} />
                <Badge type="priority" value={task.priority} />
                <p className="text-gray-400"> DueDate : <span className="text-red-500">{task.dueDate}</span></p>
            </div>
        </div>
    );
}

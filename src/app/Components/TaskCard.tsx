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
            className={`relative flex flex-col rounded-xl p-4 shadow hover:shadow-md transition cursor-pointer ${bgColor}`}
            onClick={() => {
                if (task.status === "Unread") {
                    updateTaskStatus(task.id, "in-progress"); // เปลี่ยนสถานะเป็น In-Progress
                }
                onClick(task); // เรียกฟังก์ชันที่ส่งมาจาก Props
            }}
        >
            {/* Head */}
            <div className="mb-2">
                <h2 className="text-lg font-semibold text-black">{task.title}</h2>
            </div>

            {/* Body */}
            <div className="flex-1 text-sm text-gray-500 overflow-hidden mb-4">
                {task.description.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-auto flex items-center gap-2 text-sm text-gray-500">
                <Badge type="status" value={task.status} />
                <Badge type="priority" value={task.priority} />
                <p className="text-gray-400">
                    DueDate:{" "}
                    <span className={task.dueDate ? "text-red-500" : "text-green-500"}>
                        {task.dueDate ? task.dueDate : "Long Term Support (LTS)"}
                    </span>
                </p>
            </div>
        </div>
    );
}

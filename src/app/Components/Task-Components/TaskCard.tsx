import { Task } from "@/types/task";
import Badge from "./Badge";
import { updateTaskStatus } from "@/libs/taskservice";

// ✅ ปรับ color map ใหม่
const taskStatusColorMap: Record<string, string> = {
    "Unread": "bg-white",
    "In-progress": "bg-yellow-100",
    "Wait Approve": "bg-gray-100 opacity-70",
    "done": "bg-green-100", // เปลี่ยนจาก bg-green-100 เป็นสีครีม
    "rejected": "bg-red-100",
};

interface TaskCardProps {
    task: Task;
    onClick: () => void;
    onDragStart?: (task: Task) => void;
}

export default function TaskCard({ task, onClick, onDragStart }: TaskCardProps) {
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData("taskId", task.id);
        e.dataTransfer.setData("taskData", JSON.stringify(task));
        onDragStart?.(task);
    };

    const getPriorityBorder = (priority: string) => {
        switch (priority) {
            case "Urgent": return "border-l-red-500";
            case "High": return "border-l-orange-400";
            case "Medium": return "border-l-yellow-400";
            case "Low": return "border-l-green-400";
            default: return "border-l-gray-400";
        }
    };

    const bgColor = taskStatusColorMap[task.status] || "bg-gray-100";

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onClick={onClick}
            className={`relative flex flex-col rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-gray-200 hover:border-gray-300 border-l-4 ${getPriorityBorder(task.priority)} ${bgColor}`}
        >
            {/* Header - Title */}
            <div className="mb-2">
                <h2 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">{task.title}</h2>
            </div>

            {/* Body - Description */}
            <div className="flex-1 text-xs text-gray-600 mb-3 line-clamp-3">
                {task.description.split("\n").map((line, index) => (
                    <p key={index} className="leading-relaxed">{line}</p>
                ))}
            </div>

            {/* Assigned To */}
            <div className="mb-3">
                <p className="text-xs text-gray-500">
                    Assigned:{" "}
                    <span className="font-medium text-blue-600">
                        {task.AssignedTo === "All"
                            ? "Everyone"
                            : (typeof task.AssignedTo === 'object' ? task.AssignedTo.name : "Everyone")
                        }
                    </span>
                </p>
            </div>

            {/* Footer - Badges แนวตั้ง */}
            <div className="space-y-2">
                {/* Status และ Priority Badges - แนวตั้ง */}
                <div className="flex items-center gap-4 justify-center">
                    <Badge type="status" value={task.status} />
                    <Badge type="priority" value={task.priority} />
                </div>

                {/* Due Date - แยกออกมาต่างหาก */}
                <div className="pt-1 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Due:{" "}
                        <span className={task.dueDate ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                            {task.dueDate ? task.dueDate : "LTS"}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

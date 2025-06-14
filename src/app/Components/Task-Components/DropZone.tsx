import { useState } from "react";

interface DropZoneProps {
    priority: "Urgent" | "High" | "Medium" | "Low";
    onDrop: (taskId: string, newPriority: string) => void;
    children: React.ReactNode;
}

export default function DropZone({ priority, onDrop, children }: DropZoneProps) {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const taskId = e.dataTransfer.getData("taskId");
        const taskData = JSON.parse(e.dataTransfer.getData("taskData"));

        // ถ้า Priority เหมือนเดิม ไม่ต้องทำอะไร
        if (taskData.priority === priority) return;

        onDrop(taskId, priority);
    };

    const priorityColor: Record<string, string> = {
        Urgent: "border-red-500 bg-red-50",
        High: "border-orange-400 bg-orange-50",
        Medium: "border-yellow-400 bg-yellow-50",
        Low: "border-green-400 bg-green-50"
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`transition-all duration-200 rounded-lg p-4 ${isDragOver
                    ? `${priorityColor[priority]} border-2 border-dashed scale-105`
                    : "border-2 border-transparent"
                }`}
        >
            {children}
        </div>
    );
}
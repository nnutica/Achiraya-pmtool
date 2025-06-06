import { Task } from "@/types/task";
import Badge from "./Badge";

interface TaskCardProps {
    task: Task;
    onClick: (task: Task) => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
    return (
        <div className="rounded-xl p-4 bg-white shadow hover:shadow-md transition cursor-pointer" onClick={() => onClick(task)}>
            <h2 className="text-lg font-semibold">{task.title}</h2>
            <p className="text-sm text-gray-500">{task.description}</p>

            <div className="mt-2 text-sm flex gap-2">
                <Badge type="status" value={task.status} />
                <Badge type="priority" value={task.priority} />
            </div>
        </div>
    );
}
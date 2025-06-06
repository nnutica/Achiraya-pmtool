// components/AddTaskSidebar.tsx
"use client";
import { useState } from "react";
import { addTask } from "@/libs/taskservice";
import { TaskPriority, Taskstatus } from "@/types/task";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddTaskSidebar({ isOpen, onClose }: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<TaskPriority>("Medium");
    const [status, setStatus] = useState<Taskstatus>("Unread");
    const [dueDate, setDueDate] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description) return;

        await addTask({
            title,
            description,
            status,
            priority,
            dueDate: dueDate ? new Date(dueDate) : null,
            comments: []
        });


        onClose(); // ปิด sidebar
        setTitle("");
        setDescription("");
        setDueDate("null");
    };

    return (
        <div
            className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-lg transform transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "translate-x-full"
                }`}
        >
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold">➕ Add Task</h2>
                <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-2xl font-bold">
                    ×
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Title"
                    className="border rounded px-3 py-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description"
                    className="border rounded px-3 py-2"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <select
                    className="border rounded px-3 py-2"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                </select>
                <select
                    className="border rounded px-3 py-2"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Taskstatus)}
                >
                    <option value="Unread">Unread</option>
                    <option value="in-progress">In Progress</option>
                    <option value="Wait Approve">Wait Approve</option>
                    <option value="done">Done</option>
                </select>
                <input
                    type="date"
                    className="border rounded px-3 py-2"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    Create Task
                </button>
            </form>
        </div>
    );
}

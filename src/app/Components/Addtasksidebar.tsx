// components/AddTaskSidebar.tsx
"use client";
import { useState } from "react";
import { addTask } from "@/libs/taskservice";
import { TaskPriority, Taskstatus } from "@/types/task";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    projectId: string; // เพิ่ม projectId เพื่อเชื่อม Task กับ Project
}

export default function AddTaskSidebar({ isOpen, onClose, projectId }: Props) {
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
            dueDate: dueDate || null,
            comments: [],
            projectId, // เชื่อม Task กับ Project
        });

        onClose(); // ปิด sidebar
        setTitle("");
        setDescription("");
        setDueDate("");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 flex justify-end">
            {/* Background overlay with fade-in */}
            <div
                className="fixed inset-0 transition-opacity duration-300 ease-in-out"
                style={{ opacity: isOpen ? 1 : 0 }}
                onClick={onClose}
            ></div>

            {/* Sidebar with slide-in */}
            <div
                className="w-full sm:w-[400px] bg-white shadow-lg rounded-l-3xl flex flex-col h-[calc(100%-4rem)] mt-16 relative transition-transform duration-300 ease-in-out"
                style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
            >
                {/* Header - fixed at top */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold">➕ Add Task</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-red-500 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                {/* เนื้อหายังคงเหมือนเดิม */}
                <div className="flex-1 overflow-y-auto p-4">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
                            <input
                                id="title"
                                type="text"
                                placeholder="Enter task title"
                                className="w-full border rounded-lg px-3 py-2"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                id="description"
                                placeholder="Enter task description"
                                className="w-full border rounded-lg px-3 py-2 min-h-[100px]"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="priority" className="text-sm font-medium text-gray-700">Priority</label>
                            <select
                                id="priority"
                                className="w-full border rounded-lg px-3 py-2"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="status" className="text-sm font-medium text-gray-700">Status</label>
                            <select
                                id="status"
                                className="w-full border rounded-lg px-3 py-2"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as Taskstatus)}
                            >
                                <option value="Unread">Unread</option>
                                <option value="in-progress">In Progress</option>
                                <option value="Wait Approve">Wait Approve</option>
                                <option value="done">Done</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="dueDate" className="text-sm font-medium text-gray-700">Due Date</label>
                            <input
                                id="dueDate"
                                type="date"
                                className="w-full border rounded-lg px-3 py-2"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Create Task
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

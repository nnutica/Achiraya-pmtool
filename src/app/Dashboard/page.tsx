"use client";
import { useState, useEffect } from "react";
import { Task } from "@/types/task";
import { fetchTasks } from "@/libs/taskservice";
import AddTaskSidebar from "../Components/Addtasksidebar";

export default function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showSidebar, setShowSidebar] = useState(false);

    const loadTasks = async () => {
        const data = await fetchTasks();
        setTasks(data);
    };

    useEffect(() => {
        loadTasks();
    }, []);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-white">📋 Achiraya Dashboard</h1>
                <button
                    onClick={() => setShowSidebar(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    + Add Task
                </button>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="border rounded-xl p-4 bg-white shadow hover:shadow-md transition"
                    >
                        <h2 className="text-lg font-semibold">{task.title}</h2>
                        <p className="text-gray-600 text-sm">{task.description}</p>
                        <div className="mt-2 text-sm flex gap-2">
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                                {task.status}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-800">
                                Priority: {task.priority}
                            </span>
                            <span className="ml-auto text-gray-500">
                                💬 {task.comments?.length ?? 0}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ✅ Add Task Sidebar */}
            <AddTaskSidebar
                isOpen={showSidebar}
                onClose={() => {
                    setShowSidebar(false);
                    loadTasks(); // โหลด tasks ใหม่หลังปิด modal
                }}
            />
        </div>
    );
}
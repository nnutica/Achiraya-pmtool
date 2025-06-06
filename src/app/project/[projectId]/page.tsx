"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchTasksByProjectId, deleteTask } from "@/libs/taskservice";
import { Task } from "@/types/task";
import TaskCard from "@/app/Components/TaskCard";
import AddTaskSidebar from "@/app/Components/Addtasksidebar";
import TaskDetailSidebar from "@/app/Components/TaskDetailSidebar";
import DeleteModal from "@/app/Components/DeleteModal"; // Import DeleteModal

export default function ProjectDetail({ params }: { params: Promise<{ projectId: string }> }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showAddSidebar, setShowAddSidebar] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [projectId, setProjectId] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State สำหรับ DeleteModal
    const router = useRouter();

    // Unwrap params
    useEffect(() => {
        const unwrapParams = async () => {
            const resolvedParams = await params;
            setProjectId(resolvedParams.projectId); // ตั้งค่า projectId
        };
        unwrapParams();
    }, [params]);

    // ดึง Task เฉพาะใน Project
    useEffect(() => {
        if (projectId) {
            const loadTasks = async () => {
                const data = await fetchTasksByProjectId(projectId);
                console.log("Tasks fetched:", data); // ตรวจสอบข้อมูล Task ที่ดึงมา
                setTasks(data);
            };
            loadTasks();
        }
    }, [projectId]);

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
    };

    const handleTaskUpdate = async () => {
        if (projectId) {
            const updatedTasks = await fetchTasksByProjectId(projectId);
            setTasks(updatedTasks); // อัปเดต State tasks
        }
    };

    const handleDeleteTask = async () => {
        if (!selectedTask) return;

        try {
            await deleteTask(selectedTask.id); // ลบ Task
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== selectedTask.id)); // อัปเดต State
            setShowDeleteModal(false); // ปิด Modal
            setSelectedTask(null); // ปิด Sidebar
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Failed to delete task. Please try again.");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Tasks in Project</h1>
            <button
                onClick={() => setShowAddSidebar(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mb-6"
            >
                Add Task
            </button>

            {/* Render tasks grouped by priority */}
            {["Urgent", "High", "Medium", "Low"].map((priority) => {
                const filteredTasks = tasks.filter((task) => task.priority === priority);
                if (filteredTasks.length === 0) return null;

                return (
                    <div key={priority} className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">{priority} Priority</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onClick={() => {
                                        if (task.status === "rejected" || task.status === "cancelled") {
                                            setSelectedTask(task); // ตั้งค่า Task ที่เลือก
                                            setShowDeleteModal(true); // เปิด DeleteModal
                                        } else {
                                            setSelectedTask(task); // เปิด TaskDetailSidebar ตามปกติ
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}

            <AddTaskSidebar
                isOpen={showAddSidebar}
                onClose={() => setShowAddSidebar(false)}
                projectId={projectId || ""}
            />
            {selectedTask && (
                <TaskDetailSidebar
                    isOpen={!!selectedTask}
                    onClose={() => setSelectedTask(null)}
                    task={selectedTask}
                    onTaskUpdate={handleTaskUpdate}
                />
            )}

            {/* Delete Modal */}
            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false); // ปิด Modal
                    setSelectedTask(null); // เปิด TaskDetailSidebar ตามปกติ
                }}
                onConfirm={async () => {
                    await handleDeleteTask(); // ลบ Task
                }}
                taskTitle={selectedTask?.title || ""}
                taskStatus={selectedTask?.status || ""}
                setShowDetailSidebar={(show) => {
                    if (show) setSelectedTask(selectedTask); // เปิด TaskDetailSidebar
                }}
            />
        </div>
    );
}
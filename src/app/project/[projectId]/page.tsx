"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchProjectById } from "@/libs/projectService";
import { Project } from "@/types/project";
import { Task } from "@/types/task";
import TaskCard from "@/app/Components/TaskCard";
import AddTaskSidebar from "@/app/Components/Addtasksidebar";
import TaskDetailSidebar from "@/app/Components/TaskDetailSidebar";
import DeleteModal from "@/app/Components/DeleteModal";

import { fetchTasksByProjectId, updateTaskStatus, deleteTask } from "@/libs/taskservice";
import { Button } from "@headlessui/react";

export default function ProjectDetail({ params }: { params: Promise<{ projectId: string }> }) {
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showAddSidebar, setShowAddSidebar] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTaskTitle, setDeleteTaskTitle] = useState<string | null>(null);
    const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadProjectAndTasks = async () => {
            const resolvedParams = await params;
            const projectData = await fetchProjectById(resolvedParams.projectId);
            setProject(projectData);

            if (projectData?.id) {
                const taskData = await fetchTasksByProjectId(projectData.id);
                setTasks(taskData);
            }
        };
        loadProjectAndTasks();
    }, [params]);

    const handleTaskUpdate = async () => {
        if (project?.id) {
            const updatedTasks = await fetchTasksByProjectId(project.id);
            setTasks(updatedTasks);
        }
    };

    const handleTaskDelete = async (task: Task) => {
        if (task.status !== "rejected") {
            setSelectedTask(task); // เปิด TaskDetailSidebar
            setShowDeleteModal(false); // ปิด DeleteModal
            return;
        }

        const confirmDelete = window.confirm(
            `Are you sure you want to delete the task "${task.title}"? This action cannot be undone.`
        );

        if (confirmDelete) {
            try {
                await deleteTask(task.id); // ลบ Task จากฐานข้อมูล
                setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id)); // อัปเดต tasks ใน state
                setSelectedTask(null); // ล้างค่า selectedTask
                setShowDeleteModal(false); // ปิด DeleteModal
                alert(`Task "${task.title}" has been deleted.`);
            } catch (error) {
                console.error("Error deleting task:", error);
                alert("Failed to delete task. Please try again.");
            }
        } else {
            setSelectedTask(task); // เปิด TaskDetailSidebar
            setShowDeleteModal(false); // ปิด DeleteModal
        }
    };

    return (
        <div className="min-h-screen bg-sky-950 text-white px-10 py-10">
            {/* หัวโปรเจกต์ + ปุ่มเพิ่ม Task */}
            <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                <Link href="/Dashboard"><Button className="text-blue-400 hover:text-blue-300 transition">
                    ← Back to Dashboard
                </Button></Link>
                <h1 className="text-3xl font-extrabold tracking-tight">
                    {project?.name || "Project Name"}
                </h1>
                <button
                    onClick={() => setShowAddSidebar(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-xl shadow-md transition"
                >
                    + Add Task
                </button>
            </div>

            {/* Render tasks grouped by priority */}
            {(["Urgent", "High", "Medium", "Low"] as const).map((priority) => {
                const filteredTasks = tasks.filter((task) => task.priority === priority);
                if (filteredTasks.length === 0) return null;

                const priorityColor: Record<"Urgent" | "High" | "Medium" | "Low", string> = {
                    Urgent: "border-red-500",
                    High: "border-orange-400",
                    Medium: "border-yellow-400",
                    Low: "border-green-400"
                };

                return (
                    <div key={priority} className="mb-10">
                        <h2 className={`text-2xl font-semibold mb-4 pl-3 border-l-4 ${priorityColor[priority]}`}>
                            {priority} Priority
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onClick={async () => {
                                        if (task.status === "Unread") {
                                            try {
                                                await updateTaskStatus(task.id, "In-progress");
                                                setTasks((prevTasks) =>
                                                    prevTasks.map((t) =>
                                                        t.id === task.id ? { ...t, status: "In-progress" } : t
                                                    )
                                                );
                                            } catch (error) {
                                                console.error("Error updating task status:", error);
                                                alert("Failed to update task status. Please try again.");
                                            }
                                        }

                                        if (task.status === "rejected") {
                                            setDeleteTaskTitle(task.title);
                                            setDeleteTaskId(task.id);
                                            setShowDeleteModal(true); // เปิด DeleteModal
                                        } else {
                                            setSelectedTask(task); // เปิด TaskDetailSidebar
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
                projectId={project?.id || ""}
                projectName={project?.name || "Project Name"}
                onTaskAdded={handleTaskUpdate}
                members={project?.members || []} // ส่ง members เข้ามา
            />

            {selectedTask && project && (
                <TaskDetailSidebar
                    isOpen={!!selectedTask}
                    onClose={() => setSelectedTask(null)}
                    task={selectedTask}
                    project={project} // ส่ง project เข้ามา
                    onTaskUpdate={handleTaskUpdate}
                />
            )}

            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false); // ปิด DeleteModal
                    if (deleteTaskId) {
                        const taskToReopen = tasks.find((task) => task.id === deleteTaskId);
                        setSelectedTask(taskToReopen || null); // เปิด TaskDetailSidebar
                    }
                }}
                onConfirm={async () => {
                    if (deleteTaskId) {
                        try {
                            await deleteTask(deleteTaskId); // ลบ Task จากฐานข้อมูล
                            setTasks((prevTasks) => prevTasks.filter((t) => t.id !== deleteTaskId)); // อัปเดต tasks ใน state
                            setSelectedTask(null); // ล้างค่า selectedTask
                            setShowDeleteModal(false); // ปิด Modal
                            alert(`Task "${deleteTaskTitle}" has been deleted.`);
                        } catch (error) {
                            console.error("Error deleting task:", error);
                            alert("Failed to delete task. Please try again.");
                        }
                    }
                }}
                taskTitle={deleteTaskTitle || "Unknown Task"}
            />
        </div>
    );
}

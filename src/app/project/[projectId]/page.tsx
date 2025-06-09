"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchProjectById } from "@/libs/projectService";
import { Project } from "@/types/project";
import { Task } from "@/types/task";
import TaskCard from "@/app/Components/TaskCard";
import AddTaskSidebar from "@/app/Components/Addtasksidebar";
import TaskDetailSidebar from "@/app/Components/TaskDetailSidebar";

import { deleteTask, fetchTasksByProjectId, updateTaskStatus } from "@/libs/taskservice";

export default function ProjectDetail({ params }: { params: Promise<{ projectId: string }> }) {
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showAddSidebar, setShowAddSidebar] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
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





    return (
        <div className="min-h-screen bg-sky-950 text-white px-10 py-10">
            {/* หัวโปรเจกต์ + ปุ่มเพิ่ม Task */}
            <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
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
                                            setSelectedTask(task); // ตั้งค่า selectedTask
                                            setShowDeleteModal(true); // แสดง DeleteModal
                                        } else {
                                            setSelectedTask(task); // ตั้งค่า selectedTask สำหรับ TaskDetailSidebar
                                            setShowDeleteModal(false); // ปิด DeleteModal หากไม่ใช่ rejected
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
                onTaskAdded={handleTaskUpdate}
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




        </div>
    );
}

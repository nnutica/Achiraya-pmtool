"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchProjectById } from "@/libs/projectService"; // ฟังก์ชันสำหรับดึงข้อมูลโปรเจค
import { Project } from "@/types/project";
import { Task } from "@/types/task";
import TaskCard from "@/app/Components/TaskCard";
import AddTaskSidebar from "@/app/Components/Addtasksidebar";
import TaskDetailSidebar from "@/app/Components/TaskDetailSidebar";
import DeleteModal from "@/app/Components/DeleteModal";
import { deleteTask, fetchTasksByProjectId } from "@/libs/taskservice";

export default function ProjectDetail({ params }: { params: Promise<{ projectId: string }> }) {
    const [project, setProject] = useState<Project | null>(null); // State สำหรับข้อมูลโปรเจค
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showAddSidebar, setShowAddSidebar] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const loadProjectAndTasks = async () => {
            const resolvedParams = await params;
            const projectData = await fetchProjectById(resolvedParams.projectId); // ดึงข้อมูลโปรเจค
            setProject(projectData);

            if (projectData?.id) {
                const taskData = await fetchTasksByProjectId(projectData.id); // ดึงข้อมูล Task
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">{project?.name || "Project Name"}</h1> {/* แสดงชื่อโปรเจค */}
                <button
                    onClick={() => setShowAddSidebar(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    Add Task
                </button>
            </div>

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
                                        if (task.status === "rejected") {
                                            setSelectedTask(task);
                                            setShowDeleteModal(true);
                                        } else {
                                            setSelectedTask(task);
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
                onTaskAdded={handleTaskUpdate} // Callback เมื่อ Task ถูกเพิ่ม
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
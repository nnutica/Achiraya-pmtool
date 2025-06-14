"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchProjectById } from "@/libs/projectService";
import { Project } from "@/types/project";
import { Task } from "@/types/task";
import TaskCard from "@/app/Components/Task-Components/TaskCard";
import DropZone from "@/app/Components/Task-Components/DropZone";
import AddTaskSidebar from "@/app/Components/Task-Components/Addtasksidebar";
import TaskDetailSidebar from "@/app/Components/Task-Components/TaskDetailSidebar";
import DeleteModal from "@/app/Components/Task-Components/DeleteModal";
import { FiX, FiMenu, FiGrid } from "react-icons/fi";

import { fetchTasksByProjectId, updateTaskStatus, updateTaskPriority, deleteTask } from "@/libs/taskservice";
import { Button } from "@headlessui/react";

export default function ProjectDetail({ params }: { params: Promise<{ projectId: string }> }) {
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showAddSidebar, setShowAddSidebar] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTaskTitle, setDeleteTaskTitle] = useState<string | null>(null);
    const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);
    const [showTip, setShowTip] = useState(true);
    const [viewMode, setViewMode] = useState<'column' | 'grid'>('column'); // เพิ่ม view mode
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

    // Handle Drag & Drop Priority Change
    const handlePriorityChange = async (taskId: string, newPriority: string) => {
        try {
            await updateTaskPriority(taskId, newPriority);
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId
                        ? { ...task, priority: newPriority as "Urgent" | "High" | "Medium" | "Low" }
                        : task
                )
            );

            const taskName = tasks.find(t => t.id === taskId)?.title;
            console.log(`Task "${taskName}" priority changed to ${newPriority}`);

        } catch (error) {
            console.error("Error updating task priority:", error);
            alert("Failed to update task priority. Please try again.");
        }
    };

    const handleDragStart = (task: Task) => {
        setDraggedTask(task);
    };

    const handleTaskClick = async (task: Task) => {
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
            setShowDeleteModal(true);
        } else {
            setSelectedTask(task);
        }
    };

    const priorityColor: Record<"Urgent" | "High" | "Medium" | "Low", string> = {
        Urgent: "border-red-500",
        High: "border-orange-400",
        Medium: "border-yellow-400",
        Low: "border-green-400"
    };

    return (
        <div className="min-h-screen bg-sky-950 text-white px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6 border-b border-gray-700 pb-3 sm:pb-4">
                <Link href="/Dashboard">
                    <Button className="text-blue-400 hover:text-blue-300 transition text-sm sm:text-base">
                        ← Back
                    </Button>
                </Link>

                <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight text-center sm:text-left">
                    {project?.name || "Project Name"}
                </h1>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* View Mode Toggle - Hidden on mobile */}
                    <div className="hidden sm:flex items-center gap-1 bg-gray-800 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('column')}
                            className={`p-1.5 rounded text-xs transition-colors ${viewMode === 'column'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:text-white'
                                }`}
                            title="Column View"
                        >
                            <FiMenu size={14} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded text-xs transition-colors ${viewMode === 'grid'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:text-white'
                                }`}
                            title="Grid View"
                        >
                            <FiGrid size={14} />
                        </button>
                    </div>

                    <button
                        onClick={() => setShowAddSidebar(true)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 sm:px-4 py-2 rounded-lg shadow-md transition text-xs sm:text-sm flex-1 sm:flex-none"
                    >
                        + Add Task
                    </button>
                </div>
            </div>

            {/* Tips Section - Responsive */}
            {showTip && (
                <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-900/30 rounded-lg border border-blue-700 relative">
                    <button
                        onClick={() => setShowTip(false)}
                        className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 text-blue-200 hover:text-white transition-colors duration-200"
                        title="Close tip"
                    >
                        <FiX size={14} className="sm:w-4 sm:h-4" />
                    </button>
                    <p className="text-xs sm:text-sm text-blue-200 pr-6 sm:pr-8">
                        💡 <strong>Tip:</strong> Drag and drop task cards between priority {window.innerWidth >= 768 ? 'columns' : 'sections'} to change their priority!
                    </p>
                </div>
            )}

            {!showTip && (
                <div className="mb-3 sm:mb-4 flex justify-end">
                    <button
                        onClick={() => setShowTip(true)}
                        className="text-xs text-blue-300 hover:text-blue-100 transition-colors duration-200 underline"
                    >
                        Show tips
                    </button>
                </div>
            )}

            {/* Main Content - Responsive Layout */}
            <div className={`
                ${viewMode === 'column'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'
                    : 'space-y-4 sm:space-y-6'
                } 
                h-auto lg:h-[calc(100vh-200px)]
            `}>
                {(["Urgent", "High", "Medium", "Low"] as const).map((priority) => {
                    const filteredTasks = tasks.filter((task) => task.priority === priority);

                    return (
                        <div key={priority} className="w-full">
                            {/* Column Header - Responsive */}
                            <h2 className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 pl-2 sm:pl-3 border-l-4 ${priorityColor[priority]}`}>
                                {priority} ({filteredTasks.length})
                            </h2>
                            {/* Drop Zone - Responsive */}
                            <DropZone priority={priority} onDrop={handlePriorityChange}>
                                <div className={`
                                    ${viewMode === 'column'
                                        ? 'space-y-2 sm:space-y-3 min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]'
                                        : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'
                                    }
                                `}>
                                    {filteredTasks.length === 0 ? (
                                        <div className="p-4 sm:p-6 text-center text-gray-400 border-2 border-dashed border-gray-600 rounded-lg h-24 sm:h-32 flex flex-col justify-center">
                                            <p className="text-xs sm:text-sm">No {priority.toLowerCase()} tasks</p>
                                            <p className="text-xs mt-1 hidden sm:block">Drop here to change priority</p>
                                        </div>
                                    ) : (
                                        filteredTasks.map((task) => (
                                            <TaskCard
                                                key={task.id}
                                                task={task}
                                                onClick={() => handleTaskClick(task)}
                                                onDragStart={handleDragStart}
                                            />
                                        ))
                                    )}
                                </div>
                            </DropZone>
                        </div>
                    );
                })}
            </div>

            {/* Existing Sidebars and Modals */}
            <AddTaskSidebar
                isOpen={showAddSidebar}
                onClose={() => setShowAddSidebar(false)}
                projectId={project?.id || ""}
                projectName={project?.name || "Project Name"}
                onTaskAdded={handleTaskUpdate}
                members={project?.members || []}
            />

            {selectedTask && project && (
                <TaskDetailSidebar
                    isOpen={!!selectedTask}
                    onClose={() => setSelectedTask(null)}
                    task={selectedTask}
                    project={project}
                    onTaskUpdate={handleTaskUpdate}
                />
            )}

            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    if (deleteTaskId) {
                        const taskToReopen = tasks.find((task) => task.id === deleteTaskId);
                        setSelectedTask(taskToReopen || null);
                    }
                }}
                onConfirm={async () => {
                    if (deleteTaskId) {
                        try {
                            await deleteTask(deleteTaskId);
                            setTasks((prevTasks) => prevTasks.filter((t) => t.id !== deleteTaskId));
                            setSelectedTask(null);
                            setShowDeleteModal(false);
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

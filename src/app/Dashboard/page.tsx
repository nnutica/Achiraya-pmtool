"use client";
import { useEffect, useState } from "react";
import { Task } from "@/types/task";
import { fetchTasks, updateTask, deleteTask } from "@/libs/taskservice";
import TaskCard from "../Components/TaskCard";
import AddTaskSidebar from "../Components/Addtasksidebar";
import TaskDetailSidebar from "../Components/TaskDetailSidebar";
import DeleteModal from "../Components/DeleteModal";

export default function Dashboard() {
    // State ต่างๆ
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showAddSidebar, setShowAddSidebar] = useState(false);
    const [showDetailSidebar, setShowDetailSidebar] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

    const loadTasks = async () => {
        const data = await fetchTasks();
        setTasks(data);
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const handleTaskClick = async (task: Task) => {
        // ตรวจสอบสถานะ rejected หรือ cancelled
        if (task.status === "rejected" || task.status === "cancelled") {
            // เปิด DeleteModal
            setTaskToDelete(task);
            setShowDeleteModal(true);
            return;
        }

        // กรณีไม่ใช่ rejected หรือ cancelled ให้ทำงานปกติ
        setSelectedTask(task);
        setShowDetailSidebar(true);

        // ถ้าสถานะเป็น Unread ให้อัปเดตเป็น Wait Approve
        if (task.status === "Unread") {
            try {
                await updateTask(task.id, { status: "Wait Approve" });

                setTasks((prevTasks) =>
                    prevTasks.map((t) =>
                        t.id === task.id
                            ? { ...t, status: "Wait Approve" }
                            : t
                    )
                );

                setSelectedTask({ ...task, status: "Wait Approve" });
            } catch (error) {
                console.error("Error updating task status:", error);
            }
        }
    };

    // ฟังก์ชันสำหรับอัปเดตงานหลังจากแก้ไข
    const handleTaskUpdate = (updatedTask: Task) => {
        // อัปเดต tasks state
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task
            )
        );

        // อัปเดต selectedTask state
        setSelectedTask(updatedTask);
    };

    // ฟังก์ชันสำหรับลบงาน
    const handleDeleteConfirm = async () => {
        if (!taskToDelete) return;

        try {
            // ลบงานจากฐานข้อมูล
            await deleteTask(taskToDelete.id);

            // อัปเดต state ให้ลบงานออกไป
            setTasks((prevTasks) =>
                prevTasks.filter((t) => t.id !== taskToDelete.id)
            );

            // รีเซ็ต Task ที่จะลบ
            setTaskToDelete(null);

            // ไม่ต้องใช้ alert() เพราะข้อความจะแสดงใน Modal
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Failed to delete task. Please try again.");
        } finally {
            setShowDeleteModal(false); // ปิด Modal หลังจากลบสำเร็จ
        }
    };

    return (
        <main className="container mx-auto px-4 py-8">
            {/* ส่วนหัว */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Task Dashboard</h1>
                <button
                    onClick={() => setShowAddSidebar(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    Add Task
                </button>
            </div>

            {/* แสดงงาน Urgent เฉพาะเมื่อมี Task */}
            {tasks.filter(task => task.priority === "Urgent").length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 flex items-center text-red-600">
                        <span className="mr-2">🔴</span> Urgent
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks
                            .filter((task) => task.priority === "Urgent")
                            .map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onClick={handleTaskClick}
                                />
                            ))}
                    </div>
                </div>
            )}

            {/* แสดงงาน High เฉพาะเมื่อมี Task */}
            {tasks.filter(task => task.priority === "High").length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 flex items-center text-orange-600">
                        <span className="mr-2">🟠</span> High
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks
                            .filter((task) => task.priority === "High")
                            .map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onClick={handleTaskClick}
                                />
                            ))}
                    </div>
                </div>
            )}

            {/* แสดงงาน Medium เฉพาะเมื่อมี Task */}
            {tasks.filter(task => task.priority === "Medium").length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 flex items-center text-yellow-600">
                        <span className="mr-2">🟡</span> Medium
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks
                            .filter((task) => task.priority === "Medium")
                            .map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onClick={handleTaskClick}
                                />
                            ))}
                    </div>
                </div>
            )}

            {/* แสดงงาน Low เฉพาะเมื่อมี Task */}
            {tasks.filter(task => task.priority === "Low").length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 flex items-center text-green-600">
                        <span className="mr-2">🟢</span> Low
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks
                            .filter((task) => task.priority === "Low")
                            .map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onClick={handleTaskClick}
                                />
                            ))}
                    </div>
                </div>
            )}

            {/* แสดงข้อความเมื่อไม่มี Task ใดๆ */}
            {tasks.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-500">No tasks found. Add your first task to get started!</p>
                    <button
                        onClick={() => setShowAddSidebar(true)}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                        Add Task
                    </button>
                </div>
            )}

            {/* Sidebars */}
            <AddTaskSidebar
                isOpen={showAddSidebar}
                onClose={() => {
                    setShowAddSidebar(false);
                    loadTasks();
                }}
            />

            <TaskDetailSidebar
                isOpen={showDetailSidebar}
                onClose={() => setShowDetailSidebar(false)}
                task={selectedTask}
                onTaskUpdate={handleTaskUpdate}
            />

            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                taskTitle={taskToDelete?.title || ""}
                taskStatus={taskToDelete?.status || ""}
                setShowDetailSidebar={setShowDetailSidebar} // ส่งฟังก์ชันเปิด TaskDetailSidebar
            />
        </main>
    );
}
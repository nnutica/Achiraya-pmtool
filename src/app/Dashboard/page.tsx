"use client";
import { useEffect, useState } from "react";
import { Task } from "@/types/task";
import { fetchTasks, updateTask, deleteTask } from "@/libs/taskservice";
import TaskCard from "../Components/TaskCard";
import AddTaskSidebar from "../Components/Addtasksidebar";
import TaskDetailSidebar from "../Components/TaskDetailSidebar";

export default function Dashboard() {
    // State ต่างๆ
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showAddSidebar, setShowAddSidebar] = useState(false);
    const [showDetailSidebar, setShowDetailSidebar] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const loadTasks = async () => {
        const data = await fetchTasks();
        setTasks(data);
    };

    useEffect(() => {
        loadTasks();
    }, []);

    const handleTaskClick = async (task: Task) => {
        // เช็คว่าเป็นงานที่ rejected หรือ cancelled หรือไม่
        if (task.status === "rejected" || task.status === "cancelled") {
            // ถามผู้ใช้ก่อนลบ
            if (confirm(`Are you sure you want to delete this ${task.status} task?`)) {
                try {
                    // ลบงานจากฐานข้อมูล
                    await deleteTask(task.id);

                    // อัปเดต state ให้ลบงานออกไป
                    setTasks(prevTasks => prevTasks.filter(t => t.id !== task.id));

                    // ถ้า task ที่กำลังแสดงอยู่ใน sidebar คือ task ที่ถูกลบ ให้ปิด sidebar
                    if (selectedTask?.id === task.id) {
                        setShowDetailSidebar(false);
                        setSelectedTask(null);
                    }

                    // แสดงข้อความว่าลบสำเร็จ
                    alert(`Task "${task.title}" has been deleted successfully.`);
                } catch (error) {
                    console.error("Error deleting task:", error);
                    alert("Failed to delete task. Please try again.");
                }
                return;
            } else {
                // ถ้าผู้ใช้กดยกเลิก ไม่ต้องทำอะไร
                return;
            }
        }

        // กรณีไม่ใช่ rejected หรือ cancelled ให้ทำงานปกติ
        setSelectedTask(task);
        setShowDetailSidebar(true);

        // ถ้าสถานะเป็น Unread ให้อัปเดตเป็น Wait Approve
        if (task.status === "Unread") {
            try {
                await updateTask(task.id, { status: "Wait Approve" });

                setTasks(prevTasks =>
                    prevTasks.map(t =>
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
        </main>
    );
}
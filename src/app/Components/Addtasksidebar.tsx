// components/AddTaskSidebar.tsx
"use client";
import { useState } from "react";
import { addTask } from "@/libs/taskservice";
import { TaskPriority, Taskstatus } from "@/types/task";
import { Member } from "@/types/project";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    projectName: string; // เชื่อม Task กับ Project
    onTaskAdded: () => Promise<void>; // เพิ่ม Props สำหรับอัปเดต Task
    members?: Member[]; // เพิ่ม props สำหรับสมาชิก
}

export default function AddTaskSidebar({ isOpen, onClose, projectId, projectName, onTaskAdded, members = [] }: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<TaskPriority>("Medium");
    const [status, setStatus] = useState<Taskstatus>("Unread");
    const [dueDate, setDueDate] = useState<string>("");
    const [AssignedTo, setAssignedTo] = useState<Member | "All">("All"); // เพิ่ม State สำหรับ AssignedTo

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
            projectId,
            projectName,
            AssignedTo
        });

        await onTaskAdded(); // เรียกฟังก์ชันเพื่อ Fetch Task ใหม่
        onClose(); // ปิด Sidebar
        setTitle("");
        setDescription("");
        setDueDate("");
        setAssignedTo("All"); // รีเซ็ต AssignedTo
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 flex justify-end">
            <div className="absolute inset-0 bg-black/20  transition-opacity"></div>
            {/* Background overlay with fade-in */}
            <div
                className="fixed inset-0 transition-opacity duration-300 ease-in-out"
                style={{ opacity: isOpen ? 1 : 0 }}
                onClick={onClose}
            ></div>

            {/* Sidebar with slide-in */}
            <div
                className="w-full sm:w-[400px] bg-blue-950 shadow-lg rounded-l-3xl flex flex-col h-fit p-1  relative transition-transform duration-300 ease-in-out"
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
                            <label htmlFor="title" className="text-sm font-medium text-white ">Title</label>
                            <input
                                id="title"
                                type="text"
                                placeholder="Enter task title"
                                className="w-full border rounded-lg px-3 py-2 mt-4 "
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium text-white">Description</label>
                            <textarea
                                id="description"
                                placeholder="Enter task description"
                                className="w-full border rounded-lg px-3 py-2 min-h-[100px]  mt-4"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="priority" className="text-sm font-medium text-white">Priority</label>
                            <select
                                id="priority"
                                className="w-full border rounded-lg px-3 py-2 text-white"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                            >
                                <option value="Low" className="text-gray-700">Low</option>
                                <option value="Medium" className="text-gray-700">Medium</option>
                                <option value="High" className="text-gray-700">High</option>
                                <option value="Urgent" className="text-gray-700">Urgent</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="status" className="text-sm font-medium text-white">Status</label>
                            <select
                                id="status"
                                className="w-full border rounded-lg px-3 py-2 text-white"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as Taskstatus)}
                            >
                                <option value="Unread" className="text-gray-700">Unread</option>
                                <option value="in-progress" className="text-gray-700">In Progress</option>
                                <option value="Wait Approve" className="text-gray-700">Wait Approve</option>
                                <option value="done" className="text-gray-700">Done</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="dueDate" className="text-sm font-medium text-white">Due Date</label>
                            <input
                                id="dueDate"
                                type="date"
                                className="w-full border rounded-lg px-3 py-2"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="assignedTo" className="text-sm font-medium text-white">Assign to</label>
                            <select
                                id="assignedTo"
                                className="w-full border rounded-lg px-3 py-2 text-white"
                                value={AssignedTo === "All" ? "All" : (typeof AssignedTo === 'object' ? AssignedTo.id : "")}
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    if (selectedId === "") {
                                        setAssignedTo("All"); // ไม่ได้ Assign ให้ใคร
                                    } else {
                                        // ในที่นี้คุณต้องมี array ของ members เพื่อหา member ที่ถูกเลือก
                                        // สมมติว่าคุณมี members array
                                        const selectedMember = members?.find(member => member.id === selectedId) || "All";
                                        setAssignedTo(selectedMember);
                                    }
                                }}
                            >
                                <option value="" className="text-gray-700">- (No assignment)</option>
                                {/* คุณต้องเพิ่ม members array เป็น prop หรือ fetch มาจาก project */}
                                {members?.map((member) => (
                                    <option key={member.id} value={member.id} className="text-gray-700">
                                        {member.name}
                                    </option>
                                ))}
                            </select>
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

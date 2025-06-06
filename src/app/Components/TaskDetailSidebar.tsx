import { Task, TaskPriority, Taskstatus } from "@/types/task";
import { useEffect, useRef, useState } from "react";
import Badge from "./Badge";
import { updateTask } from "@/libs/taskservice";

interface TaskDetailSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
    onTaskUpdate?: (updatedTask: Task) => void; // callback เพื่ออัปเดตรายการงานในหน้าหลัก
}

export default function TaskDetailSidebar({ isOpen, onClose, task, onTaskUpdate }: TaskDetailSidebarProps) {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState("");
    const [editedPriority, setEditedPriority] = useState("");
    const [editedStatus, setEditedStatus] = useState("");
    const [editedDueDate, setEditedDueDate] = useState("");


    // เมื่อ task เปลี่ยน ให้อัปเดต state สำหรับการแก้ไข
    useEffect(() => {
        if (task) {
            // รีเซ็ตโหมด Edit เมื่อ Task เปลี่ยน
            setIsEditing(false);

            // อัปเดตค่าเริ่มต้นสำหรับการแก้ไข
            setEditedDescription(task.description);
            setEditedPriority(task.priority);
            setEditedStatus(task.status);
            setEditedDueDate(task.dueDate?.split("T")[0] || ""); // แปลงรูปแบบวันที่ให้ตรงกับ input type="date"
            console.log("Task updated in sidebar:", task.status);
        }
    }, [task]);


    // handle click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);


    if (!isOpen || !task) return null;

    // ฟังก์ชันเปิด/ปิดโหมดการแก้ไข
    const toggleEditMode = () => {
        setIsEditing(!isEditing);

        // ถ้ากำลังจะเปิดโหมดแก้ไข ให้ reset ค่าเริ่มต้น
        if (!isEditing) {
            setEditedDescription(task.description);
            setEditedPriority(task.priority);
            setEditedStatus(task.status);
            setEditedDueDate(task.dueDate?.split("T")[0] || ""); // แปลงรูปแบบวันที่ให้ตรงกับ input type="date"
        }
    };

    // ฟังก์ชันบันทึกการแก้ไข
    const handleSaveChanges = async () => {
        if (!task) return;

        try {
            await updateTask(task.id, {
                description: editedDescription,
                priority: editedPriority as TaskPriority,
                status: editedStatus as Taskstatus,
                dueDate: editedDueDate || null, // เพิ่ม DueDate
            });

            if (onTaskUpdate) {
                onTaskUpdate({
                    ...task,
                    description: editedDescription,
                    priority: editedPriority as TaskPriority,
                    status: editedStatus as Taskstatus,
                    dueDate: editedDueDate || null, // อัปเดต DueDate
                    updatedAt: new Date().toISOString(),
                });
            }

            setIsEditing(false);
        } catch (error) {
            console.error("Error updating task:", error);
            alert("Failed to update task. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 z-40 flex justify-end">
            {/* Overlay ที่ใสไม่มีสี */}
            <div
                className="fixed inset-0 bg-transparent"
                onClick={onClose}
            ></div>

            <div
                ref={sidebarRef}
                className="bg-white w-full sm:w-[400px] rounded-l-3xl h-[calc(100%-4rem)] mt-16 overflow-y-auto p-6 shadow-lg relative"
            >
                {/* ส่วนหัว */}
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pt-2 z-10">
                    <h2 className="text-2xl font-bold">
                        {isEditing ? task.title : "Task Details"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {/* ชื่องาน - แสดงเฉพาะเมื่อไม่ได้อยู่ในโหมดแก้ไข */}
                {!isEditing && (
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">{task.title}</h1>
                        <p className="text-sm text-gray-500">Project ID: {task.projectId}</p> {/* แสดง Project ID */}
                    </div>
                )}

                {/* แท็กสถานะและความสำคัญ */}
                <div className="flex gap-2 mb-6">
                    {!isEditing ? (
                        <>
                            <Badge type="status" value={task.status} />
                            <Badge type="priority" value={task.priority} />
                        </>
                    ) : null}
                </div>

                {/* รายละเอียด */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    {!isEditing ? (
                        <>
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {task.description || "No description available"}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Due Date: {task.dueDate ? formatDate(task.dueDate) : "Not specified"}
                            </p>
                        </>
                    ) : (
                        <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 min-h-[120px]"
                            placeholder="Enter task description"
                        />
                    )}
                </div>

                {/* Priority, Status และ DueDate (แสดงเฉพาะเมื่อ edit) */}
                {isEditing && (
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-lg font-semibold mb-2">Priority</label>
                            <select
                                value={editedPriority}
                                onChange={(e) => setEditedPriority(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-lg font-semibold mb-2">Status</label>
                            <select
                                value={editedStatus}
                                onChange={(e) => setEditedStatus(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2"
                            >
                                <option value="Unread">Unread</option>
                                <option value="in-progress">In Progress</option>
                                <option value="Wait Approve">Wait Approve</option>
                                <option value="done">Done</option>
                                <option value="rejected">Rejected</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-lg font-semibold mb-2">Due Date</label>
                            <input
                                type="date"
                                value={editedDueDate}
                                onChange={(e) => setEditedDueDate(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2"
                            />
                        </div>
                    </div>
                )}

                {/* วันที่สร้างและอัปเดต */}
                <div className="mb-6 text-sm text-gray-500">
                    <p>Created: {formatDate(task.createdAt)}</p>
                    {task.updatedAt && <p>Updated: {formatDate(task.updatedAt)}</p>}
                </div>

                {/* ความคิดเห็น */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Comments ({task.comments?.length || 0})</h3>

                    {task.comments && task.comments.length > 0 ? (
                        <div className="space-y-3">
                            {task.comments.map((comment, index) => (
                                <div key={index} className="border-l-4 border-gray-200 pl-3 py-1">
                                    <p className="text-gray-700">{comment.message}</p>
                                    <p className="text-xs text-gray-500">
                                        By: {comment.author} • {formatDate(comment.createdAt)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No comments yet</p>
                    )}
                </div>

                {/* ปุ่มดำเนินการ */}
                <div className="flex gap-3 mt-6">
                    {!isEditing ? (
                        <>
                            <button
                                onClick={toggleEditMode}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex-1"
                            >
                                Edit
                            </button>
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex-1">
                                Add Comment
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleSaveChanges}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex-1"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={toggleEditMode}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex-1"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// ฟังก์ชั่นช่วยสำหรับแสดงวันที่ในรูปแบบที่อ่านง่าย
function formatDate(dateInput?: any) {
    // ฟังก์ชันเดิมไม่เปลี่ยนแปลง
    if (!dateInput) return "Not specified";

    let date;

    // กรณี Firebase Timestamp (มี seconds และ nanoseconds)
    if (dateInput && typeof dateInput === 'object' && 'seconds' in dateInput) {
        date = new Date(dateInput.seconds * 1000);
    }
    // กรณี string
    else if (typeof dateInput === 'string') {
        date = new Date(dateInput);
    }
    // กรณีอื่นๆ 
    else {
        date = dateInput;
    }

    // ตรวจสอบว่า date เป็น valid date หรือไม่
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return String(dateInput);
    }

    // แสดงในรูปแบบ yyyy/MM/dd
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).replace(/\//g, '/');
}
import { Task, TaskPriority, Taskstatus } from "@/types/task";
import { useEffect, useRef, useState } from "react";
import Badge from "./Badge";
import { updateTask, addComment, fetchTaskById, updateTaskStatus } from "@/libs/taskservice";
import { useAuth } from "../AuthProvider";
import CommentBox from "@/app/Components/Task-Components/CommentBox";
import { Member, Project } from "@/types/project";

interface TaskDetailSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
    project: Project;
    onTaskUpdate?: (updatedTask: Task) => void;
}

export default function TaskDetailSidebar({
    isOpen,
    onClose,
    task,
    project,
    onTaskUpdate,
}: TaskDetailSidebarProps) {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const { currentUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editedDescription, setEditedDescription] = useState("");
    const [editedPriority, setEditedPriority] = useState("");
    const [editedStatus, setEditedStatus] = useState("");
    const [editedDueDate, setEditedDueDate] = useState("");
    const [editedAssignedTo, setEditedAssignedTo] = useState<Member | "All">("All"); // เพิ่ม State สำหรับ AssignedTo

    useEffect(() => {
        if (task) {
            setIsEditing(false);
            setEditedDescription(task.description);
            setEditedPriority(task.priority);
            setEditedStatus(task.status);
            setEditedDueDate(task.dueDate?.split("T")[0] || "");
            setEditedAssignedTo(task.AssignedTo || "All"); // ตั้งค่า AssignedTo
        }
    }, [task]);

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

    const toggleEditMode = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            setEditedDescription(task.description);
            setEditedPriority(task.priority);
            setEditedStatus(task.status);
            setEditedDueDate(task.dueDate?.split("T")[0] || "");
            setEditedAssignedTo(task.AssignedTo || "All");
        }
    };

    const handleSaveChanges = async () => {
        if (!task) return;

        try {
            await updateTask(task.id, {
                description: editedDescription,
                priority: editedPriority as TaskPriority,
                status: editedStatus as Taskstatus,
                dueDate: editedDueDate || null,
                AssignedTo: editedAssignedTo  // เพิ่ม AssignedTo ในการอัปเดต
            });

            if (onTaskUpdate) {
                onTaskUpdate({
                    ...task,
                    description: editedDescription,
                    priority: editedPriority as TaskPriority,
                    status: editedStatus as Taskstatus,
                    dueDate: editedDueDate || null,
                    AssignedTo: editedAssignedTo,
                    updatedAt: new Date().toISOString(),
                });
            }

            setIsEditing(false);
        } catch (error) {
            console.error("Error updating task:", error);
            alert("Failed to update task. Please try again.");
        }
    };

    const handleAddComment = async (author: string, message: string) => {
        if (!task) return;

        const comment = {
            id: crypto.randomUUID(),
            author,
            message,
            createdAt: new Date().toISOString(),
        };

        try {
            await addComment(task.id, comment);

            if (onTaskUpdate) {
                const updatedTask = await fetchTaskById(task.id);
                if (updatedTask) {
                    onTaskUpdate(updatedTask);
                }
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Failed to add comment. Please try again.");
        }
    };



    return (
        <div className="fixed inset-0 z-40 flex justify-end">
            <div className="absolute inset-0 bg-black/20  transition-opacity"></div>
            <div
                ref={sidebarRef}
                className="bg-blue-950 w-1/3 sm:w-1/3 rounded-l-3xl h-full  overflow-y-auto p-6 shadow-lg relative"
            >
                <div className="sticky top-0 bg-blue-950 pt-2 z-10 shadow ">
                    <div className="flex justify-between items-center">
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

                    {!isEditing && (
                        <div className="mt-2 mb-4">
                            <h1 className="text-xl font-bold">{task.title}</h1>
                        </div>
                    )}

                    <div className="flex gap-2 mt-2 mb-4">
                        <Badge type="status" value={task.status} />
                        <Badge type="priority" value={task.priority} />
                    </div>

                    {/* Assigned To Section */}
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2 text-white">Assigned To</h3>
                        {!isEditing ? (
                            <p className="text-white">
                                {task.AssignedTo === "All"
                                    ? "Everyone"
                                    : (typeof task.AssignedTo === 'object' ? task.AssignedTo.name : "Everyone")
                                }
                            </p>
                        ) : (
                            <select
                                value={editedAssignedTo === "All" ? "All" : (typeof editedAssignedTo === 'object' ? editedAssignedTo.id : "All")}
                                onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    if (selectedValue === "All") {
                                        setEditedAssignedTo("All");
                                    } else {
                                        const selectedMember = project.members?.find(member => member.id === selectedValue);
                                        setEditedAssignedTo(selectedMember || "All");
                                    }
                                }}
                                className="w-full border rounded-lg px-3 py-2 text-white"
                            >
                                <option value="All" className="text-black">Everyone</option>
                                {project.members?.map((member) => (
                                    <option key={member.id} value={member.id} className="text-black">
                                        {member.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        {!isEditing ? (
                            <>
                                <p className="text-shadow-blue-300 whitespace-pre-wrap">
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
                                className="w-full border rounded-lg px-3 py-2 min-h-[120px] text-white"
                                placeholder="Enter task description"
                            />
                        )}
                    </div>

                    {isEditing && (
                        <div className="space-y-6 mb-6">
                            {/* Priority */}
                            <div className="border rounded-lg p-4">
                                <h3 className="text-lg font-semibold mb-2">Priority</h3>
                                <select
                                    value={editedPriority}
                                    onChange={(e) => setEditedPriority(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 text-white"
                                >
                                    <option value="Low" className="text-zinc-700">Low</option>
                                    <option value="Medium" className="text-zinc-700">Medium</option>
                                    <option value="High" className="text-zinc-700">High</option>
                                    <option value="Urgent" className="text-red-700">Urgent</option>
                                </select>
                            </div>

                            {/* Status */}
                            <div className="border rounded-lg p-4">
                                <h3 className="text-lg font-semibold mb-2">Status</h3>
                                <select
                                    value={editedStatus}
                                    onChange={(e) => setEditedStatus(e.target.value)}
                                    className="w-full text-white border border-amber-50 rounded-lg px-3 py-2 appearance-none"
                                >
                                    <option value="Unread" className="text-zinc-700">Unread</option>
                                    <option value="In-progress" className="text-zinc-700">In Progress</option>
                                    <option value="Wait Approve" className="text-zinc-700">Wait Approve</option>
                                    <option value="done" className="text-zinc-700">Done</option>
                                    <option value="rejected" className="text-zinc-700">Rejected</option>
                                </select>
                            </div>

                            {/* Due Date */}
                            <div className="border rounded-lg p-4">
                                <h3 className="text-lg font-semibold mb-2">Due Date</h3>
                                <input
                                    type="date"
                                    value={editedDueDate}
                                    onChange={(e) => setEditedDueDate(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 text-white"
                                />
                            </div>
                        </div>
                    )}

                    <div className="mb-6 text-sm text-gray-500">
                        <p>Created: {formatDate(task.createdAt)}</p>
                        {task.updatedAt && <p>Updated: {formatDate(task.updatedAt)}</p>}
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">
                            Comments ({task.comments?.length || 0})
                        </h3>
                        {task.comments && task.comments.length > 0 ? (
                            <div className="space-y-3">
                                {task.comments.map((comment, index) => (
                                    <div key={index} className="border-l-4 border-gray-200 pl-3 py-1">
                                        <div className="text-shadow-blue-500">
                                            {comment.message.split("\n").map((line, index) => (
                                                <div key={index}>{line}</div>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-200">
                                            By: {comment.author} • {formatDate(comment.createdAt)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No comments yet</p>
                        )}
                    </div>

                    <div className="space-y-4">
                        {!isEditing && (
                            <CommentBox
                                onSubmit={handleAddComment}
                                currentUserName={currentUser?.displayName || undefined}
                                members={project.members?.map((member: Member) => member.name) || []}
                            />
                        )}

                        <div className="flex gap-3">
                            {!isEditing ? (
                                <button
                                    onClick={toggleEditMode}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex-1"
                                >
                                    Edit
                                </button>
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
            </div>
        </div>
    );
}

// ฟังก์ชั่นช่วยสำหรับแสดงวันที่ในรูปแบบที่อ่านง่าย
function formatDate(dateInput?: any) {
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
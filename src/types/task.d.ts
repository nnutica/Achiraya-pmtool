import { Member } from "./project";

export type Taskstatus = "Unread" | "In-progress" | "Wait Approve" | "done" | "rejected";
export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";


export interface Task {
    id: string;
    title: string;
    description: string;
    status: Taskstatus;
    priority: TaskPriority;
    createdAt: string; // เปลี่ยนจาก Date เป็น string
    updatedAt: string; // เปลี่ยนจาก Date เป็น string
    dueDate?: string | null; // เปลี่ยนจาก Date เป็น string
    AssignedTo?: Member | "All"; // ID ของผู้ที่ได้รับมอบหมาย
    comments?: Comment[];
    projectId: string;
    projectName: string // ID ของ Project ที่ Task นี้อยู่
}

export interface Comment {
    id: string;
    author: string;
    message: string;
    createdAt: string, // เปลี่ยนจาก Date เป็น string
    editedAt?: string; // เปลี่ยนจาก Date เป็น string
}
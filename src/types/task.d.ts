export type Taskstatus = "Unread" | "In-progress" | "Wait Approve" | "done" | "rejected" | "cancelled";
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
    comments?: Comment[];
    projectId: string; // ID ของ Project ที่ Task นี้อยู่
}

export interface Comment {
    id: string;
    author: string;
    message: string;
    createdAt: string, // เปลี่ยนจาก Date เป็น string
    editedAt?: string; // เปลี่ยนจาก Date เป็น string
}
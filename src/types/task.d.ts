export type Taskstatus = "Unread" | "in-progress" | "Wait Approve" | "done" | "rejected" | "cancelled";
export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";


export interface Task {
    id: string;
    title: string;
    description: string;
    status: Taskstatus;
    priority: TaskPriority;
    createdAt: Date;
    updatedAt: Date;
    dueDate?: Date | null;
    comments?: Comment[];
}

export interface Comment {
    id: string;
    author: string;
    message: string;
    createdAt: Date,
    editedAt?: Date;
}
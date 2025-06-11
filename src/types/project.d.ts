export type ProjectStatus = "New" | "In-progress" | "Success" | "cancelled";


export interface Project {
    id: string; // Unique ID ของ Project
    name: string; // ชื่อ Project
    description: string; // คำอธิบาย Project
    members?: Member[]; // รายชื่อสมาชิกใน Project
    createdAt: string; // วันที่สร้าง Project
    updatedAt: string; // วันที่แก้ไขล่าสุด
    userId: string;
    projectStatus?: ProjectStatus; // สถานะของ Project
    projectDueDate?: string | "LTS"; // วันที่กำหนดเส้นตายของ Project
}

export interface Member {
    id: string; // Unique ID ของ Member
    name: string; // ชื่อของ Member
    email?: string | null; // อีเมลของ Member
    role: "Admin" | "Member" | "StakeHolder"; // บทบาทของ Member ใน Project
    joinedAt: string; // วันที่เข้าร่วม Project
}
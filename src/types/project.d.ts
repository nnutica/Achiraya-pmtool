export interface Project {
    id: string; // Unique ID ของ Project
    name: string; // ชื่อ Project
    description: string; // คำอธิบาย Project
    createdAt: string; // วันที่สร้าง Project
    updatedAt: string; // วันที่แก้ไขล่าสุด
    userId: string;
}
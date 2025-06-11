import { Member, ProjectStatus } from "@/types/project";
import React, { useState } from "react";

interface AddProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, description: string, members: Member[], projectDueDate: string, ProjectStatus: ProjectStatus) => void;
}

export default function AddProjectModal({ isOpen, onClose, onCreate }: AddProjectModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [members, setMembers] = useState<Member[]>([]);
    const [newMemberName, setNewMemberName] = useState("");
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [newMemberRole, setNewMemberRole] = useState<"Admin" | "Member" | "StakeHolder">("Member"); // ค่าเริ่มต้นเป็น Member
    const [projectDueDate, setProjectDueDate] = useState<string>("LTS");
    const [ProjectStatus, setProjectStatus] = useState<ProjectStatus>("New"); // ค่าเริ่มต้นเป็น Unread

    const handleAddMember = () => {
        if (!newMemberName.trim()) return;

        const newMember: Member = {
            id: crypto.randomUUID(),
            name: newMemberName,
            email: newMemberEmail || null,
            joinedAt: new Date().toISOString(),
            role: newMemberRole, // เพิ่ม Role
        };

        setMembers((prev) => [...prev, newMember]);
        setNewMemberName("");
        setNewMemberEmail("");
        setNewMemberRole("Member"); // รีเซ็ต Role เป็นค่าเริ่มต้น
    };

    const handleSubmit = () => {
        onCreate(name, description, members, projectDueDate, ProjectStatus); // ส่งข้อมูล members ไปด้วย
        setName("");
        setDescription("");
        setMembers([]);
        setProjectDueDate("LTS");
        setProjectStatus("New"); // รีเซ็ตค่าเริ่มต้น
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 flex justify-end">
            <div className="absolute inset-0 bg-black/20  transition-opacity" onClick={onClose}></div>
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md  z-50">
                <h2 className="text-xl font-bold mb-4">Add Project</h2>
                <input
                    type="text"
                    placeholder="Project Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 mb-4"
                />
                <textarea
                    placeholder="Project Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">Add Members</h3>
                <input
                    type="text"
                    placeholder="Member Name"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 mb-2"
                />
                <input
                    type="email"
                    placeholder="Member Email (optional)"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 mb-4"
                />
                <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value as "Admin" | "Member" | "StakeHolder")}
                    className="w-full border rounded-lg px-3 py-2 mb-4"
                >
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                    <option value="StackHolder">stackHolder</option>
                </select>
                <button
                    onClick={handleAddMember}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mb-4"
                >
                    Add Member
                </button>
                <ul className="mb-4">
                    {members.map((member) => (
                        <li key={member.id} className="text-gray-700">
                            {member.name} ({member.email || "No email"}) - Role: {member.role}
                        </li>
                    ))}
                </ul>
                <label htmlFor="project-status" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Status
                </label>
                <select
                    id="project-status"
                    value={ProjectStatus}
                    onChange={(e) => setProjectStatus(e.target.value as ProjectStatus)}
                    className="w-full border rounded-lg px-3 py-2 mb-4"
                >
                    {(["New", "In-progress", "Success", "cancelled", "LTS", "Lated", "On Hold"] as ProjectStatus[]).map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
                <input
                    type="date"
                    value={projectDueDate === "LTS" ? "" : projectDueDate}
                    onChange={(e) => setProjectDueDate(e.target.value || "LTS")}
                    className="w-full border rounded-lg px-3 py-2 mb-4"
                />

                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    Create Project
                </button>
                <button
                    onClick={onClose}
                    className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
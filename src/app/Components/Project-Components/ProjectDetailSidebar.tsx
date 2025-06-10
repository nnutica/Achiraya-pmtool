import { fetchProjectById } from "@/libs/projectService";
import { Project, Member } from "@/types/project";
import React, { useEffect, useState } from "react";
import MemberSidebar from "@/app/Components/Project-Components/MemberSidebar";

interface ProjectDetailSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    project: Project;
    onEdit: (updatedProject: Project) => void;
}

export default function ProjectDetailSidebar({ isOpen, onClose, project, onEdit }: ProjectDetailSidebarProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(project?.name || "");
    const [editedDescription, setEditedDescription] = useState(project?.description || "");
    const [editedMembers, setEditedMembers] = useState<Member[]>(project?.members || []);
    const [newMemberName, setNewMemberName] = useState("");
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [showMemberSidebar, setShowMemberSidebar] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
    const [editedDueDate, setEditedDueDate] = useState<string | "LTS">(project?.projectDueDate || "LTS");

    // ใช้ useEffect เพื่ออัปเดตค่าเมื่อ project เปลี่ยนแปลง
    useEffect(() => {
        if (project) {
            setEditedName(project.name || "");
            setEditedDescription(project.description || "");
            setEditedMembers(project.members || []);
            setEditedDueDate(project.projectDueDate || "LTS");
        }
    }, [project]);

    const handleAddMember = () => {
        if (!newMemberName.trim()) return;

        const newMember: Member = {
            id: crypto.randomUUID(),
            name: newMemberName,
            email: newMemberEmail || null,
            role: "Member",
            joinedAt: new Date().toISOString(),
        };

        setEditedMembers((prev) => [...prev, newMember]);
        setNewMemberName("");
        setNewMemberEmail("");
    };



    const handleDeleteMember = (member: Member) => {
        setMemberToDelete(member);
        setShowDeleteModal(true);
    };

    const confirmDeleteMember = () => {
        if (memberToDelete) {
            setEditedMembers((prev) => prev.filter((m) => m.id !== memberToDelete.id));
            setShowDeleteModal(false);
            setMemberToDelete(null);
        }
    };

    const handleSaveChanges = async () => {
        const updatedProject: Project = {
            ...project,
            name: editedName,
            description: editedDescription,
            members: editedMembers,
            projectDueDate: editedDueDate,
        };
        try {
            await onEdit(updatedProject); // อัปเดตข้อมูลในฐานข้อมูล
            setShowSuccessModal(true); // แสดง modal แจ้งเตือนความสำเร็จ
        } catch (error) {
            console.error("Error saving changes:", error);
            alert("Failed to save changes. Please try again.");
        }

        setIsEditing(false); // ปิดโหมดแก้ไข
    };

    const handleEditMemberSidebar = (member: Member) => {
        setSelectedMember(member);
        setShowMemberSidebar(true);
    };

    const handleSaveMember = (updatedMember: Member) => {
        setEditedMembers((prev) =>
            prev.map((member) =>
                member.id === updatedMember.id ? updatedMember : member
            )
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 flex justify-end">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20  transition-opacity" onClick={onClose}></div>


            {/* Sidebar */}
            <div className="bg-white w-1/2 sm:w-1/2 rounded-l-3xl h-[calc(100%-4rem)] mt-16 overflow-y-auto p-6 shadow-lg relative">
                {isEditing ? (
                    <>
                        {/* Edit */}
                        <h2 className="text-xl font-bold mb-4">Edit Project</h2>
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            placeholder="Project Name"
                            className="w-full border rounded-lg px-3 py-2 mb-4"
                        />
                        <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            placeholder="Project Description"
                            className="w-full h-32 border rounded-lg px-3 py-2 mb-4"
                        />
                        <input
                            type="date"
                            value={editedDueDate === "LTS" ? "" : editedDueDate}
                            onChange={(e) => setEditedDueDate(e.target.value || "LTS")}
                            className="w-full border rounded-lg px-3 py-2 mb-4"
                        />
                        <h3 className="text-lg font-semibold mb-2">Members</h3>
                        <ul className="mb-4">
                            {editedMembers.map((member) => (
                                <li key={member.id} className="text-gray-700 flex justify-between items-center">
                                    <div>
                                        <p>
                                            {member.name} ({member.email || "No email"}) - Role: {member.role}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditMemberSidebar(member)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-lg mb-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteMember(member)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-lg mb-4"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <input
                            type="text"
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                            placeholder="Member Name"
                            className="w-full border rounded-lg px-3 py-2 mb-2"
                        />
                        <input
                            type="email"
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                            placeholder="Member Email (optional)"
                            className="w-full border rounded-lg px-3 py-2 mb-4"
                        />
                        <button
                            onClick={handleAddMember}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mb-4 mr-4"
                        >
                            Add Member
                        </button>
                        <div className="flex gap-4 mb-4">
                            <button
                                onClick={handleSaveChanges}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg p-10"
                            >
                                {isLoading ? "Saving..." : "Save Changes"}
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="ml-4 bg-red-400 hover:bg-red-300 text-gray-800 px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Not Edit */}
                        <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
                            <h2 className="text-2xl font-bold mb-5 text-gray-900 border-b pb-2">
                                {project.name}
                            </h2>

                            <div className="text-gray-700 whitespace-pre-line mb-6 leading-relaxed">
                                {project.description}
                            </div>

                            <h3 className="text-xl font-semibold mb-3 text-gray-800 border-b pb-1">
                                Members
                            </h3>
                            <ul className="mb-6 mt-3 space-y-2 max-h-48 overflow-auto">
                                {project.members?.map((member) => {
                                    // กำหนดสี role ตามเงื่อนไข
                                    let roleColor = "text-gray-600";
                                    if (member.role === "Admin") roleColor = "text-red-600 font-semibold";
                                    else if (member.role === "StakeHolder") roleColor = "text-yellow-600 font-semibold";

                                    return (
                                        <li
                                            key={member.id}
                                            className="text-gray-700 bg-gray-50 rounded-md px-3 py-2 shadow-sm flex justify-between items-center"
                                        >
                                            <div>
                                                <span className="font-medium">{member.name}</span>{" "}
                                                <span className="text-sm text-gray-500">
                                                    ({member.email || "No email"})
                                                </span>
                                            </div>
                                            <span className={roleColor}>Role: {member.role}</span>
                                        </li>
                                    );
                                })}
                            </ul>

                            <p className="text-gray-700 mb-6 font-medium">
                                Due Date:{" "}
                                <span className="text-blue-600">
                                    {project.projectDueDate === "LTS"
                                        ? "Long Term Support"
                                        : project.projectDueDate}
                                </span>
                            </p>

                            <div className="flex gap-4 justify-end">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition"
                                >
                                    Edit Project
                                </button>
                                <button
                                    onClick={onClose}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-5 py-2 rounded-lg transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </>

                )}
            </div>

            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Success</h2>
                        <p className="text-gray-700 mb-4">Project has been updated successfully.</p>
                        <button
                            onClick={() => {
                                setShowSuccessModal(false);
                                onClose(); // ปิด Sidebar
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <MemberSidebar
                isOpen={showMemberSidebar}
                onClose={() => setShowMemberSidebar(false)}
                member={selectedMember}
                onSave={handleSaveMember}
            />

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                        <p className="text-gray-700 mb-4">
                            Are you sure you want to delete {memberToDelete?.name} ({memberToDelete?.email || "No email"})?
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={confirmDeleteMember}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setMemberToDelete(null);
                                }}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
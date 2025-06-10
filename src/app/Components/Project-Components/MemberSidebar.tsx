import React, { useState, useEffect } from "react";
import { Member } from "@/types/project";

interface MemberSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    member: Member | null;
    onSave: (updatedMember: Member) => void;
}

export default function MemberSidebar({ isOpen, onClose, member, onSave }: MemberSidebarProps) {
    const [editedName, setEditedName] = useState(member?.name || "");
    const [editedEmail, setEditedEmail] = useState(member?.email || "");
    const [editedRole, setEditedRole] = useState(member?.role || "Member");

    useEffect(() => {
        if (member) {
            setEditedName(member.name || "");
            setEditedEmail(member.email || "");
            setEditedRole(member.role || "Member");
        }
    }, [member]);

    const handleSave = () => {
        if (!editedName.trim() || !editedRole.trim()) {
            alert("Name and Role are required.");
            return;
        }

        const updatedMember: Member = {
            ...member!,
            name: editedName,
            email: editedEmail || null,
            role: editedRole as "Admin" | "Member" | "StakeHolder",
        };

        onSave(updatedMember);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={onClose}></div>
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50">
                <h2 className="text-xl font-bold mb-4">Edit Member</h2>
                <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Member Name"
                    className="w-full border rounded-lg px-3 py-2 mb-4"
                />
                <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    placeholder="Member Email (optional)"
                    className="w-full border rounded-lg px-3 py-2 mb-4"
                />
                <select
                    value={editedRole}
                    onChange={(e) => setEditedRole(e.target.value as "Admin" | "Member" | "StakeHolder")}
                    className="w-full border rounded-lg px-3 py-2 mb-4"
                >
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                    <option value="StakeHolder">StakeHolder</option>
                </select>
                <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    Save Changes
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
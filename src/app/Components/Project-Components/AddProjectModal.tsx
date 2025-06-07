import React, { useState } from "react";

interface AddProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, description: string) => void;
}

export default function AddProjectModal({ isOpen, onClose, onCreate }: AddProjectModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = () => {
        onCreate(name, description); // ส่งข้อมูล Description พร้อม line breaks
        setName("");
        setDescription("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-40 flex justify-end">
            {/* Overlay */}
            <div
                className="fixed inset-0  z-30"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div
                className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mt-16  z-40 relative"
            >
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

                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    Create
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
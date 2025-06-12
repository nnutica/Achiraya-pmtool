import React from "react";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    taskTitle: string;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, taskTitle }: DeleteModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6">
                <h2 className="text-xl font-bold mb-4 text-black">Delete Task</h2>
                <p className="text-gray-700 mb-6">
                    Are you sure you want to delete the task{" "}
                    <span className="font-semibold">{taskTitle}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
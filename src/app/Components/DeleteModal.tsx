import React, { useState } from "react";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    taskTitle: string;
    taskStatus: string;
    setShowDetailSidebar: (show: boolean) => void;
}

export default function DeleteModal({
    isOpen,
    onClose,
    onConfirm,
    taskTitle,
    taskStatus,
    setShowDetailSidebar,
}: DeleteModalProps) {
    const [isDeleted, setIsDeleted] = useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6">
                <h2 className="text-xl font-bold mb-4">
                    {isDeleted ? "Task Deleted" : "Delete Task"}
                </h2>
                <p className="text-gray-700 mb-6">
                    {isDeleted
                        ? `The task "${taskTitle}" has been successfully deleted.`
                        : `Are you sure you want to delete the task "${taskTitle}" with status "${taskStatus}"? This action cannot be undone.`}
                </p>
                <div className="flex justify-end gap-4">
                    {!isDeleted ? (
                        <>
                            <button
                                onClick={() => {
                                    onClose();
                                    setShowDetailSidebar(true);
                                }}
                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    await onConfirm(); // ลบ Task ก่อน
                                    setIsDeleted(true); // เปลี่ยนข้อความใน Modal หลังลบสำเร็จ
                                }}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                            >
                                Delete
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
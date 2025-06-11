interface DeleteProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => Promise<void>;
}

export default function DeleteProjectModal({ isOpen, onClose, onDelete }: DeleteProjectModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                <p className="text-gray-700 mb-4">
                    Are you sure you want to delete this project? This action cannot be undone.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={onDelete}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                        Delete
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
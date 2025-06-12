import Link from "next/link";
import { FiGrid, FiFolderPlus } from "react-icons/fi";

interface QuickActionsProps {
    onCreateProject: () => void;
}

export default function QuickActions({ onCreateProject }: QuickActionsProps) {
    return (
        <div className="mt-10 flex gap-4">
            <Link href="/Dashboard">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <FiGrid /> Go to Dashboard
                </button>
            </Link>
            <button
                onClick={onCreateProject}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
                <FiFolderPlus /> Create New Project
            </button>
        </div>
    );
}
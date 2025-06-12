interface EmptyProjectStateProps {
    onCreateProject: () => void;
}

export default function EmptyProjectState({ onCreateProject }: EmptyProjectStateProps) {
    return (
        <div className="bg-blue-100 text-gray-800 p-6 rounded-lg">
            <p className="text-lg">No projects yet. Create your first project to get started!</p>
            <button
                onClick={onCreateProject}
                className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-semibold"
            >
                Create Project →
            </button>
        </div>
    );
}
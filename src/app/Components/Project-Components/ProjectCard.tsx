import React from "react";

interface Member {
    id: string;
    name: string;
}

interface Task {
    id: string;
    title: string;
    completed: boolean;
}

interface ProjectCardProps {
    project: {
        id: string;
        name: string;
        description: string;
        members: Member[];

    };
    onClick: () => void;
    onDetail: () => void;
}

export default function ProjectCard({ project, onClick, onDetail }: ProjectCardProps) {
    return (
        <div
            className="bg-white rounded-lg shadow-md p-4 hover:bg-gray-100 cursor-pointer"
            onClick={onClick}
        >
            <h2 className="text-xl font-bold">{project.name}</h2>
            <div className="text-gray-600 mb-4">
                {project.description.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>
            {/* แสดงจำนวนสมาชิกและ Task */}
            <p className="text-gray-700 mb-2">Members: {project.members.length}</p>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDetail();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
                Detail
            </button>
        </div>
    );
}
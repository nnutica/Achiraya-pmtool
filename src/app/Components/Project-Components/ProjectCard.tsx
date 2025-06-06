import React from "react";

interface ProjectCardProps {
    project: {
        id: string;
        name: string;
        description: string;
    };
    onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
    return (
        <div
            className="bg-white rounded-lg shadow-md p-4 hover:bg-gray-100 cursor-pointer"
            onClick={onClick} // เรียกฟังก์ชัน onClick เมื่อคลิก
        >
            <h2 className="text-xl font-bold">{project.name}</h2>
            <p className="text-gray-600">{project.description}</p>
        </div>
    );
}
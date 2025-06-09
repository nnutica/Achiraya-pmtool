import React from "react";

interface Member {
    id: string;
    name: string;
    role?: "Admin" | "Member" | "StackHolder";
}

interface ProjectCardProps {
    projects: {
        id: string;
        name: string;
        description: string;
        members: Member[];
        createdAt?: string;
        updatedAt?: string;
        userId?: string;
    }[];
    onProjectClick: (projectId: string) => void;
    onProjectDetail: (project: {
        id: string;
        name: string;
        description: string;
        members: Member[];
        createdAt?: string;
        updatedAt?: string;
        userId?: string;
    }) => void;
}

export default function ProjectTable({ projects, onProjectClick, onProjectDetail }: ProjectCardProps) {
    return (
        <div className="min-h-screen  flex items-start justify-center px-4 py-8">
            <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-sky-800 text-gray-300">
                            <th className="border px-6 py-4 text-left text-lg">Project Name</th>
                            <th className="border px-6 py-4 text-left text-lg">Description</th>
                            <th className="border px-6 py-4 text-center text-lg">Members</th>
                            <th className="border px-6 py-4 text-center text-lg">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr
                                key={project.id}
                                className="bg-white hover:bg-blue-100 cursor-pointer transition-colors duration-200"
                                onClick={() => onProjectClick(project.id)}
                            >
                                <td className="border px-6 py-3 font-semibold text-blue-900">{project.name}</td>
                                <td className="border px-6 py-3 whitespace-pre-line text-gray-700">
                                    {project.description
                                        .split("\n")
                                        .slice(0, 5)
                                        .join("\n")}
                                    {project.description.split("\n").length > 5 && " ..."}
                                </td>
                                <td className="border px-6 py-3 text-start text-blue-800 font-medium">
                                    {project.members.length > 0 ? (
                                        <ul className="list-disc pl-5">
                                            {project.members.map((member) => (
                                                <li key={member.id}>
                                                    {member.name} - {member.role || "No role specified"}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="text-gray-500">No members</span>
                                    )}
                                </td>
                                <td className="border px-6 py-3 text-center">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onProjectDetail(project);
                                        }}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                                    >
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

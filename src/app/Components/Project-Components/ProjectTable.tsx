import React from "react";

interface Member {
    id: string;
    name: string;
    role?: "Admin" | "Member" | "StakeHolder";
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
        projectDueDate?: string | "LTS"; // วันที่กำหนดเส้นตายของ Project
        projectStatus?: "New" | "In-progress" | "Success" | "cancelled"; // สถานะของ Project
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
        projectDueDate?: string | "LTS";
        projectStatus?: string
    }) => void;
}

export default function ProjectTable({ projects, onProjectClick, onProjectDetail }: ProjectCardProps) {
    return (
        <div className="min-h-screen  flex items-start justify-center px-4 py-8">
            <div className="w-full max-w-6xl  rounded-b-2xl shadow-lg overflow-hidden">
                <table className="table-auto w-full border-collapse border border-gray-400 rounded-b-2xl">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700 rounded-2xl">
                            <th className="w-2/12 border border-gray-300 p-4 text-left font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-200 ">Project Name</th>
                            <th className="w-2/12 border border-gray-300 p-4 text-left font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-200">Description</th>
                            <th className="w-3/12 border border-gray-300 p-4 text-left font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-200">Members</th>
                            <th className="w-2/12 border border-gray-300 p-4 text-left font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-200">Due Date</th>
                            <th className="w-2/12 border border-gray-300 p-4 text-left font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-200">Status</th>
                            <th className="w-1/12 border border-gray-300 p-4 text-left font-semibold text-gray-900 dark:border-gray-600 dark:text-gray-200">Actions</th>

                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr
                                key={project.id}
                                className="bg-zinc-600 hover:bg-blue-500 cursor-pointer transition-colors duration-200"
                                onClick={() => onProjectClick(project.id)}
                            >
                                <td className="border border-gray-300 p-4 text-cyan-100">{project.name}</td>
                                <td className="border border-gray-300 p-4 text-white ">
                                    {project.description.split("\n").slice(0, 5).map((line, index) => (
                                        <p key={index}>{line}</p>
                                    ))}

                                </td>
                                <td className="border border-gray-300 p-4 text-cyan-100 ">
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
                                <td className="border border-gray-300 p-4 text-cyan-100">
                                    {project.projectDueDate
                                        ? project.projectDueDate === "LTS"
                                            ? "Long Term Support"
                                            : project.projectDueDate
                                        : "LTS"}
                                </td>

                                <td className="border border-gray-300 p-4 text-cyan-100 ">
                                    {project.projectStatus ? (
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold items-center ${project.projectStatus === "New"
                                                ? "bg-blue-500 text-white"
                                                : project.projectStatus === "In-progress"
                                                    ? "bg-yellow-500 text-white"
                                                    : project.projectStatus === "Success"
                                                        ? "bg-green-500 text-white"
                                                        : "bg-red-500 text-white"
                                                }`}
                                        >
                                            {project.projectStatus}
                                        </span>
                                    ) : (
                                        <span className="text-gray-500">No status</span>
                                    )}


                                </td>

                                <td className="border  border-gray-300 px-6 py-3 text-center">
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

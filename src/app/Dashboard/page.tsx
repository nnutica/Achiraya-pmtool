"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchProjects, createProject, Project } from "@/libs/projectService";
import ProjectCard from "@/app/Components/Project-Components/ProjectCard";
import AddProjectModal from "@/app/Components/Project-Components/AddProjectModal";
import { useAuth } from "../Components/AuthProvider";

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const { currentUser } = useAuth(); // ดึงข้อมูล CurrentUser

    useEffect(() => {
        if (!currentUser) return; // หากไม่มี currentUser ให้หยุดการทำงาน

        const loadProjects = async () => {
            const data = await fetchProjects(currentUser.uid); // ดึง Project เฉพาะของ User
            setProjects(data);
        };
        loadProjects();
    }, [currentUser]);

    const handleCreateProject = async (name: string, description: string) => {
        if (!currentUser) return;

        await createProject({ name, description, userId: currentUser.uid }); // เพิ่ม userId ใน Project
        const updatedProjects = await fetchProjects(currentUser.uid);
        setProjects(updatedProjects);
    };

    const handleProjectClick = (projectId: string) => {
        router.push(`/project/${projectId}`); // Redirect ไปหน้า ProjectDetail
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Project Dashboard</h1>
            <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mb-6"
            >
                Add Project
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onClick={() => handleProjectClick(project.id)} // Redirect ไปหน้า ProjectDetail
                    />
                ))}
            </div>
            <AddProjectModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onCreate={handleCreateProject}
            />
        </div>
    );
}
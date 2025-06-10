"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchProjects, createProject, updateProject, Project, Member } from "@/libs/projectService";
import ProjectTable from "../Components/Project-Components/ProjectTable";
import AddProjectModal from "@/app/Components/Project-Components/AddProjectModal";
import ProjectDetailSidebar from "@/app/Components/Project-Components/ProjectDetailSidebar";
import { MdSpaceDashboard } from "react-icons/md";
import { useAuth } from "../Components/AuthProvider";

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const router = useRouter();
    const { currentUser } = useAuth(); // ดึงข้อมูล CurrentUser

    useEffect(() => {
        if (!currentUser) return; // หากไม่มี currentUser ให้หยุดการทำงาน

        const loadProjects = async () => {
            const data = await fetchProjects(currentUser.uid); // ดึง Project เฉพาะของ User
            setProjects(data); // ตรวจสอบว่า data มี members และ tasks
        };
        loadProjects();
    }, [currentUser]);

    const handleCreateProject = async (name: string, description: string, members: Member[], projectDueDate: string) => {
        if (!currentUser) {
            alert("User not logged in.");
            return;
        }

        const newProject: Project = {
            id: crypto.randomUUID(),
            name,
            description,
            members,
            userId: currentUser.uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            projectDueDate, // กำหนดค่าเริ่มต้นให้ projectDueDate เป็น "LTS"
        };

        try {
            await createProject(newProject); // บันทึกโปรเจคลงในฐานข้อมูล
            setProjects((prev) => [...prev, newProject]); // อัปเดต State projects
        } catch (error) {
            console.error("Error creating project:", error);
            alert("Failed to create project. Please try again.");
        }
    };

    const handleProjectClick = (projectId: string) => {
        router.push(`/project/${projectId}`); // Redirect ไปหน้า ProjectDetail
    };

    const handleDetail = (project: Project) => {
        setSelectedProject(project);
        setShowSidebar(true);
    };

    const handleEditProject = async (updatedProject: Project) => {
        try {
            await updateProject(updatedProject); // บันทึกข้อมูลลงในฐานข้อมูล
            setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project.id === updatedProject.id ? updatedProject : project
                )
            ); // อัปเดต State projects
        } catch (error) {
            console.error("Error updating project:", error);
            alert("Failed to update project. Please try again.");
        }
    };

    useEffect(() => {
        console.log(projects); // ตรวจสอบว่า State projects ถูกอัปเดต
    }, [projects]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-white flex items-center gap-2">
                Your {currentUser ? currentUser.displayName : ""}  Project Dashboard <MdSpaceDashboard />
            </h1>
            <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mb-6"
            >
                Add Project
            </button>
            <div className="flex items-start ">
                <div className="w-full max-w-6xl">
                    <ProjectTable
                        projects={projects.map((project) => ({
                            id: project.id,
                            name: project.name,
                            description: project.description,
                            members: project.members ?? [], // กำหนดค่าเริ่มต้นให้ members เป็น []
                            createdAt: project.createdAt,  // ส่ง createdAt
                            updatedAt: project.updatedAt,  // ส่ง updatedAt
                            userId: project.userId,
                            projectDueDate: project.projectDueDate       // ส่ง DueDate มาด้วย
                        }))}
                        onProjectClick={handleProjectClick}
                        onProjectDetail={(project) => handleDetail(project as Project)}
                    />
                </div>
            </div>
            <AddProjectModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onCreate={handleCreateProject}
            />
            <ProjectDetailSidebar
                isOpen={showSidebar}
                onClose={() => setShowSidebar(false)}
                project={selectedProject!}
                onEdit={handleEditProject} // ส่งฟังก์ชันแก้ไข
            />
        </div>
    );
}
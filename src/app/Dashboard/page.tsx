"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { fetchProjects, createProject, updateProject, Project, Member } from "@/libs/projectService";
import ProjectTable from "../Components/Project-Components/ProjectTable";
import ProjectFilter from "../Components/Project-Components/ProjectFilter";
import AddProjectModal from "@/app/Components/Project-Components/AddProjectModal";
import ProjectDetailSidebar from "@/app/Components/Project-Components/ProjectDetailSidebar";
import { MdSpaceDashboard } from "react-icons/md";
import { useAuth } from "../Components/AuthProvider";
import { ProjectStatus } from "@/types/project";

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<ProjectStatus | "All">("All");

    const router = useRouter();
    const { currentUser } = useAuth();

    useEffect(() => {
        if (!currentUser) return;
        loadProjects();
    }, [currentUser]);

    const loadProjects = async () => {
        if (!currentUser) return;
        try {
            const data = await fetchProjects(currentUser.uid);
            setProjects(data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    // Real-time filtering with useMemo
    const filteredProjects = useMemo(() => {
        let filtered = [...projects];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(project =>
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.members?.some(member =>
                    member.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        // Status filter
        if (statusFilter !== "All") {
            filtered = filtered.filter(project => project.projectStatus === statusFilter);
        }

        return filtered;
    }, [projects, searchTerm, statusFilter]);

    const handleCreateProject = async (name: string, description: string, members: Member[], projectDueDate: string, projectStatus: ProjectStatus) => {
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
            projectDueDate,
            projectStatus
        };

        try {
            await createProject(newProject);
            setProjects((prev) => [...prev, newProject]);
        } catch (error) {
            console.error("Error creating project:", error);
            alert("Failed to create project. Please try again.");
        }
    };

    const handleProjectClick = (projectId: string) => {
        router.push(`/project/${projectId}`);
    };

    const handleDetail = (project: Project) => {
        setSelectedProject(project);
        setShowSidebar(true);
    };

    const handleEditProject = async (updatedProject: Project) => {
        try {
            await updateProject(updatedProject);
            setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project.id === updatedProject.id ? updatedProject : project
                )
            );
        } catch (error) {
            console.error("Error updating project:", error);
            alert("Failed to update project. Please try again.");
        }
    };

    // Filter handlers
    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
    };

    const handleStatusFilter = (status: ProjectStatus | "All") => {
        setStatusFilter(status);
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('openModal') === 'true') {
            setShowModal(true);
            window.history.replaceState({}, '', '/Dashboard');
        }
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-white flex items-center gap-2">
                Your {currentUser ? currentUser.displayName : ""} Project Dashboard <MdSpaceDashboard />
            </h1>

            <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mb-6"
            >
                Add Project
            </button>

            {/* Compact Project Filter */}
            <ProjectFilter
                onSearchChange={handleSearchChange}
                onStatusFilter={handleStatusFilter}
                onClearFilters={handleClearFilters}
                totalProjects={projects.length}
                filteredCount={filteredProjects.length}
            />

            <div className="flex items-start">
                <div className="w-full max-w-6xl">
                    <ProjectTable
                        projects={filteredProjects.map((project) => ({
                            id: project.id,
                            name: project.name,
                            description: project.description,
                            members: project.members ?? [],
                            createdAt: project.createdAt,
                            updatedAt: project.updatedAt,
                            userId: project.userId,
                            projectDueDate: project.projectDueDate,
                            projectStatus: project.projectStatus
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
                onEdit={handleEditProject}
                onDeleteSuccess={loadProjects}
            />
        </div>
    );
}
import Link from "next/link";
import { Project } from "@/libs/projectService";
import ProjectCard from "./ProjectCard";
import EmptyProjectState from "./EmptyProjectState";

interface RecentProjectsSectionProps {
    projects: Project[];
    recentProjects: Project[];
    onCreateProject: () => void;
}

export default function RecentProjectsSection({
    projects,
    recentProjects,
    onCreateProject
}: RecentProjectsSectionProps) {
    return (
        <div className="mt-10">
            <h2 className="text-2xl font-bold text-white mb-4">Recent Projects</h2>
            {projects.length === 0 ? (
                <EmptyProjectState onCreateProject={onCreateProject} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}

            {projects.length > 5 && (
                <div className="mt-4 text-center">
                    <Link href="/Dashboard" className="text-blue-300 hover:text-blue-100 font-semibold">
                        View all projects ({projects.length}) →
                    </Link>
                </div>
            )}
        </div>
    );
}
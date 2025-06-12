import { useState, useEffect } from "react";
import { fetchProjects, Project } from "@/libs/projectService";

interface ProjectStats {
    total: number;
    ongoing: number;
    completed: number;
    overdue: number;
    lts: number;
    cancelled: number;
}

export function useProjects(userId: string | null) {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectStats, setProjectStats] = useState<ProjectStats>({
        total: 0,
        ongoing: 0,
        completed: 0,
        overdue: 0,
        lts: 0,
        cancelled: 0
    });

    const calculateProjectStats = (projects: Project[]): ProjectStats => {
        const total = projects.length;
        const ongoing = projects.filter(p => p.projectStatus === 'In-progress').length;
        const completed = projects.filter(p => p.projectStatus === 'Success').length;
        const lts = projects.filter(p => p.projectStatus === 'LTS').length;
        const cancelled = projects.filter(p => p.projectStatus === 'cancelled').length;

        const now = new Date();
        const overdue = projects.filter(p => {
            if (p.projectStatus === 'Lated') return true;
            if (p.projectDueDate && p.projectDueDate !== 'LTS' && p.projectStatus !== 'Success') {
                const dueDate = new Date(p.projectDueDate);
                return dueDate < now;
            }
            return false;
        }).length;

        return { total, ongoing, completed, overdue, lts, cancelled };
    };

    const getRecentProjects = () => {
        return projects
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 5);
    };

    const loadUserData = async () => {
        if (!userId) return;

        try {
            setLoading(true);
            const userProjects = await fetchProjects(userId);
            setProjects(userProjects);
            const stats = calculateProjectStats(userProjects);
            setProjectStats(stats);
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            loadUserData();
        }
    }, [userId]);

    return {
        loading,
        projects,
        projectStats,
        getRecentProjects,
        refetch: loadUserData
    };
}
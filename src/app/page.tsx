"use client";

import { useEffect } from "react";
import { useAuth } from "./Components/AuthProvider";
import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/useProjects";
import ProjectStatsSection from "./Components/Main-Components/ProjectStatsSection";
import QuickActions from "./Components/Main-Components/QuickActions";
import RecentProjectsSection from "./Components/Main-Components/RecentProjectsSection";

export default function Home() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { loading, projects, projectStats, getRecentProjects } = useProjects(currentUser?.uid || null);

  useEffect(() => {
    if (currentUser === undefined) return;
    if (currentUser === null) {
      router.push("/login");
      return;
    }
  }, [currentUser, router]);

  const handleCreateProject = () => {
    router.push("/Dashboard?openModal=true");
  };

  if (loading || currentUser === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-4">
        Welcome, {currentUser!.displayName || currentUser!.email}!
      </h1>

      <ProjectStatsSection stats={projectStats} />
      <QuickActions onCreateProject={handleCreateProject} />
      <RecentProjectsSection
        projects={projects}
        recentProjects={getRecentProjects()}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}

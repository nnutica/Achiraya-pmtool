"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./Components/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiGrid, FiFolderPlus, FiFolder } from "react-icons/fi";
import { fetchProjects, Project } from "@/libs/projectService";

export default function Home() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectStats, setProjectStats] = useState({
    total: 0,
    ongoing: 0,
    completed: 0,
    overdue: 0,
    lts: 0,
    cancelled: 0
  });

  useEffect(() => {
    if (currentUser === undefined) {
      setLoading(true);
      return;
    }

    if (currentUser === null) {
      router.push("/login");
      return;
    }

    if (currentUser) {
      loadUserData();
    }
  }, [currentUser, router]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userProjects = await fetchProjects(currentUser!.uid);
      setProjects(userProjects);

      // คำนวณสถิติโปรเจค
      const stats = calculateProjectStats(userProjects);
      setProjectStats(stats);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProjectStats = (projects: Project[]) => {
    const total = projects.length;
    const ongoing = projects.filter(p => p.projectStatus === 'In-progress').length;
    const completed = projects.filter(p => p.projectStatus === 'Success').length;
    const lts = projects.filter(p => p.projectStatus === 'LTS').length;
    const cancelled = projects.filter(p => p.projectStatus === 'cancelled').length;

    // คำนวณโปรเจคที่เกินกำหนด - นับทั้ง "Lated" status และโปรเจคที่เลยวันหมดเขต
    const now = new Date();
    const overdue = projects.filter(p => {
      // ถ้ามี status เป็น "Lated" แล้ว
      if (p.projectStatus === 'Lated') return true;

      // หรือถ้าเลยวันกำหนดแล้วและยังไม่เสร็จ
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

  const handleCreateProject = () => {
    // ไปหน้า Dashboard พร้อมเปิด Modal
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 2xl:grid-cols-6 gap-4 mt-6">
        <SummaryCard title="Total Projects" value={projectStats.total.toString()} />
        <SummaryCard title="Ongoing Projects" value={projectStats.ongoing.toString()} />
        <SummaryCard title="Completed Projects" value={projectStats.completed.toString()} />
        <SummaryCard title="Overdue Projects" value={projectStats.overdue.toString()} color="red" />
        <SummaryCard title="LTS Projects" value={projectStats.lts.toString()} color="green" />
        <SummaryCard title="Cancelled Projects" value={projectStats.cancelled.toString()} color="darkred" />
      </div>

      {/* ปุ่มลัด */}
      <div className="mt-10 flex gap-4">
        <Link href="/Dashboard">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <FiGrid /> Go to Dashboard
          </button>
        </Link>
        <button
          onClick={handleCreateProject}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <FiFolderPlus /> Create New Project
        </button>
      </div>

      {/* Recent Projects */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-white mb-4">Recent Projects</h2>
        {projects.length === 0 ? (
          <div className="bg-blue-100 text-gray-800 p-6 rounded-lg">
            <p className="text-lg">No projects yet. Create your first project to get started!</p>
            <button
              onClick={handleCreateProject}
              className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-semibold"
            >
              Create Project →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getRecentProjects().map((project) => (
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
    </div>
  );
}

// 📦 การ์ดย่อย
function SummaryCard({ title, value, color = "blue" }: { title: string; value: string; color?: string }) {
  const getCardColors = (color: string) => {
    switch (color) {
      case "red":
        return { bg: "bg-red-100", text: "text-red-800" };
      case "green":
        return { bg: "bg-green-100", text: "text-green-800" };
      case "darkred":
        return { bg: "bg-red-300", text: "text-red-900" };
      default:
        return { bg: "bg-blue-100", text: "text-gray-800" };
    }
  };

  const colors = getCardColors(color);

  return (
    <div className={`${colors.bg} ${colors.text} p-4 rounded-lg shadow-md`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

// การ์ดโปรเจค
function ProjectCard({ project }: { project: Project }) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Success': return 'bg-green-500';
      case 'In-progress': return 'bg-blue-500';
      case 'On Hold': return 'bg-yellow-500';
      case 'New': return 'bg-gray-500';
      case 'cancelled': return 'bg-gray-700';
      case 'LTS': return 'bg-purple-500';
      case 'Lated': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getCardBorderColor = (status?: string) => {
    switch (status) {
      case 'Success': return 'border-l-green-500';
      case 'In-progress': return 'border-l-blue-500';
      case 'On Hold': return 'border-l-yellow-500';
      case 'New': return 'border-l-gray-500';
      case 'cancelled': return 'border-l-gray-700';
      case 'LTS': return 'border-l-purple-500';
      case 'Lated': return 'border-l-red-600';
      default: return 'border-l-gray-500';
    }
  };

  const getCardBackgroundColor = (isOverdue: boolean, status?: string) => {
    if (isOverdue || status === 'Lated') {
      return 'bg-red-50 hover:bg-red-100';
    }
    switch (status) {
      case 'Success': return 'bg-green-50 hover:bg-green-100';
      case 'In-progress': return 'bg-blue-50 hover:bg-blue-100';
      case 'On Hold': return 'bg-yellow-50 hover:bg-yellow-100';
      case 'New': return 'bg-gray-50 hover:bg-gray-100';
      case 'cancelled': return 'bg-gray-100 hover:bg-gray-200';
      case 'LTS': return 'bg-purple-50 hover:bg-purple-100';
      default: return 'bg-white hover:bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH');
  };

  const isOverdue = () => {
    // ถ้ามี status เป็น "Lated" แล้ว
    if (project.projectStatus === 'Lated') return true;

    // หรือถ้าเลยวันกำหนดแล้วและยังไม่เสร็จ
    if (project.projectDueDate && project.projectDueDate !== 'LTS' && project.projectStatus !== 'Success') {
      return new Date(project.projectDueDate) < new Date();
    }
    return false;
  };

  const overdueStatus = isOverdue();

  return (
    <Link href={`/project/${project.id}`} className="block">
      <div className={`${getCardBackgroundColor(overdueStatus, project.projectStatus)} p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 ${getCardBorderColor(project.projectStatus)}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <FiFolder className={`${project.projectStatus === 'Success' ? 'text-green-600' :
              project.projectStatus === 'In-progress' ? 'text-blue-600' :
                project.projectStatus === 'On Hold' ? 'text-yellow-600' :
                  project.projectStatus === 'cancelled' ? 'text-gray-600' :
                    project.projectStatus === 'LTS' ? 'text-purple-600' :
                      project.projectStatus === 'Lated' || overdueStatus ? 'text-red-600' :
                        'text-blue-600'
              }`} />
            <h3 className={`font-semibold truncate ${project.projectStatus === 'cancelled' ? 'text-gray-600 line-through' :
              overdueStatus || project.projectStatus === 'Lated' ? 'text-red-800' :
                'text-gray-800'
              }`}>
              {project.name}
              {overdueStatus && project.projectStatus !== 'Lated' && (
                <span className="ml-2 text-xs font-normal text-red-600">(Overdue)</span>
              )}
            </h3>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full text-white ${getStatusColor(project.projectStatus)}`}>
            {project.projectStatus || 'No Status'}
          </span>
        </div>

        <p className={`text-sm mb-3 line-clamp-2 ${project.projectStatus === 'cancelled' ? 'text-gray-500 line-through' :
          overdueStatus || project.projectStatus === 'Lated' ? 'text-red-700' :
            'text-gray-600'
          }`}>
          {project.description || 'No description'}
        </p>

        <div className="flex justify-between items-center text-xs">
          <span className={`${project.projectStatus === 'cancelled' ? 'text-gray-400' :
            overdueStatus || project.projectStatus === 'Lated' ? 'text-red-600' :
              'text-gray-500'
            }`}>
            Updated: {formatDate(project.updatedAt)}
          </span>
          {project.projectDueDate && project.projectDueDate !== 'LTS' && (
            <span className={`font-semibold ${overdueStatus || project.projectStatus === 'Lated' ? 'text-red-700 animate-pulse' :
              'text-gray-600'
              }`}>
              Due: {formatDate(project.projectDueDate)}
              {overdueStatus && (
                <span className="ml-1 text-red-600">⚠️</span>
              )}
            </span>
          )}
        </div>

        {project.members && project.members.length > 0 && (
          <div className={`mt-2 text-xs ${project.projectStatus === 'cancelled' ? 'text-gray-400' :
            overdueStatus || project.projectStatus === 'Lated' ? 'text-red-600' :
              'text-gray-500'
            }`}>
            {project.members.length} member{project.members.length > 1 ? 's' : ''}
          </div>
        )}

        {/* Progress indicator */}
        {project.projectStatus === 'In-progress' && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="bg-blue-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

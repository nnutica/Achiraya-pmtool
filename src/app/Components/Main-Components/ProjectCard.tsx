import Link from "next/link";
import { FiFolder } from "react-icons/fi";
import { Project } from "@/libs/projectService";

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
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
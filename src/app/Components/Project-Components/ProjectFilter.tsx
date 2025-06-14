import { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import { ProjectStatus } from "@/types/project";

interface ProjectFilterProps {
    onSearchChange: (searchTerm: string) => void;
    onStatusFilter: (status: ProjectStatus | "All") => void;
    onClearFilters: () => void;
    totalProjects: number;
    filteredCount: number;
}

export default function ProjectFilter({
    onSearchChange,
    onStatusFilter,
    onClearFilters,
    totalProjects,
    filteredCount
}: ProjectFilterProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | "All">("All");
    const [showFilters, setShowFilters] = useState(false);

    // Real-time search
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            onSearchChange(searchTerm);
        }, 300); // Debounce 300ms

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, onSearchChange]);

    // Status filter
    useEffect(() => {
        onStatusFilter(selectedStatus);
    }, [selectedStatus, onStatusFilter]);

    const handleClearAll = () => {
        setSearchTerm("");
        setSelectedStatus("All");
        onClearFilters();
    };

    const statusOptions: (ProjectStatus | "All")[] = [
        "All",
        "New",
        "In-progress",
        "On Hold",
        "Success",
        "cancelled",
        "LTS",
        "Lated"
    ];

    const getStatusColor = (status: ProjectStatus | "All") => {
        switch (status) {
            case "All": return "bg-gray-500";
            case "New": return "bg-blue-500";
            case "In-progress": return "bg-yellow-500";
            case "On Hold": return "bg-orange-400";
            case "Success": return "bg-green-500";
            case "cancelled": return "bg-red-500";
            case "LTS": return "bg-lime-400";
            case "Lated": return "bg-red-600";
            default: return "bg-gray-500";
        }
    };

    const hasActiveFilters = searchTerm || selectedStatus !== "All";

    return (
        <div className="mb-4">
            {/* Compact Filter Toggle Button */}
            <div className="flex items-center gap-3 mb-3">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${showFilters || hasActiveFilters
                            ? "bg-sky-500 text-white shadow-md"
                            : "bg-white hover:bg-gray-400 text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                >
                    <FiFilter size={16} />
                    Filter Projects
                    {hasActiveFilters && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {filteredCount}
                        </span>
                    )}
                </button>

                <span className="text-sm text-gray-500">
                    {filteredCount} of {totalProjects} projects
                </span>

                {hasActiveFilters && (
                    <button
                        onClick={handleClearAll}
                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                        <FiX size={14} />
                        Clear
                    </button>
                )}
            </div>

            {/* Expandable Filter Panel */}
            {showFilters && (
                <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 w-1/2">
                    {/* Search Input */}
                    <div className="mb-4">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <FiX size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Status Pills */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Status:</label>
                        <div className="flex flex-wrap gap-2">
                            {statusOptions.map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setSelectedStatus(status)}
                                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${selectedStatus === status
                                            ? `${getStatusColor(status)} text-white shadow-md`
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    {status === "All" ? "All" : status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Filters Summary */}
                    {hasActiveFilters && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium text-gray-700">Active:</span>
                                {searchTerm && (
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                        "{searchTerm}"
                                    </span>
                                )}
                                {selectedStatus !== "All" && (
                                    <span className={`px-2 py-1 rounded text-white text-xs ${getStatusColor(selectedStatus)}`}>
                                        {selectedStatus}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
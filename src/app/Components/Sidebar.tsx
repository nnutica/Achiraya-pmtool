"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { FiSidebar, FiLogOut, FiHome, FiGrid, FiFolder } from "react-icons/fi";
import { fetchProjects, Project } from "@/libs/projectService";




export default function Sidebar() {
    const { currentUser, signOut } = useAuth();
    const [isHovering, setIsHovering] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const sidebarIsVisible = isHovering;

    // ดึงข้อมูลโปรเจค
    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const loadProjects = async () => {
            try {
                setLoading(true);
                const userProjects = await fetchProjects(currentUser.uid);
                setProjects(userProjects);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, [currentUser]);

    // ย้าย early return มาหลังจาก hooks
    if (!currentUser) return null;

    return (
        <>
            {/* Sidebar */}
            <aside
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className={`fixed top-0 left-0 h-screen bg-blue-300 shadow-lg z-40 flex flex-col justify-between transition-all duration-500 ease-in-out overflow-hidden
          ${sidebarIsVisible ? "w-64" : "w-16"}
        `}
            >
                {/* ส่วนบน: โลโก้ + ปุ่มปิด (เอาออก) + เมนู */}
                <div className="flex flex-col h-full">
                    <div className="p-6 flex items-center justify-start h-fit mt-4">
                        <div className={`transition-all duration-500 ease-in-out ${sidebarIsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            {sidebarIsVisible ? (
                                <Link href="/" className="text-2xl font-bold text-gray-800 whitespace-nowrap">
                                    Achiraya Tool
                                </Link>
                            ) : null}
                            <hr className="my-4 border-black" />
                        </div>

                        <div className={`transition-all duration-500 ease-in-out ${!sidebarIsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'}`}>
                            {!sidebarIsVisible && (
                                <div className="flex justify-center items-center w-6 h-6 text-gray-800 mx-auto">
                                    <FiSidebar className="w-6 h-6" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* เมนูลิงก์ */}
                    <nav className="flex flex-col px-2 space-y-2 flex-1 overflow-y-auto">
                        <div className={`transition-all duration-500 ease-in-out ${sidebarIsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                            {sidebarIsVisible && (
                                <p className="mt-2 px-3 text-gray-700 font-semibold whitespace-nowrap text-xl">
                                    Welcome, {currentUser.displayName || "User"}
                                </p>
                            )}
                        </div>

                        <Link
                            href="/"
                            className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-400 transition-all duration-300
                ${!sidebarIsVisible ? "justify-center" : ""}
              `}
                        >
                            <FiHome className="w-6 h-6 text-gray-800 flex-shrink-0" />
                            <span className={`transition-all duration-500 ease-in-out ${sidebarIsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} whitespace-nowrap`}>
                                {sidebarIsVisible && "Home"}
                            </span>
                        </Link>

                        <Link
                            href="/Dashboard"
                            className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-400 transition-all duration-300
                ${!sidebarIsVisible ? "justify-center" : ""}
              `}
                        >
                            <FiGrid className="w-6 h-6 text-gray-800 flex-shrink-0" />
                            <span className={`transition-all duration-500 ease-in-out ${sidebarIsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} whitespace-nowrap`}>
                                {sidebarIsVisible && "Dashboard"}
                            </span>
                        </Link>

                        {/* Quick Access Projects Section */}
                        <div className="mt-4">
                            <div className={`transition-all duration-500 ease-in-out ${sidebarIsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                {sidebarIsVisible && (
                                    <p className="px-3 text-gray-600 font-medium text-sm uppercase tracking-wide">
                                        Quick Access
                                    </p>
                                )}
                            </div>

                            <div className="mt-2 space-y-1">
                                {loading ? (
                                    <div className={`transition-all duration-500 ease-in-out ${sidebarIsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                        {sidebarIsVisible && (
                                            <div className="px-3 py-2 text-gray-500 text-sm">
                                                Loading projects...
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    projects.slice(0, 5).map((project) => (
                                        <Link
                                            key={project.id}
                                            href={`/project/${project.id}`}
                                            className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-400 transition-all duration-300
                                                ${!sidebarIsVisible ? "justify-center" : ""}
                                            `}
                                        >
                                            <FiFolder className="w-5 h-5 text-gray-700 flex-shrink-0" />
                                            <span className={`transition-all duration-500 ease-in-out ${sidebarIsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} whitespace-nowrap text-sm truncate`}>
                                                {sidebarIsVisible && project.name}
                                            </span>
                                        </Link>
                                    ))
                                )}

                                {/* Show more projects link */}
                                {projects.length > 5 && (
                                    <Link
                                        href="/Dashboard"
                                        className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-400 transition-all duration-300 text-gray-600
                                            ${!sidebarIsVisible ? "justify-center" : ""}
                                        `}
                                    >
                                        <FiGrid className="w-5 h-5 flex-shrink-0" />
                                        <span className={`transition-all duration-500 ease-in-out ${sidebarIsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} whitespace-nowrap text-sm`}>
                                            {sidebarIsVisible && `View all (${projects.length})`}
                                        </span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </nav>
                </div>

                {/* ปุ่ม Sign Out */}
                <div className="px-4 py-6 border-t border-blue-400">
                    <button
                        onClick={() => signOut()}
                        className={`flex items-center w-full rounded-md transition-all duration-500 ease-in-out
            ${sidebarIsVisible
                                ? "gap-3 bg-red-600 text-white hover:bg-red-700 px-3 py-2"
                                : "justify-center text-red-600 hover:bg-red-100 px-1 py-1"}
        `}
                        aria-label="Sign Out"
                    >
                        <FiLogOut className={`flex-shrink-0 transition-all duration-500 ease-in-out ${sidebarIsVisible ? "w-6 h-6 text-white" : "w-6 h-6 text-red-600"}`} />
                        <span className={`transition-all duration-500 ease-in-out ${sidebarIsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} whitespace-nowrap`}>
                            {sidebarIsVisible && "Sign Out"}
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
}
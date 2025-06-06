"use client";

import Link from "next/link";


export default function Navbar() {
    return (
        <nav className="bg-blue-300 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold text-gray-800">
                            Achiraya Tool
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="text-gray-600 hover:text-gray-900">
                            Home
                        </Link>
                        <Link href="/Dashboard" className="text-gray-600 hover:text-gray-900">
                            Dashboard
                        </Link>

                    </div>
                </div>
            </div>
        </nav>
    );
}
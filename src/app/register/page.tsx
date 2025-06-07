"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/libs/authService";

export default function register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createUser(email, password, displayName);
            router.push("/login"); // Redirect ไปหน้า Login หลังสมัครสำเร็จ
        } catch (err) {
            setError("Failed to register. Please try again.");
        }
    };

    return (
        <div className="flex h-screen bg-sky-300">
            <div className="bg-blue-600 flex-[6] p-8 sm:p-20 md:p-32 lg:p-36 w-full">
                <div className="bg-white rounded-4xl p-8 sm:p-12 md:p-16 lg:p-20 shadow-lg">
                    <h1 className="text-2xl font-bold mb-4">Register</h1>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleRegister}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                            Register
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">Oh you have account?</p>
                        <button
                            onClick={() => router.push("/login")}
                            className="text-blue-600 hover:underline"
                        >
                            Sign in
                        </button>
                    </div>
                </div>
            </div>
            <div className="hidden lg:block relative flex-[6] rounded-4xl">
                <img
                    src="/achirayatn.png"
                    alt="thumbnail page"
                    className="w-full h-full object-scale-fill rounded-4xl"
                />

            </div>
        </div>
    );
}
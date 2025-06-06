"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/libs/authService";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            router.push("/"); // Redirect ไปหน้าแรกเมื่อเข้าสู่ระบบสำเร็จ
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="flex h-screen bg-sky-300">
            <div className="hidden lg:block relative flex-[6] rounded-4xl">
                <Image
                    src="/achiraya.png"
                    alt="thumbnail page"
                    fill
                    style={{
                        objectFit: "fill",
                        borderRadius: "1.5rem",
                    }}
                />
            </div>
            <div className="bg-sky-300 flex-[6] p-8 sm:p-20 md:p-32 lg:p-36 w-full">
                <div className="bg-white rounded-4xl p-8 sm:p-12 md:p-16 lg:p-20 shadow-lg">
                    <h1 className="text-2xl font-bold mb-4">Login</h1>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleLogin}>
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
                            Login
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">Don't have an account?</p>
                        <button
                            onClick={() => router.push("/register")}
                            className="text-blue-600 hover:underline"
                        >
                            Go to Register
                        </button>
                    </div>



                </div>

            </div>
        </div >
    );
}
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Auth } from "@/libs/firebase";
import { logout } from "@/libs/authService";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation"; // ใช้ useRouter จาก Next.js

interface AuthContextType {
    currentUser: User | null;
    signOut: () => Promise<void>; // เพิ่ม signOut
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const router = useRouter(); // เรียกใช้ router

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(Auth, (user) => {
            if (!user) {
                logout(); // เรียก logout จาก authService
                router.push("/login"); // เปลี่ยนไปหน้า login
            }
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, [router]); // เพิ่ม router ใน dependency array

    const signOut = async () => {
        await logout(); // เรียกใช้ logout จาก authService
        setCurrentUser(null); // ล้าง currentUser หลังออกจากระบบ
        router.push("/login"); // เปลี่ยนไปหน้า login หลังออกจากระบบ
    };

    return (
        <AuthContext.Provider value={{ currentUser, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
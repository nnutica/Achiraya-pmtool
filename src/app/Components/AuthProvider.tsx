"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Auth } from "@/libs/firebase";
import { logout } from "@/libs/authService";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
    currentUser: User | null | undefined; // เพิ่ม undefined สำหรับ loading state
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null | undefined>(undefined); // เริ่มต้นด้วย undefined
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(Auth, (user) => {
            setCurrentUser(user); // set user ทันที (null หรือ User object)

            // ถ้าไม่มี user และไม่ใช่ loading state แรก แสดงว่า logout จริงๆ
            // แต่เราจะไม่ redirect ที่นี่ เพราะแต่ละหน้าจะจัดการเอง
        });

        return () => unsubscribe();
    }, [router]);

    const signOut = async () => {
        try {
            await logout(); // เรียกใช้ logout จาก authService
            setCurrentUser(null); // ล้าง currentUser หลังออกจากระบบ
            router.push("/login"); // เปลี่ยนไปหน้า login หลังออกจากระบบ
        } catch (error) {
            console.error("Error signing out:", error);
        }
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
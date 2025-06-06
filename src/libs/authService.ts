import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { Auth } from "./firebase";

export const login = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(Auth, email, password);
        return userCredential.user;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error(String(error));
        }
    }
};

export const createUser = async (email: string, password: string, displayName: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(Auth, email, password);
        const user = userCredential.user;

        // อัปเดตชื่อผู้ใช้
        await updateProfile(user, { displayName });

        return user;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error(String(error));
        }
    }
};

export const logout = async () => {
    try {
        await signOut(Auth);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error(String(error));
        }
    }
};

import { db } from "./firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy } from "firebase/firestore";

export interface Project {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
}

const projectsCollection = collection(db, "projects");

export const fetchProjects = async (userId: string): Promise<Project[]> => {
    const q = query(
        projectsCollection,
        where("userId", "==", userId), // กรอง Project ตาม userId
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Project[];
};

export const createProject = async (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const projectWithMeta = {
        ...project,
        createdAt: now,
        updatedAt: now,
    };
    const docRef = await addDoc(collection(db, "projects"), projectWithMeta);
    return docRef;
};

export const updateProject = async (id: string, updates: Partial<Project>) => {
    const updatesWithMeta = {
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    return await updateDoc(doc(db, "projects", id), updatesWithMeta);
};

export const deleteProject = async (id: string) => {
    return await deleteDoc(doc(db, "projects", id));
};
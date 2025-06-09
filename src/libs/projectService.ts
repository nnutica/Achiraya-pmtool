import { Member } from "@/types/project";
import { db } from "./firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy, getDoc, setDoc } from "firebase/firestore";

export interface Project {
    id: string;
    name: string;
    description: string;
    members?: Member[];
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

export const createProject = async (project: Project) => {
    const projectRef = doc(collection(db, "projects"), project.id); // ใช้ project.id เป็น Document ID
    await setDoc(projectRef, project); // บันทึกเอกสารลงใน Firestore
};

export const updateProject = async (project: Project) => {
    const projectRef = doc(db, "projects", project.id);
    await updateDoc(projectRef, {
        name: project.name,
        description: project.description,
        members: project.members,
        updatedAt: new Date().toISOString(),
    });
};

export const deleteProject = async (id: string) => {
    return await deleteDoc(doc(db, "projects", id));
};

export const fetchProjectById = async (projectId: string): Promise<Project | null> => {
    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
        return null; // หากไม่มีโปรเจค ให้คืนค่า null
    }

    return { id: projectSnap.id, ...projectSnap.data() } as Project;
};

export const addMemberToProject = async (projectId: string, member: Omit<Member, "joinedAt">) => {
    const now = new Date().toISOString();
    const memberWithMeta = {
        ...member,
        joinedAt: now,
    };

    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
        throw new Error(`Project with ID ${projectId} not found.`);
    }

    const existingMembers = projectSnap.data().members || [];
    const updatedMembers = [...existingMembers, memberWithMeta];

    await updateDoc(projectRef, { members: updatedMembers });
    return memberWithMeta;
};

export const removeMemberFromProject = async (projectId: string, memberId: string) => {
    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
        throw new Error(`Project with ID ${projectId} not found.`);
    }

    const existingMembers = projectSnap.data().members || [];
    const updatedMembers = existingMembers.filter((member: Member) => member.id !== memberId);

    await updateDoc(projectRef, { members: updatedMembers });
};

export const fetchMembersByProjectId = async (projectId: string): Promise<Member[]> => {
    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
        throw new Error(`Project with ID ${projectId} not found.`);
    }

    const members = projectSnap.data().members || [];
    return members as Member[];
}

export type { Member };

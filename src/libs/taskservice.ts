import { db } from "./firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy, QueryConstraint } from "firebase/firestore";
import { Task, TaskPriority, Taskstatus } from "../types/task";

const tasksCollection = collection(db, "tasks");

export const fetchTasks = async (): Promise<Task[]> => {
    const q = query(tasksCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })) as Task[];
};

export const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString(); // เปลี่ยนเป็น ISO string
    const taskWithMeta = {
        ...task,
        createdAt: now,
        updatedAt: now,
        comments: task.comments ?? [],
    };
    const docRef = await addDoc(tasksCollection, taskWithMeta);
    return docRef;
};

export const updateTask = async (id: string, updates: Partial<Task>) => {
    // ถ้ามีการอัปเดต ให้อัปเดต updatedAt ด้วย
    const updatesWithMeta = {
        ...updates,
        updatedAt: new Date().toISOString(), // เปลี่ยนเป็น ISO string
    };
    return await updateDoc(doc(db, "tasks", id), updatesWithMeta);
};

export const deleteTask = async (id: string) => {
    return await deleteDoc(doc(db, "tasks", id));
}

export const addComment = async (
    taskId: string,
    comment: {
        id: string;
        author: string;
        message: string;
        createdAt: string; // เปลี่ยนเป็น string
    }
) => {
    const taskDoc = doc(db, "tasks", taskId);
    const { arrayUnion, updateDoc } = await import("firebase/firestore");
    return await updateDoc(taskDoc, {
        comments: arrayUnion(comment),
        updatedAt: new Date().toISOString(), // เปลี่ยนเป็น ISO string
    });
};


export const fetchTasksByStatus = async (status: Taskstatus): Promise<Task[]> => {
    const stasksCollection = collection(db, "tasks");
    const q = query(tasksCollection, where("status", "==", status), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const tasks: Task[] = [];
    snapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...(doc.data() as Omit<Task, "id">) });

    });
    return tasks;
};

export const fetchTasksByPriority = async (priority: TaskPriority): Promise<Task[]> => {
    const tasksCollection = collection(db, "tasks");
    const q = query(tasksCollection, where("priority", "==", priority), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const tasks: Task[] = [];
    snapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...(doc.data() as Omit<Task, "id">) });
    });
    return tasks;
};

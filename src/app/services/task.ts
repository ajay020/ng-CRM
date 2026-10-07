import { Injectable, signal } from '@angular/core';
import { Task } from '../models/task';
import { db } from '../firebase';

import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks = signal<Task[]>([]);

  async loadTasks() {
    const snapshot = await getDocs(collection(db, 'tasks'));

    const tasks: Task[] = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        title: data['title'],
        description: data['description'],
        assignedTo: data['assignedTo'],
        status: data['status'],
        priority: data['priority'],
        dueDate: data['dueDate'].toDate(),
        createdAt: data['createdAt'].toDate(),
      };
    });

    this.tasks.set(tasks);
  }

  getTasks() {
    return this.tasks.asReadonly();
  }

  async addTask(task: Omit<Task, 'id' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...task,
      dueDate: task.dueDate,
      createdAt: new Date(),
    });

    const newTask: Task = {
      ...task,
      id: docRef.id,
      createdAt: new Date(),
    };

    this.tasks.update((currentTasks) => [...currentTasks, newTask]);
  }

  async updateTask(id: string, updates: Omit<Task, 'id' | 'createdAt'>) {
    const taskRef = doc(db, 'tasks', id);

    await updateDoc(taskRef, {
      ...updates,
    });

    this.tasks.update((currentTasks) =>
      currentTasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
    );
  }
  async deleteTask(id: string) {
    const taskRef = doc(db, 'tasks', id);

    await deleteDoc(taskRef);

    this.tasks.update((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }
}

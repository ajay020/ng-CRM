import { Injectable, signal } from '@angular/core';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks = signal<Task[]>([
    {
      id: 1,
      title: 'Follow up with ABC Solutions',
      description: 'Discuss the website redesign proposal.',
      assignedTo: 'Rahul',
      status: 'Pending',
      priority: 'High',
      dueDate: new Date('2026-10-10'),
      createdAt: new Date(),
    },
    {
      id: 2,
      title: 'Prepare project proposal',
      description: 'Prepare a proposal for mobile app development.',
      assignedTo: 'Priya',
      status: 'In Progress',
      priority: 'Medium',
      dueDate: new Date('2026-10-12'),
      createdAt: new Date(),
    },
    {
      id: 3,
      title: 'Send invoice',
      description: 'Send the invoice for the SEO package.',
      assignedTo: 'Rahul',
      status: 'Completed',
      priority: 'Low',
      dueDate: new Date('2026-10-03'),
      createdAt: new Date(),
    },
  ]);

  getTasks() {
    return this.tasks.asReadonly();
  }

  addTask(task: Omit<Task, 'id' | 'createdAt'>) {
    const newTask: Task = {
      ...task,
      id: Date.now(),
      createdAt: new Date(),
    };

    this.tasks.update((currentTasks) => [...currentTasks, newTask]);
  }

  updateTask(id: number, updates: Omit<Task, 'id' | 'createdAt'>) {
    this.tasks.update((currentTasks) =>
      currentTasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
    );
  }

  deleteTask(id: number) {
    this.tasks.update((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }
}

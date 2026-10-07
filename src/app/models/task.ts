export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  createdAt: Date;
}

import { Component, inject, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TaskService } from '../../services/task';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskPriority, TaskStatus } from '../../models/task';

@Component({
  selector: 'app-tasks',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class Tasks {
  private taskService = inject(TaskService);

  tasks = this.taskService.getTasks();

  searchTerm = signal('');
  selectedStatus = signal<TaskStatus | 'All'>('All');

  filteredTasks = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const status = this.selectedStatus();

    return this.tasks().filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search) ||
        task.assignedTo.toLowerCase().includes(search);

      const matchesStatus = status === 'All' || task.status === status;

      return matchesSearch && matchesStatus;
    });
  });

  showForm = false;
  editingTaskId: number | null = null;

  statuses: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];

  priorities: TaskPriority[] = ['Low', 'Medium', 'High'];

  taskForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      nonNullable: true,
    }),
    assignedTo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    status: new FormControl<TaskStatus>('Pending', {
      nonNullable: true,
    }),
    priority: new FormControl<TaskPriority>('Medium', {
      nonNullable: true,
    }),
    dueDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingTaskId = null;

    this.taskForm.reset({
      status: 'Pending',
      priority: 'Medium',
    });
  }

  submit() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const data = this.taskForm.getRawValue();

    const taskData = {
      ...data,
      dueDate: new Date(data.dueDate),
    };

    if (this.editingTaskId === null) {
      this.taskService.addTask(taskData);
    } else {
      this.taskService.updateTask(this.editingTaskId, taskData);
    }

    this.closeForm();
  }

  openEditForm(task: Task) {
    this.editingTaskId = task.id;
    this.showForm = true;

    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate.toISOString().split('T')[0],
    });
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id);
  }

  isOverdue(task: Task) {
    return task.status !== 'Completed' && new Date(task.dueDate) < new Date();
  }
}

import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { LeadService } from '../../services/lead';
import { CustomerService } from '../../services/customer';
import { DealService } from '../../services/deal';
import { TaskService } from '../../services/task';
import { CurrencyPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppDataService } from '../../services/app-data';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  loading = signal(true);
  error = signal('');

  private leadService = inject(LeadService);
  private customerService = inject(CustomerService);
  private dealService = inject(DealService);
  private taskService = inject(TaskService);

  private appDataService = inject(AppDataService);

  leads = this.leadService.getLeads();
  customers = this.customerService.getCustomers();
  deals = this.dealService.getDeals();
  tasks = this.taskService.getTasks();

  totalLeads = computed(() => this.leads().length);
  totalCustomers = computed(() => this.customers().length);

  activeDeals = computed(
    () => this.deals().filter((deal) => deal.stage !== 'Won' && deal.stage !== 'Lost').length,
  );

  wonDeals = computed(() => this.deals().filter((deal) => deal.stage === 'Won').length);

  pipelineValue = computed(() =>
    this.deals()
      .filter((deal) => deal.stage !== 'Won' && deal.stage !== 'Lost')
      .reduce((total, deal) => total + deal.value, 0),
  );

  pendingTasks = computed(() => this.tasks().filter((task) => task.status !== 'Completed').length);

  async ngOnInit() {
    try {
      await this.appDataService.loadAll();
    } catch (error) {
      console.error(error);
      this.error.set('Failed to load dashboard data.');
    } finally {
      this.loading.set(false);
    }
  }

  overdueTasks = computed(
    () =>
      this.tasks().filter(
        (task) => task.status !== 'Completed' && new Date(task.dueDate) < new Date(),
      ).length,
  );

  recentDeals = computed(() =>
    [...this.deals()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5),
  );

  overdueTaskList = computed(() =>
    this.tasks()
      .filter((task) => task.status !== 'Completed' && new Date(task.dueDate) < new Date())
      .slice(0, 5),
  );
}

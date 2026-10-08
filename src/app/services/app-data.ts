import { Injectable, inject, signal } from '@angular/core';
import { LeadService } from './lead';
import { CustomerService } from './customer';
import { DealService } from './deal';
import { TaskService } from './task';

@Injectable({
  providedIn: 'root',
})
export class AppDataService {
  private loaded = signal(false);
  private leadService = inject(LeadService);
  private customerService = inject(CustomerService);
  private dealService = inject(DealService);
  private taskService = inject(TaskService);

  async loadAll() {
    if (this.loaded()) {
      return;
    }

    await Promise.all([
      this.leadService.loadLeads(),
      this.customerService.loadCustomers(),
      this.dealService.loadDeals(),
      this.taskService.loadTasks(),
    ]);

    this.loaded.set(true);
  }
}

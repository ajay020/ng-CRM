import { Component, inject, computed, OnInit, signal } from '@angular/core';
import { DealService } from '../../services/deal';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Deal, DealStage } from '../../models/deal';
import { CustomerService } from '../../services/customer';

@Component({
  selector: 'app-deals',
  imports: [DatePipe, CurrencyPipe, ReactiveFormsModule],
  templateUrl: './deals.html',
  styleUrl: './deals.scss',
})
export class Deals implements OnInit {
  private dealService = inject(DealService);
  private customerService = inject(CustomerService);

  deals = this.dealService.getDeals();
  customers = this.customerService.getCustomers();

  dealsByStage = computed(() =>
    this.stages.map((stage) => {
      const deals = this.deals().filter((deal) => deal.stage === stage);

      const totalValue = deals.reduce((total, deal) => total + deal.value, 0);

      return {
        stage,
        deals,
        totalValue,
      };
    }),
  );

  stages: DealStage[] = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];

  showForm = false;
  editingDealId: string | null = null;
  saving = signal(false);
  errorMessage = signal('');

  dealForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    customerId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    value: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),

    stage: new FormControl<DealStage>('New', {
      nonNullable: true,
    }),

    expectedCloseDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  async ngOnInit() {
    await Promise.all([this.customerService.loadCustomers(), this.dealService.loadDeals()]);
  }

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingDealId = null;

    this.dealForm.reset({
      value: 0,
      stage: 'New',
    });
  }

  async submit() {
    if (this.dealForm.invalid || this.saving()) {
      this.dealForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set('');

    const data = this.dealForm.getRawValue();

    const dealData = {
      ...data,
      expectedCloseDate: new Date(data.expectedCloseDate),
    };

    try {
      if (this.editingDealId === null) {
        await this.dealService.addDeal(dealData);
      } else {
        await this.dealService.updateDeal(this.editingDealId, dealData);
      }

      this.closeForm();
    } catch (error) {
      console.error(error);
      this.errorMessage.set('Failed to save deal. Please try again.');
    } finally {
      this.saving.set(false);
    }
  }

  openEditForm(deal: Deal) {
    this.editingDealId = deal.id;
    this.showForm = true;

    this.dealForm.patchValue({
      title: deal.title,
      customerId: deal.customerId,
      value: deal.value,
      stage: deal.stage,
      expectedCloseDate: deal.expectedCloseDate.toISOString().split('T')[0],
    });
  }

  deleteDeal(id: string) {
    this.dealService.deleteDeal(id);
  }

  getCustomerName(customerId: string): string {
    const customer = this.customers().find((customer) => customer.id === customerId);

    return customer?.name ?? 'Unknown customer';
  }
}

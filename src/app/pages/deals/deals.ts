import { Component, inject, computed } from '@angular/core';
import { DealService } from '../../services/deal';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Deal, DealStage } from '../../models/deal';

@Component({
  selector: 'app-deals',
  imports: [DatePipe, CurrencyPipe, ReactiveFormsModule],
  templateUrl: './deals.html',
  styleUrl: './deals.scss',
})
export class Deals {
  private dealService = inject(DealService);
  deals = this.dealService.getDeals();

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
  editingDealId: number | null = null;

  dealForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    customer: new FormControl('', {
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

  submit() {
    if (this.dealForm.invalid) {
      this.dealForm.markAllAsTouched();
      return;
    }

    const data = this.dealForm.getRawValue();

    const dealData = {
      ...data,
      expectedCloseDate: new Date(data.expectedCloseDate),
    };

    if (this.editingDealId === null) {
      this.dealService.addDeal(dealData);
    } else {
      this.dealService.updateDeal(this.editingDealId, dealData);
    }

    this.closeForm();
  }

  openEditForm(deal: Deal) {
    this.editingDealId = deal.id;
    this.showForm = true;

    this.dealForm.patchValue({
      title: deal.title,
      customer: deal.customer,
      value: deal.value,
      stage: deal.stage,
      expectedCloseDate: deal.expectedCloseDate.toISOString().split('T')[0],
    });
  }

  deleteDeal(id: number) {
    this.dealService.deleteDeal(id);
  }
}

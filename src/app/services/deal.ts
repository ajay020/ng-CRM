import { Injectable, signal } from '@angular/core';
import { Deal } from '../models/deal';

@Injectable({
  providedIn: 'root',
})
export class DealService {
  private deals = signal<Deal[]>([
    {
      id: 1,
      title: 'Website Redesign',
      customer: 'ABC Solutions',
      value: 80000,
      stage: 'Proposal',
      expectedCloseDate: new Date('2026-10-15'),
      createdAt: new Date(),
    },
    {
      id: 2,
      title: 'Mobile App Development',
      customer: 'Tech World',
      value: 150000,
      stage: 'Negotiation',
      expectedCloseDate: new Date('2026-10-25'),
      createdAt: new Date(),
    },
    {
      id: 3,
      title: 'SEO Package',
      customer: 'Digital Works',
      value: 40000,
      stage: 'Won',
      expectedCloseDate: new Date('2026-09-30'),
      createdAt: new Date(),
    },
  ]);

  getDeals() {
    return this.deals.asReadonly();
  }

  addDeal(deal: Omit<Deal, 'id' | 'createdAt'>) {
    const newDeal: Deal = {
      ...deal,
      id: Date.now(),
      createdAt: new Date(),
    };

    this.deals.update((currentDeals) => [...currentDeals, newDeal]);
  }

  updateDeal(id: number, updates: Omit<Deal, 'id' | 'createdAt'>) {
    this.deals.update((currentDeals) =>
      currentDeals.map((deal) => (deal.id === id ? { ...deal, ...updates } : deal)),
    );
  }

  deleteDeal(id: number) {
    this.deals.update((currentDeals) => currentDeals.filter((deal) => deal.id !== id));
  }
}

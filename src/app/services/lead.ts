import { Injectable, signal } from '@angular/core';
import { Lead } from '../models/lead';

@Injectable({
  providedIn: 'root',
})
export class LeadService {
  private leads = signal<Lead[]>([
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '9876543210',
      company: 'ABC Solutions',
      source: 'Website',
      status: 'New',
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'Priya Verma',
      email: 'priya@example.com',
      phone: '9123456789',
      company: 'Tech World',
      source: 'Referral',
      status: 'Contacted',
      createdAt: new Date(),
    },
  ]);

  getLeads() {
    return this.leads.asReadonly();
  }

  addLead(lead: Omit<Lead, 'id' | 'createdAt'>) {
    const newLead: Lead = {
      ...lead,
      id: Date.now(),
      createdAt: new Date(),
    };

    this.leads.update((currentLeads) => [...currentLeads, newLead]);
  }

  deleteLead(id: number) {
    this.leads.update((currentLeads) => currentLeads.filter((lead) => lead.id !== id));
  }

  updateLead(id: number, updates: Omit<Lead, 'id' | 'createdAt'>) {
    this.leads.update((currentLeads) =>
      currentLeads.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead)),
    );
  }
}

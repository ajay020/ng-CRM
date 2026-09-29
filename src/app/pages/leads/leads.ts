import { Component, inject, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeadService } from '../../services/lead';
import { LeadSource, LeadStatus, Lead } from '../../models/lead';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-leads',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './leads.html',
  styleUrl: './leads.scss',
})
export class Leads {
  private leadService = inject(LeadService);

  leads = this.leadService.getLeads();

  showForm = false;

  searchTerm = signal('');

  editingLeadId: number | null = null;

  sources: LeadSource[] = ['Website', 'Referral', 'Social Media', 'Advertisement', 'Other'];

  statuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
  selectedStatus = signal<LeadStatus | 'All'>('All');

  leadForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),

    phone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    company: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),

    source: new FormControl<LeadSource>('Website', {
      nonNullable: true,
    }),

    status: new FormControl<LeadStatus>('New', {
      nonNullable: true,
    }),
  });

  filteredLeads = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const status = this.selectedStatus();

    return this.leads().filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(search) ||
        lead.email.toLowerCase().includes(search) ||
        lead.company.toLowerCase().includes(search) ||
        lead.phone.includes(search);

      const matchesStatus = status === 'All' || lead.status === status;

      return matchesSearch && matchesStatus;
    });
  });

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;

    this.editingLeadId = null;

    this.leadForm.reset({
      source: 'Website',
      status: 'New',
    });
  }

  submit() {
    if (this.leadForm.invalid) {
      this.leadForm.markAllAsTouched();
      return;
    }

    const data = this.leadForm.getRawValue();

    if (this.editingLeadId === null) {
      this.leadService.addLead(data);
    } else {
      this.leadService.updateLead(this.editingLeadId, data);
    }

    this.closeForm();
  }

  deleteLead(id: number) {
    this.leadService.deleteLead(id);
  }

  openEditForm(lead: Lead) {
    this.editingLeadId = lead.id;
    this.showForm = true;

    this.leadForm.patchValue({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      source: lead.source,
      status: lead.status,
    });
  }
}

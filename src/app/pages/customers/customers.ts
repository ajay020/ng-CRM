import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CustomerService } from '../../services/customer';
import { Customer } from '../../models/customer';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-customers',
  imports: [DatePipe, ReactiveFormsModule, RouterLink],
  templateUrl: './customers.html',
  styleUrl: './customers.scss',
})
export class Customers {
  private customerService = inject(CustomerService);

  customers = this.customerService.getCustomers();

  showForm = false;
  searchTerm = signal('');

  editingCustomerId: number | null = null;

  industries = ['Software', 'Marketing', 'Finance', 'Healthcare', 'Education', 'Retail', 'Other'];

  selectedIndustry = signal('All');

  filteredCustomers = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const industry = this.selectedIndustry();

    return this.customers().filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search) ||
        customer.company.toLowerCase().includes(search) ||
        customer.phone.includes(search);

      const matchesIndustry = industry === 'All' || customer.industry === industry;

      return matchesSearch && matchesIndustry;
    });
  });

  customerForm = new FormGroup({
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

    industry: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;

    this.customerForm.reset();
  }

  deleteCustomer(id: number) {
    this.customerService.deleteCustomer(id);
  }

  submit() {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    const data = this.customerForm.getRawValue();

    if (this.editingCustomerId == null) {
      this.customerService.addCustomer(data);
    } else {
      this.customerService.updateCustomer(this.editingCustomerId, data);
    }

    this.closeForm();
  }

  openEditForm(customer: Customer) {
    this.showForm = true;
    this.editingCustomerId = customer.id;

    this.customerForm.patchValue({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company,
      industry: customer.industry,
    });
  }
}

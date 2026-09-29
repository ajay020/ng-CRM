import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CustomerService } from '../../services/customer';
import { Customer } from '../../models/customer';

@Component({
  selector: 'app-customers',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './customers.html',
  styleUrl: './customers.scss',
})
export class Customers {
  private customerService = inject(CustomerService);

  customers = this.customerService.getCustomers();

  showForm = false;
  searchTerm = signal('');

  editingCustomerId: number | null = null;

  filteredCustomers = computed(() => {
    let search = this.searchTerm().toLocaleLowerCase().trim();

    if (!search) {
      return this.customers();
    }

    return this.customers().filter((customer) => {
      return (
        customer.name.includes(search) ||
        customer.company.includes(search) ||
        customer.email.includes(search) ||
        customer.phone.includes(search)
      );
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

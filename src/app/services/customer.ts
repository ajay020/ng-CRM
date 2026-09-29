import { Injectable, signal } from '@angular/core';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private customers = signal<Customer[]>([
    {
      id: 1,
      name: 'Amit Gupta',
      email: 'amit@example.com',
      phone: '9876501234',
      company: 'Tech Solutions',
      industry: 'Software',
      createdAt: new Date(),
    },
    {
      id: 2,
      name: 'Neha Singh',
      email: 'neha@example.com',
      phone: '9123405678',
      company: 'Digital Works',
      industry: 'Marketing',
      createdAt: new Date(),
    },
  ]);

  getCustomers() {
    return this.customers.asReadonly();
  }

  addCustomer(customer: Omit<Customer, 'id' | 'createdAt'>) {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now(),
      createdAt: new Date(),
    };

    this.customers.update((currentCustomers) => [...currentCustomers, newCustomer]);
  }

  updateCustomer(id: number, updates: Omit<Customer, 'id' | 'createdAt'>) {
    this.customers.update((currentCustomers) =>
      currentCustomers.map((customer) =>
        customer.id === id ? { ...customer, ...updates } : customer,
      ),
    );
  }

  deleteCustomer(id: number) {
    this.customers.update((currentCustomers) =>
      currentCustomers.filter((customer) => customer.id !== id),
    );
  }
}

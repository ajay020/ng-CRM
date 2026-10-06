import { Injectable, signal } from '@angular/core';
import { Customer } from '../models/customer';
import { db } from '../firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private customers = signal<Customer[]>([]);

  async loadCustomers() {
    const snapshot = await getDocs(collection(db, 'customers'));

    // console.log('FIRESTORE DOCUMENT COUNT:', snapshot.size);

    const customers: Customer[] = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data['name'],
        company: data['company'],
        email: data['email'],
        phone: data['phone'],
        industry: data['industry'],
        createdAt: data['createdAt'].toDate(),
      };
    });

    this.customers.set(customers);
  }

  getCustomers() {
    return this.customers.asReadonly();
  }

  async addCustomer(customer: Omit<Customer, 'id' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, 'customers'), {
      ...customer,
      createdAt: new Date(),
    });

    const newCustomer: Customer = {
      ...customer,
      id: docRef.id,
      createdAt: new Date(),
    };

    this.customers.update((currentCustomers) => [...currentCustomers, newCustomer]);
  }

  async updateCustomer(id: string, updates: Omit<Customer, 'id' | 'createdAt'>) {
    const customerRef = doc(db, 'customers', id);

    await updateDoc(customerRef, {
      ...updates,
    });

    this.customers.update((currentCustomers) =>
      currentCustomers.map((customer) =>
        customer.id === id ? { ...customer, ...updates } : customer,
      ),
    );
  }

  async deleteCustomer(id: string) {
    const customerRef = doc(db, 'customers', id);

    await deleteDoc(customerRef);

    this.customers.update((currentCustomers) =>
      currentCustomers.filter((customer) => customer.id !== id),
    );
  }
}

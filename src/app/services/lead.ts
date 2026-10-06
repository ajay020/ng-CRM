import { Injectable, signal } from '@angular/core';
import { Lead } from '../models/lead';
import { db } from '../firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
@Injectable({
  providedIn: 'root',
})
export class LeadService {
  private leads = signal<Lead[]>([]);

  async loadLeads() {
    const snapshot = await getDocs(collection(db, 'leads'));

    // console.log('FIRESTORE DOCUMENT COUNT:', snapshot.size);

    const leads: Lead[] = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data['name'],
        email: data['email'],
        phone: data['phone'],
        company: data['company'],
        source: data['source'],
        status: data['status'],
        createdAt: data['createdAt'].toDate(),
      };
    });

    this.leads.set(leads);
  }

  getLeads() {
    return this.leads.asReadonly();
  }

  async addLead(lead: Omit<Lead, 'id' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, 'leads'), {
      ...lead,
      createdAt: new Date(),
    });

    const newLead: Lead = {
      ...lead,
      id: docRef.id,
      createdAt: new Date(),
    };

    this.leads.update((currentLeads) => [...currentLeads, newLead]);
  }

  async deleteLead(id: string) {
    const leadRef = doc(db, 'leads', id);

    await deleteDoc(leadRef);

    this.leads.update((currentLeads) => currentLeads.filter((lead) => lead.id !== id));
  }

  async updateLead(id: string, updates: Omit<Lead, 'id' | 'createdAt'>) {
    const leadRef = doc(db, 'leads', id);

    await updateDoc(leadRef, {
      ...updates,
    });

    this.leads.update((currentLeads) =>
      currentLeads.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead)),
    );
  }
}

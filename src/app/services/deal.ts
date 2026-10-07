import { Injectable, signal } from '@angular/core';
import { Deal } from '../models/deal';
import { db } from '../firebase';

import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class DealService {
  private deals = signal<Deal[]>([]);

  async loadDeals() {
    const snapshot = await getDocs(collection(db, 'deals'));

    const deals: Deal[] = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        title: data['title'],
        customer: data['customer'],
        value: data['value'],
        stage: data['stage'],
        expectedCloseDate: data['expectedCloseDate'].toDate(),
        createdAt: data['createdAt'].toDate(),
      };
    });

    this.deals.set(deals);
  }

  getDeals() {
    return this.deals.asReadonly();
  }

  async addDeal(deal: Omit<Deal, 'id' | 'createdAt'>) {
    const docRef = await addDoc(collection(db, 'deals'), {
      ...deal,
      expectedCloseDate: deal.expectedCloseDate,
      createdAt: new Date(),
    });

    const newDeal: Deal = {
      ...deal,
      id: docRef.id,
      createdAt: new Date(),
    };

    this.deals.update((currentDeals) => [...currentDeals, newDeal]);
  }

  async updateDeal(id: string, updates: Omit<Deal, 'id' | 'createdAt'>) {
    const dealRef = doc(db, 'deals', id);

    await updateDoc(dealRef, {
      ...updates,
    });

    this.deals.update((currentDeals) =>
      currentDeals.map((deal) => (deal.id === id ? { ...deal, ...updates } : deal)),
    );
  }

  async deleteDeal(id: string) {
    const dealRef = doc(db, 'deals', id);

    await deleteDoc(dealRef);

    this.deals.update((currentDeals) => currentDeals.filter((deal) => deal.id !== id));
  }
}

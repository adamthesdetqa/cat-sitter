import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc, deleteDoc, onSnapshot, getDocs, updateDoc } from '@angular/fire/firestore';

export interface AvailabilityRow {
  date_key: string;   // 'YYYY-MM-DD'  — primary key
  status: 'available' | 'requested' | 'booked';
  note: string | null;
  requested_by?: string; // UID of user requesting
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private firestore = inject(Firestore);

  async fetchAll(): Promise<AvailabilityRow[]> {
    const querySnapshot = await getDocs(collection(this.firestore, 'availability'));
    const rows: AvailabilityRow[] = [];
    querySnapshot.forEach((doc) => {
      rows.push(doc.data() as AvailabilityRow);
    });
    return rows;
  }

  async upsert(row: Omit<AvailabilityRow, 'updated_at'>): Promise<void> {
    const docRef = doc(this.firestore, `availability/${row.date_key}`);
    await setDoc(docRef, { ...row, updated_at: new Date().toISOString() }, { merge: true });
  }

  async updateStatus(dateKey: string, updates: Partial<AvailabilityRow>): Promise<void> {
    const docRef = doc(this.firestore, `availability/${dateKey}`);
    await updateDoc(docRef, { ...updates, updated_at: new Date().toISOString() });
  }

  async remove(dateKey: string): Promise<void> {
    const docRef = doc(this.firestore, `availability/${dateKey}`);
    await deleteDoc(docRef);
  }

  subscribeToChanges(callback: (rows: AvailabilityRow[]) => void) {
    return onSnapshot(collection(this.firestore, 'availability'), (snapshot) => {
      const rows: AvailabilityRow[] = [];
      snapshot.forEach((doc) => rows.push(doc.data() as AvailabilityRow));
      callback(rows);
    });
  }
}

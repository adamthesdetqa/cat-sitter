import { Injectable, signal, computed, inject } from '@angular/core';
import { FirestoreService, AvailabilityRow } from './firestore.service';
import { AuthService } from './auth.service';

export type DayStatus = 'available' | 'unavailable' | 'requested' | 'booked';

export interface DayEntry {
  dateKey: string; // 'YYYY-MM-DD'
  status: DayStatus;
  note?: string;
  requested_by?: string;
}

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  private firestoreService = inject(FirestoreService);
  private authService = inject(AuthService);

  private _days = signal<Record<string, DayEntry>>({});
  private _loading = signal<boolean>(true);
  private _error = signal<string | null>(null);

  readonly days = this._days.asReadonly();
  readonly isAdmin = this.authService.isAdmin;
  readonly isUser = computed(() => this.authService.isAuthenticated() && !this.isAdmin());
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly availableDates = computed(() =>
    Object.values(this._days())
      .filter(d => d.status === 'available')
      .map(d => d.dateKey)
  );

  constructor() {
    this.loadFromFirestore();
    // Subscribe to realtime updates so changes sync instantly across devices
    this.firestoreService.subscribeToChanges((rows) => {
      this.updateDaysFromRows(rows);
    });
  }

  private updateDaysFromRows(rows: AvailabilityRow[]) {
      const map: Record<string, DayEntry> = {};
      for (const row of rows) {
        map[row.date_key] = {
          dateKey: row.date_key,
          status: row.status as DayStatus,
          note: row.note ?? undefined,
          requested_by: row.requested_by
        };
      }
      this._days.set(map);
  }

  private async loadFromFirestore(): Promise<void> {
    try {
      this._loading.set(true);
      this._error.set(null);
      const rows = await this.firestoreService.fetchAll();
      this.updateDaysFromRows(rows);
    } catch (err: any) {
      this._error.set('Could not load availability. Check your Firebase config.');
      console.error('Firebase load error:', err);
    } finally {
      this._loading.set(false);
    }
  }

  getDay(dateKey: string): DayEntry | undefined {
    return this._days()[dateKey];
  }

  async toggleAvailable(dateKey: string): Promise<void> {
    if (!this.isAdmin()) return;
    const current = this._days()[dateKey];

    // Optimistic update
    const updated = { ...this._days() };

    if (!current || current.status === 'unavailable') {
      updated[dateKey] = { dateKey, status: 'available' };
      this._days.set(updated);
      try {
        await this.firestoreService.upsert({ date_key: dateKey, status: 'available', note: null });
      } catch (err) {
        await this.loadFromFirestore();
        throw err;
      }
    } else if (current.status === 'available') {
      delete updated[dateKey];
      this._days.set(updated);
      try {
        await this.firestoreService.remove(dateKey);
      } catch (err) {
        await this.loadFromFirestore();
        throw err;
      }
    } else if (current.status === 'requested') {
      // Mark requested as booked
      updated[dateKey] = { ...current, status: 'booked' };
      this._days.set(updated);
      try {
        await this.firestoreService.updateStatus(dateKey, { status: 'booked' });
      } catch (err) {
         await this.loadFromFirestore();
         throw err;
      }
    } else if (current.status === 'booked') {
        // Remove booking, back to available (or unavailable, but available is safer)
      updated[dateKey] = { ...current, status: 'available', requested_by: undefined };
      this._days.set(updated);
      try {
        await this.firestoreService.updateStatus(dateKey, { status: 'available', requested_by: '' }); // use empty string or null instead of omitting
      } catch (err) {
         await this.loadFromFirestore();
         throw err;
      }
    }
  }

  async requestBooking(dateKey: string): Promise<void> {
      if (!this.isUser()) return;
      const current = this._days()[dateKey];
      const profile = this.authService.profile();
      if (!profile || !current || current.status !== 'available') return;

      const updated = { ...this._days() };
      updated[dateKey] = { ...current, status: 'requested', requested_by: profile.uid };
      this._days.set(updated);

      try {
          await this.firestoreService.updateStatus(dateKey, { status: 'requested', requested_by: profile.uid });
      } catch (err) {
          await this.loadFromFirestore();
          throw err;
      }
  }
}

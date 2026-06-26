import { Injectable, signal, computed, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { environment } from '../../environments/environment';

export type DayStatus = 'available' | 'unavailable' | 'booked';

export interface DayEntry {
  dateKey: string; // 'YYYY-MM-DD'
  status: DayStatus;
  note?: string;
}

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  private supabase = inject(SupabaseService);

  private _days = signal<Record<string, DayEntry>>({});
  private _isAdmin = signal<boolean>(false);
  private _loading = signal<boolean>(true);
  private _error = signal<string | null>(null);

  readonly days = this._days.asReadonly();
  readonly isAdmin = this._isAdmin.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly availableDates = computed(() =>
    Object.values(this._days())
      .filter(d => d.status === 'available')
      .map(d => d.dateKey)
  );

  constructor() {
    this.loadFromSupabase();
    // Subscribe to realtime updates so changes sync instantly across devices
    this.supabase.subscribeToChanges(() => this.loadFromSupabase());
  }

  private async loadFromSupabase(): Promise<void> {
    try {
      this._loading.set(true);
      this._error.set(null);
      const rows = await this.supabase.fetchAll();
      const map: Record<string, DayEntry> = {};
      for (const row of rows) {
        map[row.date_key] = {
          dateKey: row.date_key,
          status: row.status,
          note: row.note ?? undefined,
        };
      }
      this._days.set(map);
    } catch (err: any) {
      this._error.set('Could not load availability. Check your Supabase config.');
      console.error('Supabase load error:', err);
    } finally {
      this._loading.set(false);
    }
  }

  getDay(dateKey: string): DayEntry | undefined {
    return this._days()[dateKey];
  }

  async toggleAvailable(dateKey: string): Promise<void> {
    if (!this._isAdmin()) return;
    const current = this._days()[dateKey];

    // Optimistic update
    const updated = { ...this._days() };

    if (!current || current.status === 'unavailable') {
      updated[dateKey] = { dateKey, status: 'available' };
      this._days.set(updated);
      try {
        await this.supabase.upsert({ date_key: dateKey, status: 'available', note: null });
      } catch (err) {
        // Roll back on failure
        await this.loadFromSupabase();
        throw err;
      }
    } else if (current.status === 'available') {
      delete updated[dateKey];
      this._days.set(updated);
      try {
        await this.supabase.remove(dateKey);
      } catch (err) {
        await this.loadFromSupabase();
        throw err;
      }
    }
  }

  login(pin: string): boolean {
    if (pin === environment.adminPin) {
      this._isAdmin.set(true);
      return true;
    }
    return false;
  }

  logout(): void {
    this._isAdmin.set(false);
  }
}

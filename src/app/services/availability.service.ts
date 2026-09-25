import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

export type DayStatus = 'available' | 'unavailable' | 'requested' | 'booked';

export interface DayEntry {
  dateKey: string; // 'YYYY-MM-DD'
  status: DayStatus;
  note?: string;
  requested_by?: string;
}

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  private http = inject(HttpClient);
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
    this.loadFromBackend();
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = this.authService.token();
    if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  private async loadFromBackend(): Promise<void> {
    try {
      this._loading.set(true);
      this._error.set(null);
      const rows: any = await firstValueFrom(this.http.get(`${environment.apiUrl}/availability`));

      const map: Record<string, DayEntry> = {};
      for (const row of rows) {
        map[row.dateKey] = {
          dateKey: row.dateKey,
          status: row.status as DayStatus,
          note: row.note ?? undefined,
          requested_by: row.requestedBy
        };
      }
      this._days.set(map);
    } catch (err: any) {
      this._error.set('Could not load availability.');
      console.error('Backend load error:', err);
    } finally {
      this._loading.set(false);
    }
  }

  getDay(dateKey: string): DayEntry | undefined {
    return this._days()[dateKey];
  }

  async toggleAvailable(dateKey: string): Promise<void> {
    if (!this.isAdmin()) return;

    try {
        await firstValueFrom(this.http.post(`${environment.apiUrl}/availability/toggle`, { dateKey }, { headers: this.getHeaders() }));
        await this.loadFromBackend();
    } catch (err) {
        console.error(err);
    }
  }

  async requestBooking(dateKey: string): Promise<void> {
      if (!this.isUser()) return;

      try {
          await firstValueFrom(this.http.post(`${environment.apiUrl}/availability/request`, { dateKey }, { headers: this.getHeaders() }));
          await this.loadFromBackend();
      } catch (err) {
          console.error(err);
      }
  }
}

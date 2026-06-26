import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface AvailabilityRow {
  date_key: string;   // 'YYYY-MM-DD'  — primary key
  status: 'available' | 'booked';
  note: string | null;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly client: SupabaseClient;

  constructor() {
    this.client = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );
  }

  /** Fetch all rows from the availability table */
  async fetchAll(): Promise<AvailabilityRow[]> {
    const { data, error } = await this.client
      .from('availability')
      .select('*');
    if (error) throw error;
    return data ?? [];
  }

  /** Upsert a date as available (or update its status) */
  async upsert(row: Omit<AvailabilityRow, 'updated_at'>): Promise<void> {
    const { error } = await this.client
      .from('availability')
      .upsert({ ...row, updated_at: new Date().toISOString() });
    if (error) throw error;
  }

  /** Delete a row (marks date as having no entry = unavailable) */
  async remove(dateKey: string): Promise<void> {
    const { error } = await this.client
      .from('availability')
      .delete()
      .eq('date_key', dateKey);
    if (error) throw error;
  }

  /** Subscribe to realtime changes on the availability table */
  subscribeToChanges(callback: () => void) {
    return this.client
      .channel('availability-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'availability' },
        callback
      )
      .subscribe();
  }
}

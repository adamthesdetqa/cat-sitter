import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  role: 'admin' | 'user';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private _profile = signal<UserProfile | null>(null);
  private _token = signal<string | null>(null);

  readonly profile = this._profile.asReadonly();
  readonly token = this._token.asReadonly();

  readonly isAdmin = computed(() => this._profile()?.role === 'admin');
  readonly isAuthenticated = computed(() => this._profile() !== null);

  async login(email: string, pass: string) {
    const res: any = await firstValueFrom(this.http.post(`${environment.apiUrl}/auth/login`, { email, password: pass }));
    this._token.set(res.token);
    this._profile.set(res.profile);
  }

  async register(email: string, pass: string, name: string) {
    const res: any = await firstValueFrom(this.http.post(`${environment.apiUrl}/auth/register`, { email, password: pass, name }));
    this._token.set(res.token);
    this._profile.set(res.profile);
  }

  logout() {
    this._profile.set(null);
    this._token.set(null);
  }
}

import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-toggle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-toggle.component.html',
  styleUrl: './admin-toggle.component.scss'
})
export class AdminToggleComponent {
  private authService = inject(AuthService);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly isAdmin = this.authService.isAdmin;
  readonly profile = this.authService.profile;

  showAuthForm = signal(false);
  isLoginMode = signal(true);

  email = signal('');
  password = signal('');
  name = signal('');
  error = signal('');

  openAuth(): void {
    this.showAuthForm.set(true);
    this.email.set('');
    this.password.set('');
    this.name.set('');
    this.error.set('');
  }

  toggleMode(): void {
    this.isLoginMode.set(!this.isLoginMode());
    this.error.set('');
  }

  async submitAuth(): Promise<void> {
    this.error.set('');
    try {
      if (this.isLoginMode()) {
        await this.authService.login(this.email(), this.password());
      } else {
        await this.authService.register(this.email(), this.password(), this.name());
      }
      this.showAuthForm.set(false);
    } catch (err: any) {
      this.error.set(err.message || 'Authentication failed. Please try again.');
    }
  }

  logout(): void {
    this.authService.logout();
  }

  cancelAuth(): void {
    this.showAuthForm.set(false);
    this.email.set('');
    this.password.set('');
    this.name.set('');
    this.error.set('');
  }

  onInput(signalRef: any, event: Event): void {
    signalRef.set((event.target as HTMLInputElement).value);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.submitAuth();
    if (event.key === 'Escape') this.cancelAuth();
  }
}

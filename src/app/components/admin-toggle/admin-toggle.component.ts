import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvailabilityService } from '../../services/availability.service';

@Component({
  selector: 'app-admin-toggle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-toggle.component.html',
  styleUrl: './admin-toggle.component.scss'
})
export class AdminToggleComponent {
  private availabilityService = inject(AvailabilityService);

  readonly isAdmin = this.availabilityService.isAdmin;
  showLoginForm = signal(false);
  pin = signal('');
  error = signal('');

  openLogin(): void {
    this.showLoginForm.set(true);
    this.pin.set('');
    this.error.set('');
  }

  submitPin(): void {
    const success = this.availabilityService.login(this.pin());
    if (success) {
      this.showLoginForm.set(false);
      this.pin.set('');
      this.error.set('');
    } else {
      this.error.set('Incorrect PIN. Try again.');
    }
  }

  logout(): void {
    this.availabilityService.logout();
  }

  cancelLogin(): void {
    this.showLoginForm.set(false);
    this.pin.set('');
    this.error.set('');
  }

  onPinInput(event: Event): void {
    this.pin.set((event.target as HTMLInputElement).value);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.submitPin();
    if (event.key === 'Escape') this.cancelLogin();
  }
}

import { Component } from '@angular/core';
import { CalendarComponent } from './components/calendar/calendar.component';
import { AdminToggleComponent } from './components/admin-toggle/admin-toggle.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CalendarComponent, AdminToggleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}

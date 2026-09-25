import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailabilityService, DayStatus } from '../../services/availability.service';

interface CalendarDay {
  date: Date;
  dateKey: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  status: DayStatus | 'none';
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
  private availabilityService = inject(AvailabilityService);

  readonly isAdmin = this.availabilityService.isAdmin;
  readonly isUser = this.availabilityService.isUser;
  readonly loading = this.availabilityService.loading;
  readonly error = this.availabilityService.error;
  readonly weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  private _currentDate = signal(new Date());
  private _saving = signal<string | null>(null); // dateKey currently being saved

  readonly currentMonthLabel = computed(() =>
    this._currentDate().toLocaleString('default', { month: 'long', year: 'numeric' })
  );

  readonly calendarDays = computed(() => {
    const days = this.availabilityService.days();
    const date = this._currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cells: CalendarDay[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      const d = new Date(year, month, -firstDay.getDay() + i + 1);
      cells.push(this.makeCell(d, month, today, days));
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      cells.push(this.makeCell(new Date(year, month, d), month, today, days));
    }
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      cells.push(this.makeCell(new Date(year, month + 1, i), month, today, days));
    }

    return cells;
  });

  private makeCell(date: Date, currentMonth: number, today: Date, days: Record<string, any>): CalendarDay {
    const dateKey = this.toDateKey(date);
    const entry = days[dateKey];
    return {
      date,
      dateKey,
      dayOfMonth: date.getDate(),
      isCurrentMonth: date.getMonth() === currentMonth,
      isToday: date.getTime() === today.getTime(),
      isPast: date < today,
      status: entry ? entry.status : 'none'
    };
  }

  private toDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  previousMonth(): void {
    const d = this._currentDate();
    this._currentDate.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const d = this._currentDate();
    this._currentDate.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  async onDayClick(day: CalendarDay): Promise<void> {
    if (!day.isCurrentMonth || day.isPast || this._saving()) return;

    if (this.isAdmin()) {
        this._saving.set(day.dateKey);
        try {
          await this.availabilityService.toggleAvailable(day.dateKey);
        } finally {
          this._saving.set(null);
        }
    } else if (this.isUser() && day.status === 'available') {
        this._saving.set(day.dateKey);
        try {
            await this.availabilityService.requestBooking(day.dateKey);
        } finally {
            this._saving.set(null);
        }
    }
  }

  isSaving(dateKey: string): boolean {
    return this._saving() === dateKey;
  }

  getCellClass(day: CalendarDay): Record<string, boolean> {
    const clickable = (this.isAdmin() && !day.isPast && day.isCurrentMonth && !this._saving()) ||
                      (this.isUser() && day.status === 'available' && !day.isPast && day.isCurrentMonth && !this._saving());
    return {
      'day': true,
      'day--other-month': !day.isCurrentMonth,
      'day--today': day.isToday,
      'day--past': day.isPast && !day.isToday,
      'day--available': day.status === 'available',
      'day--requested': day.status === 'requested',
      'day--booked': day.status === 'booked',
      'day--saving': this.isSaving(day.dateKey),
      'day--admin-clickable': clickable,
    };
  }
}

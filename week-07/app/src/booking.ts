export interface Booking {
  start: number;
  end: number;
}

export interface CanBookParams {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Booking[];
}

export function canBook({ start, end, now, blocked, bookings }: CanBookParams): boolean {
  // AC1: Корректность временного интервала (start < end, start > now, end <= 1440)
  if (start >= end) return false;
  if (start <= now) return false;
  if (end > 1440) return false;

  // AC2: Максимальная длительность бронирования не более 120 минут
  if (end - start > 120) return false;

  // AC3: Пользователь/комната не заблокированы
  if (blocked) return false;

  // AC4: Отсутствие пересечений с существующими бронированиями
  // Пересечение происходит, если слот начинается строго раньше окончания существующего И заканчивается строго позже начала существующего
  for (const b of bookings) {
    if (start < b.end && end > b.start) {
      return false;
    }
  }

  return true;
}
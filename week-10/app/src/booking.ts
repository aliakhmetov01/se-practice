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

export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }

  return true;
}

/** Raw form values as the page holds them ("HH:MM" strings). */
export interface CheckRequestParams {
  now: string;
  start: string;
  end: string;
  endOfDay: boolean;
  blocked: boolean;
  bookings: Booking[];
}

/** Exactly one of: an error message (result null) or a verdict (error ''). */
export interface CheckOutcome {
  error: string;
  result: boolean | null;
}

const toMinutes = (value: string): number => {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
};

/** Pure: validates the raw form values, then applies canBook. Never mutates bookings. */
export function checkRequest({ now, start, end, endOfDay, blocked, bookings }: CheckRequestParams): CheckOutcome {
  if (!start || !now || (!end && !endOfDay)) {
    return { error: 'Fill in the current time, the start and the end.', result: null };
  }
  const s = toMinutes(start);
  const e = endOfDay ? 1440 : toMinutes(end);
  if (!(s < e)) {
    return { error: 'The end time must be after the start time.', result: null };
  }
  return { error: '', result: canBook({ start: s, end: e, now: toMinutes(now), blocked, bookings }) };
}

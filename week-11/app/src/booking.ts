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

/** Why a request is or is not bookable. Spelled exactly like this everywhere (README 3.1). */
export type ReasonCode = 'invalid_time' | 'past_time' | 'too_long' | 'room_blocked' | 'overlap' | 'available';

export const REASON_CODES: readonly ReasonCode[] = [
  'invalid_time',
  'past_time',
  'too_long',
  'room_blocked',
  'overlap',
  'available',
];

/**
 * The deterministic booking rules, in canBook's order. The first rule that fails names the reason.
 * Pure: never mutates bookings.
 */
export function availabilityReason({ start, end, now, blocked, bookings }: CanBookParams): ReasonCode {
  if (!(0 <= start && start < end && end <= 1440)) return 'invalid_time'; // AC1
  if (!(start > now)) return 'past_time'; // AC1
  if (end - start > 120) return 'too_long'; // AC2
  if (blocked) return 'room_blocked'; // AC3
  for (const b of bookings) {
    if (start < b.end && end > b.start) return 'overlap'; // AC4: touching endpoints is allowed
  }

  return 'available';
}

/** The source of truth for availability. The rules live in availabilityReason only. */
export function canBook(params: CanBookParams): boolean {
  return availabilityReason(params) === 'available';
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

/** A CheckOutcome plus the deterministic reason code (null whenever result is null). */
export interface ReasonOutcome extends CheckOutcome {
  reasonCode: ReasonCode | null;
}

/** Pure: validates the raw form values, then applies canBook and availabilityReason. Never mutates bookings. */
export function checkRequestWithReason({ now, start, end, endOfDay, blocked, bookings }: CheckRequestParams): ReasonOutcome {
  if (!start || !now || (!end && !endOfDay)) {
    return { error: 'Fill in the current time, the start and the end.', result: null, reasonCode: null };
  }
  const s = toMinutes(start);
  const e = endOfDay ? 1440 : toMinutes(end);
  if (!(s < e)) {
    return { error: 'The end time must be after the start time.', result: null, reasonCode: null };
  }
  const request = { start: s, end: e, now: toMinutes(now), blocked, bookings };
  return { error: '', result: canBook(request), reasonCode: availabilityReason(request) };
}

/** Pure: validates the raw form values, then applies canBook. Never mutates bookings. Unchanged shape. */
export function checkRequest(params: CheckRequestParams): CheckOutcome {
  const { error, result } = checkRequestWithReason(params);
  return { error, result };
}

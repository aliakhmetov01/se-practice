export const MAX_BOOKING_MINUTES = 120;

export interface Booking {
  startMin: number;
  endMin: number;
}

export interface BookingRequest {
  startMin: number;
  endMin: number;
}

export interface RoomState {
  blocked: boolean;
  bookings: Booking[];
}

export type AvailabilityResult =
  | { status: 'available' }
  | { status: 'unavailable'; reason: string };

export type RequestValidation =
  | { ok: true; request: BookingRequest }
  | { ok: false; message: string };

export type CheckOutcome =
  | { type: 'error'; message: string }
  | { type: 'result'; request: BookingRequest; result: AvailabilityResult };

export function parseTimeToMinutes(value: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export function formatMinutes(total: number): string {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function invalid(message: string): RequestValidation {
  return { ok: false, message };
}

export function validateBookingRequest(
  startValue: string,
  endValue: string,
  nowMin: number | null,
): RequestValidation {
  if (nowMin === null) return invalid('Enter a valid current time.');

  const startMin = parseTimeToMinutes(startValue);
  const endMin = parseTimeToMinutes(endValue);
  if (startMin === null || endMin === null) {
    return invalid('Enter both a start time and an end time.');
  }

  if (startMin >= endMin) {
    return invalid('The end time must be later than the start time.');
  }

  if (startMin <= nowMin) {
    return invalid(`The start time must be later than the current time (${formatMinutes(nowMin)}).`);
  }

  const duration = endMin - startMin;
  if (duration > MAX_BOOKING_MINUTES) {
    return invalid(
      `A booking can last at most ${MAX_BOOKING_MINUTES} minutes (2 hours). This window is ${duration} minutes long.`,
    );
  }

  return { ok: true, request: { startMin, endMin } };
}

export function checkAvailability(request: BookingRequest, room: RoomState): AvailabilityResult {
  if (room.blocked) {
    return { status: 'unavailable', reason: 'This room is blocked and cannot be booked.' };
  }

  const conflict = room.bookings.find(
    (booking) => request.startMin < booking.endMin && request.endMin > booking.startMin,
  );
  if (conflict) {
    return {
      status: 'unavailable',
      reason: `It overlaps an existing booking from ${formatMinutes(conflict.startMin)} to ${formatMinutes(conflict.endMin)}.`,
    };
  }

  return { status: 'available' };
}

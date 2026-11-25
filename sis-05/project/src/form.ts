// src/form.ts - the Adapter between the page's form (strings and a checkbox) and the rules (numbers:
// attendees, minutes after midnight). It translates and says what is missing; it decides nothing about
// availability - that stays in booking.ts and filter.ts.
import { END_OF_DAY, toMinutes } from './time';

/** What the page holds: the raw field values. */
export interface TimeForm {
  start: string;
  end: string;
  endOfDay: boolean;
  roomChosen: boolean;
}

/** What the rules take: minutes after midnight. */
export type TimeRequest = { start: number; end: number };

export type FormResult = { request: TimeRequest } | { error: string };

/** F1: the attendees field as the number filterRooms expects; an empty field counts as 0. */
export function toAttendees(value: string): number {
  return Number(value) || 0;
}

/** The submitted times as minutes, or the message the page shows instead of a result. */
export function toRequest(form: TimeForm): FormResult {
  if (!form.start || (!form.end && !form.endOfDay)) return { error: 'Fill in the start and the end time.' };
  if (!form.roomChosen) return { error: 'Choose a room from the list first.' };
  return { request: { start: toMinutes(form.start), end: form.endOfDay ? END_OF_DAY : toMinutes(form.end) } };
}

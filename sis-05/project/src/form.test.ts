import { describe, expect, it } from 'vitest';
import { toAttendees, toRequest } from './form';
import { END_OF_DAY } from './time';

const filled = { start: '11:00', end: '12:00', endOfDay: false, roomChosen: true };

describe('form adapter - page fields to rule inputs', () => {
  it('P1: a filled form becomes minutes after midnight (11:00-12:00 -> 660-720)', () => {
    expect(toRequest(filled)).toEqual({ request: { start: 660, end: 720 } });
  });

  it('P2: "Ends at 24:00" gives END_OF_DAY (1440), whatever the end field says', () => {
    expect(toRequest({ ...filled, end: '', endOfDay: true })).toEqual({ request: { start: 660, end: END_OF_DAY } });
  });

  it('P3: a missing start or end asks for both times', () => {
    expect(toRequest({ ...filled, start: '' })).toEqual({ error: 'Fill in the start and the end time.' });
    expect(toRequest({ ...filled, end: '' })).toEqual({ error: 'Fill in the start and the end time.' });
  });

  it('P4: no room chosen asks for a room', () => {
    expect(toRequest({ ...filled, roomChosen: false })).toEqual({ error: 'Choose a room from the list first.' });
  });

  it('P5: with times AND room missing, the times message comes first (as before the refactoring)', () => {
    expect(toRequest({ ...filled, start: '', roomChosen: false })).toEqual({ error: 'Fill in the start and the end time.' });
  });

  it('P6: the attendees field becomes a number; an empty field counts as 0', () => {
    expect(toAttendees('12')).toBe(12);
    expect(toAttendees('')).toBe(0);
  });
});

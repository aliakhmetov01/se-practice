import { describe, it, expect } from 'vitest';
import { canBook } from './booking';
import { describe, it, test, expect } from 'vitest';
describe('canBook - First Suite', () => {
  const defaultFixture = {
    now: 540,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  };

  it('T01 AC4: 660-720 touching after', () => {
    const result = canBook({
      ...defaultFixture,
      start: 660,
      end: 720,
    });
    expect(result).toBe(true);
  });

  it('T02 AC1: 540-570 starts now', () => {
    const result = canBook({
      ...defaultFixture,
      start: 540,
      end: 570,
    });
    expect(result).toBe(false);
  });

  it('T03 AC1: 720-720 zero duration', () => {
    const result = canBook({
      ...defaultFixture,
      start: 720,
      end: 720,
    });
    expect(result).toBe(false);
  });

  it('T04 AC1: 750-720 reversed', () => {
    const result = canBook({
      ...defaultFixture,
      start: 750,
      end: 720,
    });
    expect(result).toBe(false);
  });

  it('T05 AC1: 1380-1441 past day end', () => {
    const result = canBook({
      ...defaultFixture,
      start: 1380,
      end: 1441,
    });
    expect(result).toBe(false);
  });

  it('T06 AC2: 720-840 (120 min)', () => {
    const result = canBook({
      ...defaultFixture,
      start: 720,
      end: 840,
    });
    expect(result).toBe(true);
  });

  it('T07 AC2: 720-841 (121 min)', () => {
    const result = canBook({
      ...defaultFixture,
      start: 720,
      end: 841,
    });
    expect(result).toBe(false);
  });

  it('T08 AC4: 570-600 touching before', () => {
    const result = canBook({
      ...defaultFixture,
      start: 570,
      end: 600,
    });
    expect(result).toBe(true);
  });

  it('T09 AC4: 630-690 partial overlap', () => {
    const result = canBook({
      ...defaultFixture,
      start: 630,
      end: 690,
    });
    expect(result).toBe(false);
  });

  it('T10 AC4: 570-690 contains booking', () => {
    const result = canBook({
      ...defaultFixture,
      start: 570,
      end: 690,
    });
    expect(result).toBe(false);
  });

  it('T11 AC4: 615-645 inside booking', () => {
    const result = canBook({
      ...defaultFixture,
      start: 615,
      end: 645,
    });
    expect(result).toBe(false);
  });

  it('T12 AC4: 600-660 identical', () => {
    const result = canBook({
      ...defaultFixture,
      start: 600,
      end: 660,
    });
    expect(result).toBe(false);
  });

  it('T13 AC3: 660-720, blocked = true', () => {
    const result = canBook({
      ...defaultFixture,
      blocked: true,
      start: 660,
      end: 720,
    });
    expect(result).toBe(false);
  });

  it('T14 AC4: 630-690, bookings = []', () => {
    const result = canBook({
      ...defaultFixture,
      bookings: [],
      start: 630,
      end: 690,
    });
    expect(result).toBe(true);
  });

  it('AC5: Available request does not mutate bookings array', () => {
    const bookings = [{ start: 600, end: 660 }];
    const bookingsCopy = JSON.parse(JSON.stringify(bookings));
    const result = canBook({
      now: 540,
      blocked: false,
      bookings,
      start: 660,
      end: 720,
    });
    expect(result).toBe(true);
    expect(bookings).toEqual(bookingsCopy);
  });

  it('X1 AC1: 539-600 starts in past', () => {
    const result = canBook({
      ...defaultFixture,
      start: 539,
      end: 600,
    });
    expect(result).toBe(false);
  });

  it('X2 AC2: 1320-1440 ends at midnight', () => {
    const result = canBook({
      ...defaultFixture,
      start: 1320,
      end: 1440,
    });
    expect(result).toBe(true);
  });
});

describe('Practice 08: Bug Reproduction', () => {
  it('BUG-A: touching endpoints (adjacent slots) should be allowed', () => {
    const bookings = [{ start: 600, end: 660 }];
    const result = canBook({
      start: 660,
      end: 720,
      now: 540,
      blocked: false,
      bookings,
    });

    expect(result).toBe(true);
  });

  it('BUG-B: Available request that touches nothing does not mutate bookings array', () => {
    const bookings = [{ start: 600, end: 660 }];
    const bookingsCopy = JSON.parse(JSON.stringify(bookings));

    const result = canBook({
      start: 720,
      end: 780,
      now: 540,
      blocked: false,
      bookings,
    });

    expect(result).toBe(true);
    expect(bookings).toEqual(bookingsCopy);
  });
});
import { describe, test, expect } from 'vitest';
import { availabilityReason, canBook } from './booking';
import {
  explainAvailability,
  fallbackExplanation,
  mockAdapter,
  type ExplainAdapter,
  type ExplainInput,
} from './explain';

// The E1-E9 fixture of README Part 5: now 09:00, one booking 10:00-11:00, room not blocked.
const NOW = 9 * 60;
const BOOKINGS = [{ start: 600, end: 660 }];
const toMin = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3));

/** Runs the deterministic checker, then builds the contract input from its result. */
function decide(start: string, end: string, blocked = false, roomLabel = 'Room A-101'): ExplainInput {
  const request = { start: toMin(start), end: toMin(end), now: NOW, blocked, bookings: BOOKINGS };
  return { roomLabel, start, end, isAvailable: canBook(request), reasonCode: availabilityReason(request) };
}

/** A fake adapter that counts its calls, to prove rejected input never reaches it. */
function countingAdapter() {
  const calls = { n: 0 };
  const adapter: ExplainAdapter = async input => {
    calls.n += 1;
    return mockAdapter(input, new AbortController().signal);
  };
  return { adapter, calls };
}

const NEGATIVE = /unavailable|not available/i;

describe('Week 11: explain availability, E1-E9', () => {
  test('E1 F2: 11:00-12:00 at 09:00 is available and the explanation says so', async () => {
    const input = decide('11:00', '12:00');
    expect(input).toMatchObject({ isAvailable: true, reasonCode: 'available' });
    const out = await explainAvailability(input, mockAdapter, 2000);
    expect(out.kind).toBe('generated');
    if (out.kind === 'rejected') throw new Error('unexpected rejection');
    expect(out.explanation).toMatch(/available/i);
    expect(out.explanation).not.toMatch(NEGATIVE);
  });

  test('E2 F2: 10:30-11:30 overlaps the 10:00-11:00 booking; the explanation says unavailable and names the overlap', async () => {
    const input = decide('10:30', '11:30');
    expect(input).toMatchObject({ isAvailable: false, reasonCode: 'overlap' });
    const out = await explainAvailability(input, mockAdapter, 2000);
    expect(out.kind).toBe('generated');
    if (out.kind === 'rejected') throw new Error('unexpected rejection');
    expect(out.explanation).toMatch(NEGATIVE);
    expect(out.explanation).toMatch(/overlap/i);
  });

  test('E3 F2: a blocked room gives room_blocked and an unavailable explanation', async () => {
    const input = decide('11:00', '12:00', true);
    expect(input).toMatchObject({ isAvailable: false, reasonCode: 'room_blocked' });
    const out = await explainAvailability(input, mockAdapter, 2000);
    if (out.kind === 'rejected') throw new Error('unexpected rejection');
    expect(out.explanation).toMatch(NEGATIVE);
    expect(out.explanation).toMatch(/blocked/i);
  });

  test('E4 F1: 12:30-12:00 is invalid_time and is still explained as unavailable', async () => {
    const input = decide('12:30', '12:00');
    expect(input).toMatchObject({ isAvailable: false, reasonCode: 'invalid_time' });
    const out = await explainAvailability(input, mockAdapter, 2000);
    if (out.kind === 'rejected') throw new Error('unexpected rejection');
    expect(out.explanation).toMatch(NEGATIVE);
  });

  test('E5 F1: 08:00-08:30 at 09:00 is past_time', async () => {
    const input = decide('08:00', '08:30');
    expect(input).toMatchObject({ isAvailable: false, reasonCode: 'past_time' });
    const out = await explainAvailability(input, mockAdapter, 2000);
    if (out.kind === 'rejected') throw new Error('unexpected rejection');
    expect(out.explanation).toMatch(NEGATIVE);
  });

  test('E6 F3: a blank room label is rejected before the adapter is called', async () => {
    const { adapter, calls } = countingAdapter();
    const out = await explainAvailability(decide('11:00', '12:00', false, '   '), adapter, 2000);
    expect(out.kind).toBe('rejected');
    expect(calls.n).toBe(0);
  });

  test('E7 F3: a 500-character room label is rejected before the adapter is called', async () => {
    const { adapter, calls } = countingAdapter();
    const out = await explainAvailability(decide('11:00', '12:00', false, 'R'.repeat(500)), adapter, 2000);
    expect(out.kind).toBe('rejected');
    expect(calls.n).toBe(0);
  });

  test('E8 F4: an adapter that never answers times out into the fallback, within the timeout', async () => {
    const never: ExplainAdapter = () => new Promise(() => {});
    const input = decide('10:30', '11:30');
    const started = Date.now();
    const out = await explainAvailability(input, never, 50);
    const elapsed = Date.now() - started;
    expect(out).toEqual({ kind: 'fallback', explanation: fallbackExplanation(input), cause: 'timeout' });
    expect(elapsed).toBeLessThan(1000);
  });

  test('E9 F4: an adapter that throws (simulated API failure) gives the fallback', async () => {
    const broken: ExplainAdapter = async () => {
      throw new Error('503 Service Unavailable');
    };
    const input = decide('11:00', '12:00');
    const out = await explainAvailability(input, broken, 2000);
    expect(out).toEqual({ kind: 'fallback', explanation: fallbackExplanation(input), cause: 'adapter_error' });
  });

  test('F2: an answer that contradicts the decision is replaced by the fallback', async () => {
    const liar: ExplainAdapter = async () => ({ explanation: 'Room A-101 is available, go ahead.' });
    const input = decide('10:30', '11:30');
    const out = await explainAvailability(input, liar, 2000);
    expect(out).toEqual({ kind: 'fallback', explanation: fallbackExplanation(input), cause: 'invalid_output' });
  });

  test('F2: an answer that names a time not in the request is replaced by the fallback', async () => {
    const inventor: ExplainAdapter = async () => ({ explanation: 'Room A-101 is not available; try 13:00 instead.' });
    const out = await explainAvailability(decide('10:30', '11:30'), inventor, 2000);
    expect(out.kind).toBe('fallback');
  });
});

import { useRef, useState } from 'react';
import { checkRequestWithReason, type ReasonCode } from './booking';
import { DEFAULT_TIMEOUT_MS, explainAvailability, failingMockAdapter, mockAdapter, type ExplainResult } from './explain';

type Interval = { start: number; end: number };
type Room = { id: string; name: string; blocked: boolean; bookings: Interval[] };

const ROOMS: Room[] = [
  { id: 'a101', name: 'Room A-101', blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'b204', name: 'Room B-204', blocked: false, bookings: [] },
];

const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/** The request exactly as it was checked, so the explanation never describes newer form values. */
type CheckedRequest = { roomLabel: string; start: string; end: string; isAvailable: boolean; reasonCode: ReasonCode };

export default function App() {
  const [roomId, setRoomId] = useState('a101');
  const [now, setNow] = useState('09:00');
  const [blocked, setBlocked] = useState(false);
  const [start, setStart] = useState('11:00');
  const [end, setEnd] = useState('12:00');
  const [endOfDay, setEndOfDay] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState<CheckedRequest | null>(null);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const [explained, setExplained] = useState<ExplainResult | null>(null);
  const explainRun = useRef(0);

  const room = ROOMS.find(r => r.id === roomId)!;

  function check() {
    const outcome = checkRequestWithReason({ now, start, end, endOfDay, blocked, bookings: room.bookings });
    setError(outcome.error);
    setResult(outcome.result);
    setChecked(outcome.result === null || outcome.reasonCode === null ? null : {
      roomLabel: room.name,
      start,
      end: endOfDay ? '24:00' : end,
      isAvailable: outcome.result,
      reasonCode: outcome.reasonCode,
    });
    explainRun.current += 1; // drop any explanation still in flight for the previous check
    setExplained(null);
    setExplaining(false);
  }

  async function explain() {
    if (!checked) return;
    const run = ++explainRun.current;
    setExplaining(true);
    setExplained(null);
    const adapter = simulateFailure ? failingMockAdapter : mockAdapter;
    const answer = await explainAvailability(checked, adapter, DEFAULT_TIMEOUT_MS);
    if (run !== explainRun.current) return;
    setExplained(answer);
    setExplaining(false);
  }

  return (
    <main className="page">
      <h1>Smart Campus Room Availability</h1>
      <div className="row">
        <label>Room
          <select value={roomId} onChange={e => setRoomId(e.target.value)}>
            {ROOMS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </label>
        <label>Current time<input type="time" value={now} onChange={e => setNow(e.target.value)} /></label>
        <label>Start<input type="time" value={start} onChange={e => setStart(e.target.value)} /></label>
        <label>End<input type="time" value={end} disabled={endOfDay} onChange={e => setEnd(e.target.value)} /></label>
        <label className="inline"><input type="checkbox" checked={endOfDay} onChange={e => setEndOfDay(e.target.checked)} /> Ends at 24:00</label>
        <label className="inline"><input type="checkbox" checked={blocked} onChange={e => setBlocked(e.target.checked)} /> Room blocked</label>
      </div>
      <button onClick={check}>Check availability</button>
      {error && <p className="error">{error}</p>}
      {result !== null && (
        <p className={`result ${result ? 'available' : 'unavailable'}`}>{result ? 'Available' : 'Unavailable'}</p>
      )}

      {checked && (
        <section className="explain" aria-label="Explanation">
          <div className="explain-controls">
            <button className="secondary" onClick={explain} disabled={explaining}>
              {explaining ? 'Explaining…' : 'Explain availability'}
            </button>
            <label className="inline">
              <input type="checkbox" checked={simulateFailure} onChange={e => setSimulateFailure(e.target.checked)} /> Simulate API failure
            </label>
          </div>
          <div aria-live="polite">
            {explained?.kind === 'generated' && (
              <div className="explanation">
                <p className="explanation-label">Generated explanation (mock), not a booking decision</p>
                <p>{explained.explanation}</p>
              </div>
            )}
            {explained?.kind === 'fallback' && (
              <div className="explanation">
                <p className="explanation-label">Fallback explanation from the booking rules (the generated one was unavailable), not a booking decision</p>
                <p>{explained.explanation}</p>
              </div>
            )}
            {explained?.kind === 'rejected' && <p className="error">Cannot explain this request: {explained.error}</p>}
          </div>
        </section>
      )}

      <h2>Existing bookings</h2>
      <ul>{room.bookings.length ? room.bookings.map((b, i) => <li key={i}>{fmt(b.start)}–{fmt(b.end)}</li>) : <li>none</li>}</ul>
    </main>
  );
}

import { useState } from 'react';
import { checkRoom } from './booking';
import { filterRooms } from './filter';
import { DEMO_NOW, EQUIPMENT, ROOMS } from './rooms';
import { END_OF_DAY, fmt, toMinutes } from './time';
import { RoomFilter } from './components/RoomFilter';
import { RoomList } from './components/RoomList';
import { ResultMessage } from './components/ResultMessage';

type Request = { start: number; end: number };

export default function App() {
  const [attendees, setAttendees] = useState('1');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [roomId, setRoomId] = useState('');
  const [start, setStart] = useState('11:00');
  const [end, setEnd] = useState('12:00');
  const [endOfDay, setEndOfDay] = useState(false);
  const [request, setRequest] = useState<Request | null>(null);
  const [error, setError] = useState('');

  // F1, F2: the list comes from filterRooms; the page adds no rule of its own.
  const visible = filterRooms(ROOMS, { attendees: Number(attendees) || 0, equipment });
  // A room hidden by the filter is no longer selected, so no result is shown for it.
  const selected = visible.find(r => r.id === roomId) ?? null;
  // F3, F5: recomputed on every render for the selected room with the last submitted times.
  const result = request && selected ? checkRoom(ROOMS, selected.id, { ...request, now: DEMO_NOW }) : null;

  function toggle(item: string) {
    setEquipment(list => (list.includes(item) ? list.filter(x => x !== item) : [...list, item]));
  }

  // Changing a time makes the old answer meaningless, so it is cleared until the next check.
  function changeTime(set: (v: string) => void) {
    return (value: string) => {
      set(value);
      setRequest(null);
    };
  }

  function check() {
    if (!start || (!end && !endOfDay)) {
      setError('Fill in the start and the end time.');
      setRequest(null);
      return;
    }
    if (!selected) {
      setError('Choose a room from the list first.');
      setRequest(null);
      return;
    }
    setError('');
    setRequest({ start: toMinutes(start), end: endOfDay ? END_OF_DAY : toMinutes(end) });
  }

  return (
    <main className="page">
      <h1>Smart Campus Room Availability</h1>
      <p className="hint">Current time (fixed demo): {fmt(DEMO_NOW)}</p>

      <RoomFilter
        attendees={attendees}
        onAttendeesChange={setAttendees}
        options={EQUIPMENT}
        selected={equipment}
        onToggle={toggle}
      />

      <h2>Rooms ({visible.length} of {ROOMS.length})</h2>
      <RoomList rooms={visible} selectedId={selected?.id ?? ''} onSelect={setRoomId} />

      <div className="row">
        <label>Start<input type="time" value={start} onChange={e => changeTime(setStart)(e.target.value)} /></label>
        <label>End<input type="time" value={end} disabled={endOfDay} onChange={e => changeTime(setEnd)(e.target.value)} /></label>
        <label className="inline">
          <input
            type="checkbox"
            checked={endOfDay}
            onChange={e => { setEndOfDay(e.target.checked); setRequest(null); }}
          /> Ends at 24:00
        </label>
      </div>
      <button onClick={check}>Check availability</button>
      {error && <p className="error" role="alert">{error}</p>}

      <ResultMessage room={selected} request={request} result={result} />
    </main>
  );
}

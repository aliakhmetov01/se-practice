import type { Room } from '../rooms';
import { fmt } from '../time';

type Props = {
  room: Room | null;
  request: { start: number; end: number } | null;
  result: boolean | null;
};

/** Shows the answer for the chosen room and that room's own bookings. Decides nothing itself. */
export function ResultMessage({ room, request, result }: Props) {
  if (!room) {
    return <p className="hint">Choose a room from the list to check it.</p>;
  }
  return (
    <section className="details" aria-label={`Details for ${room.name}`}>
      <p className="result-line" aria-live="polite">
        {result === null || !request ? (
          <span className="hint">Enter the times and press "Check availability".</span>
        ) : (
          <>
            {room.name}, {fmt(request.start)}–{fmt(request.end)}:{' '}
            <strong className={result ? 'available' : 'unavailable'}>
              {result ? 'Available' : 'Unavailable'}
            </strong>
          </>
        )}
      </p>
      <h2>Existing bookings in {room.name}</h2>
      <ul>
        {room.blocked && <li>The room is blocked: it cannot be booked.</li>}
        {room.bookings.length
          ? room.bookings.map(b => <li key={`${b.start}-${b.end}`}>{fmt(b.start)}–{fmt(b.end)}</li>)
          : <li>none</li>}
      </ul>
    </section>
  );
}

import type { Room } from '../rooms';

type Props = {
  rooms: Room[];
  selectedId: string;
  onSelect: (id: string) => void;
};

/** The rooms that passed the filter, or the F4 empty state. Blocked rooms stay visible with a label. */
export function RoomList({ rooms, selectedId, onSelect }: Props) {
  if (rooms.length === 0) {
    return (
      <p className="empty" role="status">
        No rooms match these requirements. Try fewer attendees or less equipment.
      </p>
    );
  }
  return (
    <ul className="rooms" aria-label="Matching rooms">
      {rooms.map(room => (
        <li key={room.id} className={room.id === selectedId ? 'room selected' : 'room'}>
          <label>
            <input
              type="radio"
              name="room"
              value={room.id}
              checked={room.id === selectedId}
              onChange={() => onSelect(room.id)}
            />
            <span className="room-name">{room.name}</span>
            {room.blocked && <span className="badge">Blocked</span>}
            <span className="room-meta">
              {room.capacity} seats · {room.equipment.length ? room.equipment.join(', ') : 'no equipment'}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}

import { useState } from 'react';
import { CheckCircle2, XCircle, Clock, MapPin, Users, Lock, CalendarClock } from 'lucide-react';
import type { AvailabilityResult, Booking, Room } from './types';
import { sampleBookings, sampleRooms } from './data';
import { evaluateAvailability, labelToMinutes, minutesToLabel } from './bookingLogic';

const TIME_OPTIONS: number[] = Array.from({ length: 145 }, (_, i) => i * 10); // 00:00..24:00 in 10-min steps

function AvailabilityBanner({ result }: { result: AvailabilityResult | null }) {
  if (!result) return null;
  const isAvailable = result.status === 'available';
  return (
    <div
      role="status"
      aria-live="polite"
      className={`mt-4 flex items-start gap-3 rounded-xl border p-4 text-sm ${
        isAvailable
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-rose-200 bg-rose-50 text-rose-800'
      }`}
    >
      {isAvailable ? (
        <CheckCircle2 className="mt-0.5 shrink-0" size={20} />
      ) : (
        <XCircle className="mt-0.5 shrink-0" size={20} />
      )}
      <div>
        <p className="font-semibold">{isAvailable ? 'Available' : 'Unavailable'}</p>
        <p className="mt-0.5">{result.reason}</p>
      </div>
    </div>
  );
}

function RoomCard({
  room,
  selected,
  onSelect,
}: {
  room: Room;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border p-4 text-left transition-all ${
        selected
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-gray-900">{room.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {room.building}
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} /> {room.capacity} seats
            </span>
          </div>
        </div>
        {room.blocked && (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
            <Lock size={11} /> Blocked
          </span>
        )}
      </div>
    </button>
  );
}

function App() {
  const [rooms] = useState<Room[]>(sampleRooms);
  const [bookings] = useState<Booking[]>(sampleBookings);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('r1');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('09:00');

  const systemNow = (() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  })();
  const [currentTime, setCurrentTime] = useState(minutesToLabel(systemNow));
  const currentMin = labelToMinutes(currentTime);

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  const startMin = labelToMinutes(startTime);
  const endMin = labelToMinutes(endTime);

  const result: AvailabilityResult = evaluateAvailability(
    startMin,
    endMin,
    currentMin,
    selectedRoom,
    bookings
  );

  const roomBookings = bookings
    .filter((b) => b.roomId === selectedRoomId)
    .sort((a, b) => a.startMin - b.startMin);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <CalendarClock size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 sm:text-xl">Smart Campus Room Availability</h1>
              <p className="text-xs text-slate-500 sm:text-sm">
                Check whether a room is free for your requested time slot.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* Left: form */}
          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                1. Select a room
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    selected={room.id === selectedRoomId}
                    onSelect={() => setSelectedRoomId(room.id)}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                2. Choose a time interval
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Start time</span>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {TIME_OPTIONS.filter((m) => m < 1440).map((m) => (
                      <option key={m} value={minutesToLabel(m)}>
                        {minutesToLabel(m)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">End time</span>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {TIME_OPTIONS.map((m) => (
                      <option key={m} value={minutesToLabel(m)}>
                        {minutesToLabel(m)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">Current time</span>
                  <select
                    value={currentTime}
                    onChange={(e) => setCurrentTime(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {TIME_OPTIONS.map((m) => (
                      <option key={m} value={minutesToLabel(m)}>
                        {minutesToLabel(m)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                <Clock size={13} /> Max booking length: 120 min
              </p>

              <AvailabilityBanner result={result} />
            </div>
          </section>

          {/* Right: room schedule */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Existing bookings
              </h2>
              {selectedRoom && (
                <span className="text-sm font-semibold text-slate-800">{selectedRoom.name}</span>
              )}
            </div>

            {roomBookings.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">No existing bookings for this room.</p>
            ) : (
              <ul className="space-y-2">
                {roomBookings.map((b) => {
                  const isOverlap =
                    startMin < b.endMin && endMin > b.startMin;
                  return (
                    <li
                      key={b.id}
                      className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm ${
                        isOverlap
                          ? 'border-rose-200 bg-rose-50'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-slate-800">
                          {minutesToLabel(b.startMin)} – {minutesToLabel(b.endMin)}
                        </p>
                        <p className="text-xs text-slate-500">{b.bookedBy}</p>
                      </div>
                      <span className="text-xs text-slate-400">{b.endMin - b.startMin} min</span>
                    </li>
                  );
                })}
              </ul>
            )}

            <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3 text-xs text-blue-700">
              This checker is read-only — it does not modify or create any bookings.
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;

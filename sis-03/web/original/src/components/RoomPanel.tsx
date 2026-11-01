import { CalendarClock, Clock, DoorOpen, ListChecks } from 'lucide-react';
import { formatMinutes, MAX_BOOKING_MINUTES, type Booking } from '@/lib/availability';

interface RoomPanelProps {
  name: string;
  location: string;
  bookings: Booking[];
}

const RULES = [
  'Start time must be later than the current time.',
  `Bookings can last at most ${MAX_BOOKING_MINUTES} minutes.`,
  'Blocked rooms cannot be booked.',
  'Back-to-back bookings are allowed.',
];

export default function RoomPanel({ name, location, bookings }: RoomPanelProps) {
  return (
    <aside className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
          <DoorOpen className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-semibold leading-[1.2] text-slate-900">{name}</h2>
          <p className="mt-1 text-sm text-slate-500">{location}</p>
        </div>
      </div>

      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <CalendarClock className="h-4 w-4 text-slate-500" aria-hidden="true" />
          Existing bookings
        </h3>
        {bookings.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No bookings for this room.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {bookings.map((booking) => (
              <li
                key={`${booking.startMin}-${booking.endMin}`}
                className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-4 py-3"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
                  <Clock className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  {formatMinutes(booking.startMin)} to {formatMinutes(booking.endMin)}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">Reserved</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <ListChecks className="h-4 w-4 text-slate-500" aria-hidden="true" />
          Booking rules
        </h3>
        <ul className="mt-3 space-y-2 text-sm leading-normal text-slate-600">
          {RULES.map((rule) => (
            <li key={rule} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-700" aria-hidden="true" />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="border-t border-slate-100 pt-4 text-xs leading-normal text-slate-500">
        This is a read-only check. Nothing is booked or changed here.
      </p>
    </aside>
  );
}

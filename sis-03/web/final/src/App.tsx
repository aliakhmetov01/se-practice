import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import AvailabilityForm from '@/components/AvailabilityForm';
import AvailabilityResult from '@/components/AvailabilityResult';
import RoomPanel from '@/components/RoomPanel';
import {
  checkAvailability,
  getRangeError,
  parseTimeToMinutes,
  validateBookingRequest,
  type Booking,
  type CheckOutcome,
} from '@/lib/availability';

const ROOM = {
  name: 'Room B-204',
  location: 'Library, second floor',
};

const EXISTING_BOOKINGS: Booking[] = [
  { startMin: 600, endMin: 660 },
  { startMin: 700, endMin: 760 },
];
const BASELINE_NOW = '09:00';

function App() {
  const [nowValue, setNowValue] = useState(BASELINE_NOW);
  const [startValue, setStartValue] = useState('');
  const [endValue, setEndValue] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [outcome, setOutcome] = useState<CheckOutcome | null>(null);

  const rangeError = getRangeError(startValue, endValue);

  const withOutcomeReset = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setOutcome(null);
  };

  const toggleBlocked = () => {
    setBlocked((current) => !current);
    setOutcome(null);
  };

  const handleCheck = () => {
    const validation = validateBookingRequest(startValue, endValue, parseTimeToMinutes(nowValue));
    if (!validation.ok) {
      setOutcome({ type: 'error', message: validation.message });
      return;
    }

    const result = checkAvailability(validation.request, { blocked, bookings: EXISTING_BOOKINGS });
    setOutcome({ type: 'result', request: validation.request, result });
  };

  return (
    <div className="min-h-screen bg-slate-50 leading-normal text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-base font-semibold leading-[1.2] text-slate-900">Smart Campus</p>
            <p className="text-sm text-slate-500">Room availability checker</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 max-w-2xl">
          <h1 className="text-2xl font-bold leading-[1.2] text-slate-900 sm:text-3xl">
            Check if a room is free
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Pick a time window to see whether {ROOM.name} can be booked.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <AvailabilityForm
              nowValue={nowValue}
              startValue={startValue}
              endValue={endValue}
              blocked={blocked}
              rangeError={rangeError}
              onNowChange={withOutcomeReset(setNowValue)}
              onStartChange={withOutcomeReset(setStartValue)}
              onEndChange={withOutcomeReset(setEndValue)}
              onBlockedToggle={toggleBlocked}
              onSubmit={handleCheck}
            />
            <AvailabilityResult outcome={outcome} />
          </div>

          <div className="lg:col-span-2">
            <RoomPanel name={ROOM.name} location={ROOM.location} bookings={EXISTING_BOOKINGS} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

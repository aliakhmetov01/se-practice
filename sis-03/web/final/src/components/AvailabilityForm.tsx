import { AlertCircle, Search } from 'lucide-react';

interface AvailabilityFormProps {
  nowValue: string;
  startValue: string;
  endValue: string;
  blocked: boolean;
  rangeError: string | null;
  onNowChange: (value: string) => void;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onBlockedToggle: () => void;
  onSubmit: () => void;
}

interface TimeFieldProps {
  id: string;
  label: string;
  value: string;
  invalid: boolean;
  onChange: (value: string) => void;
}

function TimeField({ id, label, value, invalid, onChange }: TimeFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        type="time"
        value={value}
        aria-invalid={invalid}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-base text-slate-900 shadow-sm transition focus:outline-none focus:ring-4 ${
          invalid
            ? 'border-rose-600 focus:border-rose-600 focus:ring-rose-600/15'
            : 'border-slate-300 focus:border-teal-600 focus:ring-teal-600/15'
        }`}
      />
    </div>
  );
}

export default function AvailabilityForm({
  nowValue,
  startValue,
  endValue,
  blocked,
  rangeError,
  onNowChange,
  onStartChange,
  onEndChange,
  onBlockedToggle,
  onSubmit,
}: AvailabilityFormProps) {
  const rangeInvalid = rangeError !== null;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
    >
      <div>
        <h2 className="text-lg font-semibold leading-[1.2] text-slate-900">Choose a booking window</h2>
        <p className="mt-2 text-sm text-slate-500">
          Bookings can last up to 2 hours and must start after the current time.
        </p>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
          <div className="col-span-2 sm:col-span-1">
            <TimeField id="now" label="Current time" value={nowValue} invalid={false} onChange={onNowChange} />
          </div>
          <TimeField id="start" label="Start time" value={startValue} invalid={rangeInvalid} onChange={onStartChange} />
          <TimeField id="end" label="End time" value={endValue} invalid={rangeInvalid} onChange={onEndChange} />
        </div>

        {rangeError && (
          <p role="alert" className="flex items-start gap-2 text-sm font-medium text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{rangeError}</span>
          </p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={blocked}
        onClick={onBlockedToggle}
        className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/15"
      >
        <span>
          <span className="block text-sm font-medium text-slate-900">Room is blocked</span>
          <span className="mt-1 block text-sm text-slate-500">Blocked rooms cannot be booked.</span>
        </span>
        <span
          className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
            blocked ? 'bg-rose-700' : 'bg-slate-300'
          }`}
          aria-hidden="true"
        >
          <span
            className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
              blocked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </span>
      </button>

      <div className="flex sm:justify-end">
        <button
          type="submit"
          disabled={rangeInvalid}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-teal-800 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-600/30 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-700 disabled:shadow-none disabled:active:scale-100 sm:w-auto"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Check Availability
        </button>
      </div>
    </form>
  );
}

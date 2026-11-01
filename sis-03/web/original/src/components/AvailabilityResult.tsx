import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { formatMinutes, type CheckOutcome } from '@/lib/availability';

interface AvailabilityResultProps {
  outcome: CheckOutcome | null;
}

function WindowLabel({ startMin, endMin }: { startMin: number; endMin: number }) {
  return (
    <span className="font-semibold">
      {formatMinutes(startMin)} to {formatMinutes(endMin)}
    </span>
  );
}

export default function AvailabilityResult({ outcome }: AvailabilityResultProps) {
  if (!outcome) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-slate-600">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" aria-hidden="true" />
        <p className="text-sm leading-normal">
          Enter a booking window and press Check Availability to see whether the room is free.
        </p>
      </div>
    );
  }

  if (outcome.type === 'error') {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5"
      >
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" aria-hidden="true" />
        <div>
          <p className="font-semibold leading-[1.2] text-rose-900">Check your booking window</p>
          <p className="mt-2 text-sm leading-normal text-rose-800">{outcome.message}</p>
        </div>
      </div>
    );
  }

  const { request, result } = outcome;

  if (result.status === 'available') {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5"
      >
        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-700" aria-hidden="true" />
        <div>
          <p className="inline-flex items-center rounded-full bg-emerald-700 px-3 py-1 text-sm font-semibold text-white">
            Available
          </p>
          <p className="mt-3 text-sm leading-normal text-emerald-900">
            The room is free from <WindowLabel startMin={request.startMin} endMin={request.endMin} />. No
            conflicts were found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5"
    >
      <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-rose-700" aria-hidden="true" />
      <div>
        <p className="inline-flex items-center rounded-full bg-rose-700 px-3 py-1 text-sm font-semibold text-white">
          Unavailable
        </p>
        <p className="mt-3 text-sm leading-normal text-rose-900">
          The room is not free from <WindowLabel startMin={request.startMin} endMin={request.endMin} />.{' '}
          {result.reason}
        </p>
      </div>
    </div>
  );
}

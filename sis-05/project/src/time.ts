// src/time.ts - turning "HH:MM" into minutes after midnight and back. Formatting only, no rules.

/** 24:00, used when the "Ends at 24:00" box is ticked. */
export const END_OF_DAY = 1440;

export const toMinutes = (value: string): number => {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
};

export const fmt = (m: number): string =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

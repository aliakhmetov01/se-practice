// src/rooms.ts - data only: the types and the fictional catalog. No rules live here.

/** A booked interval in minutes after midnight (600 = 10:00). */
export interface Booking {
  start: number;
  end: number;
}

export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: Booking[];
};

/** The equipment a user can ask for in the filter. */
export const EQUIPMENT: string[] = ['projector', 'whiteboard', 'video-conference', 'computers'];

/** The fixed demo "current time": 09:00, the same value the tests use. */
export const DEMO_NOW = 540;

/** Fictional rooms. Nothing here is real campus data. */
export const ROOMS: Room[] = [
  {
    id: 'a101',
    name: 'Room A-101',
    capacity: 12,
    equipment: ['projector', 'whiteboard'],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: 'b204',
    name: 'Room B-204',
    capacity: 8,
    equipment: ['whiteboard'],
    blocked: false,
    bookings: [],
  },
  {
    id: 'c310',
    name: 'Lab C-310',
    capacity: 24,
    equipment: ['projector', 'computers'],
    blocked: false,
    bookings: [{ start: 720, end: 840 }],
  },
  {
    id: 'd015',
    name: 'Seminar Hall D-015',
    capacity: 40,
    equipment: ['projector', 'whiteboard', 'video-conference'],
    blocked: true,
    bookings: [],
  },
  {
    id: 'e112',
    name: 'Study Room E-112',
    capacity: 4,
    equipment: ['video-conference'],
    blocked: false,
    bookings: [{ start: 540, end: 600 }, { start: 900, end: 960 }],
  },
];

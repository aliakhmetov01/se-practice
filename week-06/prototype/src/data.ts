import type { Room, Booking } from './types';

export const sampleRooms: Room[] = [
  { id: 'r1', name: 'Lecture Hall A', building: 'North Wing', capacity: 120, blocked: false },
  { id: 'r2', name: 'Lab 204', building: 'Engineering Block', capacity: 40, blocked: true },
  { id: 'r3', name: 'Seminar Room 12', building: 'Central Hub', capacity: 25, blocked: false },
  { id: 'r4', name: 'Auditorium B', building: 'South Wing', capacity: 300, blocked: false },
  { id: 'r5', name: 'Study Room 7', building: 'Library', capacity: 8, blocked: false },
];

export const sampleBookings: Booking[] = [
  { id: 'b1', roomId: 'r1', startMin: 540, endMin: 600, bookedBy: 'Dr. Patel' },
  { id: 'b2', roomId: 'r1', startMin: 780, endMin: 840, bookedBy: 'Prof. Nguyen' },
  { id: 'b3', roomId: 'r3', startMin: 600, endMin: 660, bookedBy: 'Study Group Alpha' },
  { id: 'b4', roomId: 'r3', startMin: 900, endMin: 960, bookedBy: 'Debate Club' },
  { id: 'b5', roomId: 'r4', startMin: 480, endMin: 540, bookedBy: 'Open House' },
  { id: 'b6', roomId: 'r5', startMin: 660, endMin: 720, bookedBy: 'Quiet Study' },
];

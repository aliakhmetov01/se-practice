export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  startMin: number;
  endMin: number;
  bookedBy: string;
}

export type AvailabilityStatus = 'available' | 'unavailable';

export interface AvailabilityResult {
  status: AvailabilityStatus;
  reason: string;
}

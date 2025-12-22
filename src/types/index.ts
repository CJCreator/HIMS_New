export type UserRole = 'admin' | 'doctor' | 'receptionist' | 'nurse' | 'pharmacist' | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address: string;
  emergencyContact: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  type: string;
}

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'icon' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'search' | 'date' | 'datetime-local' | 'time';
export type BadgeStatus = 'request' | 'pending' | 'sent' | 'dispatched' | 'received' | 'delivered' | 'error';
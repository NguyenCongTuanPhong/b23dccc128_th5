import { request } from 'umi';

export interface Appointment {
  id: string;
  customerName: string;
  service: string;
  employee: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  note?: string;
  createdAt: string;
  updatedAt: string;
}

// Key for localStorage
const STORAGE_KEY = 'salon_appointments';

// Get appointments from localStorage
const getStoredAppointments = (): Appointment[] => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : [];
};

// Save appointments to localStorage
const saveAppointmentsToStorage = (appointments: Appointment[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
};

// Get all appointments
export async function getAppointments() {
  const appointments = getStoredAppointments();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: appointments,
        success: true,
      });
    }, 300);
  });
}

// Get appointment by id
export async function getAppointment(id: string) {
  const appointments = getStoredAppointments();
  const appointment = appointments.find(a => a.id === id);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: appointment,
        success: true,
      });
    }, 300);
  });
}

// Add new appointment
export async function addAppointment(data: Omit<Appointment, 'id' | 'status' | 'createdAt' | 'updatedAt'>) {
  const appointments = getStoredAppointments();
  const newAppointment: Appointment = {
    ...data,
    id: `${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  appointments.push(newAppointment);
  saveAppointmentsToStorage(appointments);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: newAppointment,
        success: true,
      });
    }, 300);
  });
}

// Update appointment
export async function updateAppointment(data: Appointment) {
  const appointments = getStoredAppointments();
  const index = appointments.findIndex(a => a.id === data.id);
  
  if (index > -1) {
    appointments[index] = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    saveAppointmentsToStorage(appointments);
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: appointments[index],
        success: true,
      });
    }, 300);
  });
}

// Update appointment status
export async function updateAppointmentStatus(id: string, status: Appointment['status']) {
  const appointments = getStoredAppointments();
  const index = appointments.findIndex(a => a.id === id);
  
  if (index > -1) {
    appointments[index] = {
      ...appointments[index],
      status,
      updatedAt: new Date().toISOString(),
    };
    saveAppointmentsToStorage(appointments);
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: appointments[index],
        success: true,
      });
    }, 300);
  });
}

// Delete appointment
export async function deleteAppointment(id: string) {
  const appointments = getStoredAppointments();
  const filteredAppointments = appointments.filter(a => a.id !== id);
  saveAppointmentsToStorage(filteredAppointments);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
      });
    }, 300);
  });
}

// Get appointments by date range
export async function getAppointmentsByDateRange(startDate: string, endDate: string) {
  const appointments = getStoredAppointments();
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    return appointmentDate >= new Date(startDate) && appointmentDate <= new Date(endDate);
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: filteredAppointments,
        success: true,
      });
    }, 300);
  });
}

// Get appointments by employee
export async function getAppointmentsByEmployee(employeeId: string) {
  const appointments = getStoredAppointments();
  const filteredAppointments = appointments.filter(a => a.employee === employeeId);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: filteredAppointments,
        success: true,
      });
    }, 300);
  });
} 
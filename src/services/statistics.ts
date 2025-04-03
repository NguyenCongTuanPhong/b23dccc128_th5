import { request } from 'umi';
import moment from 'moment';
import type { Appointment } from './appointment';
import type { Service } from '@/models/Service';

export interface Revenue {
  date: string;
  amount: number;
  serviceId: string;
  employeeId: string;
  appointmentId: string;
}

// Key for localStorage
const STORAGE_KEY = 'salon_revenues';

// Get revenues from localStorage
const getStoredRevenues = (): Revenue[] => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : [];
};

// Save revenues to localStorage
const saveRevenuesToStorage = (revenues: Revenue[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(revenues));
};

// Add revenue record
export async function addRevenue(data: Omit<Revenue, 'date'>) {
  const revenues = getStoredRevenues();
  const newRevenue: Revenue = {
    ...data,
    date: new Date().toISOString(),
  };
  
  revenues.push(newRevenue);
  saveRevenuesToStorage(revenues);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: newRevenue,
        success: true,
      });
    }, 300);
  });
}

// Get daily revenue
export async function getDailyRevenue(date: string) {
  const revenues = getStoredRevenues();
  const dailyRevenues = revenues.filter(r => 
    moment(r.date).format('YYYY-MM-DD') === date
  );
  
  const total = dailyRevenues.reduce((acc, curr) => acc + curr.amount, 0);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          date,
          total,
          details: dailyRevenues,
        },
        success: true,
      });
    }, 300);
  });
}

// Get monthly revenue
export async function getMonthlyRevenue(year: number, month: number) {
  const revenues = getStoredRevenues();
  const monthlyRevenues = revenues.filter(r => {
    const revenueDate = moment(r.date);
    return revenueDate.year() === year && revenueDate.month() === month - 1;
  });
  
  const total = monthlyRevenues.reduce((acc, curr) => acc + curr.amount, 0);
  
  // Group by day
  const dailyStats = monthlyRevenues.reduce((acc: { [key: string]: number }, curr) => {
    const day = moment(curr.date).format('YYYY-MM-DD');
    acc[day] = (acc[day] || 0) + curr.amount;
    return acc;
  }, {});

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          year,
          month,
          total,
          dailyStats,
          details: monthlyRevenues,
        },
        success: true,
      });
    }, 300);
  });
}

// Get revenue by service
export async function getRevenueByService(serviceId: string, startDate: string, endDate: string) {
  const revenues = getStoredRevenues();
  const serviceRevenues = revenues.filter(r => 
    r.serviceId === serviceId &&
    moment(r.date).isBetween(startDate, endDate, 'day', '[]')
  );
  
  const total = serviceRevenues.reduce((acc, curr) => acc + curr.amount, 0);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          serviceId,
          total,
          details: serviceRevenues,
        },
        success: true,
      });
    }, 300);
  });
}

// Get revenue by employee
export async function getRevenueByEmployee(employeeId: string, startDate: string, endDate: string) {
  const revenues = getStoredRevenues();
  const employeeRevenues = revenues.filter(r => 
    r.employeeId === employeeId &&
    moment(r.date).isBetween(startDate, endDate, 'day', '[]')
  );
  
  const total = employeeRevenues.reduce((acc, curr) => acc + curr.amount, 0);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          employeeId,
          total,
          details: employeeRevenues,
        },
        success: true,
      });
    }, 300);
  });
}

// Get revenue statistics
export async function getRevenueStatistics(startDate: string, endDate: string) {
  const revenues = getStoredRevenues();
  const periodRevenues = revenues.filter(r =>
    moment(r.date).isBetween(startDate, endDate, 'day', '[]')
  );

  // Tổng doanh thu
  const totalRevenue = periodRevenues.reduce((acc, curr) => acc + curr.amount, 0);

  // Doanh thu theo dịch vụ
  const revenueByService = periodRevenues.reduce((acc: { [key: string]: number }, curr) => {
    acc[curr.serviceId] = (acc[curr.serviceId] || 0) + curr.amount;
    return acc;
  }, {});

  // Doanh thu theo nhân viên
  const revenueByEmployee = periodRevenues.reduce((acc: { [key: string]: number }, curr) => {
    acc[curr.employeeId] = (acc[curr.employeeId] || 0) + curr.amount;
    return acc;
  }, {});

  // Doanh thu theo ngày
  const revenueByDate = periodRevenues.reduce((acc: { [key: string]: number }, curr) => {
    const date = moment(curr.date).format('YYYY-MM-DD');
    acc[date] = (acc[date] || 0) + curr.amount;
    return acc;
  }, {});

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          totalRevenue,
          revenueByService,
          revenueByEmployee,
          revenueByDate,
          details: periodRevenues,
        },
        success: true,
      });
    }, 300);
  });
}

// Get appointment completion rate
export async function getAppointmentCompletionRate(startDate: string, endDate: string) {
  const appointments = JSON.parse(localStorage.getItem('salon_appointments') || '[]');
  const periodAppointments = appointments.filter((a: Appointment) =>
    moment(a.date).isBetween(startDate, endDate, 'day', '[]')
  );

  const total = periodAppointments.length;
  const completed = periodAppointments.filter((a: Appointment) => a.status === 'completed').length;
  const cancelled = periodAppointments.filter((a: Appointment) => a.status === 'cancelled').length;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          total,
          completed,
          cancelled,
          completionRate: total > 0 ? (completed / total) * 100 : 0,
          cancellationRate: total > 0 ? (cancelled / total) * 100 : 0,
        },
        success: true,
      });
    }, 300);
  });
} 
import { request } from 'umi';
import type { Employee } from '@/models/Employee';

// Sử dụng local storage để lưu trữ
const STORAGE_KEY = 'salon_employees';

// Hàm lấy danh sách nhân viên từ localStorage
const getStoredEmployees = (): Employee[] => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : [];
};

// Hàm lưu danh sách nhân viên vào localStorage
const saveEmployeesToStorage = (employees: Employee[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
};

// Hàm lấy danh sách nhân viên
export async function getEmployees() {
  const employees = getStoredEmployees();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: employees,
        success: true,
      });
    }, 300);
  });
}

// Hàm lấy thông tin nhân viên
export async function getEmployee(id: string) {
  const employees = getStoredEmployees();
  const employee = employees.find(e => e.id === id);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: employee,
        success: true,
      });
    }, 300);
  });
}

// Hàm thêm nhân viên mới
export async function addEmployee(data: Omit<Employee, 'id'>) {
  const employees = getStoredEmployees();
  const newEmployee = {
    ...data,
    id: `${Date.now()}`, // Sử dụng timestamp làm id
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  employees.push(newEmployee);
  saveEmployeesToStorage(employees);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: newEmployee,
        success: true,
      });
    }, 300);
  });
}

// Hàm cập nhật thông tin nhân viên
export async function updateEmployee(data: Employee) {
  const employees = getStoredEmployees();
  const index = employees.findIndex(e => e.id === data.id);
  if (index > -1) {
    employees[index] = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    saveEmployeesToStorage(employees);
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: employees[index],
        success: true,
      });
    }, 300);
  });
}

// Hàm xóa nhân viên
export async function deleteEmployee(id: string) {
  const employees = getStoredEmployees();
  const filteredEmployees = employees.filter(e => e.id !== id);
  saveEmployeesToStorage(filteredEmployees);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
      });
    }, 300);
  });
} 
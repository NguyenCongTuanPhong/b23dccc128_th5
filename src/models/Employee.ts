import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '@/services/employee';

export interface Rating {
  id: string;
  appointmentId: string;
  customerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface WorkSchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Employee {
  id: string;
  name: string;
  position: 'stylist' | 'technician' | 'assistant' | 'receptionist';
  maxCustomersPerDay: number;
  workSchedule: WorkSchedule[];
  ratings: Rating[];
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeModelState {
  employees: Employee[];
}

export interface EmployeeModelType {
  namespace: 'employee';
  state: EmployeeModelState;
  effects: {
    fetchEmployees: Effect;
    addEmployee: Effect;
    updateEmployee: Effect;
    deleteEmployee: Effect;
    addRating: Effect;
  };
  reducers: {
    setEmployees: Reducer<EmployeeModelState>;
    updateEmployeeList: Reducer<EmployeeModelState>;
  };
}

const getStoredEmployees = (): Employee[] => {
  const storedData = localStorage.getItem('salon_employees');
  return storedData ? JSON.parse(storedData) : [];
};

const saveEmployeesToStorage = (employees: Employee[]) => {
  localStorage.setItem('salon_employees', JSON.stringify(employees));
};

const calculateAverageRating = (ratings: Rating[]): number => {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
  return Number((sum / ratings.length).toFixed(1));
};

const EmployeeModel: EmployeeModelType = {
  namespace: 'employee',

  state: {
    employees: [],
  },

  effects: {
    *fetchEmployees(_, { put }) {
      const employees = getStoredEmployees();
      yield put({
        type: 'setEmployees',
        payload: employees,
      });
    },

    *addEmployee({ payload }, { put }) {
      const employees = getStoredEmployees();
      const newEmployee: Employee = {
        ...payload,
        id: `emp_${Date.now()}`,
        ratings: [],
        averageRating: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedEmployees = [...employees, newEmployee];
      saveEmployeesToStorage(updatedEmployees);

      yield put({
        type: 'setEmployees',
        payload: updatedEmployees,
      });
      message.success('Thêm nhân viên thành công!');
    },

    *updateEmployee({ payload }, { put }) {
      const employees = getStoredEmployees();
      const index = employees.findIndex(emp => emp.id === payload.id);

      if (index !== -1) {
        const updatedEmployee = {
          ...employees[index],
          ...payload,
          updatedAt: new Date().toISOString(),
          ratings: employees[index].ratings || [],
          averageRating: employees[index].averageRating || 0,
        };

        const updatedEmployees = [
          ...employees.slice(0, index),
          updatedEmployee,
          ...employees.slice(index + 1),
        ];

        saveEmployeesToStorage(updatedEmployees);

        yield put({
          type: 'setEmployees',
          payload: updatedEmployees,
        });
        message.success('Cập nhật thông tin nhân viên thành công!');
      }
    },

    *deleteEmployee({ payload }, { put }) {
      const employees = getStoredEmployees();
      const updatedEmployees = employees.filter(emp => emp.id !== payload);
      saveEmployeesToStorage(updatedEmployees);

      yield put({
        type: 'setEmployees',
        payload: updatedEmployees,
      });
      message.success('Xóa nhân viên thành công!');
    },

    *addRating({ payload }, { put }) {
      const { employeeId, rating } = payload;
      const employees = getStoredEmployees();
      const index = employees.findIndex(emp => emp.id === employeeId);

      if (index !== -1) {
        const employee = employees[index];
        const newRating: Rating = {
          id: `rating_${Date.now()}`,
          ...rating,
          createdAt: new Date().toISOString(),
        };

        const updatedEmployee = {
          ...employee,
          ratings: [...(employee.ratings || []), newRating],
        };
        updatedEmployee.averageRating = calculateAverageRating(updatedEmployee.ratings);

        const updatedEmployees = [
          ...employees.slice(0, index),
          updatedEmployee,
          ...employees.slice(index + 1),
        ];

        saveEmployeesToStorage(updatedEmployees);

        yield put({
          type: 'setEmployees',
          payload: updatedEmployees,
        });
        message.success('Đánh giá nhân viên thành công!');
      }
    },
  },

  reducers: {
    setEmployees(state, { payload }) {
      return {
        ...state,
        employees: payload,
      };
    },

    updateEmployeeList(state, { payload }) {
      return {
        ...state,
        employees: payload,
      };
    },
  },
};

export default EmployeeModel; 
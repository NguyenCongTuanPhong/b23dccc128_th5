import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import {
  getAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
  Appointment
} from '@/services/appointment';

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Appointment {
  id: string;
  customerId: string;
  employeeId: string;
  serviceId: string;
  date: string; // Format: "YYYY-MM-DD"
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  status: AppointmentStatus;
  employee?: Employee;
  service?: Service;
}

export interface AppointmentModelState {
  appointments: Appointment[];
}

export interface AppointmentModelType {
  namespace: 'appointment';
  state: AppointmentModelState;
  effects: {
    fetchAppointments: Effect;
    addAppointment: Effect;
    updateAppointment: Effect;
    deleteAppointment: Effect;
    updateAppointmentStatus: Effect;
  };
  reducers: {
    saveAppointments: Reducer<AppointmentModelState>;
    addAppointmentToList: Reducer<AppointmentModelState>;
    updateAppointmentInList: Reducer<AppointmentModelState>;
    removeAppointmentFromList: Reducer<AppointmentModelState>;
  };
}

const AppointmentModel: AppointmentModelType = {
  namespace: 'appointment',

  state: {
    appointments: [],
  },

  effects: {
    *fetchAppointments(_, { call, put }) {
      try {
        const response = yield call(getAppointments);
        if (response.success) {
          yield put({
            type: 'saveAppointments',
            payload: response.data,
          });
        }
      } catch (error) {
        message.error('Không thể tải danh sách lịch hẹn');
      }
    },

    *addAppointment({ payload }, { call, put }) {
      try {
        const response = yield call(addAppointment, payload);
        if (response.success) {
          yield put({
            type: 'addAppointmentToList',
            payload: response.data,
          });
          message.success('Thêm lịch hẹn thành công');
        }
      } catch (error) {
        message.error('Không thể thêm lịch hẹn');
      }
    },

    *updateAppointment({ payload }, { call, put }) {
      try {
        const response = yield call(updateAppointment, payload);
        if (response.success) {
          yield put({
            type: 'updateAppointmentInList',
            payload: response.data,
          });
          message.success('Cập nhật lịch hẹn thành công');
        }
      } catch (error) {
        message.error('Không thể cập nhật lịch hẹn');
      }
    },

    *deleteAppointment({ payload }, { call, put }) {
      try {
        const response = yield call(deleteAppointment, payload);
        if (response.success) {
          yield put({
            type: 'removeAppointmentFromList',
            payload,
          });
          message.success('Xóa lịch hẹn thành công');
        }
      } catch (error) {
        message.error('Không thể xóa lịch hẹn');
      }
    },

    *updateAppointmentStatus({ payload }, { call, put }) {
      try {
        const { id, status } = payload;
        const response = yield call(updateAppointmentStatus, id, status);
        if (response.success) {
          yield put({
            type: 'updateAppointmentInList',
            payload: response.data,
          });
          message.success('Cập nhật trạng thái thành công');
        }
      } catch (error) {
        message.error('Không thể cập nhật trạng thái');
      }
    },
  },

  reducers: {
    saveAppointments(state, { payload }) {
      return {
        ...state,
        appointments: payload,
      };
    },

    addAppointmentToList(state, { payload }) {
      return {
        ...state,
        appointments: [...state.appointments, payload],
      };
    },

    updateAppointmentInList(state, { payload }) {
      const appointments = state.appointments.map(appointment =>
        appointment.id === payload.id ? payload : appointment
      );
      return {
        ...state,
        appointments,
      };
    },

    removeAppointmentFromList(state, { payload: id }) {
      return {
        ...state,
        appointments: state.appointments.filter(appointment => appointment.id !== id),
      };
    },
  },
};

export default AppointmentModel; 
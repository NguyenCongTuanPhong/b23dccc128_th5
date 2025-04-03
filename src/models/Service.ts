import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import { getServices, addService, updateService, deleteService } from '@/services/service';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceModelState {
  services: Service[];
}

export interface ServiceModelType {
  namespace: 'service';
  state: ServiceModelState;
  effects: {
    fetchServices: Effect;
    addService: Effect;
    updateService: Effect;
    deleteService: Effect;
  };
  reducers: {
    saveServices: Reducer<ServiceModelState>;
    addServiceToList: Reducer<ServiceModelState>;
    updateServiceInList: Reducer<ServiceModelState>;
    removeServiceFromList: Reducer<ServiceModelState>;
  };
}

const ServiceModel: ServiceModelType = {
  namespace: 'service',

  state: {
    services: [],
  },

  effects: {
    *fetchServices(_, { call, put }) {
      try {
        const response = yield call(getServices);
        yield put({
          type: 'saveServices',
          payload: response.data,
        });
      } catch (error) {
        message.error('Không thể tải danh sách dịch vụ');
      }
    },

    *addService({ payload }, { call, put }) {
      try {
        const response = yield call(addService, payload);
        yield put({
          type: 'addServiceToList',
          payload: response.data,
        });
        message.success('Thêm dịch vụ thành công');
      } catch (error) {
        message.error('Không thể thêm dịch vụ');
      }
    },

    *updateService({ payload }, { call, put }) {
      try {
        const response = yield call(updateService, payload);
        yield put({
          type: 'updateServiceInList',
          payload: response.data,
        });
        message.success('Cập nhật dịch vụ thành công');
      } catch (error) {
        message.error('Không thể cập nhật dịch vụ');
      }
    },

    *deleteService({ payload }, { call, put }) {
      try {
        yield call(deleteService, payload);
        yield put({
          type: 'removeServiceFromList',
          payload,
        });
        message.success('Xóa dịch vụ thành công');
      } catch (error) {
        message.error('Không thể xóa dịch vụ');
      }
    },
  },

  reducers: {
    saveServices(state, { payload }) {
      return {
        ...state,
        services: payload,
      };
    },

    addServiceToList(state, { payload }) {
      return {
        ...state,
        services: [...state.services, payload],
      };
    },

    updateServiceInList(state, { payload }) {
      const updatedServices = state.services.map(service =>
        service.id === payload.id ? payload : service
      );
      return {
        ...state,
        services: updatedServices,
      };
    },

    removeServiceFromList(state, { payload: id }) {
      const filteredServices = state.services.filter(service => service.id !== id);
      return {
        ...state,
        services: filteredServices,
      };
    },
  },
};

export default ServiceModel; 
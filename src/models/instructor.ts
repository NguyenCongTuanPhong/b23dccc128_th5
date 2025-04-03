import { Effect, Reducer } from 'umi';
import { Instructor, InstructorFormData } from '@/types/instructor';
import { addInstructor, deleteInstructor, getInstructors, updateInstructor } from '@/services/instructor';

export interface InstructorModelState {
  instructors: Instructor[];
}

export interface InstructorModelType {
  namespace: 'instructor';
  state: InstructorModelState;
  effects: {
    fetchInstructors: Effect;
    addInstructor: Effect;
    updateInstructor: Effect;
    deleteInstructor: Effect;
  };
  reducers: {
    saveInstructors: Reducer<InstructorModelState>;
  };
}

const InstructorModel: InstructorModelType = {
  namespace: 'instructor',
  state: {
    instructors: [],
  },
  effects: {
    *fetchInstructors(_, { call, put }) {
      const instructors = yield call(getInstructors);
      yield put({
        type: 'saveInstructors',
        payload: instructors,
      });
    },
    *addInstructor({ payload }, { call, put }) {
      yield call(addInstructor, payload);
      yield put({ type: 'fetchInstructors' });
    },
    *updateInstructor({ payload }, { call, put }) {
      const { id, data } = payload;
      yield call(updateInstructor, id, data);
      yield put({ type: 'fetchInstructors' });
    },
    *deleteInstructor({ payload }, { call, put }) {
      yield call(deleteInstructor, payload);
      yield put({ type: 'fetchInstructors' });
    },
  },
  reducers: {
    saveInstructors(state, { payload }) {
      return {
        ...state,
        instructors: payload,
      };
    },
  },
};

export default InstructorModel; 
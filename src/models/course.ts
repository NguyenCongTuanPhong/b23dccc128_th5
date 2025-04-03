import { Effect, Reducer } from 'umi';
import { Course, CourseFilter, CourseFormData } from '@/types/course';
import { addCourse, deleteCourse, getCourses, updateCourse } from '@/services/course';

export interface CourseModelState {
  courses: Course[];
  filters: CourseFilter;
}

export interface CourseModelType {
  namespace: 'course';
  state: CourseModelState;
  effects: {
    fetchCourses: Effect;
    addCourse: Effect;
    updateCourse: Effect;
    deleteCourse: Effect;
  };
  reducers: {
    saveCourses: Reducer<CourseModelState>;
    setFilters: Reducer<CourseModelState>;
  };
}

const CourseModel: CourseModelType = {
  namespace: 'course',
  state: {
    courses: [],
    filters: {},
  },
  effects: {
    *fetchCourses(_, { call, put }) {
      const courses = yield call(getCourses);
      yield put({
        type: 'saveCourses',
        payload: courses,
      });
    },
    *addCourse({ payload }, { call, put }) {
      yield call(addCourse, payload);
      yield put({ type: 'fetchCourses' });
    },
    *updateCourse({ payload }, { call, put }) {
      const { id, data } = payload;
      yield call(updateCourse, id, data);
      yield put({ type: 'fetchCourses' });
    },
    *deleteCourse({ payload }, { call, put }) {
      yield call(deleteCourse, payload);
      yield put({ type: 'fetchCourses' });
    },
  },
  reducers: {
    saveCourses(state, { payload }) {
      return {
        ...state,
        courses: payload,
      };
    },
    setFilters(state, { payload }) {
      return {
        ...state,
        filters: payload,
      };
    },
  },
};

export default CourseModel; 
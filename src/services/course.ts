import { Course, CourseFormData, CourseStatus } from '@/types/course';
import { getInstructors as getInstructorList } from '@/services/instructor';

const STORAGE_KEY = 'courses';

const initializeData = () => {
  const courses = localStorage.getItem(STORAGE_KEY);
  if (!courses) {
    const defaultCourses: Course[] = [
      {
        id: '1',
        name: 'Lập trình Web cơ bản',
        instructor: 'Nguyễn Văn A',
        studentCount: 30,
        description: 'Khóa học lập trình web cơ bản',
        status: CourseStatus.OPEN,
      },
      {
        id: '2',
        name: 'Lập trình ReactJS',
        instructor: 'Trần Thị B',
        studentCount: 25,
        description: 'Khóa học lập trình ReactJS',
        status: CourseStatus.OPEN,
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCourses));
    return defaultCourses;
  }
  return JSON.parse(courses);
};

export const getCourses = (): Course[] => {
  return initializeData();
};

export const saveCourses = (courses: Course[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
};

export const isCourseNameExists = (name: string, excludeId?: string): boolean => {
  const courses = getCourses();
  return courses.some(course => 
    course.name.toLowerCase() === name.toLowerCase() && 
    course.id !== excludeId
  );
};

export const addCourse = (course: CourseFormData): Course | { error: string } => {
  if (isCourseNameExists(course.name)) {
    return { error: 'Tên khóa học đã tồn tại' };
  }

  const courses = getCourses();
  const newCourse: Course = {
    ...course,
    id: Date.now().toString(),
  };
  courses.push(newCourse);
  saveCourses(courses);
  return newCourse;
};

export const updateCourse = (id: string, course: CourseFormData): Course | { error: string } | null => {
  if (isCourseNameExists(course.name, id)) {
    return { error: 'Tên khóa học đã tồn tại' };
  }

  const courses = getCourses();
  const index = courses.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  const updatedCourse: Course = {
    ...course,
    id,
  };
  courses[index] = updatedCourse;
  saveCourses(courses);
  return updatedCourse;
};

export const deleteCourse = (id: string): boolean => {
  const courses = getCourses();
  const course = courses.find(c => c.id === id);
  
  if (!course || course.studentCount > 0) {
    return false;
  }
  
  const filteredCourses = courses.filter(c => c.id !== id);
  saveCourses(filteredCourses);
  return true;
};

export const getInstructors = (): string[] => {
  const instructors = getInstructorList();
  return instructors.map(instructor => instructor.name);
}; 
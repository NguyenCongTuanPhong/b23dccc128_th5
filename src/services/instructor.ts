import { Instructor, InstructorFormData } from '@/types/instructor';

const STORAGE_KEY = 'instructors';

const initializeData = () => {
  const instructors = localStorage.getItem(STORAGE_KEY);
  if (!instructors) {
    const defaultInstructors: Instructor[] = [
      {
        id: '1',
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0123456789',
        status: 'ACTIVE',
      },
      {
        id: '2',
        name: 'Trần Thị B',
        email: 'tranthib@example.com',
        phone: '0987654321',
        status: 'ACTIVE',
      },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultInstructors));
    return defaultInstructors;
  }
  return JSON.parse(instructors);
};

export const getInstructors = (): Instructor[] => {
  return initializeData();
};

export const saveInstructors = (instructors: Instructor[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(instructors));
};

export const addInstructor = (instructor: InstructorFormData): Instructor => {
  const instructors = getInstructors();
  const newInstructor: Instructor = {
    ...instructor,
    id: Date.now().toString(),
  };
  instructors.push(newInstructor);
  saveInstructors(instructors);
  return newInstructor;
};

export const updateInstructor = (id: string, instructor: InstructorFormData): Instructor | null => {
  const instructors = getInstructors();
  const index = instructors.findIndex(i => i.id === id);
  if (index === -1) return null;
  
  const updatedInstructor: Instructor = {
    ...instructor,
    id,
  };
  instructors[index] = updatedInstructor;
  saveInstructors(instructors);
  return updatedInstructor;
};

export const deleteInstructor = (id: string): boolean => {
  const instructors = getInstructors();
  const filteredInstructors = instructors.filter(i => i.id !== id);
  saveInstructors(filteredInstructors);
  return true;
}; 
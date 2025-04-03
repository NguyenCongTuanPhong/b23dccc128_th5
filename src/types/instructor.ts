export interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface InstructorFormData {
  name: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
} 
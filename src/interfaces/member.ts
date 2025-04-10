export interface IMemberRegistration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  skills: string;
  clubId: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
  createdAt: string;
}

export interface IActionHistory {
  id: string;
  registrationId: string;
  action: 'approve' | 'reject';
  actionBy: string;
  actionAt: string;
  reason?: string;
}

export interface IClubMember extends Omit<IMemberRegistration, 'reason' | 'status' | 'rejectReason'> {
  joinDate: string;
  currentClubId: string;
}

export interface IClub {
  id: string;
  name: string;
  establishmentDate: string;
  description: string;
  president: string;
  isActive: boolean;
} 
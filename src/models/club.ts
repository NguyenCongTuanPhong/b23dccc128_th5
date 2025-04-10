export interface Club {
  id: string;
  name: string;
  logo: string;
  establishmentDate: string;
  description: string;
  president: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClubMember {
  id: string;
  clubId: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  skills: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Registration {
  id: string;
  clubId: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  skills: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationHistory {
  id: string;
  registrationId: string;
  action: 'created' | 'approved' | 'rejected';
  reason?: string;
  createdAt: string;
}

export interface ClubStatistics {
  totalClubs: number;
  totalRegistrations: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  rejectedRegistrations: number;
  registrationsByClub: {
    clubId: string;
    clubName: string;
    pending: number;
    approved: number;
    rejected: number;
  }[];
} 
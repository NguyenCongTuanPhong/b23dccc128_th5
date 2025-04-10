import { request } from 'umi';
import type { Club, ClubMember, Registration, RegistrationHistory, ClubStatistics } from '@/models/club';
import { clubStorage } from './localStorage';

// Mock data for development
const mockClubs: Club[] = [
  {
    id: '1',
    name: 'Câu lạc bộ IT',
    logo: 'https://via.placeholder.com/150',
    establishmentDate: '2024-01-01',
    description: 'Câu lạc bộ dành cho sinh viên yêu thích công nghệ thông tin',
    president: 'Nguyễn Văn A',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const mockMembers: ClubMember[] = [
  {
    id: '1',
    clubId: '1',
    userId: '1',
    fullName: 'Nguyễn Văn B',
    email: 'nguyenvanb@example.com',
    phone: '0123456789',
    gender: 'male',
    address: 'Hà Nội',
    skills: 'Lập trình web',
    status: 'approved',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

// Initialize localStorage with mock data if empty
if (clubStorage.getClubs().length === 0) {
  clubStorage.saveClubs(mockClubs);
}

export async function getClubs() {
  // Get clubs from localStorage
  const clubs = clubStorage.getClubs();
  return { data: clubs };
}

export async function createClub(data: Partial<Club>) {
  const newClub: Club = {
    ...data,
    id: Date.now().toString(), // Generate a unique ID
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Club;

  const success = clubStorage.addClub(newClub);
  return { success };
}

export async function updateClub(id: string, data: Partial<Club>) {
  const clubs = clubStorage.getClubs();
  const club = clubs.find(c => c.id === id);
  
  if (!club) {
    return { success: false };
  }

  const updatedClub: Club = {
    ...club,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const success = clubStorage.updateClub(updatedClub);
  return { success };
}

export async function deleteClub(id: string) {
  const success = clubStorage.deleteClub(id);
  return { success };
}

export async function getClubMembers(clubId: string) {
  return { data: mockMembers.filter(member => member.clubId === clubId) };
}

export async function getRegistrations() {
  return { data: [] };
}

export async function createRegistration(data: Partial<Registration>) {
  console.log('Creating registration:', data);
  return { success: true };
}

export async function updateRegistration(id: string, data: Partial<Registration>) {
  console.log('Updating registration:', id, data);
  return { success: true };
}

export async function deleteRegistration(id: string) {
  console.log('Deleting registration:', id);
  return { success: true };
}

export async function approveRegistrations(ids: string[]) {
  console.log('Approving registrations:', ids);
  return { success: true };
}

export async function rejectRegistrations(ids: string[], reason: string) {
  console.log('Rejecting registrations:', ids, reason);
  return { success: true };
}

export async function getRegistrationHistory(registrationId: string) {
  return { data: [] };
}

export async function getClubStatistics() {
  return {
    data: {
      totalClubs: mockClubs.length,
      totalRegistrations: 0,
      pendingRegistrations: 0,
      approvedRegistrations: mockMembers.length,
      rejectedRegistrations: 0,
      registrationsByClub: mockClubs.map(club => ({
        clubId: club.id,
        clubName: club.name,
        pending: 0,
        approved: mockMembers.filter(m => m.clubId === club.id).length,
        rejected: 0,
      })),
    },
  };
}

export async function exportClubMembers(clubId: string) {
  const members = mockMembers.filter(m => m.clubId === clubId);
  return new Blob([JSON.stringify(members)], { type: 'application/json' });
} 
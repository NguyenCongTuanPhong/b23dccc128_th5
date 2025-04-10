import { IClub } from '@/interfaces/member';

const CLUBS_STORAGE_KEY = 'clubs_data';

export const clubStorage = {
  // Lưu danh sách CLB
  saveClubs: (clubs: IClub[]) => {
    try {
      localStorage.setItem(CLUBS_STORAGE_KEY, JSON.stringify(clubs));
      return true;
    } catch (error) {
      console.error('Error saving clubs to localStorage:', error);
      return false;
    }
  },

  // Lấy danh sách CLB
  getClubs: (): IClub[] => {
    try {
      const clubsData = localStorage.getItem(CLUBS_STORAGE_KEY);
      return clubsData ? JSON.parse(clubsData) : [];
    } catch (error) {
      console.error('Error getting clubs from localStorage:', error);
      return [];
    }
  },

  // Thêm một CLB mới
  addClub: (club: IClub) => {
    try {
      const clubs = clubStorage.getClubs();
      clubs.push(club);
      return clubStorage.saveClubs(clubs);
    } catch (error) {
      console.error('Error adding club to localStorage:', error);
      return false;
    }
  },

  // Cập nhật thông tin CLB
  updateClub: (updatedClub: IClub) => {
    try {
      const clubs = clubStorage.getClubs();
      const index = clubs.findIndex(club => club.id === updatedClub.id);
      if (index !== -1) {
        clubs[index] = updatedClub;
        return clubStorage.saveClubs(clubs);
      }
      return false;
    } catch (error) {
      console.error('Error updating club in localStorage:', error);
      return false;
    }
  },

  // Xóa một CLB
  deleteClub: (clubId: string) => {
    try {
      const clubs = clubStorage.getClubs();
      const filteredClubs = clubs.filter(club => club.id !== clubId);
      return clubStorage.saveClubs(filteredClubs);
    } catch (error) {
      console.error('Error deleting club from localStorage:', error);
      return false;
    }
  },

  // Xóa tất cả dữ liệu CLB
  clearClubs: () => {
    try {
      localStorage.removeItem(CLUBS_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing clubs from localStorage:', error);
      return false;
    }
  }
}; 
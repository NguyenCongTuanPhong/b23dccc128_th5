import React, { useState, useEffect } from 'react';

interface Club {
  id: string;
  name: string;
  // ...other properties if needed...
}

const ClubRegistrationManagement: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);

  useEffect(() => {
    // Lấy dữ liệu câu lạc bộ từ localStorage
    const storedClubs = localStorage.getItem('clubManagement_clubs');
    if (storedClubs) {
      setClubs(JSON.parse(storedClubs));
    }
  }, []);

  return (
    <div>
      {/* Dropdown để chọn câu lạc bộ */}
      <label htmlFor="club-select">Chọn câu lạc bộ:</label>
      <select id="club-select">
        {clubs.map((club) => (
          <option key={club.id} value={club.id}>
            {club.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ClubRegistrationManagement;

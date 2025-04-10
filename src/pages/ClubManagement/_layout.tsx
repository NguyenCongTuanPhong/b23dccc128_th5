import React from 'react';
import { Outlet } from 'umi';

const ClubManagementLayout: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Outlet />
    </div>
  );
};

export default ClubManagementLayout; 
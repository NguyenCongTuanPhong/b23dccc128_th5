import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import EmployeeService from '../../Booking App/components/EmployeeServices';

const ServicesPage: React.FC = () => {
  return (
    <PageContainer>
      <EmployeeService />
    </PageContainer>
  );
};

export default ServicesPage; 
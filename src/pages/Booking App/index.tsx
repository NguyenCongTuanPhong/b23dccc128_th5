import EmployeeRatings from './components/EmployeeRatings';

return (
  <PageContainer>
    <ProCard
      tabs={{
        type: 'card',
      }}
    >
      <ProCard.TabPane key="appointments" tab="Quản lý lịch hẹn">
        <AppointmentManagement />
      </ProCard.TabPane>
      <ProCard.TabPane key="services" tab="Quản lý dịch vụ">
        <EmployeeServices />
      </ProCard.TabPane>
      <ProCard.TabPane key="ratings" tab="Thống kê đánh giá">
        <EmployeeRatings />
      </ProCard.TabPane>
    </ProCard>
  </PageContainer>
);


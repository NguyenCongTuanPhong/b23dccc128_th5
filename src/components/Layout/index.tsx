import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

const { Sider, Content } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="light">
        <Sidebar />
      </Sider>
      <Content style={{ padding: '24px' }}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default MainLayout; 
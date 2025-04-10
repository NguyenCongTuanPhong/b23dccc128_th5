import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'umi';
import {
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  HomeOutlined,
  FormOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const MainLayout: React.FC = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">Trang chủ</Link>,
    },
    {
      key: '/club-management',
      icon: <TeamOutlined />,
      label: <Link to="/club-management">Quản lý CLB</Link>,
    },
    {
      key: '/course-management',
      icon: <BookOutlined />,
      label: <Link to="/course-management">Quản lý khóa học</Link>,
    },
    {
      key: '/instructor-management',
      icon: <UserOutlined />,
      label: <Link to="/instructor-management">Quản lý giảng viên</Link>,
    },
    {
      key: '/member-registration',
      icon: <FormOutlined />,
      label: <Link to="/member-registration">Quản lý đơn đăng ký</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" width={200}>
        <div style={{ height: 64, padding: '16px', fontWeight: 'bold', fontSize: '18px' }}>
          LẬP TRÌNH WEB - RIPT
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ height: 'calc(100vh - 64px)', borderRight: 0 }}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px', borderBottom: '1px solid #f0f0f0' }}>
          <h1 style={{ margin: 0 }}>Hệ thống quản lý</h1>
        </Header>
        <Content style={{ margin: '24px 16px', minHeight: 280 }}>
          <div style={{ padding: 24, background: '#fff', borderRadius: '2px' }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 
import React from 'react';
import { Card, Row, Col } from 'antd';
import { TeamOutlined, BookOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'umi';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Chào mừng đến với hệ thống quản lý</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Link to="/club-management">
            <Card
              hoverable
              style={{ textAlign: 'center' }}
            >
              <TeamOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <h2>Quản lý Câu lạc bộ</h2>
            </Card>
          </Link>
        </Col>
        <Col span={8}>
          <Link to="/course-management">
            <Card
              hoverable
              style={{ textAlign: 'center' }}
            >
              <BookOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <h2>Quản lý Khóa học</h2>
            </Card>
          </Link>
        </Col>
        <Col span={8}>
          <Link to="/instructor-management">
            <Card
              hoverable
              style={{ textAlign: 'center' }}
            >
              <UserOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <h2>Quản lý Giảng viên</h2>
            </Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default Home; 
import React from 'react';
import { Card, Table, Rate, Progress, Space, Avatar, Typography } from 'antd';
import { UserOutlined, StarOutlined } from '@ant-design/icons';
import { connect, ConnectProps } from 'umi';
import type { Employee } from '@/models/Employee';

const { Text } = Typography;

interface EmployeeRatingsProps extends ConnectProps {
  employees: Employee[];
}

const EmployeeRatings: React.FC<EmployeeRatingsProps> = ({ employees }) => {
  const calculateRatingStats = (ratings: any[]) => {
    if (!ratings || ratings.length === 0) return {
      average: 0,
      total: 0,
      distribution: [0, 0, 0, 0, 0]
    };

    const total = ratings.length;
    const average = ratings.reduce((acc, curr) => acc + curr.rating, 0) / total;
    const distribution = [0, 0, 0, 0, 0];
    
    ratings.forEach(rating => {
      distribution[rating.rating - 1]++;
    });

    return {
      average,
      total,
      distribution: distribution.map(count => (count / total) * 100)
    };
  };

  const columns = [
    {
      title: 'Nhân viên',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Employee) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Space direction="vertical" size={0}>
            <Text strong>{text}</Text>
            <Text type="secondary">{
              record.position === 'stylist' ? 'Stylist' :
              record.position === 'technician' ? 'Kỹ thuật viên' :
              record.position === 'assistant' ? 'Trợ lý' : record.position
            }</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Đánh giá trung bình',
      dataIndex: 'ratings',
      key: 'average',
      render: (ratings: any[]) => {
        const stats = calculateRatingStats(ratings);
        return (
          <Space>
            <Rate disabled defaultValue={stats.average} allowHalf />
            <Text strong>{stats.average.toFixed(1)}</Text>
            <Text type="secondary">({stats.total} đánh giá)</Text>
          </Space>
        );
      },
    },
    {
      title: 'Phân bố đánh giá',
      dataIndex: 'ratings',
      key: 'distribution',
      render: (ratings: any[]) => {
        const { distribution } = calculateRatingStats(ratings);
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            {distribution.map((percentage, index) => (
              <Space key={5 - index} style={{ width: '100%' }}>
                <Text style={{ width: '30px' }}>{5 - index} <StarOutlined /></Text>
                <Progress 
                  percent={percentage} 
                  size="small" 
                  showInfo={false}
                  strokeColor="#faad14"
                />
                <Text style={{ width: '45px' }}>{percentage.toFixed(1)}%</Text>
              </Space>
            ))}
          </Space>
        );
      },
    },
    {
      title: 'Đánh giá gần đây',
      dataIndex: 'ratings',
      key: 'recentComments',
      render: (ratings: any[]) => {
        if (!ratings || ratings.length === 0) return 'Chưa có đánh giá';
        
        const recentRatings = [...ratings]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 2);

        return (
          <Space direction="vertical">
            {recentRatings.map((rating, index) => (
              <div key={index}>
                <Rate disabled defaultValue={rating.rating} style={{ fontSize: 12 }} />
                <Text type="secondary" style={{ display: 'block' }}>{rating.comment}</Text>
              </div>
            ))}
          </Space>
        );
      },
    },
  ];

  return (
    <Card title="Thống kê đánh giá nhân viên">
      <Table 
        columns={columns} 
        dataSource={employees}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};

export default connect(({ 
  employee 
}: { 
  employee: { employees: Employee[] }
}) => ({
  employees: employee.employees,
}))(EmployeeRatings); 
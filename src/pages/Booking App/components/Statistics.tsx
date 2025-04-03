import React, { useState } from 'react';
import { Card, Row, Col, DatePicker, Statistic, Table, Select, Space } from 'antd';
import { Line, Bar } from '@ant-design/plots';
import { UserOutlined, ScheduleOutlined, DollarOutlined, ShopOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Statistics = () => {
  const [dateRange, setDateRange] = useState<[any, any]>([null, null]);
  const [viewType, setViewType] = useState<'day' | 'month'>('day');

  // Mock data - thay thế bằng data thật từ API sau
  const appointmentData = [
    { date: '2024-03-01', appointments: 12 },
    { date: '2024-03-02', appointments: 15 },
    { date: '2024-03-03', appointments: 8 },
    // Thêm dữ liệu khác...
  ];

  const revenueData = [
    { date: '2024-03-01', revenue: 2500000 },
    { date: '2024-03-02', revenue: 3000000 },
    { date: '2024-03-03', revenue: 1800000 },
    // Thêm dữ liệu khác...
  ];

  const serviceStats = [
    {
      service: 'Cắt tóc nam',
      appointments: 45,
      revenue: 4500000,
      averageRating: 4.5,
    },
    {
      service: 'Nhuộm tóc',
      appointments: 30,
      revenue: 9000000,
      averageRating: 4.8,
    },
    // Thêm dữ liệu khác...
  ];

  const employeeStats = [
    {
      employee: 'Nhân viên 1',
      appointments: 28,
      revenue: 5600000,
      averageRating: 4.7,
    },
    {
      employee: 'Nhân viên 2',
      appointments: 35,
      revenue: 7000000,
      averageRating: 4.5,
    },
    // Thêm dữ liệu khác...
  ];

  const appointmentConfig = {
    data: appointmentData,
    xField: 'date',
    yField: 'appointments',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  const revenueConfig = {
    data: revenueData,
    xField: 'date',
    yField: 'revenue',
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      style: {
        fill: '#aaa',
      },
      formatter: (v: any) => `${new Intl.NumberFormat('vi-VN').format(v.revenue)}đ`,
    },
  };

  const serviceColumns = [
    {
      title: 'Dịch vụ',
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: 'Số lượt đặt',
      dataIndex: 'appointments',
      key: 'appointments',
      sorter: (a: any, b: any) => a.appointments - b.appointments,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      sorter: (a: any, b: any) => a.revenue - b.revenue,
      render: (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`,
    },
    {
      title: 'Đánh giá TB',
      dataIndex: 'averageRating',
      key: 'averageRating',
      sorter: (a: any, b: any) => a.averageRating - b.averageRating,
    },
  ];

  const employeeColumns = [
    {
      title: 'Nhân viên',
      dataIndex: 'employee',
      key: 'employee',
    },
    {
      title: 'Số khách phục vụ',
      dataIndex: 'appointments',
      key: 'appointments',
      sorter: (a: any, b: any) => a.appointments - b.appointments,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      sorter: (a: any, b: any) => a.revenue - b.revenue,
      render: (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`,
    },
    {
      title: 'Đánh giá TB',
      dataIndex: 'averageRating',
      key: 'averageRating',
      sorter: (a: any, b: any) => a.averageRating - b.averageRating,
    },
  ];

  return (
    <Card title="Thống kê & Báo cáo">
      <Space style={{ marginBottom: 16 }}>
        <RangePicker 
          onChange={(dates) => setDateRange(dates)}
          style={{ width: 300 }}
        />
        <Select 
          defaultValue="day" 
          style={{ width: 120 }}
          onChange={(value) => setViewType(value)}
        >
          <Option value="day">Theo ngày</Option>
          <Option value="month">Theo tháng</Option>
        </Select>
      </Space>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số lịch hẹn"
              value={156}
              prefix={<ScheduleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={15600000}
              prefix={<DollarOutlined />}
              formatter={(value) => `${new Intl.NumberFormat('vi-VN').format(value)}đ`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Số lượng khách"
              value={120}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Dịch vụ phổ biến"
              value="Cắt tóc nam"
              prefix={<ShopOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Biểu đồ lịch hẹn">
            <Line {...appointmentConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Biểu đồ doanh thu">
            <Bar {...revenueConfig} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Thống kê theo dịch vụ">
            <Table 
              columns={serviceColumns} 
              dataSource={serviceStats}
              rowKey="service"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Thống kê theo nhân viên">
            <Table 
              columns={employeeColumns} 
              dataSource={employeeStats}
              rowKey="employee"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default Statistics;
  
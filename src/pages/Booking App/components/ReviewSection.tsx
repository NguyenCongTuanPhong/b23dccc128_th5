import React, { useState } from 'react';
import { Card, Table, Rate, Button, Modal, Form, Input, Space, Avatar, List, Comment } from 'antd';
import { UserOutlined, StarOutlined } from '@ant-design/icons';

const ReviewSection = () => {
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [form] = Form.useForm();

  // Mock data - thay thế bằng data thật từ API sau
  const reviews = [
    {
      id: 1,
      customerName: 'Nguyễn Văn A',
      employeeName: 'Nhân viên 1',
      service: 'Cắt tóc nam',
      rating: 5,
      comment: 'Dịch vụ rất tốt, nhân viên nhiệt tình',
      date: '2024-03-20',
      reply: 'Cảm ơn quý khách đã sử dụng dịch vụ!',
    },
    {
      id: 2,
      customerName: 'Trần Thị B',
      employeeName: 'Nhân viên 2',
      service: 'Nhuộm tóc',
      rating: 4,
      comment: 'Nhân viên tư vấn rất kỹ càng',
      date: '2024-03-19',
      reply: null,
    },
  ];

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Nhân viên',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: 'Nhận xét',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: 'Ngày đánh giá',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Phản hồi',
      dataIndex: 'reply',
      key: 'reply',
      render: (reply: string, record: any) => (
        <Space direction="vertical">
          {reply && <div>{reply}</div>}
          {!reply && (
            <Button 
              type="link" 
              onClick={() => {
                setSelectedReview(record);
                setReplyModalVisible(true);
              }}
            >
              Phản hồi
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleReply = (values: any) => {
    console.log('Reply values:', values);
    setReplyModalVisible(false);
    form.resetFields();
  };

  // Thống kê đánh giá trung bình của nhân viên
  const employeeStats = [
    {
      name: 'Nhân viên 1',
      averageRating: 4.5,
      totalReviews: 10,
    },
    {
      name: 'Nhân viên 2',
      averageRating: 4.8,
      totalReviews: 15,
    },
  ];

  return (
    <Card title="Đánh giá Dịch vụ & Nhân viên">
      <Card type="inner" title="Thống kê đánh giá nhân viên" style={{ marginBottom: 16 }}>
        <List
          itemLayout="horizontal"
          dataSource={employeeStats}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={item.name}
                description={
                  <Space>
                    <Rate disabled defaultValue={item.averageRating} />
                    <span>({item.averageRating}/5 từ {item.totalReviews} đánh giá)</span>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Table 
        columns={columns} 
        dataSource={reviews}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Phản hồi đánh giá"
        visible={replyModalVisible}
        onOk={form.submit}
        onCancel={() => {
          setReplyModalVisible(false);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleReply}
        >
          {selectedReview && (
            <Comment
              author={selectedReview.customerName}
              content={selectedReview.comment}
              datetime={selectedReview.date}
              style={{ marginBottom: 16 }}
            />
          )}
          <Form.Item
            name="reply"
            rules={[{ required: true, message: 'Vui lòng nhập phản hồi!' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập phản hồi của bạn" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ReviewSection;
  
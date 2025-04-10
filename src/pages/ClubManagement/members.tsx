import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, message } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useParams, history } from 'umi';

interface Member {
  id: string;
  name: string;
  studentId: string;
  email: string;
  role: string;
  joinDate: string;
}

const ClubMembers: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const [members, setMembers] = useState<Member[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [form] = Form.useForm();

  const columns: ColumnsType<Member> = [
    {
      title: 'Tên thành viên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'studentId',
      key: 'studentId',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'joinDate',
      key: 'joinDate',
      sorter: (a, b) => new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime(),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Chỉnh sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingMember(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    form.setFieldsValue(member);
    setIsModalVisible(true);
  };

  const handleDelete = (member: Member) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa thành viên ${member.name}?`,
      onOk: () => {
        setMembers(members.filter((m) => m.id !== member.id));
        message.success('Xóa thành viên thành công');
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const newMember: Member = {
        id: editingMember?.id || Date.now().toString(),
        ...values,
        joinDate: new Date().toISOString().split('T')[0],
      };

      if (editingMember) {
        setMembers(members.map((m) => (m.id === editingMember.id ? newMember : m)));
        message.success('Cập nhật thành viên thành công');
      } else {
        setMembers([...members, newMember]);
        message.success('Thêm thành viên thành công');
      }

      setIsModalVisible(false);
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => history.goBack()}
        >
          Quay lại
        </Button>
        <Button type="primary" onClick={handleAdd}>
          Thêm thành viên
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={members}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingMember ? 'Chỉnh sửa thành viên' : 'Thêm thành viên'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên thành viên"
            rules={[{ required: true, message: 'Vui lòng nhập tên thành viên' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="studentId"
            label="Mã sinh viên"
            rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng nhập vai trò' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClubMembers; 
import React, { useState, useEffect } from 'react';
import {
  Table, Button, Space, Modal, Form, Input, DatePicker, Switch, message, Upload
} from 'antd';
import { EditOutlined, DeleteOutlined, TeamOutlined, UploadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { history } from 'umi';
import dayjs from 'dayjs';

interface Club {
  id: string;
  name: string;
  logo: string;
  establishmentDate: string;
  description: string;
  president: string;
  isActive: boolean;
}

const ClubManagement: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [form] = Form.useForm();
  const [logoFileList, setLogoFileList] = useState<any[]>([]);

  useEffect(() => {
    const storedClubs = localStorage.getItem('clubManagement_clubs');
    if (storedClubs) {
      setClubs(JSON.parse(storedClubs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('clubManagement_clubs', JSON.stringify(clubs));
  }, [clubs]);

  const columns: ColumnsType<Club> = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'logo',
      key: 'logo',
      render: (logo) => (
        <img src={logo} alt="Club Logo" style={{ width: 50, height: 50, objectFit: 'cover' }} />
      ),
    },
    {
      title: 'Tên câu lạc bộ',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'establishmentDate',
      key: 'establishmentDate',
      sorter: (a, b) =>
        new Date(a.establishmentDate).getTime() - new Date(b.establishmentDate).getTime(),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text) => <div dangerouslySetInnerHTML={{ __html: text }} />,
    },
    {
      title: 'Chủ nhiệm CLB',
      dataIndex: 'president',
      key: 'president',
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (isActive ? 'Có' : 'Không'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Chỉnh sửa
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>
            Xóa
          </Button>
          <Button type="default" icon={<TeamOutlined />} onClick={() => handleViewMembers(record)}>
            Thành viên
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingClub(null);
    setLogoFileList([]);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (club: Club) => {
    setEditingClub(club);
    form.setFieldsValue({
      ...club,
      establishmentDate: club.establishmentDate ? dayjs(club.establishmentDate) : null,
    });
    setLogoFileList([
      {
        uid: '-1',
        name: 'logo.png',
        status: 'done',
        url: club.logo,
      },
    ]);
    setIsModalVisible(true);
  };

  const handleDelete = (club: Club) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa câu lạc bộ ${club.name}?`,
      onOk: () => {
        setClubs(clubs.filter((c) => c.id !== club.id));
        message.success('Xóa câu lạc bộ thành công');
      },
    });
  };

  const handleViewMembers = (club: Club) => {
    history.push(`/club-management/members/${club.id}`);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (logoFileList.length === 0) {
        message.error('Vui lòng tải lên ảnh đại diện!');
        return;
      }

      const logoUrl = logoFileList[0].url || logoFileList[0].response?.url;

      const newClub: Club = {
        id: editingClub?.id || Date.now().toString(),
        ...values,
        logo: logoUrl,
        establishmentDate: values.establishmentDate.format('YYYY-MM-DD'),
      };

      if (editingClub) {
        setClubs(clubs.map((c) => (c.id === editingClub.id ? newClub : c)));
        message.success('Cập nhật câu lạc bộ thành công');
      } else {
        setClubs([...clubs, newClub]);
        message.success('Thêm câu lạc bộ thành công');
      }

      setIsModalVisible(false);
    });
  };

  const handleLogoChange = ({ fileList }) => {
    setLogoFileList(fileList);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>
          Thêm câu lạc bộ
        </Button>
      </div>

      <Table columns={columns} dataSource={clubs} rowKey="id" pagination={{ pageSize: 10 }} />

      <Modal
        title={editingClub ? 'Chỉnh sửa câu lạc bộ' : 'Thêm câu lạc bộ'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên câu lạc bộ"
            rules={[{ required: true, message: 'Vui lòng nhập tên câu lạc bộ' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Ảnh đại diện" required>
            <Upload
              listType="picture"
              beforeUpload={() => false}
              fileList={logoFileList}
              onChange={handleLogoChange}
              accept="image/*"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="establishmentDate"
            label="Ngày thành lập"
            rules={[{ required: true, message: 'Vui lòng chọn ngày thành lập' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="president"
            label="Chủ nhiệm CLB"
            rules={[{ required: true, message: 'Vui lòng nhập tên chủ nhiệm' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="isActive" label="Hoạt động" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClubManagement;

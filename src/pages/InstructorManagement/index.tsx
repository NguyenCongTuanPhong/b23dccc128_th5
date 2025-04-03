import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect, Dispatch } from 'umi';
import { Instructor } from '@/types/instructor';
import InstructorForm from '@/components/InstructorForm';

interface InstructorManagementProps {
  dispatch: Dispatch;
  instructors: Instructor[];
}

const InstructorManagement: React.FC<InstructorManagementProps> = ({
  dispatch,
  instructors,
}) => {
  const [formVisible, setFormVisible] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);

  useEffect(() => {
    dispatch({ type: 'instructor/fetchInstructors' });
  }, []);

  const handleAdd = () => {
    setEditingInstructor(null);
    setFormVisible(true);
  };

  const handleEdit = (instructor: Instructor) => {
    setEditingInstructor(instructor);
    setFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    await dispatch({
      type: 'instructor/deleteInstructor',
      payload: id,
    });
    message.success('Xóa giảng viên thành công');
  };

  const handleFormSubmit = async (values: any) => {
    if (editingInstructor) {
      await dispatch({
        type: 'instructor/updateInstructor',
        payload: { id: editingInstructor.id, data: values },
      });
      message.success('Cập nhật giảng viên thành công');
    } else {
      await dispatch({
        type: 'instructor/addInstructor',
        payload: values,
      });
      message.success('Thêm giảng viên thành công');
    }
    setFormVisible(false);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên giảng viên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ color: status === 'ACTIVE' ? 'green' : 'red' }}>
          {status === 'ACTIVE' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Instructor) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa giảng viên này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd} icon={<PlusOutlined />}>
          Thêm giảng viên
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={instructors}
        rowKey="id"
      />

      <InstructorForm
        visible={formVisible}
        onCancel={() => setFormVisible(false)}
        onFinish={handleFormSubmit}
        initialValues={editingInstructor || undefined}
        title={editingInstructor ? 'Chỉnh sửa giảng viên' : 'Thêm giảng viên mới'}
      />
    </div>
  );
};

export default connect(({ instructor }: { instructor: InstructorManagementProps }) => ({
  instructors: instructor.instructors,
}))(InstructorManagement); 
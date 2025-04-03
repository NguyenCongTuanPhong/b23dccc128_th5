import React from 'react';
import { Form, Input, Select, Modal } from 'antd';
import { InstructorFormData } from '@/types/instructor';

interface InstructorFormProps {
  visible: boolean;
  onCancel: () => void;
  onFinish: (values: InstructorFormData) => void;
  initialValues?: InstructorFormData;
  title: string;
}

const InstructorForm: React.FC<InstructorFormProps> = ({
  visible,
  onCancel,
  onFinish,
  initialValues,
  title,
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onFinish(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="name"
          label="Tên giảng viên"
          rules={[
            { required: true, message: 'Vui lòng nhập tên giảng viên' },
            { max: 100, message: 'Tên giảng viên không được vượt quá 100 ký tự' },
          ]}
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
          name="phone"
          label="Số điện thoại"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại' },
            { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select>
            <Select.Option value="ACTIVE">Đang hoạt động</Select.Option>
            <Select.Option value="INACTIVE">Ngừng hoạt động</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InstructorForm; 
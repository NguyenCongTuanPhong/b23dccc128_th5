import React from 'react';
import { Form, Input, Select, Button } from 'antd';
import { IMemberRegistration, IClub } from '@/interfaces/member';

interface RegistrationFormProps {
  initialValues?: Partial<IMemberRegistration>;
  clubs: IClub[];
  onSubmit: (values: Partial<IMemberRegistration>) => void;
  onCancel: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  initialValues,
  clubs,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <Form.Item
        name="fullName"
        label="Họ tên"
        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
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
        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="gender"
        label="Giới tính"
        rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
      >
        <Select>
          <Select.Option value="male">Nam</Select.Option>
          <Select.Option value="female">Nữ</Select.Option>
          <Select.Option value="other">Khác</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="address"
        label="Địa chỉ"
        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
      >
        <Input.TextArea rows={2} />
      </Form.Item>

      <Form.Item
        name="skills"
        label="Sở trường"
        rules={[{ required: true, message: 'Vui lòng nhập sở trường' }]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item
        name="clubId"
        label="Câu lạc bộ"
        rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}
      >
        <Select>
          {clubs.map(club => (
            <Select.Option key={club.id} value={club.id}>
              {club.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="reason"
        label="Lý do đăng ký"
        rules={[{ required: true, message: 'Vui lòng nhập lý do đăng ký' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
          {initialValues ? 'Cập nhật' : 'Đăng ký'}
        </Button>
        <Button onClick={onCancel}>Hủy</Button>
      </Form.Item>
    </Form>
  );
};

export default RegistrationForm; 
import React from 'react';
import { Form, Input, Select, InputNumber, Modal } from 'antd';
import { CourseFormData, CourseStatus } from '@/types/course';
import { getInstructors, isCourseNameExists } from '@/services/course';
import TinyEditor from '@/components/TinyEditor';

const { TextArea } = Input;

interface CourseFormProps {
  visible: boolean;
  onCancel: () => void;
  onFinish: (values: CourseFormData) => void;
  initialValues?: CourseFormData & { id?: string };
  title: string;
}

const CourseForm: React.FC<CourseFormProps> = ({
  visible,
  onCancel,
  onFinish,
  initialValues,
  title,
}) => {
  const [form] = Form.useForm();
  const instructors = getInstructors();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onFinish(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const validateCourseName = async (_: any, value: string) => {
    if (!value) {
      return Promise.reject('Vui lòng nhập tên khóa học');
    }
    if (value.length > 100) {
      return Promise.reject('Tên khóa học không được vượt quá 100 ký tự');
    }
    if (isCourseNameExists(value, initialValues?.id)) {
      return Promise.reject('Tên khóa học đã tồn tại');
    }
    return Promise.resolve();
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="name"
          label="Tên khóa học"
          rules={[
            { validator: validateCourseName },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="instructor"
          label="Giảng viên"
          rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]}
        >
          <Select>
            {instructors.map((instructor) => (
              <Select.Option key={instructor} value={instructor}>
                {instructor}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="studentCount"
          label="Số lượng học viên"
          rules={[{ required: true, message: 'Vui lòng nhập số lượng học viên' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả khóa học"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả khóa học' }]}
        >
          <TinyEditor />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select>
            <Select.Option value={CourseStatus.OPEN}>Đang mở</Select.Option>
            <Select.Option value={CourseStatus.CLOSED}>Đã kết thúc</Select.Option>
            <Select.Option value={CourseStatus.PAUSED}>Tạm dừng</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CourseForm; 
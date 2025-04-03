import React from 'react';
import { Modal, Space, Select, DatePicker, InputNumber, Input, Form, message } from 'antd';
import { EditingSession, Subject } from './types';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface SessionModalProps {
  visible: boolean;
  loading: boolean;
  subjects: Subject[];
  editingSession: EditingSession;
  onCancel: () => void;
  onOk: (values: any) => void;
}

const SessionModal: React.FC<SessionModalProps> = ({
  visible,
  loading,
  subjects,
  editingSession,
  onCancel,
  onOk,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        subjectId: editingSession.subjectId || undefined,
        date: editingSession.date,
        duration: editingSession.duration,
        content: editingSession.content,
        notes: editingSession.notes,
      });
    }
  }, [visible, editingSession, form]);

  React.useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible, form]);

  React.useEffect(() => {
    if (visible && subjects.length === 0) {
      message.warning('Không có môn học nào!');
      onCancel();
    }
  }, [visible, subjects, onCancel]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={editingSession.id ? "Sửa lịch học" : "Thêm lịch học"}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          subjectId: editingSession.subjectId,
          date: editingSession.date,
          duration: editingSession.duration,
          content: editingSession.content,
          notes: editingSession.notes,
        }}
      >
        <Form.Item
          name="subjectId"
          label="Môn học"
          rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
        >
          <Select placeholder="Chọn môn học">
            {subjects.map((subject) => (
              <Select.Option key={subject.id} value={subject.id}>
                {subject.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="date"
          label="Thời gian học"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
        >
          <DatePicker
            showTime
            format="DD/MM/YYYY HH:mm"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="duration"
          label="Thời lượng (giờ)"
          rules={[{ required: true, message: 'Vui lòng nhập thời lượng!' }]}
        >
          <InputNumber
            min={0.5}
            step={0.5}
            style={{ width: '100%' }}
            placeholder="Nhập thời lượng học"
          />
        </Form.Item>

        <Form.Item
          name="content"
          label="Nội dung học"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
        >
          <TextArea
            rows={4}
            placeholder="Nhập nội dung đã học"
          />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Ghi chú"
        >
          <TextArea
            rows={2}
            placeholder="Nhập ghi chú (không bắt buộc)"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SessionModal;
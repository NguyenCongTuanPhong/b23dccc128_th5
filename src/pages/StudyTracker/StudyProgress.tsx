import React, { useState } from 'react';
import { Space, Button, Table, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { StudySession, Subject, EditingSession } from './types';
import SessionModal from './SessionModal';
import dayjs from 'dayjs';

interface StudyProgressProps {
  sessions: StudySession[];
  subjects: Subject[];
  onAddSession: (session: StudySession) => void;
  onEditSession: (session: StudySession) => void;
  onDeleteSession: (id: number) => void;
}

const StudyProgress: React.FC<StudyProgressProps> = ({
  sessions,
  subjects,
  onAddSession,
  onEditSession,
  onDeleteSession,
}) => {
  // Khởi tạo state
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingSession, setEditingSession] = useState<EditingSession>({
    subjectId: subjects.length > 0 ? subjects[0].id : 0,
    date: dayjs(),
    duration: 1,
    content: '',
    notes: ''
  });

  // Handler mở modal
  const handleOpenModal = (session?: StudySession) => {
    // Kiểm tra xem có môn học nào không
    if (subjects.length === 0) {
      message.warning('Vui lòng thêm ít nhất một môn học trước!');
      return;
    }

    if (session) {
      // Nếu là edit session
      setEditingSession({
        id: session.id,
        subjectId: session.subjectId,
        date: dayjs(session.date),
        duration: session.duration,
        content: session.content,
        notes: session.notes
      });
    } else {
      // Nếu là thêm mới
      setEditingSession({
        subjectId: subjects[0].id, // Lấy môn học đầu tiên làm mặc định
        date: dayjs(),
        duration: 1,
        content: '',
        notes: ''
      });
    }
    setIsModalVisible(true);
  };

  // Handler đóng modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingSession({
      subjectId: subjects.length > 0 ? subjects[0].id : 0,
      date: dayjs(),
      duration: 1,
      content: '',
      notes: ''
    });
  };

  // Handler xử lý submit form
  const handleModalOk = async (values: any) => {
    setLoading(true);
    try {
      const sessionData: StudySession = {
        id: editingSession.id || Date.now(),
        subjectId: values.subjectId,
        date: values.date.format('YYYY-MM-DD HH:mm'),
        duration: values.duration,
        content: values.content,
        notes: values.notes || ''
      };

      if (editingSession.id) {
        onEditSession(sessionData);
      } else {
        onAddSession(sessionData);
      }

      handleCloseModal();
      message.success(`${editingSession.id ? 'Cập nhật' : 'Thêm'} lịch học thành công!`);
    } catch (error) {
      console.error('Error:', error);
      message.error('Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  // Columns cho table
  const sessionColumns = [
    {
      title: 'Môn học',
      dataIndex: 'subjectId',
      render: (subjectId: number) => 
        subjects.find(s => s.id === subjectId)?.name || 'Không xác định'
    },
    {
      title: 'Thời gian',
      dataIndex: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Thời lượng (giờ)',
      dataIndex: 'duration'
    },
    {
      title: 'Nội dung',
      dataIndex: 'content'
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes'
    },
    {
      title: 'Thao tác',
      render: (_: any, record: StudySession) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleOpenModal(record)}
          >
            Sửa
          </Button>
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => onDeleteSession(record.id)}
          >
            Xóa
          </Button>
        </Space>
      )
    }
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Button 
        type="primary" 
        icon={<PlusOutlined />}
        onClick={() => handleOpenModal()}
      >
        Thêm lịch học
      </Button>
      
      <Table 
        columns={sessionColumns} 
        dataSource={sessions}
        rowKey="id"
      />

      <SessionModal
        visible={isModalVisible}
        loading={loading}
        subjects={subjects}
        editingSession={editingSession}
        onCancel={handleCloseModal}
        onOk={handleModalOk}
      />
    </Space>
  );
};

export default StudyProgress;
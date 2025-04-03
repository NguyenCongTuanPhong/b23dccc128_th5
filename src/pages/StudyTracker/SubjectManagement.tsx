import React from 'react';
import { Space, Input, Button, List, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Subject } from './types';

interface SubjectManagementProps {
  subjects: Subject[];
  onAddSubject: (name: string) => void;
  onEditSubject: (id: number, name: string) => void;
  onDeleteSubject: (id: number) => void;
}

const SubjectManagement: React.FC<SubjectManagementProps> = ({
  subjects,
  onAddSubject,
  onEditSubject,
  onDeleteSubject,
}) => {
  const [newSubject, setNewSubject] = React.useState("");
  const [editingSubject, setEditingSubject] = React.useState<Subject | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = React.useState(false);
  const [editingName, setEditingName] = React.useState("");

  const handleAdd = () => {
    if (!newSubject.trim()) {
      message.error("Vui lòng nhập tên môn học!");
      return;
    }
    onAddSubject(newSubject);
    setNewSubject("");
  };

  const handleEdit = () => {
    if (!editingName.trim() || !editingSubject) {
      message.error("Vui lòng nhập tên môn học!");
      return;
    }
    onEditSubject(editingSubject.id, editingName);
    setIsEditModalVisible(false);
    setEditingSubject(null);
    setEditingName("");
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space>
        <Input
          placeholder="Nhập tên môn học..."
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          onPressEnter={handleAdd}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm môn học
        </Button>
      </Space>
      
      <List
        bordered
        dataSource={subjects}
        renderItem={(subject) => (
          <List.Item
            actions={[
              <Button 
                type="text"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditingSubject(subject);
                  setEditingName(subject.name);
                  setIsEditModalVisible(true);
                }}
              >
                Sửa
              </Button>,
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
                onClick={() => onDeleteSubject(subject.id)}
              >
                Xóa
              </Button>
            ]}
          >
            {subject.name}
          </List.Item>
        )}
      />

      <Modal
        title="Sửa môn học"
        open={isEditModalVisible}
        onOk={handleEdit}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingSubject(null);
          setEditingName("");
        }}
      >
        <Input
          placeholder="Nhập tên môn học mới"
          value={editingName}
          onChange={(e) => setEditingName(e.target.value)}
        />
      </Modal>
    </Space>
  );
};

export default SubjectManagement;
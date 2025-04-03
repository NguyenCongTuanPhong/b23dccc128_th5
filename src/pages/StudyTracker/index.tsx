import React, { useState, useEffect } from "react";
import { Card, Input, Button, List, Select, InputNumber, Space, Tabs, message, Modal } from "antd";
import { DeleteOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import StudyProgress from "./StudyProgress";

const { TabPane } = Tabs;

interface Subject {
  id: number;
  name: string;
}

interface StudySession {
  id: number;
  subjectId: number;
  date: string;
  duration: number;
  content: string;
  notes: string;
}

interface StudyGoal {
  subjectId: number;
  targetHours: number;
}

const StudyTracker: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [newGoal, setNewGoal] = useState<{ subjectId: number; targetHours: number }>({
    subjectId: 0,
    targetHours: 0,
  });
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingName, setEditingName] = useState("");

  // LocalStorage effects
  useEffect(() => {
    setSubjects(JSON.parse(localStorage.getItem("subjects") || "[]"));
    setSessions(JSON.parse(localStorage.getItem("sessions") || "[]"));
    setGoals(JSON.parse(localStorage.getItem("goals") || "[]"));
  }, []);

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  // Handlers

  const addSubject = () => {
    if (!newSubject.trim()) {
      message.error("Vui lòng nhập tên môn học!");
      return;
    }
    setSubjects([...subjects, { id: Date.now(), name: newSubject }]);
    setNewSubject("");
    message.success("Thêm môn học thành công!");
  };

  const removeSubject = (id: number) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
    setSessions(sessions.filter((session) => session.subjectId !== id));
    setGoals(goals.filter((goal) => goal.subjectId !== id));
    message.success("Xóa môn học thành công!");
  };

  const setGoal = () => {
    if (newGoal.subjectId === 0 || newGoal.targetHours === 0) {
      message.error("Vui lòng chọn môn học và nhập số giờ mục tiêu!");
      return;
    }
    setGoals([...goals.filter((goal) => goal.subjectId !== newGoal.subjectId), newGoal]);
    message.success("Cập nhật mục tiêu thành công!");
  };
  const startEditing = (subject: Subject) => {
    setEditingSubject(subject);
    setEditingName(subject.name);
    setIsEditModalVisible(true);
  };

  const handleEdit = () => {
    if (!editingName.trim() || !editingSubject) {
      message.error("Vui lòng nhập tên môn học!");
      return;
    }

    setSubjects(subjects.map(subject => 
      subject.id === editingSubject.id 
        ? { ...subject, name: editingName }
        : subject
    ));

    setIsEditModalVisible(false);
    setEditingSubject(null);
    setEditingName("");
    message.success("Cập nhật môn học thành công!");
  };

  const handleAddSession = (session: StudySession) => {
    setSessions([...sessions, session]);
  };

  const handleEditSession = (updatedSession: StudySession) => {
    setSessions(sessions.map(session => 
      session.id === updatedSession.id ? updatedSession : session
    ));
  };

  const handleDeleteSession = (id: number) => {
    setSessions(sessions.filter((session) => session.id !== id));
    message.success("Xóa lịch học thành công!");
  };

  return (
    <Card title="📚 Quản lý tiến độ học tập" style={{ margin: 20 }}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Danh sách môn học" key="1">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Input
                placeholder="Nhập tên môn học..."
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                onPressEnter={addSubject}
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={addSubject}>
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
                      onClick={() => startEditing(subject)}
                    >
                      Sửa
                    </Button>,
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />}
                      onClick={() => removeSubject(subject.id)}
                    >
                      Xóa
                    </Button>
                  ]}
                >
                  {subject.name}
                </List.Item>
              )}
            />
          </Space>
        </TabPane>

        

        <TabPane tab="Mục tiêu học tập" key="2">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card title="Thiết lập mục tiêu">
              <Space>
                <Select
                  style={{ width: 200 }}
                  placeholder="Chọn môn học"
                  onChange={(value) => setNewGoal({ ...newGoal, subjectId: Number(value) })}
                >
                  {subjects.map((subject) => (
                    <Select.Option key={subject.id} value={subject.id}>
                      {subject.name}
                    </Select.Option>
                  ))}
                </Select>
                <InputNumber
                  placeholder="Số giờ mục tiêu"
                  min={1}
                  onChange={(value) => setNewGoal({ ...newGoal, targetHours: Number(value) })}
                />
                <Button type="primary" onClick={setGoal}>
                  Lưu mục tiêu
                </Button>
              </Space>
            </Card>

            <List
              bordered
              dataSource={goals}
              renderItem={(goal) => (
                <List.Item>
                  <Space>
                    {subjects.find(s => s.id === goal.subjectId)?.name}: {goal.targetHours} giờ
                  </Space>
                </List.Item>
              )}
            />
          </Space>
        </TabPane>

        <TabPane tab="Tiến độ học tập" key="3">
          <StudyProgress
            sessions={sessions}
            subjects={subjects}
            onAddSession={handleAddSession}
            onEditSession={handleEditSession}
            onDeleteSession={handleDeleteSession}
          />
        </TabPane>
      </Tabs>

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
    </Card>
  );
};

export default StudyTracker;
import React from 'react';
import { Space, Card, Select, InputNumber, Button, List, Progress } from 'antd';
import { Subject, StudyGoal, StudySession } from './types';
import dayjs from 'dayjs';

interface StudyGoalsProps {
  subjects: Subject[];
  goals: StudyGoal[];
  sessions: StudySession[];
  onSetGoal: (goal: StudyGoal) => void;
}

const StudyGoals: React.FC<StudyGoalsProps> = ({
  subjects,
  goals,
  sessions,
  onSetGoal,
}) => {
  const [newGoal, setNewGoal] = React.useState<StudyGoal>({
    subjectId: 0,
    targetHours: 0,
  });

  const calculateProgress = (subjectId: number): number => {
    const currentMonth = dayjs().format('YYYY-MM');
    const goal = goals.find(g => g.subjectId === subjectId);
    if (!goal) return 0;

    const monthSessions = sessions.filter(session => 
      session.subjectId === subjectId && 
      dayjs(session.date).format('YYYY-MM') === currentMonth
    );
    
    const totalHours = monthSessions.reduce((sum, session) => sum + session.duration, 0);
    return Math.min(Math.round((totalHours / goal.targetHours) * 100), 100);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card title="Thiết lập mục tiêu">
        <Space>
          <Select
            style={{ width: 200 }}
            placeholder="Chọn môn học"
            value={newGoal.subjectId || undefined}
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
            value={newGoal.targetHours || undefined}
            onChange={(value) => setNewGoal({ ...newGoal, targetHours: Number(value) })}
          />
          <Button 
            type="primary" 
            onClick={() => onSetGoal(newGoal)}
          >
            Lưu mục tiêu
          </Button>
        </Space>
      </Card>

      <List
        bordered
        dataSource={subjects}
        renderItem={(subject) => {
          const progress = calculateProgress(subject.id);
          const goal = goals.find(g => g.subjectId === subject.id);
          
          return (
            <List.Item>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>{subject.name}</div>
                <Progress 
                  percent={progress}
                  status={progress >= 100 ? "success" : "active"}
                  format={(percent) => (
                    <span>
                      {goal ? `${percent}% (${goal.targetHours} giờ)` : 'Chưa có mục tiêu'}
                    </span>
                  )}
                />
              </Space>
            </List.Item>
          );
        }}
      />
    </Space>
  );
};

export default StudyGoals;
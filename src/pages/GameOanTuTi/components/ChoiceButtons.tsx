import React from 'react';
import { Typography } from 'antd';
import { ScissorOutlined, StopOutlined, BorderOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ChoiceButtonsProps {
  playerChoice: string | null;
  onChoiceClick: (choice: string) => void;
}

const choices = [
  { name: 'KÉO', icon: <ScissorOutlined />, color: '#ff4d4f' },
  { name: 'BÚA', icon: <StopOutlined />, color: '#1890ff' },
  { name: 'BAO', icon: <BorderOutlined />, color: '#52c41a' }
];

const ChoiceButtons: React.FC<ChoiceButtonsProps> = ({ playerChoice, onChoiceClick }) => (
  <div className="choice-container">
    {choices.map(choice => (
      <div
        key={choice.name}
        className={`choice-box ${playerChoice === choice.name.toLowerCase() ? 'selected' : ''}`}
        onClick={() => onChoiceClick(choice.name.toLowerCase())}
      >
        <div className="choice-icon" style={{ color: choice.color }}>
          {choice.icon}
        </div>
        <Text className="choice-text">{choice.name}</Text>
      </div>
    ))}
  </div>
);

export default ChoiceButtons; 
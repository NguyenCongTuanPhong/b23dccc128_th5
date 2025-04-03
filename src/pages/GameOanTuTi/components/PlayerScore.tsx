import React from 'react';
import { Typography } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface PlayerScoreProps {
  playerScore: number;
  computerScore: number;
}

const PlayerScore: React.FC<PlayerScoreProps> = ({ playerScore, computerScore }) => (
  <div className="score-board">
    <div className="player-side">
      <UserOutlined className="player-icon" />
      <Text>Bạn</Text>
      <Text className="score">{playerScore}</Text>
    </div>
    <div className="vs-badge">VS</div>
    <div className="computer-side">
      <RobotOutlined className="computer-icon" />
      <Text>Máy</Text>
      <Text className="score">{computerScore}</Text>
    </div>
  </div>
);

export default PlayerScore; 
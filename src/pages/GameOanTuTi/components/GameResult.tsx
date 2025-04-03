import React from 'react';
import { Typography, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface GameResultProps {
  playerChoice: string | null;
  computerChoice: string | null;
  result: string;
  onPlayAgain: () => void;
}

const GameResult: React.FC<GameResultProps> = ({
  playerChoice,
  computerChoice,
  result,
  onPlayAgain
}) => (
  <div className="result-section">
    <div className="choices-result">
      <Text>Bạn chọn: {playerChoice}</Text>
      <Text className="vs-small">VS</Text>
      <Text>Máy chọn: {computerChoice}</Text>
    </div>
    <Title level={2} className="result-text">{result}</Title>
    <Button 
      type="primary" 
      danger
      icon={<ReloadOutlined />}
      onClick={onPlayAgain}
      className="play-again-btn"
    >
      Chơi tiếp
    </Button>
  </div>
);

export default GameResult; 
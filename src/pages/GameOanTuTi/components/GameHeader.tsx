import React from 'react';
import { Typography } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';

const { Title } = Typography;

const GameHeader: React.FC = () => (
  <div className="game-header">
    <Title level={2}>
      <TrophyOutlined /> Oản Tù Tì
    </Title>
  </div>
);

export default GameHeader; 
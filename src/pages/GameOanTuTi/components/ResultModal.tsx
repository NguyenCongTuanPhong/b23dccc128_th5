import React from 'react';
import { Modal, Typography, Button, Space } from 'antd';
import { TrophyOutlined, RobotOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ResultModalProps {
  visible: boolean;
  result: string;
  playerChoice: string | null;
  computerChoice: string | null;
  onClose: () => void;
  onPlayAgain: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({
  visible,
  result,
  playerChoice,
  computerChoice,
  onClose,
  onPlayAgain
}) => {
  const getResultIcon = () => {
    if (result.includes('thắng')) {
      return <TrophyOutlined style={{ color: '#52c41a', fontSize: 48 }} />;
    } else if (result.includes('thua')) {
      return <RobotOutlined style={{ color: '#ff4d4f', fontSize: 48 }} />;
    }
    return <MinusCircleOutlined style={{ color: '#faad14', fontSize: 48 }} />;
  };

  const getResultColor = () => {
    if (result.includes('thắng')) return '#52c41a';
    if (result.includes('thua')) return '#ff4d4f';
    return '#faad14';
  };

  return (
    <Modal
      visible={visible}
      footer={null}
      onCancel={onClose}
      centered
      className="result-modal"
      width={400}
    >
      <div className="result-content">
        {getResultIcon()}
        <Title level={2} style={{ color: getResultColor(), margin: '20px 0' }}>
          {result}
        </Title>
        <div className="choices-summary">
          <Text>Bạn chọn: <strong>{playerChoice?.toUpperCase()}</strong></Text>
          <Text>Máy chọn: <strong>{computerChoice?.toUpperCase()}</strong></Text>
        </div>
        <Space size="middle" className="action-buttons">
          <Button type="primary" onClick={onPlayAgain}>
            Chơi tiếp
          </Button>
          <Button onClick={onClose}>
            Đóng
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default ResultModal; 
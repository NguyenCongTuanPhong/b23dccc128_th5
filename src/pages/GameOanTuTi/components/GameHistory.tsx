import React from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface GameHistoryItem {
  id: number;
  time: string;
  playerChoice: string;
  computerChoice: string;
  result: string;
  score: string;
}

interface GameHistoryProps {
  history: GameHistoryItem[];
}

const columns: ColumnsType<GameHistoryItem> = [
  {
    title: 'Thời gian',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'Bạn chọn',
    dataIndex: 'playerChoice',
    key: 'playerChoice',
  },
  {
    title: 'Máy chọn',
    dataIndex: 'computerChoice',
    key: 'computerChoice',
  },
  {
    title: 'Kết quả',
    dataIndex: 'result',
    key: 'result',
    render: (result: string) => {
      const color = result === 'Thắng' ? 'success' : 
                   result === 'Thua' ? 'error' : 'default';
      return <Tag color={color}>{result}</Tag>;
    },
  },
  {
    title: 'Tỉ số',
    dataIndex: 'score',
    key: 'score',
  },
];

const GameHistory: React.FC<GameHistoryProps> = ({ history }) => (
  <Table 
    columns={columns} 
    dataSource={history}
    rowKey="id"
    pagination={{ pageSize: 10 }}
  />
);

export default GameHistory; 
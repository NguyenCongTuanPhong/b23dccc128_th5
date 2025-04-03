import React, { useState, useEffect } from 'react';
import { Card, Tabs } from 'antd';
import { TrophyOutlined, HistoryOutlined } from '@ant-design/icons';
import GameHeader from './components/GameHeader';
import PlayerScore from './components/PlayerScore';
import ChoiceButtons from './components/ChoiceButtons';
import GameResult from './components/GameResult';
import GameHistory from './components/GameHistory';
import { useGameLogic } from './hooks/useGameLogic';
import './style.less';

const { TabPane } = Tabs;

const GameOanTuTi: React.FC = () => {
  const {
    playerChoice,
    computerChoice,
    result,
    score,
    gameHistory,
    handleChoice,
    resetGame,
  } = useGameLogic();

  return (
    <div className="game-container">
      <GameHeader />
      
      <Tabs defaultActiveKey="1">
        <TabPane 
          tab={<span><TrophyOutlined /> Chơi game</span>} 
          key="1"
        >
          <PlayerScore 
            playerScore={score.player} 
            computerScore={score.computer} 
          />
          <ChoiceButtons 
            playerChoice={playerChoice}
            onChoiceClick={handleChoice}
          />
          {result && (
            <GameResult 
              playerChoice={playerChoice}
              computerChoice={computerChoice}
              result={result}
              onPlayAgain={resetGame}
            />
          )}
        </TabPane>
        
        <TabPane 
          tab={<span><HistoryOutlined /> Lịch sử</span>} 
          key="2"
        >
          <GameHistory history={gameHistory} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default GameOanTuTi;
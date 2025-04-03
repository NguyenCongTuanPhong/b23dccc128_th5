import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

export const useGameLogic = () => {
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [gameHistory, setGameHistory] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const determineWinner = (player: string, computer: string) => {
    if (player === computer) {
      setResult('Hòa!');
      return 'draw';
    }

    const winConditions = {
      kéo: 'bao',
      búa: 'kéo',
      bao: 'búa'
    };

    if (winConditions[player] === computer) {
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
      setResult('Bạn thắng! 🎉');
      return 'win';
    } else {
      setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
      setResult('Máy thắng! 🤖');
      return 'lose';
    }
  };

  const handleChoice = (choice: string) => {
    const choices = ['kéo', 'búa', 'bao'];
    const computerPick = choices[Math.floor(Math.random() * 3)];
    
    setPlayerChoice(choice);
    setComputerChoice(computerPick);
    
    const gameResult = determineWinner(choice, computerPick);
    setShowResult(true);

    // Lưu lịch sử
    const newGame = {
      id: Date.now(),
      time: dayjs().format('HH:mm:ss DD/MM/YYYY'),
      playerChoice: choice,
      computerChoice: computerPick,
      result: gameResult,
      score: `${score.player} - ${score.computer}`
    };

    setGameHistory(prev => [newGame, ...prev]);
    localStorage.setItem('gameHistory', JSON.stringify([newGame, ...gameHistory]));
    localStorage.setItem('gameScore', JSON.stringify(score));
  };

  return {
    playerChoice,
    computerChoice,
    result,
    score,
    gameHistory,
    showResult,
    handleChoice,
    setShowResult
  };
}; 
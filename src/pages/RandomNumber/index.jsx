import { useState } from "react";
import { Input, Button, Card, Space, Typography, Alert, Progress } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function GuessNumberGame() {
  const [randomNumber] = useState(Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(10);
  const [gameOver, setGameOver] = useState(false);

  const handleGuess = () => {
    if (gameOver) return;

    if (attempts <= 0) {
      setMessage(`Bạn đã hết lượt! Số đúng là ${randomNumber}.`);
      setGameOver(true);
      return;
    }

    const userGuess = parseInt(guess, 10);
    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
      setMessage("Vui lòng nhập số từ 1 đến 100!");
      return;
    }

    setAttempts(attempts - 1);

    if (userGuess < randomNumber) {
      setMessage("Bạn đoán quá thấp!");
    } else if (userGuess > randomNumber) {
      setMessage("Bạn đoán quá cao!");
    } else {
      setMessage("🎉 Chúc mừng! Bạn đã đoán đúng!");
      setGameOver(true);
    }
  };

  const resetGame = () => {
    window.location.reload();
  };

  return (
    <Card style={{ maxWidth: 600, margin: '20px auto' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Title level={2} style={{ textAlign: 'center', margin: 0 }}>
          🎯 Trò chơi đoán số
        </Title>

        <Alert
          message="Luật chơi"
          description="Hãy đoán một số từ 1 đến 100. Bạn có 10 lượt đoán!"
          type="info"
          showIcon
        />

        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>Nhập số dự đoán của bạn:</Text>
          <Space>
            <Input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onPressEnter={handleGuess}
              style={{ width: 200 }}
              placeholder="Nhập số từ 1-100"
              disabled={gameOver}
            />
            <Button 
              type="primary" 
              onClick={handleGuess}
              disabled={gameOver}
            >
              Đoán
            </Button>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={resetGame}
              type="default"
            >
              Chơi lại
            </Button>
          </Space>
        </Space>

        {message && (
          <Alert
            message={message}
            type={message.includes("Chúc mừng") ? "success" : message.includes("hết lượt") ? "error" : "warning"}
            showIcon
          />
        )}

        <div>
          <Text strong>Số lượt còn lại:</Text>
          <Progress 
            percent={attempts * 10} 
            status={attempts > 3 ? "active" : "exception"}
            format={() => attempts}
          />
        </div>
      </Space>
    </Card>
  );
}
import React, { useState, useEffect, useRef } from "react";
import { Box, Flex, Heading, Kbd, Text } from "@chakra-ui/react";

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 10;
const PADDLE_SPEED = 5;
const BALL_SPEED = 3;

const Index = () => {
  const [player1Y, setPlayer1Y] = useState((GAME_HEIGHT - PADDLE_HEIGHT) / 2);
  const [player2Y, setPlayer2Y] = useState((GAME_HEIGHT - PADDLE_HEIGHT) / 2);
  const [ballX, setBallX] = useState(GAME_WIDTH / 2);
  const [ballY, setBallY] = useState(GAME_HEIGHT / 2);
  const [ballSpeedX, setBallSpeedX] = useState(BALL_SPEED);
  const [ballSpeedY, setBallSpeedY] = useState(BALL_SPEED);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  const gameRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "w" && player1Y > 0) {
        setPlayer1Y((prev) => prev - PADDLE_SPEED);
      } else if (e.key === "s" && player1Y < GAME_HEIGHT - PADDLE_HEIGHT) {
        setPlayer1Y((prev) => prev + PADDLE_SPEED);
      } else if (e.key === "ArrowUp" && player2Y > 0) {
        setPlayer2Y((prev) => prev - PADDLE_SPEED);
      } else if (e.key === "ArrowDown" && player2Y < GAME_HEIGHT - PADDLE_HEIGHT) {
        setPlayer2Y((prev) => prev + PADDLE_SPEED);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [player1Y, player2Y]);

  useEffect(() => {
    const moveBall = () => {
      setBallX((prevX) => prevX + ballSpeedX);
      setBallY((prevY) => prevY + ballSpeedY);
    };

    const detectCollision = () => {
      if (ballY <= 0 || ballY >= GAME_HEIGHT - BALL_SIZE) {
        setBallSpeedY((prev) => -prev);
      }

      if ((ballX <= PADDLE_WIDTH && ballY >= player1Y && ballY <= player1Y + PADDLE_HEIGHT) || (ballX >= GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE && ballY >= player2Y && ballY <= player2Y + PADDLE_HEIGHT)) {
        setBallSpeedX((prev) => -prev);
      }

      if (ballX <= 0) {
        setPlayer2Score((prev) => prev + 1);
        resetBall();
      } else if (ballX >= GAME_WIDTH - BALL_SIZE) {
        setPlayer1Score((prev) => prev + 1);
        resetBall();
      }
    };

    const resetBall = () => {
      setBallX(GAME_WIDTH / 2);
      setBallY(GAME_HEIGHT / 2);
      setBallSpeedX((prev) => -prev);
    };

    const gameLoop = () => {
      moveBall();
      detectCollision();
    };

    const intervalId = setInterval(gameLoop, 1000 / 60);
    return () => clearInterval(intervalId);
  }, [ballX, ballY, player1Y, player2Y, ballSpeedX, ballSpeedY]);

  return (
    <Flex direction="column" align="center" justify="center" h="100vh">
      <Heading mb={4}>Pong Game</Heading>
      <Flex mb={4}>
        <Text mr={4}>
          Player 1: <Kbd>W</Kbd> <Kbd>S</Kbd>
        </Text>
        <Text>
          Player 2: <Kbd>↑</Kbd> <Kbd>↓</Kbd>
        </Text>
      </Flex>
      <Box ref={gameRef} position="relative" width={GAME_WIDTH} height={GAME_HEIGHT} bg="gray.100" borderWidth={1}>
        <Box position="absolute" left={0} top={player1Y} width={PADDLE_WIDTH} height={PADDLE_HEIGHT} bg="blue.500" />
        <Box position="absolute" right={0} top={player2Y} width={PADDLE_WIDTH} height={PADDLE_HEIGHT} bg="red.500" />
        <Box position="absolute" left={ballX} top={ballY} width={BALL_SIZE} height={BALL_SIZE} borderRadius="50%" bg="green.500" />
      </Box>
      <Text mt={4}>
        Score: {player1Score} - {player2Score}
      </Text>
    </Flex>
  );
};

export default Index;

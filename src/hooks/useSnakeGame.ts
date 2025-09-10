'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// 游戏配置常量
export const GRID_SIZE = 20;
export const CANVAS_SIZE = 400;
export const INITIAL_SPEED = 150;
export const SPEED_INCREASE = 5;

// 类型定义
export interface Position {
  x: number;
  y: number;
}

export interface Direction {
  x: number;
  y: number;
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
  highScore: number;
  speed: number;
}

export interface Snake {
  body: Position[];
  direction: Direction;
  nextDirection: Direction;
}

export const useSnakeGame = () => {
  // 游戏状态
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    score: 0,
    highScore: 0,
    speed: INITIAL_SPEED,
  });

  // 蛇的状态
  const [snake, setSnake] = useState<Snake>({
    body: [{ x: 200, y: 200 }],
    direction: { x: GRID_SIZE, y: 0 },
    nextDirection: { x: GRID_SIZE, y: 0 },
  });

  // 食物位置
  const [food, setFood] = useState<Position>({ x: 0, y: 0 });

  // 游戏循环引用
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 从localStorage获取最高分
  useEffect(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setGameState(prev => ({ ...prev, highScore: parseInt(savedHighScore) }));
    }
  }, []);

  // 生成随机食物位置
  const generateFood = useCallback(() => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)) * GRID_SIZE,
        y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)) * GRID_SIZE,
      };
    } while (snake.body.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    setFood(newFood);
  }, [snake.body]);

  // 检查碰撞
  const checkCollision = useCallback((head: Position): boolean => {
    // 检查是否撞墙
    if (head.x < 0 || head.x >= CANVAS_SIZE || head.y < 0 || head.y >= CANVAS_SIZE) {
      return true;
    }
    
    // 检查是否撞到自己
    return snake.body.some(segment => head.x === segment.x && head.y === segment.y);
  }, [snake.body]);

  // 游戏结束
  const gameOver = useCallback(() => {
    setGameState(prev => {
      const newHighScore = prev.score > prev.highScore ? prev.score : prev.highScore;
      if (prev.score > prev.highScore) {
        localStorage.setItem('snakeHighScore', newHighScore.toString());
      }
      
      return {
        ...prev,
        isPlaying: false,
        isGameOver: true,
        highScore: newHighScore,
      };
    });
    
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, []);

  // 吃到食物
  const eatFood = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + 10,
      speed: Math.max(50, prev.speed - SPEED_INCREASE),
    }));
    
    generateFood();
  }, [generateFood]);

  // 游戏主更新逻辑
  const updateGame = useCallback(() => {
    setSnake(prevSnake => {
      // 更新方向
      const newDirection = { ...prevSnake.nextDirection };
      
      // 计算新的蛇头位置
      const head = { ...prevSnake.body[0] };
      head.x += newDirection.x;
      head.y += newDirection.y;
      
      // 检查碰撞
      if (checkCollision(head)) {
        gameOver();
        return prevSnake;
      }
      
      // 创建新的蛇身
      const newBody = [head, ...prevSnake.body];
      
      // 检查是否吃到食物
      if (head.x === food.x && head.y === food.y) {
        eatFood();
        // 不移除尾部，蛇变长
      } else {
        // 移除尾部
        newBody.pop();
      }
      
      return {
        ...prevSnake,
        body: newBody,
        direction: newDirection,
      };
    });
  }, [checkCollision, food, gameOver, eatFood]);

  // 开始游戏
  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      score: 0,
      speed: INITIAL_SPEED,
    }));
    
    setSnake({
      body: [{ x: 200, y: 200 }],
      direction: { x: GRID_SIZE, y: 0 },
      nextDirection: { x: GRID_SIZE, y: 0 },
    });
    
    generateFood();
  }, [generateFood]);

  // 暂停/继续游戏
  const togglePause = useCallback(() => {
    if (!gameState.isPlaying || gameState.isGameOver) return;
    
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, [gameState.isPlaying, gameState.isGameOver]);

  // 重置游戏
  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      score: 0,
      speed: INITIAL_SPEED,
    }));
    
    setSnake({
      body: [{ x: 200, y: 200 }],
      direction: { x: GRID_SIZE, y: 0 },
      nextDirection: { x: GRID_SIZE, y: 0 },
    });
    
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, []);

  // 改变方向
  const changeDirection = useCallback((newDirection: Direction) => {
    setSnake(prev => {
      // 防止反向移动
      if (newDirection.x === -prev.direction.x && newDirection.y === -prev.direction.y) {
        return prev;
      }
      
      return {
        ...prev,
        nextDirection: newDirection,
      };
    });
  }, []);

  // 游戏循环效果
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && !gameState.isGameOver) {
      gameLoopRef.current = setInterval(updateGame, gameState.speed);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, gameState.speed, updateGame]);

  // 键盘事件处理
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();
      
      switch (e.code) {
        case 'ArrowUp':
          changeDirection({ x: 0, y: -GRID_SIZE });
          break;
        case 'ArrowDown':
          changeDirection({ x: 0, y: GRID_SIZE });
          break;
        case 'ArrowLeft':
          changeDirection({ x: -GRID_SIZE, y: 0 });
          break;
        case 'ArrowRight':
          changeDirection({ x: GRID_SIZE, y: 0 });
          break;
        case 'Space':
          if (!gameState.isPlaying || gameState.isGameOver) {
            startGame();
          } else {
            togglePause();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [changeDirection, gameState.isPlaying, gameState.isGameOver, startGame, togglePause]);

  // 页面可见性变化时自动暂停
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && gameState.isPlaying && !gameState.isPaused && !gameState.isGameOver) {
        togglePause();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, togglePause]);

  return {
    gameState,
    snake,
    food,
    canvasRef,
    startGame,
    togglePause,
    resetGame,
    changeDirection,
    generateFood,
  };
};

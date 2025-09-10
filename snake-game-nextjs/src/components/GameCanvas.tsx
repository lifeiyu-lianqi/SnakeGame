'use client';

import { useEffect, useRef, ForwardedRef, forwardRef } from 'react';
import { Snake, Position, GRID_SIZE, CANVAS_SIZE } from '@/hooks/useSnakeGame';

interface GameCanvasProps {
  snake: Snake;
  food: Position;
}

const GameCanvas = forwardRef<HTMLCanvasElement, GameCanvasProps>(
  ({ snake, food }, ref: ForwardedRef<HTMLCanvasElement>) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // 绘制圆角矩形
    const drawRoundedRect = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();
    };

    // 绘制网格
    const drawGrid = (ctx: CanvasRenderingContext2D) => {
      ctx.strokeStyle = '#1f2937'; // gray-800
      ctx.lineWidth = 1;
      
      // 绘制垂直线
      for (let x = 0; x <= CANVAS_SIZE; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_SIZE);
        ctx.stroke();
      }
      
      // 绘制水平线
      for (let y = 0; y <= CANVAS_SIZE; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_SIZE, y);
        ctx.stroke();
      }
    };

    // 绘制蛇
    const drawSnake = (ctx: CanvasRenderingContext2D) => {
      snake.body.forEach((segment, index) => {
        if (index === 0) {
          // 蛇头 - 使用渐变绿色
          const gradient = ctx.createRadialGradient(
            segment.x + GRID_SIZE / 2, segment.y + GRID_SIZE / 2, 0,
            segment.x + GRID_SIZE / 2, segment.y + GRID_SIZE / 2, GRID_SIZE / 2
          );
          gradient.addColorStop(0, '#34d399'); // emerald-400
          gradient.addColorStop(1, '#059669'); // emerald-600
          ctx.fillStyle = gradient;
        } else {
          // 蛇身 - 使用较暗的绿色
          ctx.fillStyle = '#10b981'; // emerald-500
        }
        
        // 绘制圆角矩形
        drawRoundedRect(ctx, segment.x + 1, segment.y + 1, GRID_SIZE - 2, GRID_SIZE - 2, 4);
      });
      
      // 绘制蛇眼睛
      if (snake.body.length > 0) {
        const head = snake.body[0];
        ctx.fillStyle = '#ffffff';
        
        // 根据方向调整眼睛位置
        if (snake.direction.x > 0) { // 向右
          ctx.fillRect(head.x + GRID_SIZE - 8, head.y + 4, 3, 3);
          ctx.fillRect(head.x + GRID_SIZE - 8, head.y + GRID_SIZE - 7, 3, 3);
        } else if (snake.direction.x < 0) { // 向左
          ctx.fillRect(head.x + 5, head.y + 4, 3, 3);
          ctx.fillRect(head.x + 5, head.y + GRID_SIZE - 7, 3, 3);
        } else if (snake.direction.y > 0) { // 向下
          ctx.fillRect(head.x + 4, head.y + GRID_SIZE - 8, 3, 3);
          ctx.fillRect(head.x + GRID_SIZE - 7, head.y + GRID_SIZE - 8, 3, 3);
        } else { // 向上
          ctx.fillRect(head.x + 4, head.y + 5, 3, 3);
          ctx.fillRect(head.x + GRID_SIZE - 7, head.y + 5, 3, 3);
        }
      }
    };

    // 绘制食物
    const drawFood = (ctx: CanvasRenderingContext2D) => {
      // 使用渐变红色
      const gradient = ctx.createRadialGradient(
        food.x + GRID_SIZE / 2, food.y + GRID_SIZE / 2, 0,
        food.x + GRID_SIZE / 2, food.y + GRID_SIZE / 2, GRID_SIZE / 2
      );
      gradient.addColorStop(0, '#f87171'); // red-400
      gradient.addColorStop(1, '#dc2626'); // red-600
      ctx.fillStyle = gradient;
      
      // 绘制圆形食物
      ctx.beginPath();
      ctx.arc(food.x + GRID_SIZE / 2, food.y + GRID_SIZE / 2, GRID_SIZE / 2 - 2, 0, 2 * Math.PI);
      ctx.fill();
      
      // 添加高光效果
      ctx.fillStyle = '#fca5a5'; // red-300
      ctx.beginPath();
      ctx.arc(food.x + GRID_SIZE / 2 - 3, food.y + GRID_SIZE / 2 - 3, 3, 0, 2 * Math.PI);
      ctx.fill();
    };

    // 主绘制函数
    const draw = () => {
      const canvas = canvasRef.current || (ref as React.RefObject<HTMLCanvasElement>)?.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // 清空画布
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      
      // 绘制网格
      drawGrid(ctx);
      
      // 绘制蛇
      drawSnake(ctx);
      
      // 绘制食物
      drawFood(ctx);
    };

    // 绘制效果
    useEffect(() => {
      draw();
    }, [snake, food]);

    // 触摸控制
    const handleTouchStart = useRef({ x: 0, y: 0 });

    const onTouchStart = (e: React.TouchEvent) => {
      e.preventDefault();
      handleTouchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const onTouchEnd = (e: React.TouchEvent) => {
      e.preventDefault();
      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };
      
      const deltaX = touchEnd.x - handleTouchStart.current.x;
      const deltaY = touchEnd.y - handleTouchStart.current.y;
      const minSwipeDistance = 30;
      
      // 这里需要从父组件传入changeDirection函数
      // 暂时留空，将在父组件中处理
    };

    return (
      <div className="relative">
        <canvas
          ref={ref || canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="border-4 border-gray-800 rounded-xl bg-black shadow-2xl hover:scale-105 transition-transform duration-200"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onTouchMove={(e) => e.preventDefault()}
        />
      </div>
    );
  }
);

GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;

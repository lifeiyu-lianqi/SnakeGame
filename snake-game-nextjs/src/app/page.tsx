'use client';

import { useSnakeGame } from '@/hooks/useSnakeGame';
import GameCanvas from '@/components/GameCanvas';
import ScoreBoard from '@/components/ScoreBoard';
import GameControls from '@/components/GameControls';
import GameOverlay from '@/components/GameOverlay';
import GameInstructions from '@/components/GameInstructions';

export default function Home() {
  const {
    gameState,
    snake,
    food,
    canvasRef,
    startGame,
    togglePause,
    resetGame,
    changeDirection,
    generateFood,
  } = useSnakeGame();

  // 初始化食物位置（如果还没有的话）
  if (food.x === 0 && food.y === 0) {
    generateFood();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 标题和分数板 */}
        <ScoreBoard gameState={gameState} />
        
        {/* 游戏区域 */}
        <div className="bg-white/95 backdrop-blur-sm rounded-b-xl shadow-2xl p-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* 游戏画布区域 */}
            <div className="flex-1 flex flex-col items-center">
              <div className="relative">
                <GameCanvas
                  ref={canvasRef}
                  snake={snake}
                  food={food}
                />
                
                {/* 游戏覆盖层 */}
                <GameOverlay
                  gameState={gameState}
                  onStart={startGame}
                  onContinue={togglePause}
                />
              </div>
              
              {/* 控制按钮 */}
              <div className="mt-6 w-full max-w-md">
                <GameControls
                  gameState={gameState}
                  onStart={startGame}
                  onPause={togglePause}
                  onReset={resetGame}
                  onDirectionChange={changeDirection}
                />
              </div>
            </div>
            
            {/* 游戏说明 */}
            <div className="w-full lg:w-80">
              <GameInstructions />
            </div>
          </div>
        </div>
        
        {/* 页脚 */}
        <footer className="mt-8 text-center text-white/70">
          <p className="text-sm">
            &copy; 2025 贪食蛇游戏 - Next.js 版本
          </p>
          <p className="text-xs mt-1">
            使用 React + TypeScript + Tailwind CSS 构建
          </p>
        </footer>
      </div>
    </main>
  );
}
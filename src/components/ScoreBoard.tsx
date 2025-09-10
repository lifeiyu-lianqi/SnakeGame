'use client';

import { GameState } from '@/hooks/useSnakeGame';

interface ScoreBoardProps {
  gameState: GameState;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ gameState }) => {
  return (
    <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white p-6 rounded-t-xl shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-4 text-shadow-lg">
        🐍 贪食蛇游戏
      </h1>
      
      <div className="flex justify-around items-center bg-white/10 rounded-xl p-4 backdrop-blur-sm">
        <div className="text-center">
          <div className="text-sm opacity-90 mb-1">分数</div>
          <div 
            className={`text-3xl font-bold transition-all duration-300 ${
              gameState.score > 0 ? 'animate-pulse' : ''
            }`}
          >
            {gameState.score}
          </div>
        </div>
        
        <div className="w-px h-12 bg-white/30"></div>
        
        <div className="text-center">
          <div className="text-sm opacity-90 mb-1">最高分</div>
          <div className="text-3xl font-bold">
            {gameState.highScore}
          </div>
        </div>
      </div>
      
      {/* 游戏状态指示器 */}
      <div className="flex justify-center mt-4">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          gameState.isPlaying && !gameState.isPaused && !gameState.isGameOver
            ? 'bg-green-500 text-white'
            : gameState.isPaused
            ? 'bg-yellow-500 text-white'
            : gameState.isGameOver
            ? 'bg-red-500 text-white'
            : 'bg-gray-500 text-white'
        }`}>
          {gameState.isPlaying && !gameState.isPaused && !gameState.isGameOver
            ? '游戏进行中'
            : gameState.isPaused
            ? '已暂停'
            : gameState.isGameOver
            ? '游戏结束'
            : '等待开始'
          }
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;

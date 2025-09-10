'use client';

import { GameState, Direction, GRID_SIZE } from '@/hooks/useSnakeGame';

interface GameControlsProps {
  gameState: GameState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onDirectionChange: (direction: Direction) => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  onStart,
  onPause,
  onReset,
  onDirectionChange,
}) => {
  const handleDirectionClick = (direction: 'up' | 'down' | 'left' | 'right') => {
    const directions = {
      up: { x: 0, y: -GRID_SIZE },
      down: { x: 0, y: GRID_SIZE },
      left: { x: -GRID_SIZE, y: 0 },
      right: { x: GRID_SIZE, y: 0 },
    };
    
    onDirectionChange(directions[direction]);
  };

  return (
    <div className="space-y-6">
      {/* 主要控制按钮 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {!gameState.isPlaying || gameState.isGameOver ? (
          <button
            onClick={onStart}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {gameState.isGameOver ? '重新开始' : '开始游戏'}
          </button>
        ) : (
          <button
            onClick={onPause}
            className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {gameState.isPaused ? '继续游戏' : '暂停游戏'}
          </button>
        )}
        
        <button
          onClick={onReset}
          className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold rounded-xl hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          重置游戏
        </button>
      </div>

      {/* 移动端方向控制 */}
      <div className="block sm:hidden">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">触控操作</h3>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          {/* 上 */}
          <button
            onClick={() => handleDirectionClick('up')}
            className="w-16 h-16 bg-gradient-to-b from-blue-400 to-blue-600 text-white text-2xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-150"
            disabled={!gameState.isPlaying || gameState.isPaused || gameState.isGameOver}
          >
            ↑
          </button>
          
          {/* 左右 */}
          <div className="flex gap-4">
            <button
              onClick={() => handleDirectionClick('left')}
              className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-2xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-150"
              disabled={!gameState.isPlaying || gameState.isPaused || gameState.isGameOver}
            >
              ←
            </button>
            
            <button
              onClick={() => handleDirectionClick('right')}
              className="w-16 h-16 bg-gradient-to-l from-blue-400 to-blue-600 text-white text-2xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-150"
              disabled={!gameState.isPlaying || gameState.isPaused || gameState.isGameOver}
            >
              →
            </button>
          </div>
          
          {/* 下 */}
          <button
            onClick={() => handleDirectionClick('down')}
            className="w-16 h-16 bg-gradient-to-t from-blue-400 to-blue-600 text-white text-2xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-150"
            disabled={!gameState.isPlaying || gameState.isPaused || gameState.isGameOver}
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameControls;

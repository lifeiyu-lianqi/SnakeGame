'use client';

import { GameState } from '@/hooks/useSnakeGame';

interface GameOverlayProps {
  gameState: GameState;
  onStart: () => void;
  onContinue: () => void;
}

const GameOverlay: React.FC<GameOverlayProps> = ({ gameState, onStart, onContinue }) => {
  if (gameState.isPlaying && !gameState.isPaused && !gameState.isGameOver) {
    return null;
  }

  const getOverlayContent = () => {
    if (gameState.isGameOver) {
      const isNewRecord = gameState.score === gameState.highScore && gameState.score > 0;
      
      return {
        icon: isNewRecord ? '🎉' : '💀',
        title: isNewRecord ? '新记录！' : '游戏结束',
        message: isNewRecord 
          ? `恭喜！你创造了新记录：${gameState.score}分` 
          : `你的分数：${gameState.score}分\n最高分：${gameState.highScore}分`,
        buttonText: '重新开始',
        buttonAction: onStart,
        buttonClass: isNewRecord 
          ? 'from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600' 
          : 'from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700',
      };
    }
    
    if (gameState.isPaused) {
      return {
        icon: '⏸️',
        title: '游戏暂停',
        message: '按 空格键 继续游戏',
        buttonText: '继续游戏',
        buttonAction: onContinue,
        buttonClass: 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
      };
    }
    
    return {
      icon: '🎮',
      title: '准备开始',
      message: '按 空格键 开始游戏\n使用方向键控制蛇的移动',
      buttonText: '开始游戏',
      buttonAction: onStart,
      buttonClass: 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
    };
  };

  const content = getOverlayContent();

  return (
    <div 
      className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          content.buttonAction();
        }
      }}
    >
      <div className="text-center text-white p-8 max-w-md mx-4">
        <div className="text-6xl mb-4 animate-bounce">
          {content.icon}
        </div>
        
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          {content.title}
        </h2>
        
        <p className="text-lg mb-8 leading-relaxed opacity-90 whitespace-pre-line">
          {content.message}
        </p>
        
        <button
          onClick={content.buttonAction}
          className={`px-8 py-4 bg-gradient-to-r ${content.buttonClass} text-white font-bold rounded-xl transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl text-lg uppercase tracking-wide`}
        >
          {content.buttonText}
        </button>
        
        <div className="mt-6 text-sm opacity-70">
          <p>键盘控制：</p>
          <div className="flex justify-center gap-2 mt-2">
            <span className="px-2 py-1 bg-white/10 rounded text-xs">↑</span>
            <span className="px-2 py-1 bg-white/10 rounded text-xs">↓</span>
            <span className="px-2 py-1 bg-white/10 rounded text-xs">←</span>
            <span className="px-2 py-1 bg-white/10 rounded text-xs">→</span>
            <span className="px-2 py-1 bg-white/10 rounded text-xs">空格</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOverlay;

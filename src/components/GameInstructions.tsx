'use client';

const GameInstructions: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold text-center mb-4">🎯 游戏说明</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍎</span>
            <span>控制蛇吃掉红色食物来获得分数</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-2xl">⌨️</span>
            <span>使用方向键或移动端按钮控制移动</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <span>不要撞到墙壁或自己的身体</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <span>挑战更高分数！</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏸️</span>
            <span>按空格键暂停/继续游戏</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <span>速度会随着分数增加而加快</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
        <h4 className="font-semibold mb-2">💡 小贴士：</h4>
        <ul className="text-sm space-y-1 opacity-90">
          <li>• 每吃到一个食物获得 10 分</li>
          <li>• 游戏速度会逐渐加快，保持专注</li>
          <li>• 页面切换时游戏会自动暂停</li>
          <li>• 最高分会自动保存在本地</li>
        </ul>
      </div>
    </div>
  );
};

export default GameInstructions;

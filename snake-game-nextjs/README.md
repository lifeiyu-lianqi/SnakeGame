# 🐍 贪食蛇游戏 - Next.js 版本

一个使用 Next.js + React + TypeScript + Tailwind CSS 构建的现代化贪食蛇游戏。

## ✨ 技术亮点

### 🚀 Next.js 13+ App Router
- 使用最新的 App Router 架构
- 服务端渲染 (SSR) 支持
- 自动代码分割和优化

### ⚛️ React + TypeScript
- 函数式组件和 Hooks
- 完整的 TypeScript 类型定义
- 自定义 Hook 管理游戏状态

### 🎨 现代化 UI/UX
- Tailwind CSS 响应式设计
- 精美的渐变色彩和动画效果
- 移动端友好的触控支持

### 🎮 游戏特性
- 流畅的游戏循环和渲染
- 实时分数系统
- 本地存储最高分记录
- 键盘和触摸双重控制

## 🛠️ 技术架构

### 组件结构
```
src/
├── app/
│   ├── layout.tsx          # 根布局组件
│   ├── page.tsx            # 主页面
│   └── globals.css         # 全局样式
├── components/
│   ├── GameCanvas.tsx      # 游戏画布组件
│   ├── ScoreBoard.tsx      # 分数显示组件
│   ├── GameControls.tsx    # 游戏控制组件
│   ├── GameOverlay.tsx     # 游戏覆盖层组件
│   └── GameInstructions.tsx # 游戏说明组件
└── hooks/
    └── useSnakeGame.ts     # 游戏逻辑Hook
```

### 核心特性

#### 🎯 自定义 Hook - `useSnakeGame`
- **状态管理**：游戏状态、蛇的位置、食物位置
- **游戏逻辑**：移动、碰撞检测、得分计算
- **事件处理**：键盘输入、触摸控制
- **生命周期**：游戏循环、暂停恢复

#### 🎨 组件化设计
- **GameCanvas**：Canvas 渲染逻辑，支持触摸事件
- **ScoreBoard**：实时分数显示和游戏状态指示
- **GameControls**：按钮控制和移动端方向键
- **GameOverlay**：游戏开始/暂停/结束界面
- **GameInstructions**：游戏说明和操作指南

#### 📱 响应式设计
- 桌面端优化的键盘控制
- 移动端触摸滑动和按钮控制
- 自适应布局，支持各种屏幕尺寸

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn

### 安装和运行
```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 开发服务器
启动后访问 [http://localhost:3000](http://localhost:3000) 开始游戏。

## 🎮 游戏玩法

### 控制方式
- **桌面端**：方向键 ↑↓←→ 控制移动，空格键开始/暂停
- **移动端**：屏幕滑动或点击方向按钮控制

### 游戏规则
1. 🎯 控制蛇吃掉红色食物获得分数
2. 📈 每个食物 +10 分，速度逐渐加快
3. ⚠️ 避免撞墙或撞到自己
4. 🏆 挑战更高分数！

## 🔧 自定义配置

在 `src/hooks/useSnakeGame.ts` 中可以调整游戏参数：

```typescript
export const GRID_SIZE = 20;          // 网格大小
export const CANVAS_SIZE = 400;       // 画布尺寸  
export const INITIAL_SPEED = 150;     // 初始速度(ms)
export const SPEED_INCREASE = 5;      // 速度增量
```

## 🎨 样式定制

项目使用 Tailwind CSS，可以轻松定制：

- **颜色主题**：在组件中修改 `bg-gradient-to-r` 等样式类
- **动画效果**：在 `globals.css` 中添加自定义动画
- **响应式断点**：使用 Tailwind 的响应式前缀

## 📦 部署

### Vercel (推荐)
```bash
npm i -g vercel
vercel
```

### 其他平台
```bash
npm run build
# 部署 .next 目录到任何支持 Node.js 的平台
```

## 🔮 未来改进

- [ ] PWA 支持，离线游戏
- [ ] 多人对战模式
- [ ] 更多游戏主题和皮肤
- [ ] 成就系统
- [ ] 游戏重放功能
- [ ] WebGL 加速渲染

## 📄 许可证

MIT License - 自由使用和修改

---

**技术栈**: Next.js 13+ • React 18+ • TypeScript • Tailwind CSS • Canvas API

享受编码，享受游戏！🎉
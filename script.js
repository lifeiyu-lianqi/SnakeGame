// 游戏配置和全局变量
const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const INITIAL_SPEED = 150;
const SPEED_INCREASE = 5;

// 游戏状态
let gameState = {
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    score: 0,
    highScore: localStorage.getItem('snakeHighScore') || 0,
    speed: INITIAL_SPEED
};

// 蛇和食物对象
let snake = {
    body: [{ x: 200, y: 200 }],
    direction: { x: GRID_SIZE, y: 0 },
    nextDirection: { x: GRID_SIZE, y: 0 }
};

let food = {
    x: 0,
    y: 0
};

// DOM元素引用
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const gameOverlay = document.getElementById('gameOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayMessage = document.getElementById('overlayMessage');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');

// 游戏循环计时器
let gameLoop = null;

// 初始化游戏
function initGame() {
    // 设置canvas尺寸
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    
    // 显示最高分
    updateHighScore();
    
    // 重置游戏状态
    resetGame();
    
    // 生成初始食物
    generateFood();
    
    // 绘制初始画面
    draw();
    
    // 绑定事件监听器
    bindEventListeners();
    
    console.log('游戏初始化完成');
}

// 重置游戏状态
function resetGame() {
    gameState.isPlaying = false;
    gameState.isPaused = false;
    gameState.isGameOver = false;
    gameState.score = 0;
    gameState.speed = INITIAL_SPEED;
    
    snake.body = [{ x: 200, y: 200 }];
    snake.direction = { x: GRID_SIZE, y: 0 };
    snake.nextDirection = { x: GRID_SIZE, y: 0 };
    
    updateScore();
    showOverlay('🎮 准备开始', '按 空格键 开始游戏<br>使用方向键控制蛇的移动');
    
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
}

// 开始游戏
function startGame() {
    if (gameState.isGameOver) {
        resetGame();
    }
    
    gameState.isPlaying = true;
    gameState.isPaused = false;
    hideOverlay();
    
    // 生成食物（如果还没有的话）
    if (food.x === 0 && food.y === 0) {
        generateFood();
    }
    
    // 开始游戏循环
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    gameLoop = setInterval(update, gameState.speed);
    
    console.log('游戏开始');
}

// 暂停/继续游戏
function togglePause() {
    if (!gameState.isPlaying || gameState.isGameOver) return;
    
    gameState.isPaused = !gameState.isPaused;
    
    if (gameState.isPaused) {
        clearInterval(gameLoop);
        showOverlay('⏸️ 游戏暂停', '按 空格键 继续游戏');
        pauseButton.textContent = '继续';
    } else {
        hideOverlay();
        gameLoop = setInterval(update, gameState.speed);
        pauseButton.textContent = '暂停';
    }
}

// 游戏结束
function gameOver() {
    gameState.isPlaying = false;
    gameState.isGameOver = true;
    clearInterval(gameLoop);
    
    // 检查是否创造新记录
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('snakeHighScore', gameState.highScore);
        updateHighScore();
        showOverlay('🎉 新记录！', `恭喜！你创造了新记录：${gameState.score}分<br>点击重新开始挑战更高分数`);
        // 添加庆祝动画
        canvas.classList.add('pulse');
        setTimeout(() => canvas.classList.remove('pulse'), 500);
    } else {
        showOverlay('💀 游戏结束', `你的分数：${gameState.score}分<br>最高分：${gameState.highScore}分<br>点击重新开始`);
        // 添加震动效果
        canvas.classList.add('shake');
        setTimeout(() => canvas.classList.remove('shake'), 500);
    }
    
    pauseButton.textContent = '暂停';
}

// 游戏主更新函数
function update() {
    if (!gameState.isPlaying || gameState.isPaused) return;
    
    // 更新蛇的方向
    snake.direction = { ...snake.nextDirection };
    
    // 计算蛇头的新位置
    const head = { ...snake.body[0] };
    head.x += snake.direction.x;
    head.y += snake.direction.y;
    
    // 检查碰撞
    if (checkCollision(head)) {
        gameOver();
        return;
    }
    
    // 移动蛇
    snake.body.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        eatFood();
    } else {
        // 如果没吃到食物，移除尾部
        snake.body.pop();
    }
    
    // 重新绘制游戏画面
    draw();
}

// 检查碰撞
function checkCollision(head) {
    // 检查是否撞墙
    if (head.x < 0 || head.x >= CANVAS_SIZE || head.y < 0 || head.y >= CANVAS_SIZE) {
        return true;
    }
    
    // 检查是否撞到自己
    for (let segment of snake.body) {
        if (head.x === segment.x && head.y === segment.y) {
            return true;
        }
    }
    
    return false;
}

// 吃到食物
function eatFood() {
    gameState.score += 10;
    updateScore();
    
    // 增加游戏速度
    if (gameState.speed > 50) {
        gameState.speed = Math.max(50, gameState.speed - SPEED_INCREASE);
        clearInterval(gameLoop);
        gameLoop = setInterval(update, gameState.speed);
    }
    
    // 生成新食物
    generateFood();
    
    // 添加得分动画效果
    scoreElement.classList.add('pulse');
    setTimeout(() => scoreElement.classList.remove('pulse'), 300);
    
    console.log(`得分！当前分数：${gameState.score}`);
}

// 生成食物
function generateFood() {
    do {
        food.x = Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)) * GRID_SIZE;
        food.y = Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)) * GRID_SIZE;
    } while (isPositionOccupied(food.x, food.y));
}

// 检查位置是否被蛇占据
function isPositionOccupied(x, y) {
    return snake.body.some(segment => segment.x === x && segment.y === y);
}

// 绘制游戏画面
function draw() {
    // 清空画布
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // 绘制网格（可选）
    drawGrid();
    
    // 绘制蛇
    drawSnake();
    
    // 绘制食物
    drawFood();
}

// 绘制网格
function drawGrid() {
    ctx.strokeStyle = '#222';
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
}

// 绘制蛇
function drawSnake() {
    snake.body.forEach((segment, index) => {
        if (index === 0) {
            // 蛇头 - 使用渐变绿色
            const gradient = ctx.createRadialGradient(
                segment.x + GRID_SIZE/2, segment.y + GRID_SIZE/2, 0,
                segment.x + GRID_SIZE/2, segment.y + GRID_SIZE/2, GRID_SIZE/2
            );
            gradient.addColorStop(0, '#4ade80');
            gradient.addColorStop(1, '#16a34a');
            ctx.fillStyle = gradient;
        } else {
            // 蛇身 - 使用较暗的绿色
            ctx.fillStyle = '#22c55e';
        }
        
        // 绘制圆角矩形
        drawRoundedRect(segment.x + 1, segment.y + 1, GRID_SIZE - 2, GRID_SIZE - 2, 4);
    });
    
    // 绘制蛇眼睛
    if (snake.body.length > 0) {
        const head = snake.body[0];
        ctx.fillStyle = '#fff';
        
        // 根据方向调整眼睛位置
        let eyeOffset = 4;
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
}

// 绘制食物
function drawFood() {
    // 使用渐变红色
    const gradient = ctx.createRadialGradient(
        food.x + GRID_SIZE/2, food.y + GRID_SIZE/2, 0,
        food.x + GRID_SIZE/2, food.y + GRID_SIZE/2, GRID_SIZE/2
    );
    gradient.addColorStop(0, '#ef4444');
    gradient.addColorStop(1, '#dc2626');
    ctx.fillStyle = gradient;
    
    // 绘制圆形食物
    ctx.beginPath();
    ctx.arc(food.x + GRID_SIZE/2, food.y + GRID_SIZE/2, GRID_SIZE/2 - 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // 添加高光效果
    ctx.fillStyle = '#fca5a5';
    ctx.beginPath();
    ctx.arc(food.x + GRID_SIZE/2 - 3, food.y + GRID_SIZE/2 - 3, 3, 0, 2 * Math.PI);
    ctx.fill();
}

// 绘制圆角矩形
function drawRoundedRect(x, y, width, height, radius) {
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
}

// 更新分数显示
function updateScore() {
    scoreElement.textContent = gameState.score;
}

// 更新最高分显示
function updateHighScore() {
    highScoreElement.textContent = gameState.highScore;
}

// 显示覆盖层
function showOverlay(title, message) {
    overlayTitle.innerHTML = title;
    overlayMessage.innerHTML = message;
    gameOverlay.classList.remove('hidden');
}

// 隐藏覆盖层
function hideOverlay() {
    gameOverlay.classList.add('hidden');
}

// 改变蛇的方向
function changeDirection(newDirection) {
    // 防止蛇反向移动
    if (newDirection.x === -snake.direction.x && newDirection.y === -snake.direction.y) {
        return;
    }
    
    snake.nextDirection = newDirection;
}

// 绑定事件监听器
function bindEventListeners() {
    // 键盘事件
    document.addEventListener('keydown', (e) => {
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
    });
    
    // 按钮事件
    startButton.addEventListener('click', startGame);
    pauseButton.addEventListener('click', togglePause);
    resetButton.addEventListener('click', () => {
        resetGame();
        generateFood();
        draw();
    });
    
    // 移动端控制按钮
    document.querySelectorAll('.mobile-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const direction = btn.dataset.direction;
            switch (direction) {
                case 'up':
                    changeDirection({ x: 0, y: -GRID_SIZE });
                    break;
                case 'down':
                    changeDirection({ x: 0, y: GRID_SIZE });
                    break;
                case 'left':
                    changeDirection({ x: -GRID_SIZE, y: 0 });
                    break;
                case 'right':
                    changeDirection({ x: GRID_SIZE, y: 0 });
                    break;
            }
        });
    });
    
    // 游戏覆盖层点击事件
    gameOverlay.addEventListener('click', (e) => {
        if (e.target === gameOverlay) {
            if (!gameState.isPlaying || gameState.isGameOver) {
                startGame();
            } else if (gameState.isPaused) {
                togglePause();
            }
        }
    });
    
    // 触摸滑动控制（移动端）
    let touchStartX = 0;
    let touchStartY = 0;
    
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: false });
    
    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (!gameState.isPlaying || gameState.isPaused) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        const minSwipeDistance = 30;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // 水平滑动
            if (Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    changeDirection({ x: GRID_SIZE, y: 0 }); // 右
                } else {
                    changeDirection({ x: -GRID_SIZE, y: 0 }); // 左
                }
            }
        } else {
            // 垂直滑动
            if (Math.abs(deltaY) > minSwipeDistance) {
                if (deltaY > 0) {
                    changeDirection({ x: 0, y: GRID_SIZE }); // 下
                } else {
                    changeDirection({ x: 0, y: -GRID_SIZE }); // 上
                }
            }
        }
    }, { passive: false });
    
    // 防止页面滚动
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成，初始化游戏...');
    initGame();
});

// 页面可见性变化时自动暂停
document.addEventListener('visibilitychange', () => {
    if (document.hidden && gameState.isPlaying && !gameState.isPaused && !gameState.isGameOver) {
        togglePause();
    }
});

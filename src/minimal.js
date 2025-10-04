/**
 * 最小化版本 - 用于测试基础功能
 */

console.log('🎮 最小化版本启动...');

// 简单的游戏类
class MinimalGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isRunning = false;
    this.bubbles = [];
    
    this.setupCanvas();
    this.setupEvents();
  }

  setupCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    this.canvas.width = rect.width * devicePixelRatio;
    this.canvas.height = rect.height * devicePixelRatio;
    
    this.ctx.scale(devicePixelRatio, devicePixelRatio);
  }

  setupEvents() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      this.createBubble(x, y);
    });
  }

  createBubble(x, y) {
    const bubble = {
      x: x,
      y: y,
      size: 30 + Math.random() * 40,
      color: `hsl(${Math.random() * 360}, 70%, 70%)`,
      velocity: -50 - Math.random() * 50,
      life: 3 + Math.random() * 2,
      age: 0
    };
    
    this.bubbles.push(bubble);
    console.log('🫧 创建泡泡:', bubble);
  }

  update(deltaTime) {
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const bubble = this.bubbles[i];
      bubble.age += deltaTime;
      bubble.y += bubble.velocity * deltaTime;
      
      if (bubble.age >= bubble.life || bubble.y < -bubble.size) {
        this.bubbles.splice(i, 1);
      }
    }
  }

  render() {
    const rect = this.canvas.getBoundingClientRect();
    
    // 清空画布
    this.ctx.clearRect(0, 0, rect.width, rect.height);
    
    // 绘制背景
    const gradient = this.ctx.createLinearGradient(0, 0, 0, rect.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98FB98');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, rect.width, rect.height);
    
    // 绘制泡泡
    this.bubbles.forEach(bubble => {
      this.ctx.beginPath();
      this.ctx.arc(bubble.x, bubble.y, bubble.size / 2, 0, Math.PI * 2);
      this.ctx.fillStyle = bubble.color;
      this.ctx.fill();
      
      // 高光
      this.ctx.beginPath();
      this.ctx.arc(bubble.x - bubble.size / 6, bubble.y - bubble.size / 6, bubble.size / 8, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      this.ctx.fill();
    });
    
    // 绘制提示文字
    this.ctx.fillStyle = '#333';
    this.ctx.font = '24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('点击屏幕创建泡泡！', rect.width / 2, 50);
    
    this.ctx.font = '16px Arial';
    this.ctx.fillText(`当前泡泡数量: ${this.bubbles.length}`, rect.width / 2, 80);
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    let lastTime = performance.now();
    
    const gameLoop = (currentTime) => {
      if (!this.isRunning) return;
      
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      
      this.update(deltaTime);
      this.render();
      
      requestAnimationFrame(gameLoop);
    };
    
    requestAnimationFrame(gameLoop);
    console.log('🎉 最小化游戏启动成功！');
  }

  stop() {
    this.isRunning = false;
  }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
  console.log('📋 DOM 加载完成');
  
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) {
    console.error('❌ 找不到Canvas元素');
    return;
  }
  
  // 隐藏加载界面
  const loadingEl = document.getElementById('loading');
  if (loadingEl) {
    loadingEl.style.display = 'none';
  }
  
  const game = new MinimalGame(canvas);
  game.start();
});

/**
 * 宝宝泡泡乐园 - 主入口文件
 * 负责初始化游戏引擎和启动游戏
 */

console.log('🎮 正在启动宝宝泡泡乐园...');

// 导入必要模块
import { applyCanvasPolyfills } from './utils/CanvasPolyfill.js';
import { MobileUtils } from './utils/MobileUtils.js';
import { Game } from './core/Game.js';
import './utils/polyfills.js';

class App {
  constructor() {
    this.game = null;
    this.isLoading = true;
  }

  async init() {
    try {
      console.log('📋 开始初始化游戏...');
      
      // 应用Canvas兼容性补丁
      applyCanvasPolyfills();
      
      // 初始化移动端适配
      MobileUtils.applyAllOptimizations();
      
      // 显示加载界面
      this.showLoading();
      
      // 初始化游戏
      await this.initGame();
      
      // 隐藏加载界面
      this.hideLoading();
      
      // 启动游戏
      this.game.start();
      
      console.log('🎉 宝宝泡泡乐园启动成功！');
      
    } catch (error) {
      console.error('❌ 游戏初始化失败:', error);
      this.showError('游戏加载失败，请刷新页面重试');
    }
  }

  async initGame() {
    console.log('🎨 初始化Canvas...');
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
      throw new Error('找不到游戏画布元素');
    }

    console.log('🎮 创建游戏实例...');
    this.game = new Game(canvas);
    await this.game.init();
  }

  showLoading() {
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
      loadingEl.style.display = 'flex';
    }
  }

  hideLoading() {
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
      loadingEl.style.display = 'none';
    }
    this.isLoading = false;
  }

  showError(message) {
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
      loadingEl.innerHTML = `
        <div style="color: #ff4444; text-align: center;">
          <div style="font-size: 60px; margin-bottom: 20px;">😵</div>
          <div>${message}</div>
        </div>
      `;
    }
  }
}

// 页面加载完成后启动应用
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});

// Service Worker 暂时禁用，避免开发阶段错误
// TODO: 后续添加PWA支持时再启用
console.log('📱 PWA功能暂时禁用');

/**
 * 游戏核心引擎
 * 负责游戏主循环、场景管理、输入处理等核心功能
 */

import { SceneManager } from './SceneManager.js';
import { InputManager } from './InputManager.js';
import { AudioManager } from '../audio/AudioManager.js';
import { AnimationUtils } from '../utils/AnimationUtils.js';
import { GrasslandScene } from '../scenes/GrasslandScene.js';
import { OceanScene } from '../scenes/OceanScene.js';
import { NightScene } from '../scenes/NightScene.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isRunning = false;
    this.lastTime = 0;
    this.deltaTime = 0;
    
    // 核心管理器
    this.sceneManager = new SceneManager();
    this.inputManager = new InputManager(this.canvas);
    this.audioManager = new AudioManager();
    
    // 游戏状态
    this.currentScene = null;
    this.gameState = {
      interactionCount: 0, // 用于触发鼓励
      encouragementThreshold: 10 // 每10次互动触发一次鼓励
    };

    // 绑定方法
    this.gameLoop = this.gameLoop.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  async init() {
    try {
      // 设置画布
      this.setupCanvas();
      
      // 初始化管理器
      await this.audioManager.init();
      this.setupInputHandlers();
      
      // 设置全局音频管理器引用（供场景使用）
      window.gameAudioManager = this.audioManager;
      
      // 注册场景
      this.registerScenes();
      
      // 设置默认场景（阳光草地）
      await this.sceneManager.switchScene('grassland');
      this.currentScene = this.sceneManager.getCurrentScene();
      
      console.log('当前场景已设置:', this.currentScene ? this.currentScene.name : '无');
      
      // 监听窗口大小变化
      window.addEventListener('resize', this.handleResize);
      
      console.log('游戏初始化完成');
      
    } catch (error) {
      console.error('游戏初始化失败:', error);
      throw error;
    }
  }

  setupCanvas() {
    // 设置画布尺寸
    this.resizeCanvas();
    
    // 禁用上下文菜单
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // 设置渲染质量
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  resizeCanvas() {
    // 获取窗口尺寸
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // 直接设置画布尺寸（不使用devicePixelRatio，避免缩放问题）
    this.canvas.width = width;
    this.canvas.height = height;
    
    // 设置画布显示尺寸
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    
    console.log(`画布尺寸: ${width}x${height}`);
    
    // 通知当前场景尺寸已更改
    if (this.currentScene && this.currentScene.resize) {
      this.currentScene.resize(width, height);
    }
  }

  handleResize() {
    this.resizeCanvas();
    // 通知当前场景尺寸变化
    if (this.currentScene && this.currentScene.onResize) {
      this.currentScene.onResize(this.canvas.width, this.canvas.height);
    }
  }

  registerScenes() {
    // 注册三个主题场景
    this.sceneManager.registerScene('grassland', new GrasslandScene());
    this.sceneManager.registerScene('ocean', new OceanScene());
    this.sceneManager.registerScene('night', new NightScene());
  }

  setupInputHandlers() {
    // 触摸/点击事件处理
    this.inputManager.onTouch = (x, y) => {
      if (this.currentScene && this.currentScene.onTouch) {
        this.currentScene.onTouch(x, y);
        this.onPlayerInteraction();
      }
    };

    // 角色切换事件处理
    this.inputManager.onCharacterSelect = (characterIndex) => {
      if (this.currentScene && this.currentScene.switchCharacter) {
        this.currentScene.switchCharacter(characterIndex);
        // 播放角色切换音效
        this.audioManager.playSound('character_switch');
      }
    };

    // 场景切换事件处理
    this.inputManager.onSceneSelect = (sceneId) => {
      this.switchScene(sceneId);
    };
    
    // 提供获取当前场景ID的方法
    this.inputManager.getCurrentSceneId = () => {
      return this.sceneManager.getCurrentSceneId();
    };
  }

  onPlayerInteraction() {
    // 首次交互时启动音频系统
    if (this.gameState.interactionCount === 0) {
      this.audioManager.audioGenerator.ensureAudioContext();
      // 开始播放背景音乐
      const currentSceneId = this.sceneManager.getCurrentSceneId();
      if (currentSceneId) {
        this.audioManager.playBackgroundMusic(currentSceneId);
      }
    }
    
    this.gameState.interactionCount++;
    
    // 检查是否需要播放鼓励
    if (this.gameState.interactionCount % this.gameState.encouragementThreshold === 0) {
      this.playEncouragement();
    }
  }

  playEncouragement() {
    const encouragements = [
      '真棒！',
      '好厉害！',
      '好漂亮的泡泡！',
      '继续加油！',
      '你做得很好！',
      '太有趣了！'
    ];
    
    const message = encouragements[Math.floor(Math.random() * encouragements.length)];
    console.log(`播放鼓励: ${message}`);
    
    // 播放鼓励语音和音效
    const encouragementText = this.audioManager.playEncouragement();
    
    // 显示鼓励文字动画
    this.showEncouragementText(encouragementText);
  }

  /**
   * 显示鼓励文字动画
   * @param {string} message - 鼓励文字
   */
  showEncouragementText(message) {
    const canvas = this.canvas;
    const rect = canvas.getBoundingClientRect();
    const x = rect.width / 2;
    const y = rect.height / 2;
    
    // 创建鼓励文字动画
    const result = AnimationUtils.encouragementAnimation(x, y, message);
    
    // 将文字对象添加到临时渲染队列
    if (this.currentScene) {
      this.currentScene.encouragementText = result.textObject;
      
      // 动画完成后清理
      result.timeline.call(() => {
        if (this.currentScene) {
          this.currentScene.encouragementText = null;
        }
      });
    }
  }

  async switchScene(sceneId) {
    try {
      // 播放场景切换音效
      this.audioManager.playSound('scene_switch');
      
      await this.sceneManager.switchScene(sceneId);
      this.currentScene = this.sceneManager.getCurrentScene();
      
      // 切换背景音乐
      this.audioManager.playBackgroundMusic(sceneId);
      
      console.log(`切换到场景: ${sceneId}`, this.currentScene);
    } catch (error) {
      console.error('场景切换失败:', error);
    }
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.gameLoop);
    
    console.log('游戏开始运行');
  }

  stop() {
    this.isRunning = false;
    console.log('游戏停止运行');
  }

  gameLoop(currentTime) {
    if (!this.isRunning) return;

    // 计算帧时间
    this.deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // 限制最大帧时间，避免游戏卡顿时出现大跳跃
    this.deltaTime = Math.min(this.deltaTime, 1/30);

    try {
      // 更新游戏逻辑
      this.update(this.deltaTime);
      
      // 渲染游戏画面
      this.render();
      
    } catch (error) {
      console.error('游戏循环出错:', error);
    }

    // 继续下一帧
    requestAnimationFrame(this.gameLoop);
  }

  update(deltaTime) {
    // 更新输入管理器
    this.inputManager.update();
    
    // 更新当前场景
    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update(deltaTime);
    }
    
    // 更新音频管理器
    this.audioManager.update(deltaTime);
  }

  render() {
    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 渲染当前场景
    if (this.currentScene && this.currentScene.render) {
      this.currentScene.render(this.ctx, this.canvas.width, this.canvas.height);
    } else {
      // 如果没有场景，绘制一个测试矩形来验证渲染是否工作
      this.ctx.fillStyle = '#FF0000';
      this.ctx.fillRect(100, 100, 200, 200);
      this.ctx.fillStyle = '#000';
      this.ctx.font = '24px Arial';
      this.ctx.fillText('等待场景加载...', 150, 220);
    }
    
    // 渲染UI（如果需要）
    this.renderUI();
  }

  renderUI() {
    // 可以在这里渲染游戏UI，如设置按钮、角色选择器等
    // 目前先留空，后续实现
  }

  destroy() {
    this.stop();
    
    // 清理资源
    if (this.audioManager) {
      this.audioManager.destroy();
    }
    
    if (this.inputManager) {
      this.inputManager.destroy();
    }
    
    // 移除事件监听器
    window.removeEventListener('resize', this.handleResize);
  }
}

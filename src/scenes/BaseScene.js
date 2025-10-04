/**
 * 基础场景类
 * 所有场景的父类，定义通用的场景接口和功能
 */

import { AnimationUtils } from '../utils/AnimationUtils.js';

export class BaseScene {
  constructor(sceneId, sceneName) {
    this.id = sceneId;
    this.name = sceneName;
    this.initialized = false;
    
    // 场景配置
    this.backgroundColor = '#87CEEB';
    this.characters = [];
    this.currentCharacterIndex = 0;
    this.bubbles = [];
    
    // 动画和渲染
    this.animationElements = [];
    this.backgroundElements = [];
    this.encouragementText = null;
    
    // 动物行为系统
    this.animalBehaviors = new Map(); // 存储每个角色的行为状态
    this.behaviorTimer = 0; // 行为切换计时器
    this.behaviorChangeInterval = 3000; // 3秒切换一次行为
    
    // 场景尺寸
    this.width = 0;
    this.height = 0;
  }

  /**
   * 初始化场景
   */
  async init() {
    if (this.initialized) return;
    
    // 初始化动画系统
    AnimationUtils.init();
    
    await this.loadResources();
    this.setupScene();
    this.initialized = true;
    
    console.log(`场景 "${this.name}" 初始化完成`);
  }

  /**
   * 加载场景资源
   */
  async loadResources() {
    // 子类实现具体的资源加载逻辑
    console.log(`加载场景资源: ${this.name}`);
  }

  /**
   * 设置场景
   */
  setupScene() {
    // 子类实现具体的场景设置逻辑
  }

  /**
   * 进入场景
   */
  async onEnter() {
    console.log(`进入场景: ${this.name}`);
    
    // 重置场景状态
    this.resetScene();
    
    // 设置默认角色
    if (this.characters.length > 0) {
      this.currentCharacterIndex = 0;
    }
  }

  /**
   * 退出场景
   */
  async onExit() {
    console.log(`退出场景: ${this.name}`);
    
    // 清理泡泡和动画
    this.bubbles = [];
    this.animationElements = [];
  }

  /**
   * 重置场景状态
   */
  resetScene() {
    this.bubbles = [];
    this.animationElements = [];
    this.currentCharacterIndex = 0;
  }

  /**
   * 处理触摸事件
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   */
  onTouch(x, y) {
    // 先检查是否点击了泡泡
    if (this.checkBubbleClick(x, y)) {
      return; // 如果点击了泡泡，不生成新泡泡
    }
    
    // 生成泡泡
    this.createBubble(x, y);
    
    console.log(`${this.name} 场景收到触摸: (${x}, ${y})`);
  }

  /**
   * 创建泡泡
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   */
  createBubble(x, y) {
    if (this.characters.length === 0) return;
    
    const currentCharacter = this.characters[this.currentCharacterIndex];
    const bubble = this.generateBubbleForCharacter(currentCharacter, x, y);
    
    if (bubble) {
      this.bubbles.push(bubble);
      console.log(`创建泡泡，当前泡泡数量: ${this.bubbles.length}`);
    }
  }

  /**
   * 为角色生成对应的泡泡
   * @param {Object} character - 角色对象
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   */
  generateBubbleForCharacter(character, x, y) {
    // 基础泡泡配置
    const bubble = {
      id: Date.now() + Math.random(),
      x: x,
      y: y,
      startX: x,
      startY: y,
      character: character.id,
      type: character.bubbleType || 'normal',
      size: character.bubbleSize || 40,
      color: character.bubbleColor || '#87CEEB',
      speed: character.bubbleSpeed || 50,
      life: character.bubbleLife || 10, // 秒
      age: 0,
      opacity: 1,
      isPopped: false
    };
    
    return bubble;
  }

  /**
   * 切换角色
   * @param {number} characterIndex - 角色索引
   */
  switchCharacter(characterIndex) {
    if (characterIndex >= 0 && characterIndex < this.characters.length) {
      this.currentCharacterIndex = characterIndex;
      console.log(`切换到角色: ${this.characters[characterIndex].name}`);
    }
  }

  /**
   * 检测泡泡点击
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   */
  checkBubbleClick(x, y) {
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const bubble = this.bubbles[i];
      if (bubble.isPopped) continue;
      
      const distance = Math.sqrt(
        Math.pow(x - bubble.x, 2) + Math.pow(y - bubble.y, 2)
      );
      
      if (distance <= bubble.size / 2) {
        this.popBubble(bubble, i);
        return true;
      }
    }
    return false;
  }

  /**
   * 戳破泡泡
   * @param {Object} bubble - 泡泡对象
   * @param {number} index - 泡泡索引
   */
  popBubble(bubble, index) {
    bubble.isPopped = true;
    
    // 播放对应角色的泡泡爆裂音效
    this.playBubblePopSound(bubble);
    
    // 播放泡泡破裂动画
    AnimationUtils.bubblePopAnimation(bubble, () => {
      // 动画完成后创建戳破效果
      this.createPopEffect(bubble);
    });
    
    // 移除泡泡
    this.bubbles.splice(index, 1);
    
    console.log(`泡泡被戳破，剩余泡泡: ${this.bubbles.length}`);
  }

  /**
   * 播放泡泡爆裂音效
   * @param {Object} bubble - 泡泡对象
   */
  playBubblePopSound(bubble) {
    // 获取全局音频管理器（通过事件或回调传递）
    if (window.gameAudioManager) {
      window.gameAudioManager.playSound('bubble_pop', 1.0, bubble.character);
    }
  }

  /**
   * 创建泡泡戳破效果
   * @param {Object} bubble - 被戳破的泡泡
   */
  createPopEffect(bubble) {
    const character = this.characters.find(c => c.id === bubble.character);
    if (!character) return;
    
    const effect = {
      id: Date.now() + Math.random(),
      x: bubble.x,
      y: bubble.y,
      type: character.popEffect || 'flower',
      age: 0,
      life: 2, // 效果持续2秒
      opacity: 1
    };
    
    this.animationElements.push(effect);
  }

  /**
   * 更新场景
   * @param {number} deltaTime - 帧时间
   */
  update(deltaTime) {
    // 更新泡泡
    this.updateBubbles(deltaTime);
    
    // 更新动物行为
    this.updateAnimalBehaviors(deltaTime);
    
    // 更新动画元素
    this.updateAnimationElements(deltaTime);
  }

  /**
   * 更新动物行为状态
   * @param {number} deltaTime - 时间间隔
   */
  updateAnimalBehaviors(deltaTime) {
    this.behaviorTimer += deltaTime;
    
    // 定期切换动物行为
    if (this.behaviorTimer >= this.behaviorChangeInterval) {
      this.behaviorTimer = 0;
      this.switchAnimalBehavior();
    }
  }

  /**
   * 切换动物行为
   */
  switchAnimalBehavior() {
    if (this.characters.length === 0) return;
    
    const currentCharacter = this.characters[this.currentCharacterIndex];
    const behaviors = this.getAnimalBehaviors(currentCharacter);
    
    if (behaviors.length > 0) {
      const currentBehavior = this.animalBehaviors.get(currentCharacter.id) || behaviors[0];
      const currentIndex = behaviors.indexOf(currentBehavior);
      const nextIndex = (currentIndex + 1) % behaviors.length;
      
      this.animalBehaviors.set(currentCharacter.id, behaviors[nextIndex]);
      
      // 调整行为切换间隔，让动物行为更自然
      this.behaviorChangeInterval = 2000 + Math.random() * 4000; // 2-6秒随机间隔
    }
  }

  /**
   * 获取动物可用的行为列表（子类可以重写）
   * @param {Object} character - 角色对象
   * @returns {Array} 行为列表
   */
  getAnimalBehaviors(character) {
    return ['idle', 'walking', 'playing']; // 默认行为
  }

  /**
   * 更新泡泡状态
   * @param {number} deltaTime - 帧时间
   */
  updateBubbles(deltaTime) {
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const bubble = this.bubbles[i];
      
      // 更新泡泡年龄
      bubble.age += deltaTime;
      
      // 更新泡泡位置（简单上升动画）
      bubble.y -= bubble.speed * deltaTime;
      
      // 轻微的左右摆动
      bubble.x = bubble.startX + Math.sin(bubble.age * 2) * 20;
      
      // 透明度变化
      if (bubble.age > bubble.life * 0.8) {
        bubble.opacity = 1 - (bubble.age - bubble.life * 0.8) / (bubble.life * 0.2);
      }
      
      // 移除过期的泡泡
      if (bubble.age >= bubble.life || bubble.y < -bubble.size) {
        this.bubbles.splice(i, 1);
      }
    }
  }

  /**
   * 更新动画元素
   * @param {number} deltaTime - 帧时间
   */
  updateAnimationElements(deltaTime) {
    for (let i = this.animationElements.length - 1; i >= 0; i--) {
      const element = this.animationElements[i];
      
      element.age += deltaTime;
      
      // 淡出效果
      if (element.age > element.life * 0.5) {
        element.opacity = 1 - (element.age - element.life * 0.5) / (element.life * 0.5);
      }
      
      // 移除过期的动画元素
      if (element.age >= element.life) {
        this.animationElements.splice(i, 1);
      }
    }
  }

  /**
   * 渲染场景
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   * @param {number} width - 画布宽度
   * @param {number} height - 画布高度
   */
  render(ctx, width, height) {
    this.width = width;
    this.height = height;
    
    // 绘制背景
    this.renderBackground(ctx, width, height);
    
    // 绘制背景元素
    this.renderBackgroundElements(ctx);
    
    // 绘制角色
    this.renderCharacter(ctx);
    
    // 绘制泡泡
    this.renderBubbles(ctx);
    
    // 绘制动画效果
    this.renderAnimationElements(ctx);
    
    // 绘制UI
    this.renderUI(ctx, width, height);
    
    // 绘制鼓励文字
    this.renderEncouragementText(ctx);
  }

  /**
   * 渲染背景
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   * @param {number} width - 画布宽度
   * @param {number} height - 画布高度
   */
  renderBackground(ctx, width, height) {
    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, this.backgroundColor);
    gradient.addColorStop(1, this.getSecondaryColor());
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  /**
   * 获取辅助背景色
   */
  getSecondaryColor() {
    // 子类可以重写此方法
    return '#98FB98';
  }

  /**
   * 渲染背景元素
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  renderBackgroundElements(ctx) {
    // 子类实现具体的背景元素渲染
  }

  /**
   * 渲染当前角色
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  renderCharacter(ctx) {
    if (this.characters.length === 0) return;
    
    const character = this.characters[this.currentCharacterIndex];
    
    // 获取角色的适合位置（子类可以重写此方法）
    const position = this.getCharacterPosition(character);
    
    // 添加简单的呼吸动画
    const time = Date.now() / 1000;
    const breathOffset = Math.sin(time * 2) * 3;
    
    // 获取当前行为状态
    const currentBehavior = this.animalBehaviors.get(character.id) || 'idle';
    
    // 根据行为调整角色大小和透明度
    let scale = 1;
    let alpha = 1;
    
    switch (currentBehavior) {
      case 'playing':
      case 'jumping':
      case 'hopping':
        scale = 1 + Math.sin(time * 4) * 0.1; // 玩耍时稍微放大
        break;
      case 'hiding':
      case 'camouflaging':
        alpha = 0.6 + Math.sin(time * 2) * 0.2; // 隐藏时半透明
        break;
      case 'sleeping':
      case 'sitting':
        scale = 0.9; // 休息时稍微缩小
        break;
    }
    
    // 保存画布状态
    ctx.save();
    
    // 应用透明度
    ctx.globalAlpha = alpha;
    
    // 移动到角色位置并应用缩放
    ctx.translate(position.x, position.y + breathOffset);
    ctx.scale(scale, scale);
    
    // 渲染角色
    ctx.font = '60px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#333';
    ctx.fillText(character.emoji || '🐻', 0, 0);
    
    // 渲染行为指示器
    this.renderBehaviorIndicator(ctx, currentBehavior, time);
    
    // 恢复画布状态
    ctx.restore();
  }

  /**
   * 渲染行为指示器
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   * @param {string} behavior - 当前行为
   * @param {number} time - 当前时间
   */
  renderBehaviorIndicator(ctx, behavior, time) {
    // 根据行为显示不同的视觉效果
    switch (behavior) {
      case 'walking':
      case 'prowling':
        // 脚印效果
        ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
        for (let i = 0; i < 3; i++) {
          const offset = i * 15;
          ctx.fillRect(-offset - 5, 30, 8, 4);
          ctx.fillRect(-offset + 5, 35, 8, 4);
        }
        break;
        
      case 'flying':
        // 翅膀拍动效果
        ctx.strokeStyle = 'rgba(135, 206, 235, 0.5)';
        ctx.lineWidth = 3;
        const wingSpread = Math.sin(time * 8) * 20;
        ctx.beginPath();
        ctx.arc(-wingSpread, -10, 15, 0, Math.PI);
        ctx.arc(wingSpread, -10, 15, 0, Math.PI);
        ctx.stroke();
        break;
        
      case 'swimming':
        // 水波纹效果
        ctx.strokeStyle = 'rgba(64, 164, 223, 0.4)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          const radius = 20 + i * 10 + Math.sin(time * 3) * 5;
          ctx.beginPath();
          ctx.arc(0, 20, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;
        
      case 'eating':
      case 'foraging':
        // 食物颗粒效果
        ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
        for (let i = 0; i < 5; i++) {
          const angle = (time * 2 + i) * Math.PI / 3;
          const x = Math.cos(angle) * 10;
          const y = 25 + Math.sin(angle) * 5;
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
        
      case 'hunting':
        // 专注光环效果
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(0, 0, 40 + Math.sin(time * 4) * 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        break;
        
      case 'playing':
        // 快乐星星效果
        ctx.fillStyle = 'rgba(255, 215, 0, 0.7)';
        for (let i = 0; i < 4; i++) {
          const angle = time * 2 + (i * Math.PI / 2);
          const x = Math.cos(angle) * 25;
          const y = -30 + Math.sin(angle) * 15;
          ctx.font = '16px Arial';
          ctx.fillText('✨', x, y);
        }
        break;
    }
  }

  /**
   * 获取角色位置（子类可以重写以实现不同的定位逻辑）
   * @param {Object} character - 角色对象
   * @returns {Object} 包含x和y坐标的对象
   */
  getCharacterPosition(character) {
    // 获取当前行为状态
    const currentBehavior = this.animalBehaviors.get(character.id) || 'idle';
    
    // 基础位置
    let x = this.width / 2;
    let y = this.height * 0.8;
    
    // 根据行为调整位置
    const time = Date.now() / 1000;
    switch (currentBehavior) {
      case 'walking':
        // 走路时左右移动
        x += Math.sin(time * 0.8) * this.width * 0.3;
        break;
      case 'playing':
        // 玩耍时上下跳跃
        y -= Math.abs(Math.sin(time * 2)) * 50;
        x += Math.sin(time * 1.2) * this.width * 0.2;
        break;
      case 'idle':
      default:
        // 待机时轻微摆动
        x += Math.sin(time * 0.3) * 20;
        break;
    }
    
    return { x, y };
  }

  /**
   * 渲染泡泡
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  renderBubbles(ctx) {
    this.bubbles.forEach(bubble => {
      ctx.save();
      ctx.globalAlpha = bubble.opacity;
      
      // 绘制泡泡
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.size / 2, 0, Math.PI * 2);
      ctx.fillStyle = bubble.color;
      ctx.fill();
      
      // 绘制泡泡高光
      ctx.beginPath();
      ctx.arc(
        bubble.x - bubble.size / 6, 
        bubble.y - bubble.size / 6, 
        bubble.size / 8, 
        0, 
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();
      
      ctx.restore();
    });
  }

  /**
   * 渲染动画效果
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  renderAnimationElements(ctx) {
    this.animationElements.forEach(element => {
      ctx.save();
      ctx.globalAlpha = element.opacity;
      
      // 绘制效果（使用emoji作为占位符）
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      const emoji = this.getEffectEmoji(element.type);
      ctx.fillText(emoji, element.x, element.y);
      
      ctx.restore();
    });
  }

  /**
   * 获取效果对应的emoji
   * @param {string} effectType - 效果类型
   */
  getEffectEmoji(effectType) {
    const effectMap = {
      flower: '🌸',
      carrot: '🥕',
      leaf: '🍃',
      star: '⭐',
      shell: '🐚',
      ink: '💙',
      firefly: '✨',
      nut: '🌰'
    };
    
    return effectMap[effectType] || '✨';
  }

  /**
   * 渲染UI
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   * @param {number} width - 画布宽度
   * @param {number} height - 画布高度
   */
  renderUI(ctx, width, height) {
    // 渲染场景指示器
    this.renderSceneIndicator(ctx, width, height);
    
    // 渲染角色选择器
    this.renderCharacterSelector(ctx, width, height);
    
    // 渲染设置按钮
    this.renderSettingsButton(ctx, width, height);
    
    // 渲染行为状态显示器
    this.renderBehaviorStatus(ctx, width, height);
  }

  /**
   * 渲染行为状态显示器
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   * @param {number} width - 画布宽度
   * @param {number} height - 画布高度
   */
  renderBehaviorStatus(ctx, width, height) {
    if (this.characters.length === 0) return;
    
    const character = this.characters[this.currentCharacterIndex];
    const currentBehavior = this.animalBehaviors.get(character.id) || 'idle';
    
    // 行为状态文本映射
    const behaviorTexts = {
      'idle': '待机中',
      'walking': '漫步中',
      'playing': '玩耍中',
      'swimming': '游泳中',
      'flying': '飞翔中',
      'hunting': '狩猎中',
      'eating': '进食中',
      'sleeping': '睡觉中',
      'hopping': '跳跃中',
      'digging': '挖洞中',
      'alert': '警戒中',
      'sitting': '休息中',
      'sniffing': '嗅探中',
      'yawning': '打哈欠',
      'jumping': '跳跃中',
      'catching_flies': '捕虫中',
      'croaking': '呱呱叫',
      'hiding': '躲藏中',
      'schooling': '群游中',
      'camouflaging': '伪装中',
      'exploring': '探索中',
      'crawling': '爬行中',
      'diving': '潜水中',
      'perching': '栖息中',
      'hooting': '鸣叫中',
      'prowling': '潜行中',
      'howling': '嚎叫中',
      'foraging': '觅食中',
      'climbing': '攀爬中',
      'washing': '清洗中'
    };
    
    const behaviorText = behaviorTexts[currentBehavior] || currentBehavior;
    
    // 绘制背景
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    
    // 简单的圆角矩形实现
    const x = width - 150;
    const y = 20;
    const w = 130;
    const h = 40;
    const r = 8;
    
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    
    // 绘制文本
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${character.name}`, width - 85, 35);
    ctx.fillText(`${behaviorText}`, width - 85, 50);
    
    ctx.restore();
  }

  /**
   * 渲染场景指示器
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   * @param {number} width - 画布宽度
   * @param {number} height - 画布高度
   */
  renderSceneIndicator(ctx, width, height) {
    const topUIHeight = height * 0.05;
    const margin = 20;
    
    // 场景图标映射
    const sceneIcons = {
      'grassland': '🌳',
      'ocean': '🌊',
      'night': '🌙'
    };
    
    const sceneIcon = sceneIcons[this.id] || '🌳';
    
    // 绘制场景指示器背景
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    const indicatorSize = topUIHeight * 0.8;
    
    // 兼容性处理：如果不支持roundRect，使用普通矩形
    if (ctx.roundRect) {
      ctx.roundRect(margin, margin, indicatorSize * 2, indicatorSize, indicatorSize / 4);
    } else {
      ctx.rect(margin, margin, indicatorSize * 2, indicatorSize);
    }
    ctx.fill();
    
    // 绘制场景图标
    ctx.font = `${indicatorSize * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#333';
    ctx.fillText(sceneIcon, margin + indicatorSize, margin + indicatorSize / 2);
    
    // 绘制提示文字
    ctx.font = `${indicatorSize * 0.3}px Arial`;
    ctx.fillStyle = '#666';
    ctx.fillText('点击切换', margin + indicatorSize, margin + indicatorSize * 0.85);
    
    ctx.restore();
  }

  /**
   * 渲染角色选择器
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   * @param {number} width - 画布宽度
   * @param {number} height - 画布高度
   */
  renderCharacterSelector(ctx, width, height) {
    const selectorHeight = height * 0.1;
    const selectorY = height - selectorHeight;
    
    // 绘制背景
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(0, selectorY, width, selectorHeight);
    
    // 绘制角色按钮
    const buttonWidth = width / this.characters.length;
    
    this.characters.forEach((character, index) => {
      const x = buttonWidth * index + buttonWidth / 2;
      const y = selectorY + selectorHeight / 2;
      
      // 高亮当前选中的角色
      if (index === this.currentCharacterIndex) {
        ctx.fillStyle = 'rgba(255, 140, 66, 0.5)';
        ctx.fillRect(buttonWidth * index, selectorY, buttonWidth, selectorHeight);
      }
      
      // 绘制角色emoji
      ctx.font = '40px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#333';
      ctx.fillText(character.emoji || '🐻', x, y + 15);
    });
  }

  /**
   * 渲染设置按钮
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   * @param {number} width - 画布宽度
   * @param {number} height - 画布高度
   */
  renderSettingsButton(ctx, width, height) {
    const buttonSize = Math.min(width, height) * 0.08;
    const margin = 20;
    const x = width - buttonSize - margin;
    const y = margin;
    
    // 绘制按钮背景
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    
    // 兼容性处理：如果不支持roundRect，使用普通矩形
    if (ctx.roundRect) {
      ctx.roundRect(x, y, buttonSize, buttonSize, buttonSize / 4);
    } else {
      ctx.rect(x, y, buttonSize, buttonSize);
    }
    ctx.fill();
    
    // 绘制设置图标
    ctx.font = `${buttonSize * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#666';
    ctx.fillText('⚙️', x + buttonSize / 2, y + buttonSize / 2);
    
    ctx.restore();
  }

  /**
   * 处理尺寸变化
   * @param {number} width - 新宽度
   * @param {number} height - 新高度
   */
  onResize(width, height) {
    this.width = width;
    this.height = height;
    console.log(`场景 "${this.name}" 尺寸更新: ${width}x${height}`);
  }

  /**
   * 渲染鼓励文字
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   */
  renderEncouragementText(ctx) {
    if (!this.encouragementText) return;
    
    ctx.save();
    ctx.globalAlpha = this.encouragementText.opacity;
    
    // 设置文字样式
    const fontSize = 48 * this.encouragementText.scale;
    ctx.font = `bold ${fontSize}px Arial, "Microsoft YaHei", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 文字描边
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.strokeText(this.encouragementText.text, this.encouragementText.x, this.encouragementText.y);
    
    // 文字填充
    ctx.fillStyle = '#FF8C42';
    ctx.fillText(this.encouragementText.text, this.encouragementText.x, this.encouragementText.y);
    
    ctx.restore();
  }

  /**
   * 销毁场景
   */
  destroy() {
    this.bubbles = [];
    this.animationElements = [];
    this.backgroundElements = [];
    this.encouragementText = null;
    console.log(`场景 "${this.name}" 已销毁`);
  }
}

/**
 * 海底世界场景
 * 宁静、蔚蓝、有流动感的场景，包含小丑鱼、海豚、章鱼三个角色
 */

import { BaseScene } from './BaseScene.js';

export class OceanScene extends BaseScene {
  constructor() {
    super('ocean', '海底世界');
    
    // 场景特色配置
    this.backgroundColor = '#4169E1'; // 深蓝色
    this.secondaryColor = '#87CEEB'; // 天蓝色
    
    // 海水流动效果
    this.waveTime = 0;
    this.fishSchools = [];
    
    // 设置角色
    this.setupCharacters();
    
    // 背景元素
    this.setupBackgroundElements();
  }

  /**
   * 设置场景角色
   */
  setupCharacters() {
    this.characters = [
      {
        id: 'clownfish',
        name: '小丑鱼',
        emoji: '🐠',
        bubbleType: 'water',
        bubbleSize: 50,
        bubbleColor: 'rgba(255, 165, 100, 0.75)', // 珊瑚橙金色（小丑鱼的颜色）
        bubbleSpeed: 50,
        bubbleLife: 15,
        popEffect: 'star'
      },
      {
        id: 'dolphin',
        name: '海豚',
        emoji: '🐬',
        bubbleType: 'arc',
        bubbleSize: 45,
        bubbleColor: 'rgba(100, 220, 200, 0.75)', // 青绿湖蓝色（清新活泼）
        bubbleSpeed: 70,
        bubbleLife: 12,
        popEffect: 'shell',
        arcCount: 5 // 弧形泡泡链的数量
      },
      {
        id: 'octopus',
        name: '章鱼',
        emoji: '🐙',
        bubbleType: 'spray',
        bubbleSize: 35,
        bubbleColor: 'rgba(180, 130, 255, 0.7)', // 深海紫罗兰色（神秘优雅）
        bubbleSpeed: 60,
        bubbleLife: 10,
        popEffect: 'ink',
        sprayCount: 6 // 喷射泡泡数量
      }
    ];
  }

  /**
   * 设置背景元素
   */
  setupBackgroundElements() {
    this.backgroundElements = [
      // 珊瑚礁（更多更大）
      {
        type: 'coral',
        x: 0.08,
        y: 0.78,
        size: 55,
        emoji: '🪸',
        sway: true,
        swaySpeed: 0.8
      },
      {
        type: 'coral',
        x: 0.15,
        y: 0.82,
        size: 48,
        emoji: '🪸',
        sway: true,
        swaySpeed: 1.0
      },
      {
        type: 'coral',
        x: 0.85,
        y: 0.75,
        size: 52,
        emoji: '🪸',
        sway: true,
        swaySpeed: 0.9
      },
      {
        type: 'coral',
        x: 0.92,
        y: 0.8,
        size: 45,
        emoji: '🪸',
        sway: true,
        swaySpeed: 1.1
      },
      // 大量摆动的水草
      {
        type: 'seaweed',
        x: 0.05,
        y: 0.9,
        size: 50,
        emoji: '🌿',
        animated: true,
        animSpeed: 1.2,
        swayAmount: 15
      },
      {
        type: 'seaweed',
        x: 0.12,
        y: 0.92,
        size: 45,
        emoji: '🌿',
        animated: true,
        animSpeed: 1.5,
        swayAmount: 12
      },
      {
        type: 'seaweed',
        x: 0.22,
        y: 0.88,
        size: 55,
        emoji: '🌿',
        animated: true,
        animSpeed: 1.0,
        swayAmount: 18
      },
      {
        type: 'seaweed',
        x: 0.32,
        y: 0.91,
        size: 42,
        emoji: '🌿',
        animated: true,
        animSpeed: 1.8,
        swayAmount: 10
      },
      {
        type: 'seaweed',
        x: 0.45,
        y: 0.89,
        size: 48,
        emoji: '🌿',
        animated: true,
        animSpeed: 1.3,
        swayAmount: 14
      },
      {
        type: 'seaweed',
        x: 0.58,
        y: 0.92,
        size: 52,
        emoji: '🌿',
        animated: true,
        animSpeed: 1.1,
        swayAmount: 16
      },
      {
        type: 'seaweed',
        x: 0.68,
        y: 0.87,
        size: 46,
        emoji: '🌿',
        animated: true,
        animSpeed: 1.6,
        swayAmount: 13
      },
      {
        type: 'seaweed',
        x: 0.78,
        y: 0.9,
        size: 50,
        emoji: '🌿',
        animated: true,
        animSpeed: 1.4,
        swayAmount: 15
      },
      {
        type: 'seaweed',
        x: 0.88,
        y: 0.91,
        size: 44,
        emoji: '🌿',
        animated: true,
        animSpeed: 1.7,
        swayAmount: 11
      },
      {
        type: 'seaweed',
        x: 0.95,
        y: 0.89,
        size: 48,
        emoji: '🌿',
        animated: true,
        animSpeed: 1.2,
        swayAmount: 14
      },
      // 海龟游动
      {
        type: 'turtle',
        x: 0.2,
        y: 0.4,
        size: 45,
        emoji: '🐢',
        animated: true,
        animSpeed: 0.5,
        swimPath: 'horizontal'
      },
      {
        type: 'turtle',
        x: 0.7,
        y: 0.55,
        size: 40,
        emoji: '🐢',
        animated: true,
        animSpeed: 0.6,
        swimPath: 'circular'
      },
      // 水母漂浮
      {
        type: 'jellyfish',
        x: 0.3,
        y: 0.3,
        size: 38,
        emoji: '🪼',
        animated: true,
        animSpeed: 1.5,
        float: true
      },
      {
        type: 'jellyfish',
        x: 0.6,
        y: 0.25,
        size: 35,
        emoji: '🪼',
        animated: true,
        animSpeed: 1.8,
        float: true
      },
      {
        type: 'jellyfish',
        x: 0.85,
        y: 0.35,
        size: 32,
        emoji: '🪼',
        animated: true,
        animSpeed: 1.3,
        float: true
      },
      // 螃蟹爬行
      {
        type: 'crab',
        x: 0.25,
        y: 0.92,
        size: 32,
        emoji: '🦀',
        animated: true,
        animSpeed: 1.0,
        crawl: true
      },
      {
        type: 'crab',
        x: 0.65,
        y: 0.94,
        size: 28,
        emoji: '🦀',
        animated: true,
        animSpeed: 1.2,
        crawl: true
      },
      // 海马
      {
        type: 'seahorse',
        x: 0.15,
        y: 0.65,
        size: 30,
        emoji: '🐴',
        animated: true,
        animSpeed: 2.0,
        vertical: true
      },
      {
        type: 'seahorse',
        x: 0.9,
        y: 0.7,
        size: 28,
        emoji: '🐴',
        animated: true,
        animSpeed: 1.8,
        vertical: true
      },
      // 贝壳（更多）
      {
        type: 'shell',
        x: 0.18,
        y: 0.95,
        size: 30,
        emoji: '🐚'
      },
      {
        type: 'shell',
        x: 0.38,
        y: 0.94,
        size: 28,
        emoji: '🐚'
      },
      {
        type: 'shell',
        x: 0.55,
        y: 0.96,
        size: 26,
        emoji: '🐚'
      },
      {
        type: 'shell',
        x: 0.72,
        y: 0.93,
        size: 32,
        emoji: '🐚'
      },
      // 海星（更多）
      {
        type: 'starfish',
        x: 0.28,
        y: 0.96,
        size: 28,
        emoji: '⭐',
        twinkle: true
      },
      {
        type: 'starfish',
        x: 0.48,
        y: 0.94,
        size: 32,
        emoji: '⭐',
        twinkle: true
      },
      {
        type: 'starfish',
        x: 0.82,
        y: 0.95,
        size: 30,
        emoji: '⭐',
        twinkle: true
      },
      // 海葵
      {
        type: 'anemone',
        x: 0.1,
        y: 0.85,
        size: 35,
        emoji: '🌺',
        animated: true,
        animSpeed: 2.5,
        pulse: true
      },
      {
        type: 'anemone',
        x: 0.4,
        y: 0.83,
        size: 32,
        emoji: '🌺',
        animated: true,
        animSpeed: 2.2,
        pulse: true
      },
      {
        type: 'anemone',
        x: 0.75,
        y: 0.84,
        size: 38,
        emoji: '🌺',
        animated: true,
        animSpeed: 2.8,
        pulse: true
      },
      // 鱿鱼
      {
        type: 'squid',
        x: 0.5,
        y: 0.45,
        size: 35,
        emoji: '🦑',
        animated: true,
        animSpeed: 1.5,
        swimPath: 'wave'
      }
    ];
    
    // 初始化鱼群和粒子系统
    this.initFishSchools();
    this.bubbleParticles = [];
    this.particleTimer = 0;
  }

  /**
   * 初始化鱼群
   */
  initFishSchools() {
    this.fishSchools = [
      {
        fishes: this.createFishSchool(5, 0.1, 0.3),
        direction: 1,
        speed: 0.3
      },
      {
        fishes: this.createFishSchool(3, 0.9, 0.5),
        direction: -1,
        speed: 0.2
      }
    ];
  }

  /**
   * 创建鱼群
   */
  createFishSchool(count, startX, startY) {
    const fishes = [];
    for (let i = 0; i < count; i++) {
      fishes.push({
        x: startX + (Math.random() - 0.5) * 0.1,
        y: startY + (Math.random() - 0.5) * 0.1,
        offsetX: Math.random() * 20,
        offsetY: Math.random() * 10,
        size: 15 + Math.random() * 10,
        emoji: '🐟'
      });
    }
    return fishes;
  }

  /**
   * 获取辅助背景色
   */
  getSecondaryColor() {
    return this.secondaryColor;
  }

  /**
   * 为角色生成对应的泡泡
   */
  generateBubbleForCharacter(character, x, y) {
    if (character.id === 'dolphin' && character.arcCount) {
      // 海豚生成弧形泡泡链
      const bubbles = [];
      for (let i = 0; i < character.arcCount; i++) {
        const angle = (i / (character.arcCount - 1)) * Math.PI * 0.6 - Math.PI * 0.3;
        const distance = 40 + i * 15;
        const offsetX = Math.sin(angle) * distance;
        const offsetY = -Math.cos(angle) * distance * 0.5;
        
        const bubble = {
          id: Date.now() + Math.random() + i,
          x: x + offsetX,
          y: y + offsetY,
          startX: x + offsetX,
          startY: y + offsetY,
          character: character.id,
          type: character.bubbleType,
          size: character.bubbleSize - i * 3,
          color: character.bubbleColor,
          speed: character.bubbleSpeed - i * 5,
          life: character.bubbleLife,
          age: 0,
          opacity: 1,
          isPopped: false,
          arcIndex: i
        };
        bubbles.push(bubble);
      }
      return bubbles;
    } else if (character.id === 'octopus' && character.sprayCount) {
      // 章鱼生成扇形喷射泡泡
      const bubbles = [];
      for (let i = 0; i < character.sprayCount; i++) {
        const angle = (i / (character.sprayCount - 1)) * Math.PI * 0.8 - Math.PI * 0.4;
        const speed = character.bubbleSpeed + (Math.random() - 0.5) * 30;
        const offsetX = Math.sin(angle) * 30;
        const offsetY = -Math.abs(Math.cos(angle)) * 20;
        
        const bubble = {
          id: Date.now() + Math.random() + i,
          x: x + offsetX,
          y: y + offsetY,
          startX: x + offsetX,
          startY: y + offsetY,
          character: character.id,
          type: character.bubbleType,
          size: character.bubbleSize + (Math.random() - 0.5) * 10,
          color: character.bubbleColor,
          speed: speed,
          life: character.bubbleLife,
          age: 0,
          opacity: 1,
          isPopped: false,
          sprayAngle: angle,
          sprayIndex: i
        };
        bubbles.push(bubble);
      }
      return bubbles;
    } else {
      // 小丑鱼生成单个泡泡
      return super.generateBubbleForCharacter(character, x, y);
    }
  }

  /**
   * 创建泡泡（重写以支持多泡泡生成）
   */
  createBubble(x, y) {
    if (this.characters.length === 0) return;
    
    const currentCharacter = this.characters[this.currentCharacterIndex];
    const bubbles = this.generateBubbleForCharacter(currentCharacter, x, y);
    
    if (Array.isArray(bubbles)) {
      // 多个泡泡
      this.bubbles.push(...bubbles);
      console.log(`创建${bubbles.length}个泡泡，当前泡泡数量: ${this.bubbles.length}`);
    } else if (bubbles) {
      // 单个泡泡
      this.bubbles.push(bubbles);
      console.log(`创建泡泡，当前泡泡数量: ${this.bubbles.length}`);
    }
  }

  /**
   * 更新场景
   */
  update(deltaTime) {
    super.update(deltaTime);
    
    // 更新海水流动效果
    this.waveTime += deltaTime;
    
    // 更新鱼群
    this.updateFishSchools(deltaTime);
  }

  /**
   * 更新鱼群
   */
  updateFishSchools(deltaTime) {
    this.fishSchools.forEach(school => {
      school.fishes.forEach(fish => {
        // 鱼群整体移动
        fish.x += school.direction * school.speed * deltaTime;
        
        // 个体游动
        fish.x += Math.sin(this.waveTime * 2 + fish.offsetX) * 0.001;
        fish.y += Math.cos(this.waveTime * 1.5 + fish.offsetY) * 0.001;
        
        // 边界处理
        if (fish.x > 1.2) fish.x = -0.2;
        if (fish.x < -0.2) fish.x = 1.2;
      });
    });
  }

  /**
   * 更新泡泡状态（重写以支持海底特殊效果）
   */
  updateBubbles(deltaTime) {
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const bubble = this.bubbles[i];
      
      // 更新泡泡年龄
      bubble.age += deltaTime;
      
      // 根据角色类型更新位置
      if (bubble.character === 'dolphin') {
        // 海豚泡泡：弧形路径
        bubble.y -= bubble.speed * deltaTime;
        const arcOffset = Math.sin(bubble.age * 2) * 10;
        bubble.x = bubble.startX + arcOffset;
      } else if (bubble.character === 'octopus') {
        // 章鱼泡泡：扇形扩散
        bubble.y -= bubble.speed * deltaTime * 0.8;
        bubble.x += Math.sin(bubble.sprayAngle) * bubble.speed * deltaTime * 0.3;
      } else {
        // 小丑鱼泡泡：直线上升，有海流摆动
        bubble.y -= bubble.speed * deltaTime;
        bubble.x = bubble.startX + Math.sin(this.waveTime * 2 + bubble.startY * 0.01) * 15;
      }
      
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
   * 渲染背景（现实海洋风格）
   */
  renderBackground(ctx, width, height) {
    // 创建真实的海水深度渐变效果
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1a3d5c');    // 深海蓝
    gradient.addColorStop(0.2, '#2a5c7f');  // 中深蓝
    gradient.addColorStop(0.4, '#3a7ca5');  // 海水蓝
    gradient.addColorStop(0.6, '#4a9cc7');  // 明亮海蓝
    gradient.addColorStop(0.8, '#5ab5d6');  // 浅海蓝
    gradient.addColorStop(1, '#6ac4e0');    // 近水面蓝
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // 添加海水的光线穿透效果（上帝之光）
    this.renderSunRays(ctx, width, height);
    
    // 绘制真实的海水波纹效果
    this.renderWaterEffects(ctx, width, height);
  }

  /**
   * 渲染海水中的阳光光束（上帝之光）
   */
  renderSunRays(ctx, width, height) {
    ctx.save();
    const time = Date.now() / 1000;
    
    // 绘制多条光束
    for (let i = 0; i < 5; i++) {
      const rayX = (i / 5 + 0.1) * width + Math.sin(time * 0.2 + i) * 50;
      const rayAngle = -0.15 + i * 0.1;
      
      ctx.save();
      ctx.translate(rayX, 0);
      ctx.rotate(rayAngle);
      
      // 光束渐变
      const rayGradient = ctx.createLinearGradient(0, 0, 0, height * 0.7);
      rayGradient.addColorStop(0, 'rgba(180, 220, 240, 0.15)');
      rayGradient.addColorStop(0.3, 'rgba(150, 200, 230, 0.1)');
      rayGradient.addColorStop(0.6, 'rgba(120, 180, 220, 0.05)');
      rayGradient.addColorStop(1, 'rgba(100, 160, 210, 0)');
      
      ctx.fillStyle = rayGradient;
      
      // 绘制梯形光束
      const rayWidth = 80 + i * 20;
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(20, 0);
      ctx.lineTo(rayWidth, height * 0.7);
      ctx.lineTo(-rayWidth, height * 0.7);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }
    
    ctx.restore();
  }

  /**
   * 渲染海水效果（真实海洋波动）
   */
  renderWaterEffects(ctx, width, height) {
    ctx.save();
    
    // 细微的海水层次波动
    for (let layer = 0; layer < 4; layer++) {
      ctx.globalAlpha = 0.04 - layer * 0.008;
    
      ctx.beginPath();
      ctx.moveTo(0, height * (0.15 + layer * 0.18));
      
      for (let x = 0; x <= width; x += 15) {
        const baseY = height * (0.15 + layer * 0.18);
        const waveOffset = Math.sin((x * 0.015) + (this.waveTime * 80) + layer * Math.PI / 4) * 12 +
                          Math.sin((x * 0.008) + (this.waveTime * 50) + layer) * 8;
        ctx.lineTo(x, baseY + waveOffset);
      }
      
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      
      // 深浅交替的波纹颜色
      ctx.fillStyle = layer % 2 === 0 ? 
        'rgba(200, 230, 245, 0.8)' : 
        'rgba(180, 210, 235, 0.7)';
      ctx.fill();
    }
    
    // 添加海水中的悬浮微粒
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 30; i++) {
      const x = (i / 30) * width + Math.sin(this.waveTime + i * 0.5) * 30;
      const y = (Math.random() * 0.6 + 0.1) * height;
      const size = 1 + Math.random() * 2;
      
      ctx.fillStyle = 'rgba(220, 240, 250, 0.6)';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  /**
   * 渲染背景元素
   */
  renderBackgroundElements(ctx) {
    // 绘制海底地形
    this.renderSeabed(ctx);
    
    // 绘制鱼群
    this.renderFishSchools(ctx);
    
    const time = Date.now() / 1000;
    
    // 绘制背景装饰元素（分层渲染）
    this.backgroundElements.forEach(element => {
      let x = element.x * this.width;
      let y = element.y * this.height;
      
      ctx.save();
      
      // 水草摆动动画（真实风格）
      if (element.type === 'seaweed' && element.animated) {
        this.renderRealisticSeaweed(ctx, x, y, element);
        ctx.restore();
        return;
      }
      
      // 珊瑚礁轻微摆动（真实风格）
      if (element.type === 'coral' && element.sway) {
        this.renderRealisticCoral(ctx, x, y, element);
        ctx.restore();
        return;
      }
      
      // 海龟游动
      if (element.type === 'turtle' && element.animated) {
        const baseX = element.x * this.width;
        const baseY = element.y * this.height;
        
        if (element.swimPath === 'horizontal') {
          x = baseX + Math.sin(time * element.animSpeed) * 200;
          y = baseY + Math.sin(time * element.animSpeed * 0.5) * 30;
        } else if (element.swimPath === 'circular') {
          const radius = 100;
          x = baseX + Math.cos(time * element.animSpeed) * radius;
          y = baseY + Math.sin(time * element.animSpeed) * radius * 0.5;
        }
      }
      
      // 水母漂浮
      if (element.type === 'jellyfish' && element.float) {
        x += Math.sin(time * element.animSpeed) * 50;
        y += Math.cos(time * element.animSpeed * 0.7) * 60;
        // 水母触须动画（透明度变化）
        ctx.globalAlpha = 0.7 + Math.sin(time * element.animSpeed * 2) * 0.3;
      }
      
      // 螃蟹爬行
      if (element.type === 'crab' && element.crawl) {
        x += Math.sin(time * element.animSpeed) * 100;
        // 爬行时轻微上下晃动
        y += Math.abs(Math.sin(time * element.animSpeed * 4)) * 3;
      }
      
      // 海马垂直移动
      if (element.type === 'seahorse' && element.vertical) {
        x += Math.sin(time * element.animSpeed) * 20;
        y += Math.sin(time * element.animSpeed * 0.5) * 40;
      }
      
      // 海星闪烁
      if (element.type === 'starfish' && element.twinkle) {
        ctx.globalAlpha = 0.6 + Math.sin(time * 2 + element.x * 10) * 0.4;
      }
      
      // 海葵脉动（真实风格）
      if (element.type === 'anemone' && element.pulse) {
        this.renderRealisticAnemone(ctx, x, y, element);
        ctx.restore();
        return;
      }
      
      // 鱿鱼游动
      if (element.type === 'squid' && element.swimPath === 'wave') {
        x += Math.sin(time * element.animSpeed) * 150;
        y += Math.cos(time * element.animSpeed * 1.5) * 50;
      }
      
      // 绘制元素
      ctx.font = `${element.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // 添加水下光影效果
      if (element.type !== 'seaweed') {
        ctx.shadowColor = 'rgba(100, 200, 255, 0.3)';
        ctx.shadowBlur = 8;
      }
      
      ctx.fillText(element.emoji, x, y);
      
      ctx.restore();
    });
    
    // 渲染气泡粒子
    this.renderBubbleParticles(ctx, time);
  }
  
  /**
   * 渲染上升的小气泡粒子
   */
  renderBubbleParticles(ctx, time) {
    // 定期生成新气泡
    this.particleTimer += 1;
    if (this.particleTimer > 30 && this.bubbleParticles.length < 40) {
      this.bubbleParticles.push({
        x: Math.random() * this.width,
        y: this.height + 20,
        size: 3 + Math.random() * 8,
        speedY: 0.5 + Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: 0.3 + Math.random() * 0.5,
        wobble: Math.random() * Math.PI * 2
      });
      this.particleTimer = 0;
    }
    
    // 更新和绘制气泡
    for (let i = this.bubbleParticles.length - 1; i >= 0; i--) {
      const particle = this.bubbleParticles[i];
      
      particle.y -= particle.speedY;
      particle.x += particle.speedX + Math.sin(time * 2 + particle.wobble) * 0.5;
      
      // 移除超出屏幕的气泡
      if (particle.y < -20) {
        this.bubbleParticles.splice(i, 1);
        continue;
      }
      
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200, 230, 255, 0.6)';
      ctx.fill();
      
      // 高光
      ctx.beginPath();
      ctx.arc(particle.x - particle.size * 0.3, particle.y - particle.size * 0.3, particle.size * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
      
      ctx.restore();
    }
  }

  /**
   * 获取动物可用的行为列表（重写基类方法）
   * @param {Object} character - 角色对象
   * @returns {Array} 行为列表
   */
  getAnimalBehaviors(character) {
    switch (character.id) {
      case 'clownfish': // 🐠 小丑鱼
        return ['idle', 'swimming', 'hiding', 'playing', 'schooling'];
      case 'dolphin': // 🐬 海豚
        return ['idle', 'swimming', 'jumping', 'playing', 'diving'];
      case 'octopus': // 🐙 章鱼
        return ['idle', 'crawling', 'camouflaging', 'exploring', 'hunting'];
      default:
        return super.getAnimalBehaviors(character);
    }
  }

  /**
   * 获取角色位置（重写基类方法以实现海底分层定位）
   * @param {Object} character - 角色对象
   * @returns {Object} 包含x和y坐标的对象
   */
  getCharacterPosition(character) {
    const time = Date.now() / 1000;
    const currentBehavior = this.animalBehaviors.get(character.id) || 'idle';
    let x = this.width / 2;
    let y = this.height * 0.7;
    
    // 根据角色类型确定合适的水层活动空间
    switch (character.id) {
      case 'clownfish': // 🐠 小丑鱼 - 中层水域，在珊瑚礁附近游动
        x = this.width * 0.4;
        y = this.height * 0.6;
        
        switch (currentBehavior) {
          case 'swimming':
            x += Math.sin(time * 0.8) * this.width * 0.3;
            y += Math.sin(time * 0.6) * this.height * 0.15;
            break;
          case 'hiding':
            x = this.width * 0.1 + Math.sin(time * 0.5) * 50; // 躲在珊瑚附近
            y = this.height * 0.8;
            break;
          case 'playing':
            x += Math.sin(time * 1.5) * this.width * 0.2;
            y += Math.cos(time * 1.5) * 40; // 绕圈游动
            break;
          case 'schooling':
            x += Math.sin(time * 0.6 + Math.PI/4) * this.width * 0.25; // 群游
            y += Math.sin(time * 0.8) * 30;
            break;
          default:
            x += Math.sin(time * 0.4) * this.width * 0.1;
            y += Math.sin(time * 0.3) * 20;
        }
        break;
        
      case 'dolphin': // 🐬 海豚 - 浅水到中层，优雅游动
        x = this.width * 0.3;
        y = this.height * 0.35;
        
        switch (currentBehavior) {
          case 'swimming':
            x += Math.sin(time * 0.4) * this.width * 0.4;
            y += Math.sin(time * 0.5) * this.height * 0.2;
            break;
          case 'jumping':
            y = this.height * 0.2 - Math.abs(Math.sin(time * 2)) * 100; // 跳出水面
            x += Math.sin(time * 0.8) * this.width * 0.3;
            break;
          case 'playing':
            x += Math.sin(time * 1.2) * this.width * 0.2;
            y += Math.cos(time * 1.2) * 60; // 翻滚游戏
            break;
          case 'diving':
            y = this.height * (0.4 + Math.sin(time * 0.6) * 0.3); // 深潜
            x += Math.sin(time * 0.3) * this.width * 0.2;
            break;
          default:
            x += Math.sin(time * 0.3) * this.width * 0.2;
            y += Math.sin(time * 0.4) * 30;
        }
        break;
        
      case 'octopus': // 🐙 章鱼 - 深海层，在海底爬行
        x = this.width * 0.2;
        y = this.height * 0.85;
        
        switch (currentBehavior) {
          case 'crawling':
            x += Math.sin(time * 0.3) * this.width * 0.6;
            y += Math.sin(time * 0.2) * 15; // 贴着海底爬行
            break;
          case 'camouflaging':
            // 伪装时几乎不动
            x += Math.sin(time * 0.1) * 10;
            y += Math.sin(time * 0.15) * 5;
            break;
          case 'exploring':
            x += Math.sin(time * 0.5) * this.width * 0.4;
            y += Math.sin(time * 0.6) * 30; // 探索时上下移动
            break;
          case 'hunting':
            x += Math.sin(time * 0.8) * this.width * 0.3;
            y -= Math.abs(Math.sin(time * 1.5)) * 40; // 猎食时快速移动
            break;
          default:
            x += Math.sin(time * 0.2) * this.width * 0.3;
            y += Math.sin(time * 0.1) * 10;
        }
        break;
        
      default:
        // 调用父类方法
        return super.getCharacterPosition(character);
    }
    
    return { x, y };
  }

  /**
   * 绘制真实风格的珊瑚
   */
  renderRealisticCoral(ctx, x, y, element) {
    const time = Date.now() / 1000;
    const swayAngle = Math.sin(time * element.swaySpeed) * 3;
    const size = element.size;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(swayAngle * Math.PI / 180);
    
    // 珊瑚基座
    const baseGradient = ctx.createLinearGradient(0, size * 0.3, 0, 0);
    baseGradient.addColorStop(0, 'rgba(180, 100, 120, 0.9)');
    baseGradient.addColorStop(0.5, 'rgba(200, 120, 140, 0.85)');
    baseGradient.addColorStop(1, 'rgba(220, 140, 160, 0.8)');
    
    ctx.fillStyle = baseGradient;
    ctx.strokeStyle = 'rgba(160, 80, 100, 0.7)';
    ctx.lineWidth = 2;
    
    // 绘制珊瑚分支
    const branches = 5 + Math.floor(size / 15);
    
    for (let i = 0; i < branches; i++) {
      const angle = (i / branches) * Math.PI - Math.PI / 2;
      const branchLength = size * (0.4 + Math.random() * 0.3);
      const branchWidth = 4 + Math.random() * 4;
      
      ctx.save();
      ctx.rotate(angle);
      
      // 绘制主分支
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(
        branchLength * 0.3, -branchLength * 0.2,
        branchLength * 0.6, -branchLength * 0.5
      );
      ctx.quadraticCurveTo(
        branchLength * 0.8, -branchLength * 0.7,
        branchLength, -branchLength
      );
      
      ctx.lineWidth = branchWidth;
      ctx.lineCap = 'round';
      ctx.strokeStyle = baseGradient;
      ctx.stroke();
      
      // 添加小分支
      for (let j = 0; j < 2; j++) {
        const subPos = 0.4 + j * 0.3;
        const subAngle = (Math.random() - 0.5) * 0.6;
        const subLength = branchLength * 0.3;
        
        ctx.save();
        ctx.translate(branchLength * subPos, -branchLength * subPos);
        ctx.rotate(subAngle);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(subLength * 0.5, -subLength);
        ctx.lineWidth = branchWidth * 0.6;
        ctx.stroke();
        
        ctx.restore();
      }
      
      ctx.restore();
    }
    
    // 添加珊瑚纹理小点
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 15; i++) {
      const dotAngle = Math.random() * Math.PI * 2;
      const dotDist = Math.random() * size * 0.4;
      const dotX = Math.cos(dotAngle) * dotDist;
      const dotY = Math.sin(dotAngle) * dotDist;
      
      ctx.fillStyle = 'rgba(240, 180, 200, 0.8)';
      ctx.beginPath();
      ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
  
  /**
   * 绘制真实风格的海葵
   */
  renderRealisticAnemone(ctx, x, y, element) {
    const time = Date.now() / 1000;
    const scale = 1 + Math.sin(time * element.animSpeed) * 0.15;
    const size = element.size;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    
    // 海葵基座
    const baseGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.4);
    baseGradient.addColorStop(0, 'rgba(180, 100, 140, 0.9)');
    baseGradient.addColorStop(1, 'rgba(140, 70, 100, 0.8)');
    
    ctx.fillStyle = baseGradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.4, size * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 海葵触手
    const tentacles = 20 + Math.floor(size / 3);
    
    for (let i = 0; i < tentacles; i++) {
      const angle = (i / tentacles) * Math.PI * 2;
      const waveOffset = Math.sin(time * element.animSpeed * 2 + i * 0.3) * 0.2;
      const tentacleLength = size * (0.4 + Math.random() * 0.2);
      
      ctx.save();
      ctx.rotate(angle + waveOffset);
      
      // 触手渐变色
      const tentacleGradient = ctx.createLinearGradient(0, 0, 0, -tentacleLength);
      tentacleGradient.addColorStop(0, 'rgba(200, 120, 160, 0.9)');
      tentacleGradient.addColorStop(0.5, 'rgba(220, 140, 180, 0.8)');
      tentacleGradient.addColorStop(1, 'rgba(240, 180, 220, 0.6)');
      
      ctx.strokeStyle = tentacleGradient;
      ctx.lineWidth = 2 + Math.random() * 2;
      ctx.lineCap = 'round';
      
      // 绘制弯曲的触手
      ctx.beginPath();
      ctx.moveTo(0, 0);
      
      const segments = 5;
      for (let seg = 1; seg <= segments; seg++) {
        const segY = -(seg / segments) * tentacleLength;
        const segX = Math.sin(time * element.animSpeed * 3 + i * 0.2 + seg) * 
                     (seg / segments) * 8;
        ctx.lineTo(segX, segY);
      }
      
      ctx.stroke();
      
      // 触手顶端的圆点
      const tipX = Math.sin(time * element.animSpeed * 3 + i * 0.2 + segments) * 
                   (segments / segments) * 8;
      const tipY = -tentacleLength;
      
      ctx.fillStyle = 'rgba(255, 200, 230, 0.9)';
      ctx.beginPath();
      ctx.arc(tipX, tipY, 2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
    
    ctx.restore();
  }
  
  /**
   * 绘制真实风格的水草
   */
  renderRealisticSeaweed(ctx, x, y, element) {
    const time = Date.now() / 1000;
    const swayAngle = Math.sin(this.waveTime * element.animSpeed) * (element.swayAmount || 10);
    const height = element.size * 1.5; // 水草高度
    const segments = 8; // 水草分段数
    
    ctx.save();
    ctx.translate(x, y);
    
    // 绘制多条水草叶片（成簇状）
    const bladeCount = 3 + Math.floor(element.size / 20);
    
    for (let blade = 0; blade < bladeCount; blade++) {
      const bladeOffset = (blade - bladeCount / 2) * 8;
      const bladeHeight = height * (0.7 + Math.random() * 0.3);
      const bladeWidth = 3 + Math.random() * 3;
      
      // 水草颜色（深浅不一的绿色）
      const greenShade = 60 + blade * 15;
      const gradient = ctx.createLinearGradient(0, 0, 0, -bladeHeight);
      gradient.addColorStop(0, `rgba(${greenShade}, ${greenShade + 40}, ${greenShade}, 0.9)`);
      gradient.addColorStop(0.5, `rgba(${greenShade + 20}, ${greenShade + 60}, ${greenShade + 10}, 0.85)`);
      gradient.addColorStop(1, `rgba(${greenShade + 30}, ${greenShade + 70}, ${greenShade + 20}, 0.8)`);
      
      ctx.fillStyle = gradient;
      ctx.strokeStyle = `rgba(${greenShade - 20}, ${greenShade + 20}, ${greenShade - 10}, 0.7)`;
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.moveTo(bladeOffset, 0);
      
      // 绘制弯曲的水草叶片
      for (let i = 1; i <= segments; i++) {
        const segmentY = -(i / segments) * bladeHeight;
        const segmentSway = Math.sin(time * element.animSpeed + i * 0.3 + blade) * 
                           (swayAngle + i * 2);
        const segmentX = bladeOffset + segmentSway;
        const segmentWidth = bladeWidth * (1 - i / (segments + 2));
        
        // 水草两侧的点
        const leftX = segmentX - segmentWidth;
        const rightX = segmentX + segmentWidth;
        
        if (i === 1) {
          ctx.lineTo(leftX, segmentY);
        } else {
          ctx.lineTo(leftX, segmentY);
        }
      }
      
      // 绘制另一侧
      for (let i = segments; i >= 1; i--) {
        const segmentY = -(i / segments) * bladeHeight;
        const segmentSway = Math.sin(time * element.animSpeed + i * 0.3 + blade) * 
                           (swayAngle + i * 2);
        const segmentX = bladeOffset + segmentSway;
        const segmentWidth = bladeWidth * (1 - i / (segments + 2));
        const rightX = segmentX + segmentWidth;
        
        ctx.lineTo(rightX, segmentY);
      }
      
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // 添加水草的中脉（细线）
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${greenShade - 30}, ${greenShade + 10}, ${greenShade - 20}, 0.5)`;
      ctx.lineWidth = 1;
      ctx.moveTo(bladeOffset, 0);
      
      for (let i = 1; i <= segments; i++) {
        const segmentY = -(i / segments) * bladeHeight;
        const segmentSway = Math.sin(time * element.animSpeed + i * 0.3 + blade) * 
                           (swayAngle + i * 2);
        const segmentX = bladeOffset + segmentSway;
        ctx.lineTo(segmentX, segmentY);
      }
      ctx.stroke();
    }
    
    ctx.restore();
  }
  
  /**
   * 绘制海底地形（真实海床风格）
   */
  renderSeabed(ctx) {
    const time = Date.now() / 1000;
    
    // 远处的海底山脉（深色轮廓）
    ctx.save();
    ctx.globalAlpha = 0.3;
    const distantSeabedGradient = ctx.createLinearGradient(0, this.height * 0.75, 0, this.height * 0.85);
    distantSeabedGradient.addColorStop(0, 'rgba(40, 60, 80, 0.6)');
    distantSeabedGradient.addColorStop(1, 'rgba(50, 70, 90, 0.8)');
    ctx.fillStyle = distantSeabedGradient;
    
    ctx.beginPath();
    ctx.moveTo(0, this.height * 0.82);
    
    for (let i = 0; i <= 15; i++) {
      const x = (i / 15) * this.width;
      const baseY = this.height * 0.82;
      const variation = Math.sin(i * 0.6 + time * 0.1) * 20 + Math.cos(i * 1.3) * 15;
      ctx.lineTo(x, baseY + variation);
    }
    
    ctx.lineTo(this.width, this.height);
    ctx.lineTo(0, this.height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    // 主要海底沙地（自然的沙色）
    const seabedGradient = ctx.createLinearGradient(0, this.height * 0.84, 0, this.height);
    seabedGradient.addColorStop(0, 'rgba(160, 140, 110, 1)');  // 深沙色
    seabedGradient.addColorStop(0.4, 'rgba(180, 160, 130, 1)'); // 中沙色
    seabedGradient.addColorStop(0.7, 'rgba(190, 170, 140, 1)'); // 浅沙色
    seabedGradient.addColorStop(1, 'rgba(170, 150, 120, 1)');   // 底部沙色
    
    ctx.fillStyle = seabedGradient;
    ctx.beginPath();
    ctx.moveTo(0, this.height * 0.87);
    
    // 创建自然起伏的海床
    for (let x = 0; x <= this.width; x += 25) {
      const y = this.height * 0.87 + 
                Math.sin((x + this.waveTime * 40) * 0.012) * 8 +
                Math.cos((x + this.waveTime * 30) * 0.02) * 5;
      ctx.lineTo(x, y);
    }
    
    ctx.lineTo(this.width, this.height);
    ctx.lineTo(0, this.height);
    ctx.closePath();
    ctx.fill();
    
    // 添加海底沙地的纹理和细节
    ctx.save();
    
    // 沙丘的阴影
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < 8; i++) {
      const x = (i / 8 + 0.05) * this.width;
      const y = this.height * (0.88 + Math.random() * 0.05);
      const size = 40 + Math.random() * 30;
      
      const shadowGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      shadowGradient.addColorStop(0, 'rgba(80, 70, 50, 0.5)');
      shadowGradient.addColorStop(0.7, 'rgba(100, 85, 65, 0.2)');
      shadowGradient.addColorStop(1, 'rgba(100, 85, 65, 0)');
      
      ctx.fillStyle = shadowGradient;
      ctx.beginPath();
      ctx.ellipse(x, y, size, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    }
    
    // 沙地颗粒纹理
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * this.width;
      const y = this.height * (0.87 + Math.random() * 0.12);
      const size = 1 + Math.random() * 3;
      
      const sandColors = [
        'rgba(200, 180, 150, 0.6)',
        'rgba(180, 160, 130, 0.5)',
        'rgba(190, 170, 140, 0.7)',
        'rgba(170, 150, 120, 0.4)'
      ];
      
      ctx.fillStyle = sandColors[Math.floor(Math.random() * sandColors.length)];
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 海底岩石碎片
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < 12; i++) {
      const x = (i / 12) * this.width + (Math.random() - 0.5) * 60;
      const y = this.height * (0.88 + Math.random() * 0.08);
      const width = 8 + Math.random() * 15;
      const height = 5 + Math.random() * 10;
      
      ctx.fillStyle = 'rgba(90, 85, 75, 0.7)';
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.random() * Math.PI);
      ctx.fillRect(-width / 2, -height / 2, width, height);
      ctx.restore();
    }
    
    // 沙波纹（ripple marks）
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = 'rgba(140, 120, 95, 0.8)';
    ctx.lineWidth = 2;
    
    for (let layer = 0; layer < 6; layer++) {
      const baseY = this.height * (0.88 + layer * 0.02);
      
      ctx.beginPath();
      for (let x = 0; x <= this.width; x += 10) {
        const y = baseY + Math.sin((x + layer * 30) * 0.08) * 3;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
    
    // 添加海底的光影对比
    ctx.globalAlpha = 0.15;
    const lightAreas = [
      { x: 0.2, intensity: 0.5 },
      { x: 0.5, intensity: 0.7 },
      { x: 0.8, intensity: 0.4 }
    ];
    
    lightAreas.forEach(area => {
      const lightGradient = ctx.createRadialGradient(
        this.width * area.x, this.height * 0.9,
        0,
        this.width * area.x, this.height * 0.9,
        this.width * 0.15
      );
      
      lightGradient.addColorStop(0, `rgba(220, 200, 170, ${area.intensity})`);
      lightGradient.addColorStop(0.6, `rgba(200, 180, 150, ${area.intensity * 0.4})`);
      lightGradient.addColorStop(1, 'rgba(200, 180, 150, 0)');
      
      ctx.fillStyle = lightGradient;
      ctx.beginPath();
      ctx.arc(this.width * area.x, this.height * 0.9, this.width * 0.15, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.restore();
  }

  /**
   * 绘制鱼群
   */
  renderFishSchools(ctx) {
    this.fishSchools.forEach(school => {
      school.fishes.forEach(fish => {
        const x = fish.x * this.width;
        const y = fish.y * this.height;
        
        ctx.save();
        ctx.globalAlpha = 0.7;
        
        // 根据游动方向翻转鱼
        if (school.direction < 0) {
          ctx.scale(-1, 1);
          ctx.font = `${fish.size}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText(fish.emoji, -x, y);
        } else {
          ctx.font = `${fish.size}px Arial`;
          ctx.textAlign = 'center';
          ctx.fillText(fish.emoji, x, y);
        }
        
        ctx.restore();
      });
    });
  }

  /**
   * 渲染泡泡（重写以支持海底效果）
   */
  renderBubbles(ctx) {
    this.bubbles.forEach(bubble => {
      ctx.save();
      ctx.globalAlpha = bubble.opacity;
      
      // 根据角色类型绘制不同的泡泡效果
      if (bubble.character === 'clownfish') {
        this.drawWaterBubble(ctx, bubble);
      } else if (bubble.character === 'dolphin') {
        this.drawDolphinBubble(ctx, bubble);
      } else if (bubble.character === 'octopus') {
        this.drawOctopusBubble(ctx, bubble);
      }
      
      ctx.restore();
    });
  }

  /**
   * 绘制水泡泡（小丑鱼 - 温暖的珊瑚橙金色泡泡）
   */
  drawWaterBubble(ctx, bubble) {
    const radius = bubble.size / 2;
    
    // 外层光晕（橙金色）
    const glowGradient = ctx.createRadialGradient(bubble.x, bubble.y, radius * 0.7, bubble.x, bubble.y, radius * 1.4);
    glowGradient.addColorStop(0, 'rgba(255, 165, 100, 0)');
    glowGradient.addColorStop(0.6, 'rgba(255, 140, 80, 0.35)');
    glowGradient.addColorStop(1, 'rgba(255, 120, 60, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius * 1.4, 0, Math.PI * 2);
    ctx.fill();
    
    // 主体泡泡（橙金渐变）
    const mainGradient = ctx.createRadialGradient(
      bubble.x - radius * 0.3, bubble.y - radius * 0.3, radius * 0.1,
      bubble.x, bubble.y, radius
    );
    mainGradient.addColorStop(0, 'rgba(255, 220, 180, 0.95)');
    mainGradient.addColorStop(0.5, bubble.color);
    mainGradient.addColorStop(1, 'rgba(255, 140, 80, 0.7)');
    ctx.fillStyle = mainGradient;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 水波纹效果（多层，橙色调）
    ctx.strokeStyle = 'rgba(255, 150, 90, 0.6)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.strokeStyle = 'rgba(255, 180, 120, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius + 3, 0, Math.PI * 2);
    ctx.stroke();
    
    // 内圈亮边
    ctx.strokeStyle = 'rgba(255, 240, 200, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bubble.x - radius * 0.2, bubble.y - radius * 0.2, radius * 0.6, 0, Math.PI);
    ctx.stroke();
    
    this.drawBubbleHighlight(ctx, bubble);
    
    // 额外的闪光点（金色）
    ctx.fillStyle = 'rgba(255, 220, 150, 0.8)';
    ctx.beginPath();
    ctx.arc(bubble.x + radius * 0.4, bubble.y + radius * 0.1, radius * 0.08, 0, Math.PI * 2);
    ctx.fill();
  }

  /**
   * 绘制海豚泡泡（清新的青绿湖蓝色，流线型光芒）
   */
  drawDolphinBubble(ctx, bubble) {
    const radius = bubble.size / 2;
    
    // 外层流线光晕（青绿色）
    const glowGradient = ctx.createRadialGradient(bubble.x, bubble.y, radius * 0.6, bubble.x, bubble.y, radius * 1.5);
    glowGradient.addColorStop(0, 'rgba(100, 220, 200, 0)');
    glowGradient.addColorStop(0.5, 'rgba(70, 200, 180, 0.4)');
    glowGradient.addColorStop(1, 'rgba(50, 180, 160, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // 主体泡泡（青绿湖蓝渐变）
    const mainGradient = ctx.createRadialGradient(
      bubble.x - radius * 0.35, bubble.y - radius * 0.35, radius * 0.1,
      bubble.x, bubble.y, radius
    );
    mainGradient.addColorStop(0, 'rgba(200, 255, 240, 1)');
    mainGradient.addColorStop(0.5, bubble.color);
    mainGradient.addColorStop(1, 'rgba(70, 190, 170, 0.75)');
    ctx.fillStyle = mainGradient;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 流线效果（多层光环，青绿色）
    if (bubble.arcIndex !== undefined) {
      const opacity = 0.7 - bubble.arcIndex * 0.1;
      ctx.strokeStyle = `rgba(80, 220, 190, ${opacity})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.strokeStyle = `rgba(120, 235, 210, ${opacity * 0.6})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, radius + 4, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // 内圈亮边
    ctx.strokeStyle = 'rgba(220, 255, 245, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bubble.x - radius * 0.25, bubble.y - radius * 0.25, radius * 0.55, 0, Math.PI);
    ctx.stroke();
    
    this.drawBubbleHighlight(ctx, bubble);
    
    // 流线闪光（青绿色）
    for (let i = 0; i < 2; i++) {
      const angle = (i * Math.PI) / 2;
      const flashX = bubble.x + Math.cos(angle) * radius * 0.6;
      const flashY = bubble.y + Math.sin(angle) * radius * 0.6;
      ctx.fillStyle = 'rgba(150, 240, 220, 0.7)';
      ctx.beginPath();
      ctx.arc(flashX, flashY, radius * 0.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * 绘制章鱼泡泡（优雅的深海紫罗兰色，神秘墨水效果）
   */
  drawOctopusBubble(ctx, bubble) {
    const radius = bubble.size / 2;
    
    // 外层墨水雾化效果（紫罗兰色）
    const glowGradient = ctx.createRadialGradient(bubble.x, bubble.y, radius * 0.5, bubble.x, bubble.y, radius * 1.6);
    glowGradient.addColorStop(0, 'rgba(180, 130, 255, 0)');
    glowGradient.addColorStop(0.4, 'rgba(150, 100, 255, 0.35)');
    glowGradient.addColorStop(0.8, 'rgba(160, 110, 255, 0.2)');
    glowGradient.addColorStop(1, 'rgba(140, 90, 255, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius * 1.6, 0, Math.PI * 2);
    ctx.fill();
    
    // 主体泡泡（紫罗兰渐变）
    const mainGradient = ctx.createRadialGradient(
      bubble.x - radius * 0.3, bubble.y - radius * 0.3, radius * 0.1,
      bubble.x, bubble.y, radius
    );
    mainGradient.addColorStop(0, 'rgba(230, 210, 255, 0.95)');
    mainGradient.addColorStop(0.5, bubble.color);
    mainGradient.addColorStop(1, 'rgba(140, 90, 230, 0.75)');
    ctx.fillStyle = mainGradient;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 墨水效果（多层环状，紫罗兰色）
    ctx.strokeStyle = 'rgba(170, 130, 255, 0.65)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.strokeStyle = 'rgba(150, 110, 255, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius + 3, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.strokeStyle = 'rgba(180, 140, 255, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius + 6, 0, Math.PI * 2);
    ctx.stroke();
    
    // 内圈亮边
    ctx.strokeStyle = 'rgba(240, 220, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bubble.x - radius * 0.2, bubble.y - radius * 0.2, radius * 0.6, 0, Math.PI);
    ctx.stroke();
    
    this.drawBubbleHighlight(ctx, bubble);
    
    // 神秘光点（紫罗兰色）
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3 + Math.PI / 6;
      const sparkX = bubble.x + Math.cos(angle) * radius * 0.5;
      const sparkY = bubble.y + Math.sin(angle) * radius * 0.5;
      ctx.fillStyle = 'rgba(200, 170, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, radius * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * 绘制泡泡高光
   */
  drawBubbleHighlight(ctx, bubble) {
    // 主高光
    ctx.beginPath();
    ctx.arc(
      bubble.x - bubble.size / 6, 
      bubble.y - bubble.size / 6, 
      bubble.size / 8, 
      0, 
      Math.PI * 2
    );
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fill();
    
    // 副高光
    ctx.beginPath();
    ctx.arc(
      bubble.x + bubble.size / 8, 
      bubble.y - bubble.size / 4, 
      bubble.size / 16, 
      0, 
      Math.PI * 2
    );
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fill();
  }
}

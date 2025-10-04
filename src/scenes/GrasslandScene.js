/**
 * 阳光草地场景
 * 明亮、温暖、高饱和度的场景，包含小熊、小兔、小青蛙三个角色
 */

import { BaseScene } from './BaseScene.js';

export class GrasslandScene extends BaseScene {
  constructor() {
    super('grassland', '阳光草地');
    
    // 场景特色配置
    this.backgroundColor = '#87CEEB'; // 天蓝色
    this.secondaryColor = '#98FB98'; // 淡绿色
    
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
        id: 'bear',
        name: '小熊',
        emoji: '🧸', // 完整的泰迪熊形象
        bubbleType: 'large',
        bubbleSize: 60,
        bubbleColor: 'rgba(255, 200, 50, 0.8)', // 阳光蜂蜜金黄色（温暖甜蜜）
        bubbleSpeed: 40,
        bubbleLife: 12,
        popEffect: 'flower'
      },
      {
        id: 'rabbit',
        name: '小兔',
        emoji: '🐇', // 完整的兔子形象
        bubbleType: 'cluster',
        bubbleSize: 35,
        bubbleColor: 'rgba(255, 150, 200, 0.85)', // 樱花粉红色（甜美可爱）
        bubbleSpeed: 60,
        bubbleLife: 10,
        popEffect: 'carrot',
        clusterCount: 4 // 一次生成多个泡泡
      },
      {
        id: 'frog',
        name: '小青蛙',
        emoji: '🐸', // 青蛙形象（已经是完整形象）
        bubbleType: 'bouncy',
        bubbleSize: 45,
        bubbleColor: 'rgba(100, 255, 150, 0.8)', // 清新薄荷绿（生机勃勃）
        bubbleSpeed: 80,
        bubbleLife: 8,
        popEffect: 'leaf',
        bounceAmplitude: 30 // 跳跃幅度
      }
    ];
  }

  /**
   * 设置背景元素
   */
  setupBackgroundElements() {
    this.backgroundElements = [
      // 太阳（带光晕效果）
      {
        type: 'sun',
        x: 0.85,
        y: 0.15,
        size: 60,
        emoji: '☀️',
        glow: true
      },
      // 云朵（多层次，有飘动）
      {
        type: 'cloud',
        x: 0.15,
        y: 0.08,
        size: 45,
        emoji: '☁️',
        driftSpeed: 0.3,
        layer: 1
      },
      {
        type: 'cloud',
        x: 0.4,
        y: 0.12,
        size: 38,
        emoji: '☁️',
        driftSpeed: 0.5,
        layer: 2
      },
      {
        type: 'cloud',
        x: 0.65,
        y: 0.06,
        size: 42,
        emoji: '☁️',
        driftSpeed: 0.4,
        layer: 1
      },
      // 远处的树木（森林感）
      {
        type: 'tree',
        x: 0.05,
        y: 0.6,
        size: 70,
        emoji: '🌳',
        sway: true
      },
      {
        type: 'tree',
        x: 0.12,
        y: 0.58,
        size: 65,
        emoji: '🌲',
        sway: true
      },
      {
        type: 'tree',
        x: 0.19,
        y: 0.62,
        size: 68,
        emoji: '🌳',
        sway: true
      },
      {
        type: 'tree',
        x: 0.26,
        y: 0.59,
        size: 62,
        emoji: '🌲',
        sway: true
      },
      {
        type: 'tree',
        x: 0.33,
        y: 0.61,
        size: 66,
        emoji: '🌳',
        sway: true
      },
      // 中间区域的树
      {
        type: 'tree',
        x: 0.48,
        y: 0.57,
        size: 72,
        emoji: '🌲',
        sway: true
      },
      {
        type: 'tree',
        x: 0.56,
        y: 0.6,
        size: 69,
        emoji: '🌳',
        sway: true
      },
      // 右侧树林
      {
        type: 'tree',
        x: 0.74,
        y: 0.59,
        size: 67,
        emoji: '🌲',
        sway: true
      },
      {
        type: 'tree',
        x: 0.81,
        y: 0.61,
        size: 71,
        emoji: '🌳',
        sway: true
      },
      {
        type: 'tree',
        x: 0.88,
        y: 0.58,
        size: 68,
        emoji: '🌲',
        sway: true
      },
      {
        type: 'tree',
        x: 0.94,
        y: 0.62,
        size: 64,
        emoji: '🌳',
        sway: true
      },
      // 各种花朵（更大更显眼）
      {
        type: 'flower',
        x: 0.12,
        y: 0.72,
        size: 40,
        emoji: '🌻',
        animated: true,
        animSpeed: 1.5
      },
      {
        type: 'flower',
        x: 0.18,
        y: 0.78,
        size: 35,
        emoji: '🌺',
        animated: true,
        animSpeed: 2
      },
      {
        type: 'flower',
        x: 0.28,
        y: 0.75,
        size: 38,
        emoji: '🌼',
        animated: true,
        animSpeed: 1.8
      },
      {
        type: 'flower',
        x: 0.38,
        y: 0.82,
        size: 32,
        emoji: '🌸',
        animated: true,
        animSpeed: 2.2
      },
      {
        type: 'flower',
        x: 0.58,
        y: 0.76,
        size: 42,
        emoji: '🌷',
        animated: true,
        animSpeed: 1.6
      },
      {
        type: 'flower',
        x: 0.68,
        y: 0.81,
        size: 36,
        emoji: '🌹',
        animated: true,
        animSpeed: 1.9
      },
      {
        type: 'flower',
        x: 0.78,
        y: 0.74,
        size: 39,
        emoji: '🌺',
        animated: true,
        animSpeed: 2.1
      },
      {
        type: 'flower',
        x: 0.86,
        y: 0.79,
        size: 34,
        emoji: '🌼',
        animated: true,
        animSpeed: 1.7
      },
      {
        type: 'flower',
        x: 0.92,
        y: 0.77,
        size: 37,
        emoji: '🌻',
        animated: true,
        animSpeed: 2
      },
      // 草丛点缀
      {
        type: 'grass',
        x: 0.25,
        y: 0.85,
        size: 18,
        emoji: '🌿',
        sway: true
      },
      {
        type: 'grass',
        x: 0.45,
        y: 0.87,
        size: 18,
        emoji: '🌿',
        sway: true
      },
      {
        type: 'grass',
        x: 0.65,
        y: 0.86,
        size: 18,
        emoji: '🌿',
        sway: true
      },
      // 飞舞的蝴蝶（多只）
      {
        type: 'butterfly',
        x: 0.3,
        y: 0.35,
        size: 28,
        emoji: '🦋',
        animated: true,
        animSpeed: 2,
        flightPath: 'sine'
      },
      {
        type: 'butterfly',
        x: 0.7,
        y: 0.4,
        size: 25,
        emoji: '🦋',
        animated: true,
        animSpeed: 2.5,
        flightPath: 'circle'
      },
      // 蜜蜂采蜜
      {
        type: 'bee',
        x: 0.5,
        y: 0.5,
        size: 22,
        emoji: '🐝',
        animated: true,
        animSpeed: 3,
        flightPath: 'zigzag'
      },
      {
        type: 'bee',
        x: 0.8,
        y: 0.45,
        size: 20,
        emoji: '🐝',
        animated: true,
        animSpeed: 2.8,
        flightPath: 'sine'
      },
      // 瓢虫
      {
        type: 'ladybug',
        x: 0.35,
        y: 0.73,
        size: 16,
        emoji: '🐞',
        animated: true,
        animSpeed: 1,
        crawl: true
      },
      {
        type: 'ladybug',
        x: 0.72,
        y: 0.78,
        size: 15,
        emoji: '🐞',
        animated: true,
        animSpeed: 1.2,
        crawl: true
      }
    ];
    
    // 初始化粒子系统（花瓣飘落）
    this.particles = [];
    this.particleTimer = 0;
    this.cloudOffsets = new Map(); // 云朵飘动偏移
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
    if (character.id === 'rabbit' && character.clusterCount) {
      // 小兔生成一串泡泡
      const bubbles = [];
      for (let i = 0; i < character.clusterCount; i++) {
        const offsetX = (Math.random() - 0.5) * 60;
        const offsetY = Math.random() * 30;
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
          speed: character.bubbleSpeed + (Math.random() - 0.5) * 20,
          life: character.bubbleLife,
          age: 0,
          opacity: 1,
          isPopped: false,
          clusterIndex: i
        };
        bubbles.push(bubble);
      }
      return bubbles;
    } else {
      // 其他角色生成单个泡泡
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
   * 更新泡泡状态（重写以支持特殊动画）
   */
  updateBubbles(deltaTime) {
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const bubble = this.bubbles[i];
      
      // 更新泡泡年龄
      bubble.age += deltaTime;
      
      // 根据角色类型更新位置
      if (bubble.character === 'frog') {
        // 青蛙泡泡：跳跃式上升
        const bounceFreq = 3;
        const bounceOffset = Math.sin(bubble.age * bounceFreq) * 20;
        bubble.y -= bubble.speed * deltaTime;
        bubble.x = bubble.startX + bounceOffset;
      } else if (bubble.character === 'rabbit') {
        // 兔子泡泡：快速上升，轻微摆动
        bubble.y -= bubble.speed * deltaTime;
        bubble.x = bubble.startX + Math.sin(bubble.age * 3 + bubble.clusterIndex) * 15;
      } else {
        // 熊泡泡：缓慢稳定上升
        bubble.y -= bubble.speed * deltaTime;
        bubble.x = bubble.startX + Math.sin(bubble.age * 1.5) * 25;
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
   * 渲染背景元素
   */
  renderBackgroundElements(ctx) {
    // 绘制山坡
    this.renderHills(ctx);
    
    const time = Date.now() / 1000;
    
    // 绘制背景装饰元素（分层渲染）
    this.backgroundElements.forEach(element => {
      let x = element.x * this.width;
      let y = element.y * this.height;
      
      ctx.save();
      
      // 太阳光晕效果
      if (element.type === 'sun' && element.glow) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, element.size * 1.2);
        gradient.addColorStop(0, 'rgba(255, 255, 150, 0.3)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 150, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 255, 150, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, element.size * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // 云朵飘动
      if (element.type === 'cloud' && element.driftSpeed) {
        if (!this.cloudOffsets.has(element)) {
          this.cloudOffsets.set(element, Math.random() * 1000);
        }
        const offset = this.cloudOffsets.get(element);
        x += Math.sin(time * element.driftSpeed + offset) * 30;
        y += Math.sin(time * element.driftSpeed * 0.5 + offset) * 5;
      }
      
      // 蝴蝶和蜜蜂的飞行路径
      if ((element.type === 'butterfly' || element.type === 'bee') && element.flightPath) {
        const baseX = element.x * this.width;
        const baseY = element.y * this.height;
        
        switch (element.flightPath) {
          case 'sine':
            x = baseX + Math.sin(time * element.animSpeed) * 100;
            y = baseY + Math.sin(time * element.animSpeed * 0.5) * 50;
            break;
          case 'circle':
            const radius = 80;
            x = baseX + Math.cos(time * element.animSpeed) * radius;
            y = baseY + Math.sin(time * element.animSpeed) * radius * 0.5;
            break;
          case 'zigzag':
            x = baseX + Math.sin(time * element.animSpeed * 2) * 60;
            y = baseY + (time * element.animSpeed * 10) % 100 - 50;
            break;
        }
      }
      
      // 瓢虫爬行
      if (element.type === 'ladybug' && element.crawl) {
        x += Math.sin(time * element.animSpeed) * 50;
      }
      
      // 花朵和草随风摆动
      if ((element.type === 'flower' || element.type === 'grass' || element.type === 'tree') && 
          (element.animated || element.sway)) {
        const swayAmount = element.type === 'tree' ? 5 : 8;
        ctx.translate(x, y);
        ctx.rotate(Math.sin(time * (element.animSpeed || 1)) * 0.1);
        ctx.translate(-x, -y);
        
        // 花朵还有轻微的上下浮动
        if (element.type === 'flower') {
          y += Math.sin(time * element.animSpeed) * 3;
        }
      }
      
      // 绘制元素
      ctx.font = `${element.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // 添加轻微阴影效果
      if (element.type === 'flower' || element.type === 'tree') {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      }
      
      ctx.fillText(element.emoji, x, y);
      
      ctx.restore();
    });
    
    // 渲染粒子（花瓣飘落）
    this.renderParticles(ctx, time);
  }
  
  /**
   * 渲染飘落的花瓣粒子
   */
  renderParticles(ctx, time) {
    // 定期生成新粒子
    this.particleTimer += 1;
    if (this.particleTimer > 60 && this.particles.length < 20) {
      this.particles.push({
        x: Math.random() * this.width,
        y: -20,
        size: 15 + Math.random() * 10,
        emoji: ['🌸', '🌺', '🌼', '🍃'][Math.floor(Math.random() * 4)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        speedY: 1 + Math.random() * 2,
        speedX: (Math.random() - 0.5) * 1,
        opacity: 0.6 + Math.random() * 0.4
      });
      this.particleTimer = 0;
    }
    
    // 更新和绘制粒子
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      particle.y += particle.speedY;
      particle.x += particle.speedX + Math.sin(time * 2 + particle.y * 0.01) * 0.5;
      particle.rotation += particle.rotationSpeed;
      
      // 移除超出屏幕的粒子
      if (particle.y > this.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }
      
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      ctx.font = `${particle.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(particle.emoji, 0, 0);
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
      case 'bear': // 🐻 小熊
        return ['idle', 'walking', 'sitting', 'sniffing', 'yawning'];
      case 'rabbit': // 🐰 小兔
        return ['idle', 'hopping', 'digging', 'alert', 'eating'];
      case 'frog': // 🐸 青蛙
        return ['idle', 'jumping', 'swimming', 'catching_flies', 'croaking'];
      default:
        return super.getAnimalBehaviors(character);
    }
  }

  /**
   * 获取角色位置（重写基类方法以实现分层定位）
   * @param {Object} character - 角色对象
   * @returns {Object} 包含x和y坐标的对象
   */
  getCharacterPosition(character) {
    const time = Date.now() / 1000;
    const currentBehavior = this.animalBehaviors.get(character.id) || 'idle';
    let x = this.width / 2;
    let y = this.height * 0.8;
    
    // 根据角色类型确定基础活动空间
    switch (character.id) {
      case 'bear': // 🐻 小熊 - 地面层，可以在草地上漫步
        x = this.width * 0.3;
        y = this.height * 0.8;
        
        // 根据行为调整位置
        switch (currentBehavior) {
          case 'walking':
            x += Math.sin(time * 0.5) * this.width * 0.4;
            break;
          case 'sitting':
            y += 20; // 坐下时位置稍低
            break;
          case 'sniffing':
            x += Math.sin(time * 1.5) * 30; // 嗅探时左右摆动
            y += Math.sin(time * 2) * 10;
            break;
          case 'yawning':
            y -= Math.sin(time * 0.5) * 15; // 打哈欠时稍微抬头
            break;
          default:
            x += Math.sin(time * 0.3) * this.width * 0.1;
        }
        break;
        
      case 'rabbit': // 🐰 小兔 - 地面层，活泼跳跃
        x = this.width * 0.4;
        y = this.height * 0.82;
        
        switch (currentBehavior) {
          case 'hopping':
            x += Math.sin(time * 0.8) * this.width * 0.3;
            y -= Math.abs(Math.sin(time * 3)) * 60; // 跳跃动画
            break;
          case 'digging':
            y += 10; // 挖洞时位置稍低
            x += Math.sin(time * 4) * 15; // 快速左右摆动
            break;
          case 'alert':
            y -= 20; // 警觉时稍微抬起
            break;
          case 'eating':
            y += 5; // 吃东西时稍微低头
            x += Math.sin(time * 2) * 10;
            break;
          default:
            x += Math.sin(time * 0.6) * this.width * 0.2;
        }
        break;
        
      case 'frog': // 🐸 青蛙 - 地面层，靠近水边
        x = this.width * 0.2;
        y = this.height * 0.85;
        
        switch (currentBehavior) {
          case 'jumping':
            x += Math.sin(time * 1.2) * this.width * 0.3;
            y -= Math.abs(Math.sin(time * 2.5)) * 40;
            break;
          case 'swimming':
            x += Math.sin(time * 0.6) * this.width * 0.2;
            y += Math.sin(time * 1.5) * 15; // 游泳时上下浮动
            break;
          case 'catching_flies':
            y -= Math.abs(Math.sin(time * 3)) * 25; // 捕虫时快速伸舌
            break;
          case 'croaking':
            y -= Math.sin(time * 2) * 10; // 叫声时轻微颤动
            break;
          default:
            x += Math.sin(time * 0.4) * this.width * 0.1;
        }
        break;
        
      default:
        // 调用父类方法
        return super.getCharacterPosition(character);
    }
    
    return { x, y };
  }

  /**
   * 绘制山坡（现实风格，自然真实的色彩）
   */
  renderHills(ctx) {
    const time = Date.now() / 1000;
    
    // 最远的山丘层（淡蓝灰色，模拟远景大气透视）
    const distantHillGradient = ctx.createLinearGradient(0, this.height * 0.5, 0, this.height * 0.63);
    distantHillGradient.addColorStop(0, 'rgba(160, 180, 200, 0.4)');
    distantHillGradient.addColorStop(1, 'rgba(140, 165, 185, 0.5)');
    ctx.fillStyle = distantHillGradient;
    ctx.beginPath();
    ctx.moveTo(0, this.height * 0.58);
    
    // 用更多点创建自然的山峦轮廓
    for (let i = 0; i <= 20; i++) {
      const x = (i / 20) * this.width;
      const baseY = this.height * 0.58;
      const variation = Math.sin(i * 0.8 + time * 0.1) * 15 + Math.cos(i * 1.2) * 20;
      ctx.lineTo(x, baseY + variation);
    }
    
    ctx.lineTo(this.width, this.height);
    ctx.lineTo(0, this.height);
    ctx.closePath();
    ctx.fill();
    
    // 中远山丘（暗绿色，稍微清晰一些）
    const midDistantGradient = ctx.createLinearGradient(0, this.height * 0.6, 0, this.height * 0.72);
    midDistantGradient.addColorStop(0, 'rgba(100, 140, 90, 0.6)');
    midDistantGradient.addColorStop(1, 'rgba(80, 120, 70, 0.75)');
    ctx.fillStyle = midDistantGradient;
    ctx.beginPath();
    ctx.moveTo(0, this.height * 0.66);
    
    for (let i = 0; i <= 18; i++) {
      const x = (i / 18) * this.width;
      const baseY = this.height * 0.66;
      const variation = Math.sin(i * 0.6 + time * 0.15) * 12 + Math.cos(i * 1.5 + 2) * 18;
      ctx.lineTo(x, baseY + variation);
    }
    
    ctx.lineTo(this.width, this.height);
    ctx.lineTo(0, this.height);
    ctx.closePath();
    ctx.fill();
    
    // 添加山丘阴影效果（增加立体感）
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = 'rgba(50, 80, 60, 0.5)';
    for (let i = 0; i < 3; i++) {
      const shadowX = (i / 3 + 0.2) * this.width;
      const shadowY = this.height * 0.68;
      ctx.beginPath();
      ctx.ellipse(shadowX, shadowY, this.width * 0.12, this.height * 0.06, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 中间山丘（橄榄绿，真实草地色）
    const midHillGradient = ctx.createLinearGradient(0, this.height * 0.68, 0, this.height * 0.78);
    midHillGradient.addColorStop(0, 'rgba(110, 150, 80, 0.85)');
    midHillGradient.addColorStop(0.5, 'rgba(95, 135, 70, 0.9)');
    midHillGradient.addColorStop(1, 'rgba(85, 125, 65, 0.95)');
    ctx.fillStyle = midHillGradient;
    ctx.beginPath();
    ctx.moveTo(0, this.height * 0.73);
    
    for (let i = 0; i <= 16; i++) {
      const x = (i / 16) * this.width;
      const baseY = this.height * 0.73;
      const variation = Math.sin(i * 0.5 + time * 0.2) * 10 + Math.cos(i * 1.8 + 1) * 15;
      ctx.lineTo(x, baseY + variation);
    }
    
    ctx.lineTo(this.width, this.height);
    ctx.lineTo(0, this.height);
    ctx.closePath();
    ctx.fill();
    
    // 添加中山丘的光影对比
    ctx.save();
    ctx.globalAlpha = 0.2;
    const lightPatch = ctx.createRadialGradient(
      this.width * 0.6, this.height * 0.73,
      0, this.width * 0.6, this.height * 0.73,
      this.width * 0.3
    );
    lightPatch.addColorStop(0, 'rgba(180, 200, 140, 0.5)');
    lightPatch.addColorStop(1, 'rgba(180, 200, 140, 0)');
    ctx.fillStyle = lightPatch;
    ctx.fillRect(0, this.height * 0.68, this.width, this.height * 0.12);
    ctx.restore();

    // 最近的主草地（深绿草地，自然色调）
    const mainGrassGradient = ctx.createLinearGradient(0, this.height * 0.76, 0, this.height);
    mainGrassGradient.addColorStop(0, 'rgba(80, 120, 60, 1)');
    mainGrassGradient.addColorStop(0.4, 'rgba(70, 110, 50, 1)');
    mainGrassGradient.addColorStop(0.7, 'rgba(65, 105, 45, 1)');
    mainGrassGradient.addColorStop(1, 'rgba(55, 95, 40, 1)');
    ctx.fillStyle = mainGrassGradient;
    ctx.beginPath();
    ctx.moveTo(0, this.height * 0.8);
    
    for (let i = 0; i <= 14; i++) {
      const x = (i / 14) * this.width;
      const baseY = this.height * 0.8;
      const variation = Math.sin(i * 0.4 + time * 0.25) * 8 + Math.cos(i * 2 + 3) * 12;
      ctx.lineTo(x, baseY + variation);
    }
    
    ctx.lineTo(this.width, this.height);
    ctx.lineTo(0, this.height);
    ctx.closePath();
    ctx.fill();
    
    // 添加草地的自然纹理和光影
    ctx.save();
    
    // 阳光斑块（真实的光照效果）
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 5; i++) {
      const patchX = (i / 5 + 0.1) * this.width + Math.sin(time * 0.2 + i) * 30;
      const patchY = this.height * (0.78 + i * 0.03);
      const patchSize = 60 + Math.sin(time * 0.3 + i) * 20;
      
      const patchGradient = ctx.createRadialGradient(patchX, patchY, 0, patchX, patchY, patchSize);
      patchGradient.addColorStop(0, 'rgba(200, 220, 160, 0.6)');
      patchGradient.addColorStop(0.6, 'rgba(150, 180, 120, 0.3)');
      patchGradient.addColorStop(1, 'rgba(150, 180, 120, 0)');
      
      ctx.fillStyle = patchGradient;
      ctx.beginPath();
      ctx.arc(patchX, patchY, patchSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 草地纹理细节（深浅交替，模拟草丛）
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * this.width;
      const y = this.height * (0.78 + Math.random() * 0.18);
      const size = 3 + Math.random() * 6;
      
      // 草丛的深绿色
      ctx.fillStyle = i % 2 === 0 ? 'rgba(40, 70, 30, 0.4)' : 'rgba(90, 130, 70, 0.3)';
      ctx.beginPath();
      ctx.ellipse(x, y, size, size * 0.6, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 添加草叶细节（更真实的草地效果）
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < 80; i++) {
      const x = (i / 80) * this.width + (Math.random() - 0.5) * 40;
      const y = this.height * (0.8 + Math.random() * 0.15);
      
      // 草叶颜色（深浅绿色）
      const leafColors = [
        'rgba(60, 100, 45, 0.5)',
        'rgba(75, 115, 55, 0.5)',
        'rgba(85, 125, 65, 0.5)',
        'rgba(95, 135, 75, 0.5)'
      ];
      
      ctx.strokeStyle = leafColors[Math.floor(Math.random() * leafColors.length)];
      ctx.lineWidth = 1 + Math.random();
      ctx.lineCap = 'round';
      
      // 绘制草叶（细长的线条）
      ctx.beginPath();
      ctx.moveTo(x, y);
      const bendX = x + (Math.random() - 0.5) * 4;
      const bendY = y - 6 - Math.random() * 8;
      ctx.quadraticCurveTo(
        x + (Math.random() - 0.5) * 6, 
        y - 4, 
        bendX, 
        bendY
      );
      ctx.stroke();
    }
    
    ctx.restore();
    
    // 添加前景深色草影（增强景深）
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = 'rgba(30, 50, 25, 0.6)';
    ctx.beginPath();
    ctx.moveTo(0, this.height * 0.92);
    for (let i = 0; i <= 10; i++) {
      const x = (i / 10) * this.width;
      const y = this.height * 0.92 + Math.sin(i * 2 + time * 0.5) * 8;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(this.width, this.height);
    ctx.lineTo(0, this.height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  /**
   * 渲染泡泡（重写以支持特殊效果）
   */
  renderBubbles(ctx) {
    this.bubbles.forEach(bubble => {
      ctx.save();
      ctx.globalAlpha = bubble.opacity;
      
      // 根据角色类型绘制不同的泡泡效果
      if (bubble.character === 'bear') {
        // 熊泡泡：大而稳定，有彩虹色边框
        this.drawBearBubble(ctx, bubble);
      } else if (bubble.character === 'rabbit') {
        // 兔子泡泡：小而多，白色
        this.drawRabbitBubble(ctx, bubble);
      } else if (bubble.character === 'frog') {
        // 青蛙泡泡：绿色，有跳跃感
        this.drawFrogBubble(ctx, bubble);
      } else {
        // 默认泡泡
        this.drawDefaultBubble(ctx, bubble);
      }
      
      ctx.restore();
    });
  }

  /**
   * 绘制熊泡泡（阳光蜂蜜金黄色）
   */
  drawBearBubble(ctx, bubble) {
    const radius = bubble.size / 2;
    
    // 外层阳光光晕
    const glowGradient = ctx.createRadialGradient(bubble.x, bubble.y, radius * 0.7, bubble.x, bubble.y, radius * 1.5);
    glowGradient.addColorStop(0, 'rgba(255, 220, 100, 0.4)');
    glowGradient.addColorStop(0.6, 'rgba(255, 200, 50, 0.3)');
    glowGradient.addColorStop(1, 'rgba(255, 180, 0, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // 主体泡泡（金黄渐变）
    const mainGradient = ctx.createRadialGradient(
      bubble.x - radius * 0.3, bubble.y - radius * 0.3, radius * 0.1,
      bubble.x, bubble.y, radius
    );
    mainGradient.addColorStop(0, 'rgba(255, 250, 200, 0.95)');
    mainGradient.addColorStop(0.5, bubble.color);
    mainGradient.addColorStop(1, 'rgba(255, 180, 30, 0.75)');
    ctx.fillStyle = mainGradient;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 蜂蜜金色边框
    ctx.strokeStyle = 'rgba(255, 190, 50, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.strokeStyle = 'rgba(255, 220, 100, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius + 3, 0, Math.PI * 2);
    ctx.stroke();
    
    // 内圈亮边
    ctx.strokeStyle = 'rgba(255, 255, 220, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bubble.x - radius * 0.2, bubble.y - radius * 0.2, radius * 0.6, 0, Math.PI);
    ctx.stroke();
    
    // 高光
    this.drawBubbleHighlight(ctx, bubble);
    
    // 阳光闪烁点
    for (let i = 0; i < 2; i++) {
      const angle = (i * Math.PI * 2) / 2 + Date.now() / 800;
      const sparkX = bubble.x + Math.cos(angle) * radius * 0.5;
      const sparkY = bubble.y + Math.sin(angle) * radius * 0.5;
      ctx.fillStyle = 'rgba(255, 255, 150, 0.9)';
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, radius * 0.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * 绘制兔子泡泡（樱花粉红色）
   */
  drawRabbitBubble(ctx, bubble) {
    const radius = bubble.size / 2;
    
    // 樱花粉光晕
    const glowGradient = ctx.createRadialGradient(bubble.x, bubble.y, radius * 0.7, bubble.x, bubble.y, radius * 1.4);
    glowGradient.addColorStop(0, 'rgba(255, 200, 230, 0.5)');
    glowGradient.addColorStop(0.6, 'rgba(255, 150, 200, 0.3)');
    glowGradient.addColorStop(1, 'rgba(255, 100, 180, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius * 1.4, 0, Math.PI * 2);
    ctx.fill();
    
    // 主体泡泡（粉红渐变）
    const mainGradient = ctx.createRadialGradient(
      bubble.x - radius * 0.35, bubble.y - radius * 0.35, radius * 0.1,
      bubble.x, bubble.y, radius
    );
    mainGradient.addColorStop(0, 'rgba(255, 240, 250, 0.95)');
    mainGradient.addColorStop(0.5, bubble.color);
    mainGradient.addColorStop(1, 'rgba(255, 120, 180, 0.75)');
    ctx.fillStyle = mainGradient;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 樱花粉边框
    ctx.strokeStyle = 'rgba(255, 160, 200, 0.8)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.strokeStyle = 'rgba(255, 200, 230, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius + 3, 0, Math.PI * 2);
    ctx.stroke();
    
    // 内圈光芒
    ctx.strokeStyle = 'rgba(255, 240, 250, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bubble.x - radius * 0.25, bubble.y - radius * 0.25, radius * 0.55, 0, Math.PI);
    ctx.stroke();
    
    // 高光
    this.drawBubbleHighlight(ctx, bubble);
    
    // 樱花花瓣光点
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI * 2) / 4 + Date.now() / 1000;
      const sparkX = bubble.x + Math.cos(angle) * radius * 0.6;
      const sparkY = bubble.y + Math.sin(angle) * radius * 0.6;
      ctx.fillStyle = 'rgba(255, 220, 240, 0.8)';
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, radius * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * 绘制青蛙泡泡（清新薄荷绿）
   */
  drawFrogBubble(ctx, bubble) {
    const radius = bubble.size / 2;
    
    // 外层薄荷清新光晕
    const glowGradient = ctx.createRadialGradient(bubble.x, bubble.y, radius * 0.6, bubble.x, bubble.y, radius * 1.5);
    glowGradient.addColorStop(0, 'rgba(150, 255, 200, 0.5)');
    glowGradient.addColorStop(0.6, 'rgba(100, 255, 150, 0.3)');
    glowGradient.addColorStop(1, 'rgba(50, 255, 100, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // 主体泡泡（薄荷绿渐变）
    const mainGradient = ctx.createRadialGradient(
      bubble.x - radius * 0.3, bubble.y - radius * 0.3, radius * 0.1,
      bubble.x, bubble.y, radius
    );
    mainGradient.addColorStop(0, 'rgba(220, 255, 240, 0.95)');
    mainGradient.addColorStop(0.5, bubble.color);
    mainGradient.addColorStop(1, 'rgba(70, 230, 120, 0.75)');
    ctx.fillStyle = mainGradient;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 多层薄荷绿光环
    ctx.strokeStyle = 'rgba(100, 255, 150, 0.7)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.strokeStyle = 'rgba(150, 255, 200, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius + 4, 0, Math.PI * 2);
    ctx.stroke();
    
    // 内圈亮边
    ctx.strokeStyle = 'rgba(240, 255, 250, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bubble.x - radius * 0.2, bubble.y - radius * 0.2, radius * 0.6, 0, Math.PI);
    ctx.stroke();
    
    // 高光
    this.drawBubbleHighlight(ctx, bubble);
    
    // 清新叶片光点（三叶草式）
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3 + Date.now() / 1200;
      const sparkX = bubble.x + Math.cos(angle) * radius * 0.65;
      const sparkY = bubble.y + Math.sin(angle) * radius * 0.65;
      ctx.fillStyle = 'rgba(180, 255, 220, 0.8)';
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, radius * 0.09, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * 绘制默认泡泡
   */
  drawDefaultBubble(ctx, bubble) {
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, bubble.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = bubble.color;
    ctx.fill();
    
    this.drawBubbleHighlight(ctx, bubble);
  }

  /**
   * 绘制泡泡高光
   */
  drawBubbleHighlight(ctx, bubble) {
    ctx.beginPath();
    ctx.arc(
      bubble.x - bubble.size / 6, 
      bubble.y - bubble.size / 6, 
      bubble.size / 8, 
      0, 
      Math.PI * 2
    );
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
    
    // 小高光
    ctx.beginPath();
    ctx.arc(
      bubble.x + bubble.size / 8, 
      bubble.y - bubble.size / 4, 
      bubble.size / 16, 
      0, 
      Math.PI * 2
    );
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fill();
  }
}

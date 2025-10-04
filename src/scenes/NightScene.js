/**
 * 夜晚星空场景
 * 静谧、梦幻、有发光元素的场景，包含小猫头鹰、小狐狸、小浣熊三个角色
 */

import { BaseScene } from './BaseScene.js';

export class NightScene extends BaseScene {
  constructor() {
    super('night', '夜晚星空');
    
    // 场景特色配置
    this.backgroundColor = '#191970'; // 深蓝紫色
    this.secondaryColor = '#483D8B'; // 深灰蓝色
    
    // 星空效果
    this.stars = [];
    this.starTime = 0;
    this.fireflies = [];
    this.moonPhase = 0;
    
    // 设置角色
    this.setupCharacters();
    
    // 背景元素
    this.setupBackgroundElements();
    
    // 初始化星空
    this.initStars();
    this.initFireflies();
  }

  /**
   * 设置场景角色
   */
  setupCharacters() {
    this.characters = [
      {
        id: 'owl',
        name: '小猫头鹰',
        emoji: '🦉',
        bubbleType: 'glow',
        bubbleSize: 55,
        bubbleColor: 'rgba(180, 140, 255, 0.8)', // 魔法紫罗兰色（神秘智慧）
        bubbleSpeed: 35,
        bubbleLife: 18,
        popEffect: 'star',
        glowIntensity: 0.8
      },
      {
        id: 'fox',
        name: '小狐狸',
        emoji: '🦊',
        bubbleType: 'trail',
        bubbleSize: 48,
        bubbleColor: 'rgba(255, 140, 100, 0.8)', // 温暖火焰橙金色（灵动活泼）
        bubbleSpeed: 45,
        bubbleLife: 14,
        popEffect: 'firefly',
        trailLength: 8
      },
      {
        id: 'raccoon',
        name: '小浣熊',
        emoji: '🦝',
        bubbleType: 'orbit',
        bubbleSize: 42,
        bubbleColor: 'rgba(100, 220, 255, 0.8)', // 星空青蓝色（清新明亮）
        bubbleSpeed: 40,
        bubbleLife: 16,
        popEffect: 'nut',
        orbitRadius: 25
      }
    ];
  }

  /**
   * 设置背景元素
   */
  setupBackgroundElements() {
    this.backgroundElements = [
      // 大月亮（更大更亮）
      {
        type: 'moon',
        x: 0.8,
        y: 0.15,
        size: 70,
        emoji: '🌙',
        glow: true
      },
      // 魔法城堡
      {
        type: 'castle',
        x: 0.15,
        y: 0.65,
        size: 50,
        emoji: '🏰',
        animated: true,
        twinkle: true
      },
      // 山峰剪影（更多）
      {
        type: 'mountain',
        x: 0.25,
        y: 0.72,
        size: 45,
        emoji: '⛰️'
      },
      {
        type: 'mountain',
        x: 0.5,
        y: 0.68,
        size: 42,
        emoji: '⛰️'
      },
      {
        type: 'mountain',
        x: 0.75,
        y: 0.75,
        size: 40,
        emoji: '⛰️'
      },
      // 树林剪影（更密集）
      {
        type: 'tree',
        x: 0.05,
        y: 0.8,
        size: 50,
        emoji: '🌲'
      },
      {
        type: 'tree',
        x: 0.15,
        y: 0.82,
        size: 48,
        emoji: '🌲'
      },
      {
        type: 'tree',
        x: 0.32,
        y: 0.78,
        size: 45,
        emoji: '🌲'
      },
      {
        type: 'tree',
        x: 0.42,
        y: 0.81,
        size: 47,
        emoji: '🌲'
      },
      {
        type: 'tree',
        x: 0.58,
        y: 0.79,
        size: 46,
        emoji: '🌲'
      },
      {
        type: 'tree',
        x: 0.68,
        y: 0.82,
        size: 49,
        emoji: '🌲'
      },
      {
        type: 'tree',
        x: 0.85,
        y: 0.8,
        size: 48,
        emoji: '🌲'
      },
      {
        type: 'tree',
        x: 0.95,
        y: 0.81,
        size: 45,
        emoji: '🌲'
      },
      // 飞行的蝙蝠
      {
        type: 'bat',
        x: 0.3,
        y: 0.3,
        size: 28,
        emoji: '🦇',
        animated: true,
        animSpeed: 1.5,
        flightPath: 'zigzag'
      },
      {
        type: 'bat',
        x: 0.7,
        y: 0.25,
        size: 25,
        emoji: '🦇',
        animated: true,
        animSpeed: 2.0,
        flightPath: 'circle'
      },
      // 夜间昆虫
      {
        type: 'moth',
        x: 0.4,
        y: 0.45,
        size: 20,
        emoji: '🦋',
        animated: true,
        animSpeed: 2.5,
        flutter: true
      },
      {
        type: 'moth',
        x: 0.6,
        y: 0.5,
        size: 18,
        emoji: '🦋',
        animated: true,
        animSpeed: 2.2,
        flutter: true
      },
      // 魔法蘑菇（发光）
      {
        type: 'mushroom',
        x: 0.2,
        y: 0.88,
        size: 25,
        emoji: '🍄',
        glow: true,
        glowColor: 'rgba(255, 100, 255, 0.6)'
      },
      {
        type: 'mushroom',
        x: 0.35,
        y: 0.9,
        size: 22,
        emoji: '🍄',
        glow: true,
        glowColor: 'rgba(100, 255, 255, 0.6)'
      },
      {
        type: 'mushroom',
        x: 0.65,
        y: 0.89,
        size: 24,
        emoji: '🍄',
        glow: true,
        glowColor: 'rgba(255, 255, 100, 0.6)'
      },
      {
        type: 'mushroom',
        x: 0.8,
        y: 0.91,
        size: 23,
        emoji: '🍄',
        glow: true,
        glowColor: 'rgba(255, 150, 255, 0.6)'
      }
    ];
  }

  /**
   * 初始化星星（更多更亮）
   */
  initStars() {
    this.stars = [];
    // 普通星星
    for (let i = 0; i < 150; i++) {
      this.stars.push({
        x: Math.random(),
        y: Math.random() * 0.7,
        size: Math.random() * 3 + 1,
        brightness: Math.random(),
        twinkleSpeed: Math.random() * 2 + 0.5,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: ['#FFFFFF', '#FFFFCC', '#CCFFFF', '#FFCCFF'][Math.floor(Math.random() * 4)]
      });
    }
    
    // 流星系统
    this.shootingStars = [];
    this.shootingStarTimer = 0;
    
    // 魔法粒子
    this.magicParticles = [];
    this.magicParticleTimer = 0;
  }

  /**
   * 初始化萤火虫（更多更炫）
   */
  initFireflies() {
    this.fireflies = [];
    const colors = [
      'rgba(255, 255, 100, ', // 黄色
      'rgba(100, 255, 255, ', // 青色
      'rgba(255, 100, 255, ', // 紫色
      'rgba(100, 255, 100, ', // 绿色
      'rgba(255, 200, 100, '  // 橙色
    ];
    
    for (let i = 0; i < 20; i++) {
      this.fireflies.push({
        x: Math.random(),
        y: 0.3 + Math.random() * 0.5,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        size: Math.random() * 8 + 5,
        brightness: Math.random(),
        glowPhase: Math.random() * Math.PI * 2,
        glowSpeed: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
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
    if (character.id === 'fox' && character.trailLength) {
      // 狐狸生成拖尾泡泡
      const bubble = super.generateBubbleForCharacter(character, x, y);
      if (bubble) {
        bubble.trail = [];
        bubble.trailLength = character.trailLength;
      }
      return bubble;
    } else if (character.id === 'raccoon') {
      // 浣熊生成轨道泡泡
      const bubble = super.generateBubbleForCharacter(character, x, y);
      if (bubble) {
        bubble.orbitAngle = 0;
        bubble.orbitRadius = character.orbitRadius;
        bubble.orbitSpeed = 2;
      }
      return bubble;
    } else {
      // 猫头鹰生成发光泡泡
      return super.generateBubbleForCharacter(character, x, y);
    }
  }

  /**
   * 获取动物可用的行为列表（重写基类方法）
   * @param {Object} character - 角色对象
   * @returns {Array} 行为列表
   */
  getAnimalBehaviors(character) {
    switch (character.id) {
      case 'owl': // 🦉 猫头鹰
        return ['idle', 'flying', 'hunting', 'perching', 'hooting'];
      case 'fox': // 🦊 狐狸
        return ['idle', 'prowling', 'hunting', 'howling', 'playing'];
      case 'raccoon': // 🦝 浣熊
        return ['idle', 'foraging', 'climbing', 'washing', 'exploring'];
      default:
        return super.getAnimalBehaviors(character);
    }
  }

  /**
   * 获取角色位置（重写基类方法以实现夜晚分层定位）
   * @param {Object} character - 角色对象
   * @returns {Object} 包含x和y坐标的对象
   */
  getCharacterPosition(character) {
    const time = Date.now() / 1000;
    const currentBehavior = this.animalBehaviors.get(character.id) || 'idle';
    let x = this.width / 2;
    let y = this.height * 0.8;
    
    // 根据角色类型确定合适的活动空间
    switch (character.id) {
      case 'owl': // 🦉 猫头鹰 - 高空层，在树梢间飞行
        x = this.width * 0.2;
        y = this.height * 0.15;
        
        switch (currentBehavior) {
          case 'flying':
            x += Math.sin(time * 0.3) * this.width * 0.6;
            y += Math.sin(time * 0.4) * this.height * 0.1;
            break;
          case 'hunting':
            x += Math.sin(time * 0.8) * this.width * 0.4;
            y += Math.abs(Math.sin(time * 1.2)) * 80; // 俯冲捕猎
            break;
          case 'perching':
            x = this.width * 0.1 + Math.sin(time * 0.1) * 20; // 栖息在树枝上
            y = this.height * 0.2;
            break;
          case 'hooting':
            y -= Math.sin(time * 3) * 15; // 叫声时头部摆动
            x += Math.sin(time * 0.2) * this.width * 0.3;
            break;
          default:
            x += Math.sin(time * 0.2) * this.width * 0.4;
            y += Math.sin(time * 0.3) * 30;
        }
        break;
        
      case 'fox': // 🦊 狐狸 - 地面层，在草地上漫步
        x = this.width * 0.3;
        y = this.height * 0.8;
        
        switch (currentBehavior) {
          case 'prowling':
            x += Math.sin(time * 0.6) * this.width * 0.4;
            y += Math.sin(time * 0.2) * 20; // 潜行时身体稍低
            break;
          case 'hunting':
            x += Math.sin(time * 1.0) * this.width * 0.3;
            y -= Math.abs(Math.sin(time * 2)) * 30; // 跳跃捕猎
            break;
          case 'howling':
            y -= 40; // 嚎叫时抬头
            x += Math.sin(time * 0.1) * 20;
            break;
          case 'playing':
            x += Math.sin(time * 1.5) * this.width * 0.2;
            y -= Math.abs(Math.sin(time * 2.5)) * 50; // 玩耍跳跃
            break;
          default:
            x += Math.sin(time * 0.4) * this.width * 0.2;
            y += Math.sin(time * 0.3) * 15;
        }
        break;
        
      case 'raccoon': // 🦝 浣熊 - 地面层，偶尔爬到低矮的树上
        x = this.width * 0.4;
        y = this.height * 0.75;
        
        switch (currentBehavior) {
          case 'foraging':
            x += Math.sin(time * 0.5) * this.width * 0.3;
            y += Math.sin(time * 0.8) * 25; // 觅食时上下搜寻
            break;
          case 'climbing':
            y = this.height * (0.4 + Math.sin(time * 0.3) * 0.2); // 爬树
            x += Math.sin(time * 0.4) * this.width * 0.2;
            break;
          case 'washing':
            x = this.width * 0.15 + Math.sin(time * 2) * 30; // 在水边洗手
            y = this.height * 0.85;
            break;
          case 'exploring':
            x += Math.sin(time * 0.7) * this.width * 0.4;
            y += Math.sin(time * 0.5) * 40; // 探索时活跃移动
            break;
          default:
            x += Math.sin(time * 0.3) * this.width * 0.2;
            y += Math.sin(time * 0.2) * 20;
        }
        break;
        
      default:
        // 调用父类方法
        return super.getCharacterPosition(character);
    }
    
    return { x, y };
  }

  /**
   * 更新场景
   */
  update(deltaTime) {
    super.update(deltaTime);
    
    // 更新星空效果
    this.starTime += deltaTime;
    this.moonPhase += deltaTime * 0.5;
    
    // 更新萤火虫
    this.updateFireflies(deltaTime);
    
    // 更新流星
    this.updateShootingStars(deltaTime);
    
    // 更新魔法粒子
    this.updateMagicParticles(deltaTime);
  }
  
  /**
   * 更新流星
   */
  updateShootingStars(deltaTime) {
    // 定期生成新流星
    this.shootingStarTimer += deltaTime;
    if (this.shootingStarTimer > 3 && this.shootingStars.length < 3) {
      this.shootingStars.push({
        x: Math.random() * 0.5 + 0.5, // 从右侧开始
        y: Math.random() * 0.3,
        vx: -0.4 - Math.random() * 0.2,
        vy: 0.2 + Math.random() * 0.1,
        length: 50 + Math.random() * 50,
        brightness: 0.8 + Math.random() * 0.2,
        life: 1.5,
        age: 0
      });
      this.shootingStarTimer = 0;
    }
    
    // 更新流星位置
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const star = this.shootingStars[i];
      star.x += star.vx * deltaTime;
      star.y += star.vy * deltaTime;
      star.age += deltaTime;
      
      if (star.age >= star.life || star.x < -0.2 || star.y > 1) {
        this.shootingStars.splice(i, 1);
      }
    }
  }
  
  /**
   * 更新魔法粒子
   */
  updateMagicParticles(deltaTime) {
    // 定期生成魔法粒子
    this.magicParticleTimer += deltaTime;
    if (this.magicParticleTimer > 0.1 && this.magicParticles.length < 50) {
      const colors = [
        'rgba(255, 100, 255, ',
        'rgba(100, 255, 255, ',
        'rgba(255, 255, 100, ',
        'rgba(255, 150, 200, ',
        'rgba(150, 255, 200, '
      ];
      
      this.magicParticles.push({
        x: Math.random(),
        y: 0.6 + Math.random() * 0.4,
        vx: (Math.random() - 0.5) * 0.05,
        vy: -0.03 - Math.random() * 0.05,
        size: 3 + Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 3 + Math.random() * 2,
        age: 0,
        twinkle: Math.random() * Math.PI * 2
      });
      this.magicParticleTimer = 0;
    }
    
    // 更新粒子
    for (let i = this.magicParticles.length - 1; i >= 0; i--) {
      const particle = this.magicParticles[i];
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      particle.age += deltaTime;
      particle.twinkle += deltaTime * 5;
      
      if (particle.age >= particle.life || particle.y < -0.1) {
        this.magicParticles.splice(i, 1);
      }
    }
  }

  /**
   * 更新萤火虫
   */
  updateFireflies(deltaTime) {
    this.fireflies.forEach(firefly => {
      // 移动
      firefly.x += firefly.vx * deltaTime;
      firefly.y += firefly.vy * deltaTime;
      
      // 边界反弹
      if (firefly.x <= 0 || firefly.x >= 1) {
        firefly.vx *= -1;
        firefly.x = Math.max(0, Math.min(1, firefly.x));
      }
      if (firefly.y <= 0.3 || firefly.y >= 0.8) {
        firefly.vy *= -1;
        firefly.y = Math.max(0.3, Math.min(0.8, firefly.y));
      }
      
      // 随机改变方向
      if (Math.random() < 0.02) {
        firefly.vx += (Math.random() - 0.5) * 0.05;
        firefly.vy += (Math.random() - 0.5) * 0.05;
        
        // 限制速度
        const speed = Math.sqrt(firefly.vx * firefly.vx + firefly.vy * firefly.vy);
        if (speed > 0.1) {
          firefly.vx = (firefly.vx / speed) * 0.1;
          firefly.vy = (firefly.vy / speed) * 0.1;
        }
      }
      
      // 更新发光效果
      firefly.glowPhase += firefly.glowSpeed * deltaTime;
      firefly.brightness = (Math.sin(firefly.glowPhase) + 1) / 2;
    });
  }

  /**
   * 更新泡泡状态（重写以支持夜空特殊效果）
   */
  updateBubbles(deltaTime) {
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const bubble = this.bubbles[i];
      
      // 更新泡泡年龄
      bubble.age += deltaTime;
      
      // 根据角色类型更新位置
      if (bubble.character === 'fox' && bubble.trail !== undefined) {
        // 狐狸泡泡：拖尾效果
        bubble.trail.push({ x: bubble.x, y: bubble.y });
        if (bubble.trail.length > bubble.trailLength) {
          bubble.trail.shift();
        }
        
        bubble.y -= bubble.speed * deltaTime;
        bubble.x = bubble.startX + Math.sin(bubble.age * 1.5) * 20;
      } else if (bubble.character === 'raccoon' && bubble.orbitAngle !== undefined) {
        // 浣熊泡泡：轨道运动
        bubble.orbitAngle += bubble.orbitSpeed * deltaTime;
        bubble.y -= bubble.speed * deltaTime * 0.7;
        bubble.x = bubble.startX + Math.cos(bubble.orbitAngle) * bubble.orbitRadius;
      } else {
        // 猫头鹰泡泡：缓慢发光上升
        bubble.y -= bubble.speed * deltaTime;
        bubble.x = bubble.startX + Math.sin(bubble.age * 0.8) * 15;
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
   * 渲染背景
   */
  renderBackground(ctx, width, height) {
    // 夜空渐变
    const gradient = ctx.createRadialGradient(
      width * 0.8, height * 0.15, 0,
      width * 0.8, height * 0.15, width
    );
    gradient.addColorStop(0, '#2F4F4F');  // 暗灰绿
    gradient.addColorStop(0.3, '#191970'); // 深蓝紫
    gradient.addColorStop(0.7, '#0f0f23'); // 深紫
    gradient.addColorStop(1, '#000011');   // 近黑
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  /**
   * 渲染背景元素
   */
  renderBackgroundElements(ctx) {
    // 绘制北极光效果
    this.renderAurora(ctx);
    
    // 绘制星星
    this.renderStars(ctx);
    
    // 绘制流星
    this.renderShootingStars(ctx);
    
    // 绘制萤火虫
    this.renderFireflies(ctx);
    
    // 绘制魔法粒子
    this.renderMagicParticles(ctx);
    
    // 绘制山峰和树木剪影
    this.renderSilhouettes(ctx);
    
    // 绘制动态元素（蝙蝠、飞蛾等）
    this.renderDynamicElements(ctx);
    
    // 绘制月亮（带光晕）
    this.renderMoon(ctx);
  }
  
  /**
   * 渲染北极光
   */
  renderAurora(ctx) {
    const time = Date.now() / 1000;
    ctx.save();
    
    for (let i = 0; i < 3; i++) {
      const offset = i * 0.3;
      const gradient = ctx.createLinearGradient(
        0, this.height * 0.2,
        0, this.height * 0.5
      );
      
      const colors = [
        ['rgba(100, 255, 200, ', 'rgba(100, 200, 255, '],
        ['rgba(255, 100, 200, ', 'rgba(200, 100, 255, '],
        ['rgba(200, 255, 100, ', 'rgba(255, 200, 100, ']
      ];
      
      const colorPair = colors[i % colors.length];
      const alpha = 0.05 + Math.sin(time * 0.5 + offset) * 0.03;
      
      gradient.addColorStop(0, colorPair[0] + alpha + ')');
      gradient.addColorStop(0.5, colorPair[1] + (alpha * 0.5) + ')');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      
      ctx.moveTo(0, this.height * 0.2);
      for (let x = 0; x <= this.width; x += 50) {
        const y = this.height * 0.25 + 
                 Math.sin((x / this.width) * Math.PI * 4 + time + offset) * 30;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(this.width, this.height * 0.5);
      ctx.lineTo(0, this.height * 0.5);
      ctx.closePath();
      ctx.fill();
    }
    
    ctx.restore();
  }
  
  /**
   * 渲染流星
   */
  renderShootingStars(ctx) {
    ctx.save();
    
    this.shootingStars.forEach(star => {
      const x = star.x * this.width;
      const y = star.y * this.height;
      const opacity = star.brightness * (1 - star.age / star.life);
      
      // 流星尾迹
      const gradient = ctx.createLinearGradient(
        x, y,
        x - star.vx * star.length, y - star.vy * star.length
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
      gradient.addColorStop(0.5, `rgba(200, 220, 255, ${opacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - star.vx * star.length, y - star.vy * star.length);
      ctx.stroke();
      
      // 流星头部
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.restore();
  }
  
  /**
   * 渲染魔法粒子
   */
  renderMagicParticles(ctx) {
    ctx.save();
    
    this.magicParticles.forEach(particle => {
      const x = particle.x * this.width;
      const y = particle.y * this.height;
      const opacity = (1 - particle.age / particle.life) * 
                     (Math.sin(particle.twinkle) * 0.3 + 0.7);
      
      // 粒子光晕
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, particle.size * 2);
      gradient.addColorStop(0, particle.color + opacity + ')');
      gradient.addColorStop(0.5, particle.color + (opacity * 0.3) + ')');
      gradient.addColorStop(1, particle.color + '0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, particle.size * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // 粒子核心
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, particle.size / 2, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.restore();
  }
  
  /**
   * 渲染动态元素（蝙蝠、飞蛾、魔法蘑菇等）
   */
  renderDynamicElements(ctx) {
    const time = Date.now() / 1000;
    
    this.backgroundElements.forEach(element => {
      if (element.type === 'moon' || element.type === 'mountain' || element.type === 'tree') {
        return; // 这些元素稍后单独渲染
      }
      
      let x = element.x * this.width;
      let y = element.y * this.height;
      
      ctx.save();
      
      // 蝙蝠飞行
      if (element.type === 'bat' && element.animated) {
        const baseX = element.x * this.width;
        const baseY = element.y * this.height;
        
        if (element.flightPath === 'zigzag') {
          x = baseX + Math.sin(time * element.animSpeed * 2) * 150;
          y = baseY + (time * element.animSpeed * 20) % 100 - 50;
        } else if (element.flightPath === 'circle') {
          const radius = 120;
          x = baseX + Math.cos(time * element.animSpeed) * radius;
          y = baseY + Math.sin(time * element.animSpeed) * radius * 0.6;
        }
      }
      
      // 飞蛾飞舞
      if (element.type === 'moth' && element.flutter) {
        x += Math.sin(time * element.animSpeed) * 60;
        y += Math.cos(time * element.animSpeed * 1.5) * 40;
      }
      
      // 魔法蘑菇发光
      if (element.type === 'mushroom' && element.glow) {
        const glowIntensity = 0.7 + Math.sin(time * 2) * 0.3;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, element.size * 1.5);
        gradient.addColorStop(0, element.glowColor.replace('0.6', String(glowIntensity * 0.8)));
        gradient.addColorStop(1, element.glowColor.replace('0.6', '0'));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, element.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // 城堡闪烁
      if (element.type === 'castle' && element.twinkle) {
        ctx.globalAlpha = 0.6 + Math.sin(time * 3) * 0.4;
        
        // 城堡窗户发光
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, element.size);
        gradient.addColorStop(0, 'rgba(255, 255, 150, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 150, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, element.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 1;
      }
      
      // 绘制元素
      ctx.font = `${element.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(element.emoji, x, y);
      
      ctx.restore();
    });
  }

  /**
   * 渲染星星（彩色闪烁）
   */
  renderStars(ctx) {
    ctx.save();
    
    this.stars.forEach(star => {
      const x = star.x * this.width;
      const y = star.y * this.height;
      
      // 闪烁效果
      const twinkle = Math.sin(this.starTime * star.twinkleSpeed + star.twinkleOffset);
      const alpha = star.brightness * (0.4 + 0.6 * (twinkle + 1) / 2);
      
      // 星星光晕
      if (star.size > 1.5) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, star.size * 3);
        const hexColor = star.color;
        const rgb = [
          parseInt(hexColor.substr(1, 2), 16),
          parseInt(hexColor.substr(3, 2), 16),
          parseInt(hexColor.substr(5, 2), 16)
        ];
        gradient.addColorStop(0, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha * 0.6})`);
        gradient.addColorStop(0.5, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha * 0.2})`);
        gradient.addColorStop(1, `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, star.size * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.globalAlpha = alpha;
      ctx.fillStyle = star.color;
      
      // 绘制星星
      ctx.beginPath();
      ctx.arc(x, y, star.size, 0, Math.PI * 2);
      ctx.fill();
      
      // 大星星增加十字光芒
      if (star.size > 2) {
        ctx.strokeStyle = star.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = alpha * 0.6;
        
        ctx.beginPath();
        ctx.moveTo(x - star.size * 3, y);
        ctx.lineTo(x + star.size * 3, y);
        ctx.moveTo(x, y - star.size * 3);
        ctx.lineTo(x, y + star.size * 3);
        ctx.stroke();
      }
    });
    
    ctx.restore();
  }

  /**
   * 渲染萤火虫（多彩发光）
   */
  renderFireflies(ctx) {
    ctx.save();
    
    this.fireflies.forEach(firefly => {
      const x = firefly.x * this.width;
      const y = firefly.y * this.height;
      
      // 发光效果（多彩）
      const glowSize = firefly.size + firefly.brightness * 15;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
      gradient.addColorStop(0, firefly.color + (firefly.brightness * 0.9) + ')');
      gradient.addColorStop(0.3, firefly.color + (firefly.brightness * 0.6) + ')');
      gradient.addColorStop(0.6, firefly.color + (firefly.brightness * 0.3) + ')');
      gradient.addColorStop(1, firefly.color + '0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, glowSize, 0, Math.PI * 2);
      ctx.fill();
      
      // 外层光环
      ctx.strokeStyle = firefly.color + (firefly.brightness * 0.5) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, firefly.size, 0, Math.PI * 2);
      ctx.stroke();
      
      // 核心光点
      ctx.fillStyle = `rgba(255, 255, 255, ${firefly.brightness})`;
      ctx.beginPath();
      ctx.arc(x, y, firefly.size / 3, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.restore();
  }

  /**
   * 渲染剪影
   */
  renderSilhouettes(ctx) {
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = '#000000';
    
    this.backgroundElements.forEach(element => {
      if (element.type !== 'moon') {
        const x = element.x * this.width;
        const y = element.y * this.height;
        
        ctx.font = `${element.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(element.emoji, x, y);
      }
    });
    
    ctx.restore();
  }

  /**
   * 渲染月亮
   */
  renderMoon(ctx) {
    const moonElement = this.backgroundElements.find(e => e.type === 'moon');
    if (!moonElement) return;
    
    const x = moonElement.x * this.width;
    const y = moonElement.y * this.height;
    
    ctx.save();
    
    // 月亮光晕
    const glowSize = moonElement.size * 2;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
    gradient.addColorStop(0, 'rgba(255, 255, 224, 0.3)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 224, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 224, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, glowSize, 0, Math.PI * 2);
    ctx.fill();
    
    // 月亮本体
    ctx.font = `${moonElement.size}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFAF0';
    ctx.fillText(moonElement.emoji, x, y);
    
    ctx.restore();
  }

  /**
   * 渲染泡泡（重写以支持夜空效果）
   */
  renderBubbles(ctx) {
    this.bubbles.forEach(bubble => {
      ctx.save();
      ctx.globalAlpha = bubble.opacity;
      
      // 根据角色类型绘制不同的泡泡效果
      if (bubble.character === 'owl') {
        this.drawGlowBubble(ctx, bubble);
      } else if (bubble.character === 'fox') {
        this.drawTrailBubble(ctx, bubble);
      } else if (bubble.character === 'raccoon') {
        this.drawOrbitBubble(ctx, bubble);
      }
      
      ctx.restore();
    });
  }

  /**
   * 绘制发光泡泡（猫头鹰 - 魔法紫罗兰色）
   */
  drawGlowBubble(ctx, bubble) {
    const radius = bubble.size / 2;
    
    // 外层魔法光晕
    const glowGradient = ctx.createRadialGradient(
      bubble.x, bubble.y, radius * 0.5,
      bubble.x, bubble.y, radius * 2
    );
    glowGradient.addColorStop(0, 'rgba(200, 170, 255, 0.6)');
    glowGradient.addColorStop(0.5, 'rgba(180, 140, 255, 0.4)');
    glowGradient.addColorStop(1, 'rgba(150, 100, 255, 0)');
    
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // 主体泡泡（紫罗兰渐变）
    const mainGradient = ctx.createRadialGradient(
      bubble.x - radius * 0.3, bubble.y - radius * 0.3, radius * 0.1,
      bubble.x, bubble.y, radius
    );
    mainGradient.addColorStop(0, 'rgba(230, 210, 255, 0.95)');
    mainGradient.addColorStop(0.5, bubble.color);
    mainGradient.addColorStop(1, 'rgba(150, 110, 230, 0.75)');
    
    ctx.fillStyle = mainGradient;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 魔法光环
    ctx.strokeStyle = 'rgba(200, 160, 255, 0.7)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.strokeStyle = 'rgba(220, 180, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius + 4, 0, Math.PI * 2);
    ctx.stroke();
    
    // 内圈亮边
    ctx.strokeStyle = 'rgba(240, 220, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bubble.x - radius * 0.2, bubble.y - radius * 0.2, radius * 0.6, 0, Math.PI);
    ctx.stroke();
    
    this.drawBubbleHighlight(ctx, bubble);
    
    // 魔法星光
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3 + Date.now() / 1000;
      const sparkX = bubble.x + Math.cos(angle) * radius * 0.6;
      const sparkY = bubble.y + Math.sin(angle) * radius * 0.6;
      ctx.fillStyle = 'rgba(255, 230, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, radius * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * 绘制拖尾泡泡（狐狸 - 火焰橙金色）
   */
  drawTrailBubble(ctx, bubble) {
    const radius = bubble.size / 2;
    
    // 绘制火焰拖尾
    if (bubble.trail && bubble.trail.length > 1) {
      for (let i = 0; i < bubble.trail.length - 1; i++) {
        const alpha = (i / bubble.trail.length) * bubble.opacity;
        const trailRadius = radius * (0.3 + (i / bubble.trail.length) * 0.7);
        
        const gradient = ctx.createRadialGradient(
          bubble.trail[i].x, bubble.trail[i].y, 0,
          bubble.trail[i].x, bubble.trail[i].y, trailRadius
        );
        gradient.addColorStop(0, `rgba(255, 180, 120, ${alpha * 0.8})`);
        gradient.addColorStop(0.5, `rgba(255, 140, 100, ${alpha * 0.5})`);
        gradient.addColorStop(1, `rgba(255, 100, 60, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(bubble.trail[i].x, bubble.trail[i].y, trailRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // 外层火焰光晕
    const glowGradient = ctx.createRadialGradient(
      bubble.x, bubble.y, radius * 0.6,
      bubble.x, bubble.y, radius * 1.5
    );
    glowGradient.addColorStop(0, 'rgba(255, 180, 100, 0.5)');
    glowGradient.addColorStop(0.6, 'rgba(255, 140, 80, 0.3)');
    glowGradient.addColorStop(1, 'rgba(255, 100, 50, 0)');
    
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // 主体泡泡（橙金渐变）
    const mainGradient = ctx.createRadialGradient(
      bubble.x - radius * 0.3, bubble.y - radius * 0.3, radius * 0.1,
      bubble.x, bubble.y, radius
    );
    mainGradient.addColorStop(0, 'rgba(255, 220, 180, 0.95)');
    mainGradient.addColorStop(0.5, bubble.color);
    mainGradient.addColorStop(1, 'rgba(255, 120, 70, 0.75)');
    
    ctx.fillStyle = mainGradient;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 火焰光环
    ctx.strokeStyle = 'rgba(255, 160, 90, 0.7)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.strokeStyle = 'rgba(255, 200, 130, 0.4)';
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
    
    // 火花闪烁
    const sparkleCount = 2;
    for (let i = 0; i < sparkleCount; i++) {
      const angle = (i * Math.PI * 2) / sparkleCount + Date.now() / 500;
      const sparkX = bubble.x + Math.cos(angle) * radius * 0.7;
      const sparkY = bubble.y + Math.sin(angle) * radius * 0.7;
      ctx.fillStyle = 'rgba(255, 230, 150, 0.9)';
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, radius * 0.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * 绘制轨道泡泡（浣熊 - 星空青蓝色）
   */
  drawOrbitBubble(ctx, bubble) {
    const radius = bubble.size / 2;
    
    // 绘制发光轨道路径
    if (bubble.orbitAngle !== undefined) {
      ctx.save();
      
      // 轨道光晕
      const orbitGradient = ctx.createRadialGradient(
        bubble.startX, bubble.y, 0,
        bubble.startX, bubble.y, bubble.orbitRadius + 10
      );
      orbitGradient.addColorStop(0, 'rgba(100, 220, 255, 0)');
      orbitGradient.addColorStop(0.8, 'rgba(100, 220, 255, 0.1)');
      orbitGradient.addColorStop(1, 'rgba(100, 220, 255, 0)');
      
      ctx.fillStyle = orbitGradient;
      ctx.beginPath();
      ctx.arc(bubble.startX, bubble.y, bubble.orbitRadius + 10, 0, Math.PI * 2);
      ctx.fill();
      
      // 轨道虚线
      ctx.strokeStyle = 'rgba(150, 230, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.arc(bubble.startX, bubble.y, bubble.orbitRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.restore();
    }
    
    // 外层星光光晕
    const glowGradient = ctx.createRadialGradient(
      bubble.x, bubble.y, radius * 0.6,
      bubble.x, bubble.y, radius * 1.6
    );
    glowGradient.addColorStop(0, 'rgba(150, 230, 255, 0.5)');
    glowGradient.addColorStop(0.6, 'rgba(100, 220, 255, 0.3)');
    glowGradient.addColorStop(1, 'rgba(80, 200, 255, 0)');
    
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius * 1.6, 0, Math.PI * 2);
    ctx.fill();
    
    // 主体泡泡（星空青蓝渐变）
    const mainGradient = ctx.createRadialGradient(
      bubble.x - radius * 0.3, bubble.y - radius * 0.3, radius * 0.1,
      bubble.x, bubble.y, radius
    );
    mainGradient.addColorStop(0, 'rgba(220, 245, 255, 0.95)');
    mainGradient.addColorStop(0.5, bubble.color);
    mainGradient.addColorStop(1, 'rgba(70, 190, 240, 0.75)');
    
    ctx.fillStyle = mainGradient;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 冰晶光环
    ctx.strokeStyle = 'rgba(150, 230, 255, 0.8)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.strokeStyle = 'rgba(180, 240, 255, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(bubble.x, bubble.y, radius + 3, 0, Math.PI * 2);
    ctx.stroke();
    
    // 内圈亮边
    ctx.strokeStyle = 'rgba(240, 250, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bubble.x - radius * 0.2, bubble.y - radius * 0.2, radius * 0.6, 0, Math.PI);
    ctx.stroke();
    
    this.drawBubbleHighlight(ctx, bubble);
    
    // 星光闪烁（菱形排列）
    const sparkleCount = 4;
    for (let i = 0; i < sparkleCount; i++) {
      const angle = (i * Math.PI * 2) / sparkleCount;
      const sparkX = bubble.x + Math.cos(angle) * radius * 0.5;
      const sparkY = bubble.y + Math.sin(angle) * radius * 0.5;
      ctx.fillStyle = 'rgba(200, 240, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, radius * 0.07, 0, Math.PI * 2);
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
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fill();
  }
}

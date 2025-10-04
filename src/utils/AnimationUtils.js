/**
 * 动画工具类
 * 使用GSAP库实现各种动画效果
 */

// 临时移除GSAP依赖，使用简单动画
// import { gsap } from 'gsap';

export class AnimationUtils {
  static initialized = false;

  /**
   * 初始化动画配置
   */
  static init() {
    if (this.initialized) return;
    
    this.initialized = true;
    console.log('动画系统已初始化（简化版）');
  }

  /**
   * 角色入场动画
   * @param {HTMLElement|Object} target - 动画目标
   * @param {Function} onComplete - 完成回调
   */
  static characterEnterAnimation(target, onComplete) {
    const tl = gsap.timeline();
    
    // 从下方弹入
    tl.fromTo(target, 
      { 
        y: 100, 
        opacity: 0, 
        scale: 0.3,
        rotation: -10
      },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      }
    );
    
    // 轻微弹跳
    tl.to(target, {
      y: -10,
      duration: 0.2,
      ease: "power2.out"
    });
    
    tl.to(target, {
      y: 0,
      duration: 0.3,
      ease: "bounce.out",
      onComplete: onComplete
    });
    
    return tl;
  }

  /**
   * 角色退场动画
   * @param {HTMLElement|Object} target - 动画目标
   * @param {Function} onComplete - 完成回调
   */
  static characterExitAnimation(target, onComplete) {
    const tl = gsap.timeline();
    
    // 向上飞出并旋转
    tl.to(target, {
      y: -100,
      opacity: 0,
      scale: 0.5,
      rotation: 20,
      duration: 0.6,
      ease: "power2.in",
      onComplete: onComplete
    });
    
    return tl;
  }

  /**
   * 泡泡生成动画
   * @param {Object} bubble - 泡泡对象
   * @param {Function} onComplete - 完成回调
   */
  static bubbleCreateAnimation(bubble, onComplete) {
    const tl = gsap.timeline();
    
    // 从小到大弹性出现
    tl.fromTo(bubble,
      {
        scale: 0,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(2)",
        onComplete: onComplete
      }
    );
    
    return tl;
  }

  /**
   * 泡泡破裂动画（简化版）
   * @param {Object} bubble - 泡泡对象
   * @param {Function} onComplete - 完成回调
   */
  static bubblePopAnimation(bubble, onComplete) {
    // 简化版动画：立即执行回调
    if (onComplete) {
      setTimeout(onComplete, 50);
    }
    
    console.log('泡泡破裂动画（简化版）');
    return { kill: () => {} }; // 返回空对象兼容原接口
  }

  /**
   * 创建破裂粒子效果
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   */
  static createPopParticles(x, y) {
    // 创建虚拟粒子对象用于动画
    const particleCount = 8;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 50 + Math.random() * 30;
      
      const particle = {
        x: x,
        y: y,
        targetX: x + Math.cos(angle) * distance,
        targetY: y + Math.sin(angle) * distance,
        opacity: 1,
        scale: 1
      };
      
      particles.push(particle);
      
      // 粒子飞散动画
      gsap.to(particle, {
        x: particle.targetX,
        y: particle.targetY,
        opacity: 0,
        scale: 0.5,
        duration: 0.8,
        ease: "power2.out"
      });
    }
    
    return particles;
  }

  /**
   * UI按钮点击动画
   * @param {HTMLElement|Object} target - 动画目标
   * @param {Function} onComplete - 完成回调
   */
  static buttonClickAnimation(target, onComplete) {
    const tl = gsap.timeline();
    
    // 按下效果
    tl.to(target, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.out"
    });
    
    // 弹起效果
    tl.to(target, {
      scale: 1.1,
      duration: 0.15,
      ease: "power2.out"
    });
    
    // 恢复正常
    tl.to(target, {
      scale: 1,
      duration: 0.1,
      ease: "power2.out",
      onComplete: onComplete
    });
    
    return tl;
  }

  /**
   * 鼓励效果动画（简化版）
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   * @param {string} text - 鼓励文字
   */
  static encouragementAnimation(x, y, text) {
    // 创建虚拟文字对象
    const textObj = {
      x: x,
      y: y,
      opacity: 1,
      scale: 1,
      text: text
    };
    
    // 简化版：3秒后自动清除
    setTimeout(() => {
      textObj.opacity = 0;
    }, 3000);
    
    console.log('鼓励动画（简化版）:', text);
    return { 
      timeline: { call: (fn) => setTimeout(fn, 3000) }, 
      textObject: textObj 
    };
  }

  /**
   * 场景切换动画
   * @param {Function} onMidpoint - 中间点回调（用于切换场景）
   * @param {Function} onComplete - 完成回调
   */
  static sceneTransitionAnimation(onMidpoint, onComplete) {
    const overlay = {
      opacity: 0,
      scale: 0
    };
    
    const tl = gsap.timeline();
    
    // 淡入覆盖层
    tl.to(overlay, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "power2.out"
    });
    
    // 中间点：切换场景
    tl.call(onMidpoint);
    
    // 淡出覆盖层
    tl.to(overlay, {
      opacity: 0,
      scale: 1.2,
      duration: 0.4,
      ease: "power2.in",
      onComplete: onComplete
    });
    
    return { timeline: tl, overlay: overlay };
  }

  /**
   * 背景元素浮动动画
   * @param {Object} element - 背景元素
   */
  static floatingAnimation(element) {
    if (!element.floating) {
      element.floating = true;
      
      // 无限循环的浮动动画
      gsap.to(element, {
        y: element.y + (Math.random() - 0.5) * 20,
        duration: 2 + Math.random() * 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
      
      // 轻微的旋转
      gsap.to(element, {
        rotation: (Math.random() - 0.5) * 10,
        duration: 3 + Math.random() * 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    }
  }

  /**
   * 停止所有动画
   */
  static stopAllAnimations() {
    gsap.killTweensOf("*");
  }

  /**
   * 暂停所有动画
   */
  static pauseAllAnimations() {
    gsap.globalTimeline.pause();
  }

  /**
   * 恢复所有动画
   */
  static resumeAllAnimations() {
    gsap.globalTimeline.resume();
  }

  /**
   * 设置动画时间比例（用于调试）
   * @param {number} scale - 时间比例（1为正常速度）
   */
  static setTimeScale(scale) {
    gsap.globalTimeline.timeScale(scale);
  }
}

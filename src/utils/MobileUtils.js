/**
 * 移动端适配工具类
 * 处理移动设备的特殊需求和优化
 */

export class MobileUtils {
  static initialized = false;

  /**
   * 初始化移动端适配
   */
  static init() {
    if (this.initialized) return;
    
    this.setupViewport();
    this.setupOrientationHandling();
    this.setupWeChatOptimization();
    this.setupPreventZoom();
    
    this.initialized = true;
    console.log('移动端适配已初始化');
  }

  /**
   * 设置视口
   */
  static setupViewport() {
    // 动态设置viewport meta标签
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      document.head.appendChild(viewport);
    }
    
    viewport.content = 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover, maximum-scale=1.0, minimum-scale=1.0';
    
    // 防止页面滚动
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  /**
   * 设置屏幕方向处理
   */
  static setupOrientationHandling() {
    // 监听屏幕方向变化
    if (screen.orientation) {
      screen.orientation.addEventListener('change', this.handleOrientationChange);
    } else {
      // 兼容旧版浏览器
      window.addEventListener('orientationchange', this.handleOrientationChange);
    }
    
    // 初始检查
    this.handleOrientationChange();
  }

  /**
   * 处理屏幕方向变化
   */
  static handleOrientationChange() {
    const canvas = document.getElementById('gameCanvas');
    const orientationHint = document.querySelector('.orientation-hint');
    
    if (!canvas || !orientationHint) return;
    
    // 检测是否为移动设备
    const isMobile = this.isMobileDevice();
    
    if (isMobile) {
      const isPortrait = window.innerHeight > window.innerWidth;
      
      if (isPortrait) {
        // 竖屏：显示提示，隐藏游戏
        orientationHint.style.display = 'flex';
        canvas.style.display = 'none';
        console.log('检测到竖屏模式，显示横屏提示');
      } else {
        // 横屏：隐藏提示，显示游戏
        orientationHint.style.display = 'none';
        canvas.style.display = 'block';
        console.log('检测到横屏模式，显示游戏');
        
        // 触发窗口大小变化事件
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 100);
      }
    } else {
      // 桌面设备：始终显示游戏
      orientationHint.style.display = 'none';
      canvas.style.display = 'block';
    }
  }

  /**
   * 微信浏览器优化
   */
  static setupWeChatOptimization() {
    if (this.isWeChat()) {
      console.log('检测到微信浏览器，应用微信优化');
      
      // 防止微信下拉刷新
      document.addEventListener('touchmove', function(e) {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }, { passive: false });
      
      // 防止微信浏览器的橡皮筋效果
      document.body.addEventListener('touchstart', function (e) {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }, { passive: false });
      
      document.body.addEventListener('touchend', function (e) {
        if (e.touches.length > 0) {
          e.preventDefault();
        }
      }, { passive: false });
      
      // 隐藏微信浏览器的状态栏（如果可能）
      this.hideWeChatStatusBar();
    }
  }

  /**
   * 防止缩放
   */
  static setupPreventZoom() {
    // 防止双击缩放
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, { passive: false });
    
    // 防止手势缩放
    document.addEventListener('gesturestart', function (e) {
      e.preventDefault();
    });
    
    document.addEventListener('gesturechange', function (e) {
      e.preventDefault();
    });
    
    document.addEventListener('gestureend', function (e) {
      e.preventDefault();
    });
  }

  /**
   * 检测是否为移动设备
   */
  static isMobileDevice() {
    try {
      return /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent) ||
             (window.innerWidth <= 768 && 'ontouchstart' in window);
    } catch (error) {
      console.warn('移动设备检测失败:', error);
      return false;
    }
  }

  /**
   * 检测是否为微信浏览器
   */
  static isWeChat() {
    return /MicroMessenger/i.test(navigator.userAgent);
  }

  /**
   * 检测是否为QQ浏览器
   */
  static isQQBrowser() {
    return /QQBrowser/i.test(navigator.userAgent);
  }

  /**
   * 隐藏微信状态栏
   */
  static hideWeChatStatusBar() {
    // 尝试进入全屏模式
    const canvas = document.getElementById('gameCanvas');
    if (canvas && canvas.requestFullscreen) {
      // 用户手势触发后才能进入全屏
      canvas.addEventListener('touchstart', function() {
        if (document.fullscreenElement === null) {
          canvas.requestFullscreen().catch(err => {
            console.log('无法进入全屏模式:', err);
          });
        }
      }, { once: true });
    }
  }

  /**
   * 获取安全区域
   */
  static getSafeArea() {
    const style = getComputedStyle(document.documentElement);
    
    return {
      top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0'),
      right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0'),
      bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0'),
      left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0')
    };
  }

  /**
   * 适配安全区域
   */
  static applySafeArea() {
    const safeArea = this.getSafeArea();
    const canvas = document.getElementById('gameCanvas');
    
    if (canvas && (safeArea.top || safeArea.bottom || safeArea.left || safeArea.right)) {
      canvas.style.paddingTop = safeArea.top + 'px';
      canvas.style.paddingBottom = safeArea.bottom + 'px';
      canvas.style.paddingLeft = safeArea.left + 'px';
      canvas.style.paddingRight = safeArea.right + 'px';
      
      console.log('应用安全区域适配:', safeArea);
    }
  }

  /**
   * 获取设备信息
   */
  static getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio || 1,
      isMobile: this.isMobileDevice(),
      isWeChat: this.isWeChat(),
      isQQBrowser: this.isQQBrowser(),
      hasTouch: 'ontouchstart' in window,
      orientation: window.screen.orientation ? window.screen.orientation.angle : window.orientation
    };
  }

  /**
   * 优化触控性能
   */
  static optimizeTouchPerformance() {
    // 设置触控事件为被动模式以提高性能
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
      // 移除现有的非被动监听器，重新添加被动监听器
      const events = ['touchstart', 'touchmove', 'touchend'];
      events.forEach(eventType => {
        // 注意：这里只是示例，实际需要和InputManager配合
        canvas.addEventListener(eventType, function(e) {
          // 只有在必要时才阻止默认行为
          if (eventType === 'touchmove') {
            e.preventDefault();
          }
        }, { passive: false });
      });
    }
  }

  /**
   * 添加性能监控
   */
  static addPerformanceMonitoring() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    function monitorFPS() {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        console.log(`当前FPS: ${fps}`);
        
        // 如果FPS过低，可以触发性能优化
        if (fps < 30) {
          console.warn('检测到低FPS，建议启用性能优化模式');
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(monitorFPS);
    }
    
    // 开发模式下启用FPS监控
    if (import.meta.env.DEV) {
      monitorFPS();
    }
  }

  /**
   * 电池优化
   */
  static setupBatteryOptimization() {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        console.log('电池电量:', Math.round(battery.level * 100) + '%');
        
        // 低电量时降低性能
        if (battery.level < 0.2) {
          console.log('低电量模式：启用性能优化');
          // 可以降低帧率、减少粒子效果等
        }
        
        battery.addEventListener('levelchange', () => {
          console.log('电池电量变化:', Math.round(battery.level * 100) + '%');
        });
      });
    }
  }

  /**
   * 应用所有移动端优化
   */
  static applyAllOptimizations() {
    try {
      this.init();
      // 暂时只启用基础功能，避免复杂的API调用
      console.log('移动端优化已应用（简化版）');
      console.log('设备信息:', this.getBasicDeviceInfo());
    } catch (error) {
      console.warn('移动端优化应用失败:', error);
    }
  }

  /**
   * 获取基础设备信息
   */
  static getBasicDeviceInfo() {
    try {
      return {
        userAgent: navigator.userAgent,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
        isMobile: this.isMobileDevice(),
        hasTouch: 'ontouchstart' in window
      };
    } catch (error) {
      console.warn('获取设备信息失败:', error);
      return { error: error.message };
    }
  }
}

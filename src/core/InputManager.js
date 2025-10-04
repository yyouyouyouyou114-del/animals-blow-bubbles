/**
 * 输入管理器
 * 负责处理触摸、鼠标等输入事件
 */

export class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.isEnabled = true;
    
    // 输入状态
    this.touches = new Map();
    this.mousePressed = false;
    
    // 事件回调
    this.onTouch = null; // 触摸/点击事件回调
    this.onCharacterSelect = null; // 角色选择回调
    this.onSceneSelect = null; // 场景选择回调
    
    // 绑定事件处理方法
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    // 触摸事件
    this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.canvas.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    this.canvas.addEventListener('touchend', this.handleTouchEnd, { passive: false });
    this.canvas.addEventListener('touchcancel', this.handleTouchEnd, { passive: false });
    
    // 鼠标事件（用于桌面调试）
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);
    
    // 防止页面滚动
    this.canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  }

  /**
   * 处理触摸开始事件
   */
  handleTouchStart(event) {
    if (!this.isEnabled) return;
    
    event.preventDefault();
    
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const pos = this.getTouchPosition(touch);
      
      this.touches.set(touch.identifier, {
        id: touch.identifier,
        startX: pos.x,
        startY: pos.y,
        currentX: pos.x,
        currentY: pos.y,
        startTime: Date.now()
      });
      
      // 触发触摸事件
      this.triggerTouchEvent(pos.x, pos.y);
    }
  }

  /**
   * 处理触摸移动事件
   */
  handleTouchMove(event) {
    if (!this.isEnabled) return;
    
    event.preventDefault();
    
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const touchData = this.touches.get(touch.identifier);
      
      if (touchData) {
        const pos = this.getTouchPosition(touch);
        touchData.currentX = pos.x;
        touchData.currentY = pos.y;
      }
    }
  }

  /**
   * 处理触摸结束事件
   */
  handleTouchEnd(event) {
    if (!this.isEnabled) return;
    
    event.preventDefault();
    
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      this.touches.delete(touch.identifier);
    }
  }

  /**
   * 处理鼠标按下事件
   */
  handleMouseDown(event) {
    if (!this.isEnabled) return;
    
    this.mousePressed = true;
    const pos = this.getMousePosition(event);
    this.triggerTouchEvent(pos.x, pos.y);
  }

  /**
   * 处理鼠标移动事件
   */
  handleMouseMove(event) {
    if (!this.isEnabled || !this.mousePressed) return;
    
    const pos = this.getMousePosition(event);
    // 可以在这里处理拖拽等操作
  }

  /**
   * 处理鼠标释放事件
   */
  handleMouseUp(event) {
    if (!this.isEnabled) return;
    
    this.mousePressed = false;
  }

  /**
   * 获取触摸位置（相对于画布）
   */
  getTouchPosition(touch) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  }

  /**
   * 获取鼠标位置（相对于画布）
   */
  getMousePosition(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  /**
   * 触发触摸事件
   */
  triggerTouchEvent(x, y) {
    // 检查是否点击了UI区域
    if (this.checkUIInteraction(x, y)) {
      return;
    }

    // 触发主游戏区域触摸事件
    if (this.onTouch) {
      this.onTouch(x, y);
    }
  }

  /**
   * 检查UI交互
   * @param {number} x - X坐标
   * @param {number} y - Y坐标
   */
  checkUIInteraction(x, y) {
    const rect = this.canvas.getBoundingClientRect();
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;
    
    // 检查是否点击了底部角色选择区域（底部10%）
    const bottomUIHeight = canvasHeight * 0.1;
    if (y > canvasHeight - bottomUIHeight) {
      this.handleBottomUIClick(x, y, canvasWidth, bottomUIHeight);
      return true;
    }
    
    // 检查是否点击了顶部设置区域（顶部5%）
    const topUIHeight = canvasHeight * 0.05;
    if (y < topUIHeight) {
      this.handleTopUIClick(x, y, canvasWidth, topUIHeight);
      return true;
    }
    
    return false;
  }

  /**
   * 处理底部UI点击（角色选择器）
   */
  handleBottomUIClick(x, y, canvasWidth, uiHeight) {
    // 假设有3个角色按钮，平均分布
    const buttonWidth = canvasWidth / 3;
    const characterIndex = Math.floor(x / buttonWidth);
    
    if (characterIndex >= 0 && characterIndex < 3) {
      if (this.onCharacterSelect) {
        this.onCharacterSelect(characterIndex);
      }
      console.log(`选择角色: ${characterIndex}`);
    }
  }

  /**
   * 处理顶部UI点击（设置按钮等）
   */
  handleTopUIClick(x, y, canvasWidth, uiHeight) {
    const rect = this.canvas.getBoundingClientRect();
    const canvasHeight = rect.height;
    
    // 检查是否点击了设置按钮（右上角区域）
    const settingsButtonSize = Math.min(canvasWidth, canvasHeight) * 0.08;
    const margin = 20;
    const settingsX = canvasWidth - settingsButtonSize - margin;
    const settingsY = margin;
    
    if (x >= settingsX && x <= settingsX + settingsButtonSize && 
        y >= settingsY && y <= settingsY + settingsButtonSize) {
      this.handleSettingsClick();
    }
    
    // 检查是否点击了左上角场景切换区域
    if (x < canvasWidth * 0.2 && y < uiHeight) {
      this.handleSceneSwitch();
    }
  }

  /**
   * 处理场景切换
   */
  handleSceneSwitch() {
    // 循环切换场景
    const scenes = ['grassland', 'ocean', 'night'];
    let currentIndex = 0;
    
    // 获取当前场景索引
    if (this.onSceneSelect) {
      // 简单的场景循环切换
      const currentScene = this.getCurrentSceneId ? this.getCurrentSceneId() : 'grassland';
      currentIndex = scenes.indexOf(currentScene);
      currentIndex = (currentIndex + 1) % scenes.length;
      
      this.onSceneSelect(scenes[currentIndex]);
      console.log(`切换到场景: ${scenes[currentIndex]}`);
    }
  }

  /**
   * 处理设置按钮点击（需要长按）
   */
  handleSettingsClick() {
    // 这里应该实现长按检测
    console.log('设置按钮被点击（需要实现长按检测）');
  }

  /**
   * 启用输入
   */
  enable() {
    this.isEnabled = true;
  }

  /**
   * 禁用输入
   */
  disable() {
    this.isEnabled = false;
  }

  /**
   * 更新输入状态
   */
  update() {
    // 可以在这里处理需要持续检测的输入逻辑
    // 比如长按检测等
  }

  /**
   * 销毁输入管理器
   */
  destroy() {
    // 移除所有事件监听器
    this.canvas.removeEventListener('touchstart', this.handleTouchStart);
    this.canvas.removeEventListener('touchmove', this.handleTouchMove);
    this.canvas.removeEventListener('touchend', this.handleTouchEnd);
    this.canvas.removeEventListener('touchcancel', this.handleTouchEnd);
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mouseup', this.handleMouseUp);
    
    // 清理状态
    this.touches.clear();
    this.mousePressed = false;
    this.onTouch = null;
    this.onCharacterSelect = null;
    this.onSceneSelect = null;
  }
}

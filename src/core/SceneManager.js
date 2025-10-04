/**
 * 场景管理器
 * 负责管理游戏场景的切换和生命周期
 */

export class SceneManager {
  constructor() {
    this.scenes = new Map();
    this.currentScene = null;
    this.currentSceneId = null;
    this.isTransitioning = false;
  }

  /**
   * 注册场景
   * @param {string} id - 场景ID
   * @param {Object} scene - 场景对象
   */
  registerScene(id, scene) {
    if (this.scenes.has(id)) {
      console.warn(`场景 "${id}" 已存在，将被覆盖`);
    }
    
    this.scenes.set(id, scene);
    console.log(`注册场景: ${id}`);
  }

  /**
   * 切换到指定场景
   * @param {string} sceneId - 目标场景ID
   */
  async switchScene(sceneId) {
    if (this.isTransitioning) {
      console.warn('场景正在切换中，请稍后...');
      return;
    }

    if (!this.scenes.has(sceneId)) {
      console.error(`场景 "${sceneId}" 不存在`);
      return;
    }

    if (this.currentSceneId === sceneId) {
      console.log(`已经在场景 "${sceneId}" 中`);
      return;
    }

    this.isTransitioning = true;

    try {
      // 退出当前场景
      if (this.currentScene && this.currentScene.onExit) {
        await this.currentScene.onExit();
      }

      // 获取新场景
      const newScene = this.scenes.get(sceneId);
      
      // 初始化新场景（如果需要）
      if (newScene.init && !newScene.initialized) {
        await newScene.init();
        newScene.initialized = true;
      }

      // 进入新场景
      if (newScene.onEnter) {
        await newScene.onEnter();
      }

      // 更新当前场景
      this.currentScene = newScene;
      this.currentSceneId = sceneId;

      console.log(`成功切换到场景: ${sceneId}`);

    } catch (error) {
      console.error(`场景切换失败: ${error.message}`);
    } finally {
      this.isTransitioning = false;
    }
  }

  /**
   * 获取当前场景
   */
  getCurrentScene() {
    return this.currentScene;
  }

  /**
   * 获取当前场景ID
   */
  getCurrentSceneId() {
    return this.currentSceneId;
  }

  /**
   * 获取场景
   * @param {string} sceneId - 场景ID
   */
  getScene(sceneId) {
    return this.scenes.get(sceneId);
  }

  /**
   * 检查场景是否存在
   * @param {string} sceneId - 场景ID
   */
  hasScene(sceneId) {
    return this.scenes.has(sceneId);
  }

  /**
   * 获取所有场景ID
   */
  getSceneIds() {
    return Array.from(this.scenes.keys());
  }

  /**
   * 是否正在切换场景
   */
  isTransitioningScene() {
    return this.isTransitioning;
  }

  /**
   * 更新当前场景
   * @param {number} deltaTime - 帧时间
   */
  update(deltaTime) {
    if (this.currentScene && this.currentScene.update && !this.isTransitioning) {
      this.currentScene.update(deltaTime);
    }
  }

  /**
   * 渲染当前场景
   * @param {CanvasRenderingContext2D} ctx - 画布上下文
   * @param {number} width - 画布宽度
   * @param {number} height - 画布高度
   */
  render(ctx, width, height) {
    if (this.currentScene && this.currentScene.render && !this.isTransitioning) {
      this.currentScene.render(ctx, width, height);
    }
  }

  /**
   * 销毁所有场景
   */
  destroy() {
    this.scenes.forEach((scene, id) => {
      if (scene.destroy) {
        scene.destroy();
      }
    });
    
    this.scenes.clear();
    this.currentScene = null;
    this.currentSceneId = null;
    this.isTransitioning = false;
  }
}

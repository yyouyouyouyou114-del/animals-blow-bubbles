/**
 * 资源加载器
 * 负责加载游戏所需的图片、音频等资源
 */

export class ResourceLoader {
  constructor() {
    this.loadedImages = new Map();
    this.loadedAudio = new Map();
    this.loadingProgress = 0;
    this.totalResources = 0;
    this.loadedResources = 0;
  }

  /**
   * 加载所有资源
   * @param {Object} resources - 资源配置对象
   * @param {Array} resources.images - 图片资源数组
   * @param {Array} resources.audio - 音频资源数组
   */
  async loadAll(resources) {
    const { images = [], audio = [] } = resources;
    this.totalResources = images.length + audio.length;
    this.loadedResources = 0;
    this.loadingProgress = 0;

    console.log(`开始加载 ${this.totalResources} 个资源...`);

    try {
      // 并行加载图片和音频
      await Promise.all([
        this.loadImages(images),
        this.loadAudio(audio)
      ]);

      console.log('所有资源加载完成');
      
    } catch (error) {
      console.error('资源加载失败:', error);
      throw error;
    }
  }

  /**
   * 加载图片资源
   * @param {Array} imagePaths - 图片路径数组
   */
  async loadImages(imagePaths) {
    const promises = imagePaths.map(path => this.loadImage(path));
    await Promise.all(promises);
  }

  /**
   * 加载单个图片
   * @param {string} path - 图片路径
   */
  loadImage(path) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.loadedImages.set(path, img);
        this.onResourceLoaded();
        resolve(img);
      };

      img.onerror = () => {
        console.warn(`图片加载失败: ${path}`);
        // 创建占位符图片
        const placeholder = this.createPlaceholderImage();
        this.loadedImages.set(path, placeholder);
        this.onResourceLoaded();
        resolve(placeholder);
      };

      img.src = path;
    });
  }

  /**
   * 加载音频资源
   * @param {Array} audioPaths - 音频路径数组
   */
  async loadAudio(audioPaths) {
    const promises = audioPaths.map(path => this.loadAudioFile(path));
    await Promise.all(promises);
  }

  /**
   * 加载单个音频文件
   * @param {string} path - 音频路径
   */
  loadAudioFile(path) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      
      // 设置音频格式优先级（WebM/OGG优先，MP3备用）
      const audioPath = this.getOptimalAudioPath(path);
      
      audio.addEventListener('canplaythrough', () => {
        this.loadedAudio.set(path, audio);
        this.onResourceLoaded();
        resolve(audio);
      });

      audio.addEventListener('error', () => {
        console.warn(`音频加载失败: ${audioPath}`);
        // 创建占位符音频
        const placeholder = this.createPlaceholderAudio();
        this.loadedAudio.set(path, placeholder);
        this.onResourceLoaded();
        resolve(placeholder);
      });

      audio.preload = 'auto';
      audio.src = audioPath;
    });
  }

  /**
   * 获取最优音频路径（根据浏览器支持选择格式）
   * @param {string} basePath - 基础路径（不含扩展名）
   */
  getOptimalAudioPath(basePath) {
    const audio = new Audio();
    
    // 检查WebM支持
    if (audio.canPlayType('audio/webm') !== '') {
      return `${basePath}.webm`;
    }
    
    // 检查OGG支持
    if (audio.canPlayType('audio/ogg') !== '') {
      return `${basePath}.ogg`;
    }
    
    // 默认使用MP3
    return `${basePath}.mp3`;
  }

  /**
   * 资源加载完成回调
   */
  onResourceLoaded() {
    this.loadedResources++;
    this.loadingProgress = this.loadedResources / this.totalResources;
    
    // 可以在这里触发加载进度更新事件
    this.updateLoadingUI();
  }

  /**
   * 更新加载界面
   */
  updateLoadingUI() {
    const loadingEl = document.getElementById('loading');
    if (loadingEl && this.totalResources > 0) {
      const percentage = Math.floor(this.loadingProgress * 100);
      const progressText = loadingEl.querySelector('.progress-text');
      
      if (progressText) {
        progressText.textContent = `加载中... ${percentage}%`;
      } else {
        // 如果没有进度文本元素，添加一个
        const textEl = document.createElement('div');
        textEl.className = 'progress-text';
        textEl.textContent = `加载中... ${percentage}%`;
        textEl.style.marginTop = '10px';
        loadingEl.appendChild(textEl);
      }
    }
  }

  /**
   * 创建占位符图片
   */
  createPlaceholderImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    // 绘制简单的占位符
    ctx.fillStyle = '#ddd';
    ctx.fillRect(0, 0, 100, 100);
    ctx.fillStyle = '#999';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('图片', 50, 55);
    
    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  }

  /**
   * 创建占位符音频
   */
  createPlaceholderAudio() {
    // 创建一个空的音频对象
    const audio = new Audio();
    audio.volume = 0;
    audio.play = () => Promise.resolve();
    audio.pause = () => {};
    return audio;
  }

  /**
   * 获取已加载的图片
   * @param {string} path - 图片路径
   */
  getImage(path) {
    return this.loadedImages.get(path);
  }

  /**
   * 获取已加载的音频
   * @param {string} path - 音频路径
   */
  getAudio(path) {
    return this.loadedAudio.get(path);
  }

  /**
   * 获取加载进度
   */
  getProgress() {
    return this.loadingProgress;
  }

  /**
   * 检查资源是否已加载
   * @param {string} path - 资源路径
   */
  isLoaded(path) {
    return this.loadedImages.has(path) || this.loadedAudio.has(path);
  }

  /**
   * 清理所有已加载的资源
   */
  clear() {
    this.loadedImages.clear();
    this.loadedAudio.clear();
    this.loadingProgress = 0;
    this.totalResources = 0;
    this.loadedResources = 0;
  }
}

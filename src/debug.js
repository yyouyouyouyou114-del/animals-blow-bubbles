/**
 * 调试版本 - 最简化的游戏
 */

console.log('🔍 调试版本开始加载...');

// 最简单的游戏类
class SimpleGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isRunning = false;
    this.gameStarted = false; // 游戏是否已开始
    this.gameTimer = null; // 游戏计时器
    this.gameStartTime = 0; // 游戏开始时间
    this.gameDuration = 120000; // 2分钟 = 120秒 = 120000毫秒
    this.sceneAnimals = [[], [], []]; // 每个场景的动物数组 [森林, 海底, 夜晚]
    this.currentCharacter = 0;
    
    // 简单音效系统
    this.audioContext = null;
    this.hasAudio = false;
    this.backgroundMusicNodes = {}; // 存储背景音乐节点
    this.currentBackgroundMusic = null;
    this.musicEnabled = true; // 音乐开关
    this.initAudio();
    
    // 场景系统 - 每个场景有专属角色，每个角色有独特的泡泡特性
    this.scenes = [
      { 
        name: '神秘森林', 
        emoji: '🌲', 
        colors: ['#2E7D32', '#4CAF50', '#81C784'],
        characters: [
          { 
            emoji: '🐻', 
            name: '小熊',
            bubbleType: 'large_single', // 大大的圆形泡泡
            popVisual: 'daisy', // 变成一朵小雏菊
            popSound: 'bear_pop' // 憨厚的"噗"声
          },
          { 
            emoji: '🐰', 
            name: '小兔',
            bubbleType: 'small_chain', // 一串（3-5个）小泡泡
            popVisual: 'carrot', // 变成几根胡萝卜条
            popSound: 'rabbit_pop' // 轻快的"啵啵啵"声
          },
          { 
            emoji: '🐸', 
            name: '小青蛙',
            bubbleType: 'bouncing_green', // 绿色的、跳动式上升的泡泡
            popVisual: 'leaf', // 变成一片小荷叶
            popSound: 'frog_pop' // "呱呱"的叫声
          }
        ]
      },
      { 
        name: '海底世界', 
        emoji: '🌊', 
        colors: ['#4169E1', '#00CED1'],
        characters: [
          { 
            emoji: '🐠', 
            name: '小丑鱼',
            bubbleType: 'standard_water', // 标准的圆形水泡，直线上升
            popVisual: 'starfish', // 变成一个小海星
            popSound: 'fish_pop' // "咕噜咕噜"的水泡声
          },
          { 
            emoji: '🐬', 
            name: '海豚',
            bubbleType: 'arc_chain', // 一道弧形的泡泡链
            popVisual: 'shell', // 变成一个小贝壳
            popSound: 'dolphin_pop' // 短促悦耳的海豚音
          },
          { 
            emoji: '🐙', 
            name: '章鱼',
            bubbleType: 'fan_multiple', // 一次吹出多个（约6个）小泡泡，呈扇形散开
            popVisual: 'ink', // 变成一团可爱的（卡通化）小墨滴
            popSound: 'octopus_pop' // "噗咻"的喷发声
          }
        ]
      },
      { 
        name: '夜晚星空', 
        emoji: '🌙', 
        colors: ['#191970', '#483D8B'],
        characters: [
          { 
            emoji: '🦉', 
            name: '小猫头鹰',
            bubbleType: 'glowing_moon', // 闪着微光的泡泡，像小月亮
            popVisual: 'star', // 变成一颗小星星
            popSound: 'owl_pop' // "咕咕"的猫头鹰叫声
          },
          { 
            emoji: '🦊', 
            name: '小狐狸',
            bubbleType: 'orange_trail', // 橙色的、拖着细小光尾的泡泡
            popVisual: 'firefly', // 变成一朵发光的萤火虫
            popSound: 'fox_pop' // 轻柔的"嗷呜"声
          },
          { 
            emoji: '🦝', 
            name: '小浣熊',
            bubbleType: 'silver_orbit', // 银色的泡泡，像小卫星一样绕圈上升
            popVisual: 'nut', // 变成一颗小坚果
            popSound: 'raccoon_pop' // 窸窸窣窣的摩擦声
          }
        ]
      }
    ];
    this.currentScene = 0;
    
    console.log('✅ SimpleGame 构造函数完成');
  }

  // 初始化音频系统
  initAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioContext = new AudioContext();
        this.hasAudio = true;
        console.log('🎵 音频系统初始化成功');
      }
    } catch (error) {
      console.warn('🔇 音频系统初始化失败:', error);
      this.hasAudio = false;
    }
  }

  // 播放角色专属泡泡爆裂音效
  playCharacterPopSound(character) {
    if (!this.hasAudio || !this.audioContext || !character) {
      this.playPopSound(); // 回退到默认音效
      return;
    }
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // 根据角色类型播放不同音效
      switch (character.popSound) {
        case 'bear_pop': // 小熊 - 憨厚的"噗"声
          oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.15);
          gainNode.gain.setValueAtTime(0.12, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.15);
          break;
          
        case 'rabbit_pop': // 小兔 - 轻快的"啵啵啵"声
          for (let i = 0; i < 3; i++) {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.frequency.setValueAtTime(600 + i * 100, this.audioContext.currentTime + i * 0.05);
            gain.gain.setValueAtTime(0.08, this.audioContext.currentTime + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + i * 0.05 + 0.08);
            
            osc.start(this.audioContext.currentTime + i * 0.05);
            osc.stop(this.audioContext.currentTime + i * 0.05 + 0.08);
          }
          return; // 已经处理完毕，直接返回
          
        case 'frog_pop': // 小青蛙 - "呱呱"的叫声
          oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
          oscillator.frequency.linearRampToValueAtTime(250, this.audioContext.currentTime + 0.05);
          oscillator.frequency.linearRampToValueAtTime(320, this.audioContext.currentTime + 0.1);
          oscillator.frequency.linearRampToValueAtTime(280, this.audioContext.currentTime + 0.15);
          gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.15);
          break;
          
        case 'fish_pop': // 小丑鱼 - "咕噜咕噜"的水泡声
          oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);
          gainNode.gain.setValueAtTime(0.09, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.2);
          break;
          
        case 'dolphin_pop': // 海豚 - 短促悦耳的海豚音
          oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
          oscillator.frequency.linearRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
          gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.1);
          break;
          
        case 'octopus_pop': // 章鱼 - "噗咻"的喷发声
          oscillator.frequency.setValueAtTime(500, this.audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.12);
          gainNode.gain.setValueAtTime(0.11, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.12);
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.12);
          break;
          
        case 'owl_pop': // 小猫头鹰 - "咕咕"的猫头鹰叫声
          oscillator.frequency.setValueAtTime(250, this.audioContext.currentTime);
          oscillator.frequency.linearRampToValueAtTime(200, this.audioContext.currentTime + 0.1);
          oscillator.frequency.linearRampToValueAtTime(250, this.audioContext.currentTime + 0.2);
          gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.2);
          break;
          
        case 'fox_pop': // 小狐狸 - 轻柔的"嗷呜"声
          oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
          oscillator.frequency.linearRampToValueAtTime(450, this.audioContext.currentTime + 0.1);
          oscillator.frequency.linearRampToValueAtTime(200, this.audioContext.currentTime + 0.25);
          gainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.25);
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.25);
          break;
          
        case 'raccoon_pop': // 小浣熊 - 窸窸窣窣的摩擦声
          oscillator.type = 'sawtooth'; // 使用锯齿波模拟摩擦声
          oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.15);
          gainNode.gain.setValueAtTime(0.07, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.15);
          break;
          
        default:
          this.playPopSound(); // 默认音效
          return;
      }
    } catch (error) {
      console.warn('🔇 播放角色音效失败:', error);
      this.playPopSound(); // 回退到默认音效
    }
  }

  // 播放默认泡泡爆裂音效（备用）
  playPopSound() {
    if (!this.hasAudio || !this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // 泡泡爆裂音效 - 短促的高频音
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.1);
    } catch (error) {
      console.warn('🔇 播放泡泡音效失败:', error);
    }
  }

  // 播放角色切换音效
  playCharacterSwitchSound() {
    if (!this.hasAudio || !this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // 角色切换音效 - 上升音调
      oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(600, this.audioContext.currentTime + 0.15);
      
      gainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.15);
    } catch (error) {
      console.warn('🔇 播放角色切换音效失败:', error);
    }
  }

  // 播放场景切换音效
  playSceneSwitchSound() {
    if (!this.hasAudio || !this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // 场景切换音效 - 和弦音效
      oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(500, this.audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
    } catch (error) {
      console.warn('🔇 播放场景切换音效失败:', error);
    }
  }

  // 激活音频上下文（需要用户交互）
  activateAudio() {
    if (this.hasAudio && this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().then(() => {
        console.log('🎵 音频上下文已激活');
        // 激活后开始播放当前场景的背景音乐
        this.startBackgroundMusic(this.currentScene);
      }).catch(error => {
        console.warn('🔇 音频激活失败:', error);
      });
    } else if (this.hasAudio && this.audioContext) {
      // 如果音频上下文已经激活，直接开始播放背景音乐
      this.startBackgroundMusic(this.currentScene);
    }
  }

  // 开始播放背景音乐
  startBackgroundMusic(sceneIndex) {
    if (!this.hasAudio || !this.audioContext || !this.musicEnabled) return;
    
    // 停止当前背景音乐
    this.stopBackgroundMusic();
    
    console.log(`🎼 开始播放场景${sceneIndex}的背景音乐`);
    
    try {
      // 根据场景生成背景音乐
      switch (sceneIndex) {
        case 0: // 阳光草地
          this.currentBackgroundMusic = this.createGrasslandMusic();
          break;
        case 1: // 海底世界
          this.currentBackgroundMusic = this.createOceanMusic();
          break;
        case 2: // 夜晚星空
          this.currentBackgroundMusic = this.createNightMusic();
          break;
      }
    } catch (error) {
      console.warn('🔇 背景音乐播放失败:', error);
    }
  }

  // 切换音乐开关
  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    console.log(`🎵 音乐${this.musicEnabled ? '开启' : '关闭'}`);
    
    if (!this.musicEnabled) {
      this.stopBackgroundMusic();
    } else if (this.gameStarted) {
      this.startBackgroundMusic(this.currentScene);
    }
  }

  // 停止背景音乐
  stopBackgroundMusic() {
    if (this.currentBackgroundMusic) {
      try {
        this.currentBackgroundMusic.forEach(node => {
          if (node.stop) {
            node.stop();
          }
          if (node.disconnect) {
            node.disconnect();
          }
        });
        console.log('🔇 背景音乐已停止');
      } catch (error) {
        console.warn('🔇 停止背景音乐失败:', error);
      }
      this.currentBackgroundMusic = null;
    }
  }

  // 阳光草地背景音乐 - 温柔的轻音乐
  createGrasslandMusic() {
    const nodes = [];
    const now = this.audioContext.currentTime;
    
    // 主旋律 - 柔和的正弦波
    const melody = this.audioContext.createOscillator();
    const melodyGain = this.audioContext.createGain();
    const melodyFilter = this.audioContext.createBiquadFilter();
    
    melody.connect(melodyFilter);
    melodyFilter.connect(melodyGain);
    melodyGain.connect(this.audioContext.destination);
    
    melody.type = 'sine';
    melodyFilter.type = 'lowpass';
    melodyFilter.frequency.setValueAtTime(1500, now);
    melodyGain.gain.setValueAtTime(0.03, now); // 降低音量
    
    // 更温和的旋律 - C大调简单进行
    const melodyNotes = [523.25, 587.33, 659.25, 523.25]; // C5-D5-E5-C5
    let noteIndex = 0;
    
    const playMelodyNote = () => {
      if (melody && melody.frequency) {
        // 平滑过渡
        melody.frequency.exponentialRampToValueAtTime(melodyNotes[noteIndex], this.audioContext.currentTime + 0.1);
        noteIndex = (noteIndex + 1) % melodyNotes.length;
      }
    };
    
    // 更慢的节奏 - 每2秒换一个音符
    playMelodyNote();
    const melodyInterval = setInterval(playMelodyNote, 2000);
    
    melody.start(now);
    
    nodes.push(melody, { stop: () => clearInterval(melodyInterval) });
    return nodes;
  }

  // 海底世界背景音乐 - 宁静的水滴声
  createOceanMusic() {
    const nodes = [];
    const now = this.audioContext.currentTime;
    
    // 主旋律 - 非常柔和的水滴音效
    const melody = this.audioContext.createOscillator();
    const melodyGain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    melody.connect(filter);
    filter.connect(melodyGain);
    melodyGain.connect(this.audioContext.destination);
    
    melody.type = 'sine';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now); // 更低的滤波频率
    melodyGain.gain.setValueAtTime(0.02, now); // 更低的音量
    
    // 简单的三音符循环 - 模拟水滴
    const oceanNotes = [440.00, 523.25, 392.00]; // A4-C5-G4
    let noteIndex = 0;
    
    const playOceanNote = () => {
      if (melody && melody.frequency) {
        // 模拟水滴的瞬间音效
        melody.frequency.exponentialRampToValueAtTime(oceanNotes[noteIndex], this.audioContext.currentTime + 0.05);
        melodyGain.gain.setValueAtTime(0.02, this.audioContext.currentTime);
        melodyGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.8);
        noteIndex = (noteIndex + 1) % oceanNotes.length;
      }
    };
    
    playOceanNote();
    const oceanInterval = setInterval(playOceanNote, 3000); // 每3秒一个水滴声
    
    melody.start(now);
    
    nodes.push(melody, { stop: () => clearInterval(oceanInterval) });
    return nodes;
  }

  // 夜晚星空背景音乐 - 安静的摇篮曲
  createNightMusic() {
    const nodes = [];
    const now = this.audioContext.currentTime;
    
    // 主旋律 - 非常柔和的正弦波
    const melody = this.audioContext.createOscillator();
    const melodyGain = this.audioContext.createGain();
    const melodyFilter = this.audioContext.createBiquadFilter();
    
    melody.connect(melodyFilter);
    melodyFilter.connect(melodyGain);
    melodyGain.connect(this.audioContext.destination);
    
    melody.type = 'sine';
    melodyFilter.type = 'lowpass';
    melodyFilter.frequency.setValueAtTime(1000, now);
    melodyGain.gain.setValueAtTime(0.025, now); // 非常轻柔的音量
    
    // 简单的摇篮曲旋律
    const nightNotes = [349.23, 392.00, 329.63, 293.66]; // F4-G4-E4-D4
    let noteIndex = 0;
    
    const playNightNote = () => {
      if (melody && melody.frequency) {
        // 非常平滑的过渡
        melody.frequency.exponentialRampToValueAtTime(nightNotes[noteIndex], this.audioContext.currentTime + 0.2);
        noteIndex = (noteIndex + 1) % nightNotes.length;
      }
    };
    
    playNightNote();
    const nightInterval = setInterval(playNightNote, 4000); // 每4秒换一个音符，非常慢
    
    // 偶尔的星星闪烁音效 - 非常轻微
    const sparkle = this.audioContext.createOscillator();
    const sparkleGain = this.audioContext.createGain();
    const sparkleFilter = this.audioContext.createBiquadFilter();
    
    sparkle.connect(sparkleFilter);
    sparkleFilter.connect(sparkleGain);
    sparkleGain.connect(this.audioContext.destination);
    
    sparkle.type = 'sine';
    sparkle.frequency.setValueAtTime(880, now); // A5，不要太高
    sparkleFilter.type = 'lowpass';
    sparkleFilter.frequency.setValueAtTime(1200, now);
    sparkleGain.gain.setValueAtTime(0, now);
    
    // 很少的闪烁效果
    const sparklePattern = () => {
      const currentTime = this.audioContext.currentTime;
      sparkleGain.gain.setValueAtTime(0.015, currentTime);
      sparkleGain.gain.exponentialRampToValueAtTime(0.001, currentTime + 0.5);
    };
    
    const sparkleInterval = setInterval(sparklePattern, 8000); // 每8秒闪烁一次
    
    melody.start(now);
    sparkle.start(now);
    
    nodes.push(melody, sparkle,
      { stop: () => clearInterval(nightInterval) },
      { stop: () => clearInterval(sparkleInterval) }
    );
    return nodes;
  }

  init() {
    console.log('🎨 初始化Canvas...');
    
    // 设置Canvas尺寸
    this.resize();
    
    // 添加事件监听
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.handleClick(e.touches[0]);
    });
    
    // 键盘事件：空格键切换角色，数字键切换场景
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        this.switchCharacter();
      } else if (e.code === 'KeyS') {
        e.preventDefault();
        this.switchScene();
      }
    });
    
    window.addEventListener('resize', () => this.resize());
    
    console.log('✅ 游戏初始化完成');
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    console.log(`📐 Canvas尺寸: ${this.canvas.width}x${this.canvas.height}`);
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    console.log(`👆 点击位置: (${x}, ${y})`);
    
    // 如果游戏还未开始，检查是否点击开始按钮
    if (!this.gameStarted) {
      if (this.isClickOnStartButton(x, y)) {
        this.startGame();
        return;
      }
      // 游戏未开始时，其他点击无效
      return;
    }
    
    // 游戏进行中的点击处理
    
    // 检查是否点击了场景切换按钮（左上角）
    if (x <= 80 && y <= 80) {
      this.switchScene();
      return;
    }
    
    // 检查是否点击了音乐开关按钮（右上角）
    if (x >= this.canvas.width - 80 && y <= 80) {
      this.toggleMusic();
      return;
    }
    
    // 检查是否点击了角色区域（底部中央）
    const characterY = this.canvas.height - 100;
    const characterX = this.canvas.width / 2;
    const characterSize = 60;
    
    if (x >= characterX - characterSize && x <= characterX + characterSize &&
        y >= characterY - characterSize && y <= characterY + characterSize) {
      this.switchCharacter();
      return;
    }
    
    // 检查是否点击了当前场景的动物
    let animalClicked = false;
    const currentSceneAnimals = this.sceneAnimals[this.currentScene];
    for (let i = currentSceneAnimals.length - 1; i >= 0; i--) {
      const animal = currentSceneAnimals[i];
      const dx = x - animal.x;
      const dy = y - animal.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= animal.size) {
        // 点击了动物，让它互动
        this.interactWithAnimal(i, this.currentScene);
        animalClicked = true;
        break;
      }
    }
    
    // 如果没有点击动物，放置新动物
    if (!animalClicked) {
      this.placeAnimal(x, y);
    }
  }

  // 与动物互动
  interactWithAnimal(index, sceneIndex) {
    const animal = this.sceneAnimals[sceneIndex][index];
    console.log(`🤝 与${animal.name}互动`);
    
    // 播放互动音效
    this.playCharacterPopSound(animal.character);
    
    // 创建互动特效
    this.createCharacterPopEffect(animal.x, animal.y, animal.character);
    
    // 动物反应
    animal.state = 'interacting';
    animal.animation.frame = 0;
    
    // 增加动物生命值
    animal.life = Math.min(100, animal.life + 20);
    
    // 2秒后回到正常状态
    setTimeout(() => {
      if (this.sceneAnimals[sceneIndex].includes(animal)) {
        animal.state = 'idle';
      }
    }, 2000);
  }

  // 检查是否点击了开始按钮
  isClickOnStartButton(x, y) {
    const buttonX = this.canvas.width / 2;
    const buttonY = this.canvas.height / 2 + 20; // 与渲染位置保持一致
    const buttonWidth = 180;
    const buttonHeight = 70;
    
    return x >= buttonX - buttonWidth/2 && x <= buttonX + buttonWidth/2 &&
           y >= buttonY - buttonHeight/2 && y <= buttonY + buttonHeight/2;
  }

  switchCharacter() {
    const currentSceneCharacters = this.scenes[this.currentScene].characters;
    this.currentCharacter = (this.currentCharacter + 1) % currentSceneCharacters.length;
    this.playCharacterSwitchSound();
    const character = currentSceneCharacters[this.currentCharacter];
    console.log(`🔄 切换角色: ${character.name} ${character.emoji}`);
  }

  switchScene() {
    this.currentScene = (this.currentScene + 1) % this.scenes.length;
    this.currentCharacter = 0; // 重置到新场景的第一个角色
    this.playSceneSwitchSound();
    
    // 切换背景音乐
    this.startBackgroundMusic(this.currentScene);
    
    const scene = this.scenes[this.currentScene];
    console.log(`🌍 切换场景: ${scene.name}`);
    console.log(`🎭 新场景角色: ${scene.characters.map(c => `${c.name}${c.emoji}`).join(' ')}`);
  }

  popBubble(index) {
    const bubble = this.bubbles[index];
    console.log(`💥 ${bubble.character?.name || '泡泡'}爆裂: (${bubble.x}, ${bubble.y})`);
    
    // 播放角色专属爆裂音效
    this.playCharacterPopSound(bubble.character);
    
    // 创建角色专属爆裂视觉效果
    this.createCharacterPopEffect(bubble.x, bubble.y, bubble.character);
    
    // 移除泡泡
    this.bubbles.splice(index, 1);
  }

  // 创建角色专属的爆裂视觉效果
  createCharacterPopEffect(x, y, character) {
    if (!character) {
      this.createPopEffect(x, y); // 回退到默认效果
      return;
    }

    console.log(`✨ 创建${character.name}专属爆裂效果: ${character.popVisual}`);

    switch (character.popVisual) {
      case 'daisy': // 小熊 - 变成一朵小雏菊
        this.createDaisyEffect(x, y);
        break;
      case 'carrot': // 小兔 - 变成几根胡萝卜条
        this.createCarrotEffect(x, y);
        break;
      case 'leaf': // 小青蛙 - 变成一片小荷叶
        this.createLeafEffect(x, y);
        break;
      case 'starfish': // 小丑鱼 - 变成一个小海星
        this.createStarfishEffect(x, y);
        break;
      case 'shell': // 海豚 - 变成一个小贝壳
        this.createShellEffect(x, y);
        break;
      case 'ink': // 章鱼 - 变成一团可爱的小墨滴
        this.createInkEffect(x, y);
        break;
      case 'star': // 小猫头鹰 - 变成一颗小星星
        this.createStarEffect(x, y);
        break;
      case 'firefly': // 小狐狸 - 变成一朵发光的萤火虫
        this.createFireflyEffect(x, y);
        break;
      case 'nut': // 小浣熊 - 变成一颗小坚果
        this.createNutEffect(x, y);
        break;
      default:
        this.createPopEffect(x, y); // 默认效果
        break;
    }
  }

  // 小熊 - 雏菊效果
  createDaisyEffect(x, y) {
    // 花心
    const center = {
      x: x,
      y: y,
      radius: 8,
      color: '#FFD700', // 金黄色花心
      life: 1.0,
      isEffect: true,
      effectType: 'daisy_center'
    };
    this.bubbles.push(center);

    // 花瓣（8片）
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 / 8) * i;
      const distance = 20;
      const petal = {
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        radius: 6,
        color: '#FFFFFF', // 白色花瓣
        life: 1.0,
        isEffect: true,
        effectType: 'daisy_petal',
        angle: angle
      };
      this.bubbles.push(petal);
    }

    this.scheduleEffectRemoval([center, ...this.bubbles.slice(-8)], 2000);
  }

  // 小兔 - 胡萝卜条效果
  createCarrotEffect(x, y) {
    const count = 4;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + Math.PI / 4;
      const distance = 15 + Math.random() * 10;
      const carrot = {
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        width: 12,
        height: 4,
        color: '#FF6347', // 橙红色
        life: 1.0,
        isEffect: true,
        effectType: 'carrot',
        angle: angle
      };
      this.bubbles.push(carrot);
    }
    this.scheduleEffectRemoval(this.bubbles.slice(-count), 1800);
  }

  // 小青蛙 - 荷叶效果
  createLeafEffect(x, y) {
    const leaf = {
      x: x,
      y: y,
      radius: 25,
      color: '#32CD32', // 青绿色
      life: 1.0,
      isEffect: true,
      effectType: 'leaf',
      rotation: Math.random() * Math.PI * 2
    };
    this.bubbles.push(leaf);
    this.scheduleEffectRemoval([leaf], 2200);
  }

  // 小丑鱼 - 海星效果
  createStarfishEffect(x, y) {
    const starfish = {
      x: x,
      y: y,
      radius: 18,
      color: '#FF69B4', // 粉红色
      life: 1.0,
      isEffect: true,
      effectType: 'starfish',
      rotation: 0,
      rotationSpeed: 0.1
    };
    this.bubbles.push(starfish);
    this.scheduleEffectRemoval([starfish], 2500);
  }

  // 海豚 - 贝壳效果
  createShellEffect(x, y) {
    const shell = {
      x: x,
      y: y,
      radius: 15,
      color: '#F0E68C', // 卡其色
      life: 1.0,
      isEffect: true,
      effectType: 'shell',
      phase: 0
    };
    this.bubbles.push(shell);
    this.scheduleEffectRemoval([shell], 2000);
  }

  // 章鱼 - 墨滴效果
  createInkEffect(x, y) {
    const count = 5;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 25;
      const ink = {
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        radius: 6 + Math.random() * 8,
        color: '#4B0082', // 靛青色
        life: 1.0,
        isEffect: true,
        effectType: 'ink'
      };
      this.bubbles.push(ink);
    }
    this.scheduleEffectRemoval(this.bubbles.slice(-count), 1500);
  }

  // 小猫头鹰 - 星星效果
  createStarEffect(x, y) {
    const star = {
      x: x,
      y: y,
      radius: 12,
      color: '#FFD700', // 金色
      life: 1.0,
      isEffect: true,
      effectType: 'star',
      twinkle: 0,
      twinkleSpeed: 0.2
    };
    this.bubbles.push(star);
    this.scheduleEffectRemoval([star], 3000);
  }

  // 小狐狸 - 萤火虫效果
  createFireflyEffect(x, y) {
    const firefly = {
      x: x,
      y: y,
      radius: 8,
      color: '#ADFF2F', // 绿黄色
      life: 1.0,
      isEffect: true,
      effectType: 'firefly',
      glow: 0,
      glowSpeed: 0.15,
      moveX: (Math.random() - 0.5) * 0.5,
      moveY: (Math.random() - 0.5) * 0.5
    };
    this.bubbles.push(firefly);
    this.scheduleEffectRemoval([firefly], 3500);
  }

  // 小浣熊 - 坚果效果
  createNutEffect(x, y) {
    const nut = {
      x: x,
      y: y,
      radius: 10,
      color: '#8B4513', // 棕色
      life: 1.0,
      isEffect: true,
      effectType: 'nut',
      wobble: 0
    };
    this.bubbles.push(nut);
    this.scheduleEffectRemoval([nut], 2000);
  }

  // 默认爆裂效果（备用）
  createPopEffect(x, y) {
    // 简单的爆裂效果：创建几个小圆圈
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 / 6) * i;
      const distance = 30;
      const effectX = x + Math.cos(angle) * distance;
      const effectY = y + Math.sin(angle) * distance;
      
      const effect = {
        x: effectX,
        y: effectY,
        radius: 5,
        color: 'rgba(255, 255, 255, 0.8)',
        life: 1.0,
        isEffect: true,
        effectType: 'default'
      };
      
      this.bubbles.push(effect);
    }
    this.scheduleEffectRemoval(this.bubbles.slice(-6), 500);
  }

  // 统一的效果移除调度
  scheduleEffectRemoval(effects, delay) {
    setTimeout(() => {
      effects.forEach(effect => {
        const effectIndex = this.bubbles.indexOf(effect);
        if (effectIndex > -1) {
          this.bubbles.splice(effectIndex, 1);
        }
      });
    }, delay);
  }

  placeAnimal(x, y) {
    const currentCharacter = this.scenes[this.currentScene].characters[this.currentCharacter];
    console.log(`🐾 放置${currentCharacter.name}: (${x}, ${y})`);
    
    // 根据场景和动物类型调整放置位置
    const position = this.getAnimalPlacementPosition(x, y, currentCharacter);
    
    // 创建动物对象
    const animal = {
      x: position.x,
      y: position.y,
      targetX: position.x,
      targetY: position.y,
      character: currentCharacter,
      emoji: currentCharacter.emoji,
      name: currentCharacter.name,
      created: Date.now(),
      life: 100, // 动物生命值
      state: 'appearing', // appearing, idle, moving, interacting
      animation: {
        frame: 0,
        lastUpdate: Date.now(),
        direction: Math.random() > 0.5 ? 1 : -1, // 1右 -1左
        speed: 0.5 + Math.random() * 1.5 // 移动速度
      },
      behavior: this.getAnimalBehavior(currentCharacter),
      size: 30 + Math.random() * 20, // 动物大小
      alpha: 0 // 出现时的透明度
    };
    
    this.sceneAnimals[this.currentScene].push(animal);
    this.scheduleAnimalRemoval(animal, 15000); // 15秒后消失
    
    // 播放放置音效
    this.playAnimalPlaceSound(currentCharacter);
  }

  // 获取动物放置位置（根据动物类型和场景）
  getAnimalPlacementPosition(x, y, character) {
    const h = this.canvas.height;
    const w = this.canvas.width;
    
    // 根据场景和动物类型确定合适的位置
    switch (this.currentScene) {
      case 0: // 森林场景
        return this.getForestPosition(x, y, character, h);
      case 1: // 海底场景
        return this.getOceanPosition(x, y, character, h);
      case 2: // 夜晚场景
        return this.getNightPosition(x, y, character, h);
      default:
        return { x: x, y: h * 0.8 };
    }
  }

  // 森林场景位置分配
  getForestPosition(x, y, character, h) {
    switch (character.emoji) {
      case '🐻': // 小熊 - 地面层
        return { x: x, y: h * (0.8 + Math.random() * 0.1) };
      case '🐰': // 小兔 - 地面层
        return { x: x, y: h * (0.82 + Math.random() * 0.08) };
      case '🐸': // 青蛙 - 地面层（靠近水边）
        return { x: x, y: h * (0.85 + Math.random() * 0.05) };
      case '🐿️': // 松鼠 - 树干层
        return { x: x, y: h * (0.4 + Math.random() * 0.4) };
      case '🦋': // 蝴蝶 - 树冠到天空层
        return { x: x, y: h * (0.1 + Math.random() * 0.3) };
      case '🐦': // 小鸟 - 树冠层
        return { x: x, y: h * (0.2 + Math.random() * 0.2) };
      default:
        return { x: x, y: h * 0.8 };
    }
  }

  // 海底场景位置分配
  getOceanPosition(x, y, character, h) {
    switch (character.emoji) {
      case '🐠': // 小丑鱼 - 中层水域
        return { x: x, y: h * (0.6 + Math.random() * 0.3) };
      case '🐬': // 海豚 - 浅水到中层
        return { x: x, y: h * (0.3 + Math.random() * 0.4) };
      case '🐙': // 章鱼 - 深海层
        return { x: x, y: h * (0.85 + Math.random() * 0.1) };
      case '🐢': // 海龟 - 中层水域
        return { x: x, y: h * (0.5 + Math.random() * 0.3) };
      case '🦀': // 螃蟹 - 海底层
        return { x: x, y: h * (0.9 + Math.random() * 0.05) };
      case '🐟': // 小鱼 - 全水域
        return { x: x, y: h * (0.3 + Math.random() * 0.5) };
      default:
        return { x: x, y: h * 0.7 };
    }
  }

  // 夜晚场景位置分配
  getNightPosition(x, y, character, h) {
    switch (character.emoji) {
      case '🦉': // 猫头鹰 - 高空层
        return { x: x, y: h * (0.1 + Math.random() * 0.2) };
      case '🦇': // 蝙蝠 - 中空到高空层
        return { x: x, y: h * (0.05 + Math.random() * 0.25) };
      case '🐺': // 狼 - 地面层
        return { x: x, y: h * (0.75 + Math.random() * 0.1) };
      case '✨': // 萤火虫 - 中空层
        return { x: x, y: h * (0.3 + Math.random() * 0.3) };
      case '🦔': // 刺猬 - 地面层
        return { x: x, y: h * (0.8 + Math.random() * 0.1) };
      case '🕷️': // 蜘蛛 - 各个高度
        return { x: x, y: h * (0.2 + Math.random() * 0.6) };
      default:
        return { x: x, y: h * 0.7 };
    }
  }

  // 获取动物行为模式
  getAnimalBehavior(character) {
    const behaviors = {
      // 森林动物 - 丰富的地面和空中行为
      '🐻': { 
        type: 'foraging_walker', 
        moveChance: 0.3, 
        restChance: 0.4, 
        foragingChance: 0.2,
        interests: ['honey', 'berries'],
        mood: 'lazy'
      },
      '🐰': { 
        type: 'alert_hopper', 
        moveChance: 0.6, 
        jumpHeight: 20, 
        alertChance: 0.3,
        interests: ['carrots', 'grass'],
        mood: 'energetic'
      },
      '🐸': { 
        type: 'pond_jumper', 
        moveChance: 0.4, 
        jumpHeight: 15, 
        pondSeekChance: 0.5,
        interests: ['flies', 'water'],
        mood: 'calm'
      },
      '🐿️': { 
        type: 'tree_climber', 
        moveChance: 0.7, 
        climbChance: 0.6, 
        nutGatherChance: 0.4,
        interests: ['nuts', 'trees'],
        mood: 'busy'
      },
      '🦋': { 
        type: 'flower_visitor', 
        moveChance: 0.8, 
        flyHeight: 30, 
        flowerSeekChance: 0.7,
        interests: ['flowers', 'nectar'],
        mood: 'graceful'
      },
      '🐦': { 
        type: 'branch_hopper', 
        moveChance: 0.7, 
        perchChance: 0.5, 
        songChance: 0.3,
        interests: ['worms', 'seeds'],
        mood: 'cheerful'
      },
      
      // 海底动物 - 3D水域行为
      '🐠': { 
        type: 'school_swimmer', 
        moveChance: 0.7, 
        swimDepth: 20, 
        schoolChance: 0.6,
        interests: ['plankton', 'coral'],
        mood: 'social'
      },
      '🐬': { 
        type: 'playful_swimmer', 
        moveChance: 0.8, 
        swimSpeed: 2.0, 
        jumpChance: 0.4,
        interests: ['fish', 'play'],
        mood: 'playful'
      },
      '🐙': { 
        type: 'camouflage_crawler', 
        moveChance: 0.5, 
        tentacleWave: 10, 
        hideChance: 0.3,
        interests: ['crabs', 'shells'],
        mood: 'mysterious'
      },
      '🐢': { 
        type: 'gentle_swimmer', 
        moveChance: 0.2, 
        swimDepth: 15, 
        sunbathChance: 0.4,
        interests: ['seaweed', 'jellyfish'],
        mood: 'peaceful'
      },
      '🦀': { 
        type: 'sideways_scuttler', 
        moveChance: 0.5, 
        clawWave: true, 
        digChance: 0.3,
        interests: ['algae', 'sand'],
        mood: 'defensive'
      },
      
      // 夜晚动物 - 神秘夜行行为
      '🦉': { 
        type: 'silent_hunter', 
        moveChance: 0.6, 
        flyHeight: 40, 
        huntChance: 0.3,
        interests: ['mice', 'perches'],
        mood: 'wise'
      },
      '🦇': { 
        type: 'echo_flyer', 
        moveChance: 0.9, 
        flyPattern: 'zigzag', 
        echoChance: 0.5,
        interests: ['insects', 'caves'],
        mood: 'active'
      },
      '🐺': { 
        type: 'pack_prowler', 
        moveChance: 0.4, 
        stalkMode: true, 
        howlChance: 0.2,
        interests: ['territory', 'pack'],
        mood: 'alert'
      },
      '✨': { 
        type: 'light_dancer', 
        moveChance: 0.8, 
        glowPattern: 'pulse', 
        danceChance: 0.6,
        interests: ['mates', 'light'],
        mood: 'romantic'
      },
      '🦔': { 
        type: 'spiny_roller', 
        moveChance: 0.3, 
        rollChance: 0.4, 
        foragingChance: 0.5,
        interests: ['insects', 'berries'],
        mood: 'cautious'
      }
    };
    return behaviors[character.emoji] || { type: 'walker', moveChance: 0.5 };
  }

  // 播放动物放置音效
  playAnimalPlaceSound(character) {
    if (!this.hasAudio) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // 根据动物类型设置不同音效
    switch (character.emoji) {
      case '🐻':
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        break;
      case '🐰':
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        break;
      case '🐸':
        oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
        break;
      default:
        oscillator.frequency.setValueAtTime(350, this.audioContext.currentTime);
    }
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  // 安排动物移除
  scheduleAnimalRemoval(animal, delay) {
    setTimeout(() => {
      // 在所有场景中查找并移除动物
      for (let sceneIndex = 0; sceneIndex < this.sceneAnimals.length; sceneIndex++) {
        const index = this.sceneAnimals[sceneIndex].indexOf(animal);
        if (index > -1) {
          animal.state = 'disappearing';
          // 1秒后完全移除
          setTimeout(() => {
            const finalIndex = this.sceneAnimals[sceneIndex].indexOf(animal);
            if (finalIndex > -1) {
              this.sceneAnimals[sceneIndex].splice(finalIndex, 1);
            }
          }, 1000);
          break;
        }
      }
    }, delay);
  }

  // 小熊 - 大大的圆形泡泡
  createLargeSingleBubble(x, y, character) {
    const bubble = {
      x: x,
      y: y,
      startY: y,
      radius: 50 + Math.random() * 20, // 比普通泡泡大
      color: '#FFE5B4', // 温暖的橙黄色
      opacity: 0.8,
      created: Date.now(),
      speed: 0.3, // 慢一些，显得憨厚
      wobble: 0.005, // 轻微摆动
      wobbleOffset: Math.random() * Math.PI * 2,
      character: character,
      bubbleType: 'large_single'
    };
    
    this.bubbles.push(bubble);
    this.scheduleBubbleRemoval(bubble, 8000); // 8秒后消失
  }

  // 小兔 - 一串（3-5个）小泡泡
  createSmallChainBubbles(x, y, character) {
    const count = 3 + Math.floor(Math.random() * 3); // 3-5个
    const spacing = 25;
    
    for (let i = 0; i < count; i++) {
      const bubble = {
        x: x + (i - count/2) * spacing,
        y: y + i * 10, // 略微错开高度
        startY: y + i * 10,
        radius: 20 + Math.random() * 10, // 小泡泡
        color: '#FFB6C1', // 粉红色
        opacity: 0.8,
        created: Date.now() + i * 100, // 错开创建时间
        speed: 0.6 + Math.random() * 0.2, // 轻快
        wobble: Math.random() * 0.02 - 0.01,
        wobbleOffset: Math.random() * Math.PI * 2,
        character: character,
        bubbleType: 'small_chain',
        chainIndex: i
      };
      
      this.bubbles.push(bubble);
      this.scheduleBubbleRemoval(bubble, 6000);
    }
  }

  // 小青蛙 - 绿色的、跳动式上升的泡泡
  createBouncingGreenBubble(x, y, character) {
    const bubble = {
      x: x,
      y: y,
      startY: y,
      radius: 35 + Math.random() * 15,
      color: '#90EE90', // 浅绿色
      opacity: 0.8,
      created: Date.now(),
      speed: 0.8, // 快速上升
      wobble: 0.03, // 大幅摆动模拟跳动
      wobbleOffset: Math.random() * Math.PI * 2,
      character: character,
      bubbleType: 'bouncing_green',
      bouncePhase: 0
    };
    
    this.bubbles.push(bubble);
    this.scheduleBubbleRemoval(bubble, 5000);
  }

  // 小丑鱼 - 标准的圆形水泡，直线上升
  createStandardWaterBubble(x, y, character) {
    const bubble = {
      x: x,
      y: y,
      startY: y,
      radius: 30 + Math.random() * 15,
      color: '#87CEEB', // 天蓝色
      opacity: 0.7,
      created: Date.now(),
      speed: 0.5,
      wobble: 0, // 直线上升，无摆动
      wobbleOffset: 0,
      character: character,
      bubbleType: 'standard_water'
    };
    
    this.bubbles.push(bubble);
    this.scheduleBubbleRemoval(bubble, 7000);
  }

  // 海豚 - 一道弧形的泡泡链
  createArcChainBubbles(x, y, character) {
    const count = 6;
    const arcRadius = 80;
    const startAngle = -Math.PI / 3; // -60度
    const endAngle = -Math.PI * 2 / 3; // -120度
    
    for (let i = 0; i < count; i++) {
      const angle = startAngle + (endAngle - startAngle) * (i / (count - 1));
      const bubble = {
        x: x + Math.cos(angle) * arcRadius,
        y: y + Math.sin(angle) * arcRadius,
        startY: y + Math.sin(angle) * arcRadius,
        radius: 25 + Math.random() * 10,
        color: '#00CED1', // 深青色
        opacity: 0.8,
        created: Date.now() + i * 80, // 错开时间创造弧形效果
        speed: 0.4,
        wobble: 0.01,
        wobbleOffset: angle,
        character: character,
        bubbleType: 'arc_chain',
        arcIndex: i
      };
      
      this.bubbles.push(bubble);
      this.scheduleBubbleRemoval(bubble, 6500);
    }
  }

  // 章鱼 - 一次吹出多个（约6个）小泡泡，呈扇形散开
  createFanMultipleBubbles(x, y, character) {
    const count = 6;
    const fanAngle = Math.PI / 2; // 90度扇形
    const startAngle = -fanAngle / 2;
    
    for (let i = 0; i < count; i++) {
      const angle = startAngle + (fanAngle * i / (count - 1));
      const distance = 20 + Math.random() * 30;
      const bubble = {
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        startY: y + Math.sin(angle) * distance,
        radius: 18 + Math.random() * 12,
        color: '#DDA0DD', // 淡紫色
        opacity: 0.8,
        created: Date.now(),
        speed: 0.5 + Math.random() * 0.3,
        wobble: Math.random() * 0.02 - 0.01,
        wobbleOffset: angle,
        character: character,
        bubbleType: 'fan_multiple',
        fanIndex: i
      };
      
      this.bubbles.push(bubble);
      this.scheduleBubbleRemoval(bubble, 5500);
    }
  }

  // 小猫头鹰 - 闪着微光的泡泡，像小月亮
  createGlowingMoonBubble(x, y, character) {
    const bubble = {
      x: x,
      y: y,
      startY: y,
      radius: 40 + Math.random() * 15,
      color: '#F0F8FF', // 淡蓝白色
      opacity: 0.9,
      created: Date.now(),
      speed: 0.3,
      wobble: 0.008,
      wobbleOffset: Math.random() * Math.PI * 2,
      character: character,
      bubbleType: 'glowing_moon',
      glowPhase: 0 // 用于闪烁效果
    };
    
    this.bubbles.push(bubble);
    this.scheduleBubbleRemoval(bubble, 9000); // 持续时间长一些
  }

  // 小狐狸 - 橙色的、拖着细小光尾的泡泡
  createOrangeTrailBubble(x, y, character) {
    const bubble = {
      x: x,
      y: y,
      startY: y,
      radius: 32 + Math.random() * 12,
      color: '#FFA500', // 橙色
      opacity: 0.8,
      created: Date.now(),
      speed: 0.6,
      wobble: 0.015,
      wobbleOffset: Math.random() * Math.PI * 2,
      character: character,
      bubbleType: 'orange_trail',
      trail: [] // 存储轨迹点
    };
    
    this.bubbles.push(bubble);
    this.scheduleBubbleRemoval(bubble, 6000);
  }

  // 小浣熊 - 银色的泡泡，像小卫星一样绕圈上升
  createSilverOrbitBubble(x, y, character) {
    const bubble = {
      x: x,
      y: y,
      startY: y,
      centerX: x, // 轨道中心
      radius: 35 + Math.random() * 10,
      color: '#C0C0C0', // 银色
      opacity: 0.8,
      created: Date.now(),
      speed: 0.4,
      wobble: 0,
      wobbleOffset: 0,
      character: character,
      bubbleType: 'silver_orbit',
      orbitRadius: 30, // 轨道半径
      orbitPhase: Math.random() * Math.PI * 2 // 轨道相位
    };
    
    this.bubbles.push(bubble);
    this.scheduleBubbleRemoval(bubble, 7500);
  }

  // 默认泡泡（备用）
  createDefaultBubble(x, y, character) {
    const bubble = {
      x: x,
      y: y,
      startY: y,
      radius: 30 + Math.random() * 20,
      color: `hsl(${Math.random() * 360}, 70%, 80%)`,
      opacity: 0.8,
      created: Date.now(),
      speed: 0.5 + Math.random() * 0.5,
      wobble: Math.random() * 0.02 - 0.01,
      wobbleOffset: Math.random() * Math.PI * 2,
      character: character,
      bubbleType: 'default'
    };
    
    this.bubbles.push(bubble);
    this.scheduleBubbleRemoval(bubble, 5000);
  }

  // 统一的泡泡移除调度
  scheduleBubbleRemoval(bubble, delay) {
    setTimeout(() => {
      const index = this.bubbles.indexOf(bubble);
      if (index > -1) {
        this.bubbles.splice(index, 1);
      }
    }, delay);
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.gameLoop();
    console.log('🎮 游戏循环开始');
  }

  // 开始游戏（用户点击开始按钮后调用）
  startGame() {
    if (this.gameStarted) return;
    
    this.gameStarted = true;
    this.gameStartTime = Date.now();
    
    // 激活音频并开始背景音乐
    this.activateAudio();
    
    // 设置2分钟后自动停止的计时器
    this.gameTimer = setTimeout(() => {
      this.endGame();
    }, this.gameDuration);
    
    console.log('🎮 游戏正式开始！2分钟后自动结束');
  }

  // 结束游戏
  endGame() {
    this.gameStarted = false;
    this.stopBackgroundMusic();
    
    if (this.gameTimer) {
      clearTimeout(this.gameTimer);
      this.gameTimer = null;
    }
    
    // 清空所有场景的动物
    this.sceneAnimals = [[], [], []];
    
    console.log('🏁 游戏结束！');
  }

  // 重新开始游戏
  restartGame() {
    this.endGame();
    // 短暂延迟后可以重新开始
    setTimeout(() => {
      console.log('🔄 可以重新开始游戏');
    }, 1000);
  }

  gameLoop() {
    if (!this.isRunning) return;
    
    this.update();
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    const now = Date.now();
    
    // 更新当前场景的动物状态
    const currentSceneAnimals = this.sceneAnimals[this.currentScene];
    currentSceneAnimals.forEach(animal => {
      this.updateAnimal(animal, now);
    });
    
    // 移除生命值耗尽的动物
    this.sceneAnimals[this.currentScene] = currentSceneAnimals.filter(animal => 
      animal.life > 0 && animal.state !== 'removed'
    );
  }

  // 更新动物状态
  updateAnimal(animal, now) {
    const deltaTime = now - animal.animation.lastUpdate;
    animal.animation.lastUpdate = now;
    
    // 更新透明度（出现/消失效果）
    switch (animal.state) {
      case 'appearing':
        animal.alpha = Math.min(1, animal.alpha + deltaTime * 0.003);
        if (animal.alpha >= 1) {
          animal.state = 'idle';
        }
        break;
      case 'disappearing':
        animal.alpha = Math.max(0, animal.alpha - deltaTime * 0.002);
        if (animal.alpha <= 0) {
          animal.state = 'removed';
        }
        break;
    }
    
    // 更新动画帧
    animal.animation.frame += deltaTime * 0.01;
    
    // 根据行为类型更新位置
    this.updateAnimalBehaviors(animal, deltaTime);
    
    // 生命值缓慢减少
    if (animal.state !== 'disappearing' && animal.state !== 'removed') {
      animal.life = Math.max(0, animal.life - deltaTime * 0.01);
    }
  }

  // 更新动物行为
  updateAnimalBehaviors(animal, deltaTime) {
    const behavior = animal.behavior;
    const canvas = this.canvas;
    
    // 随机决定是否改变行为
    if (Math.random() < behavior.moveChance * deltaTime * 0.001) {
      switch (behavior.type) {
        // 森林动物行为
        case 'foraging_walker':
          this.updateForagingWalker(animal, deltaTime);
          break;
        case 'alert_hopper':
          this.updateAlertHopper(animal, deltaTime);
          break;
        case 'pond_jumper':
          this.updatePondJumper(animal, deltaTime);
          break;
        case 'tree_climber':
          this.updateTreeClimber(animal, deltaTime);
          break;
        case 'flower_visitor':
          this.updateFlowerVisitor(animal, deltaTime);
          break;
        case 'branch_hopper':
          this.updateBranchHopper(animal, deltaTime);
          break;
          
        // 海底动物行为
        case 'school_swimmer':
          this.updateSchoolSwimmer(animal, deltaTime);
          break;
        case 'playful_swimmer':
          this.updatePlayfulSwimmer(animal, deltaTime);
          break;
        case 'camouflage_crawler':
          this.updateCamouflageCrawler(animal, deltaTime);
          break;
        case 'gentle_swimmer':
          this.updateGentleSwimmer(animal, deltaTime);
          break;
        case 'sideways_scuttler':
          this.updateSidewaysScuttler(animal, deltaTime);
          break;
          
        // 夜晚动物行为
        case 'silent_hunter':
          this.updateSilentHunter(animal, deltaTime);
          break;
        case 'echo_flyer':
          this.updateEchoFlyer(animal, deltaTime);
          break;
        case 'pack_prowler':
          this.updatePackProwler(animal, deltaTime);
          break;
        case 'light_dancer':
          this.updateLightDancer(animal, deltaTime);
          break;
        case 'spiny_roller':
          this.updateSpinyRoller(animal, deltaTime);
          break;
          
        // 兼容旧行为
        case 'slow_walker':
          this.updateSlowWalker(animal, deltaTime);
          break;
        case 'hopper':
          this.updateHopper(animal, deltaTime);
          break;
        case 'jumper':
          this.updateJumper(animal, deltaTime);
          break;
        default:
          this.updateWalker(animal, deltaTime);
      }
    }
    
    // 确保动物在画面内
    animal.x = Math.max(animal.size, Math.min(canvas.width - animal.size, animal.x));
    animal.y = Math.max(animal.size, Math.min(canvas.height - animal.size, animal.y));
  }

  // 慢速行走者（熊）
  updateSlowWalker(animal, deltaTime) {
    if (animal.state === 'idle') {
      const moveDistance = animal.animation.speed * deltaTime * 0.05;
      animal.x += animal.animation.direction * moveDistance;
      
      // 随机改变方向
      if (Math.random() < 0.02) {
        animal.animation.direction *= -1;
      }
    }
  }

  // 跳跃者（兔子）
  updateHopper(animal, deltaTime) {
    if (animal.state === 'idle') {
      const jumpDistance = animal.animation.speed * 15;
      animal.x += animal.animation.direction * jumpDistance;
      
      // 跳跃动画
      animal.y = animal.targetY - Math.abs(Math.sin(animal.animation.frame * 0.5)) * animal.behavior.jumpHeight;
      
      // 随机改变方向
      if (Math.random() < 0.05) {
        animal.animation.direction *= -1;
      }
    }
  }

  // 跳跃者（青蛙）
  updateJumper(animal, deltaTime) {
    if (animal.state === 'idle') {
      const jumpDistance = animal.animation.speed * 10;
      animal.x += animal.animation.direction * jumpDistance;
      
      // 跳跃动画
      animal.y = animal.targetY - Math.abs(Math.sin(animal.animation.frame * 0.3)) * animal.behavior.jumpHeight;
      
      // 随机改变方向
      if (Math.random() < 0.03) {
        animal.animation.direction *= -1;
      }
    }
  }

  // 飞行者（蝴蝶）
  updateFlyer(animal, deltaTime) {
    if (animal.state === 'idle') {
      const moveDistance = animal.animation.speed * deltaTime * 0.08;
      animal.x += animal.animation.direction * moveDistance;
      
      // 飞行高度变化
      animal.y = animal.targetY - animal.behavior.flyHeight + 
                 Math.sin(animal.animation.frame * 0.1) * animal.behavior.flyHeight;
      
      // 更频繁地改变方向
      if (Math.random() < 0.08) {
        animal.animation.direction *= -1;
      }
    }
  }

  // 攀爬者（松鼠）
  updateClimber(animal, deltaTime) {
    if (animal.state === 'idle') {
      const moveDistance = animal.animation.speed * deltaTime * 0.06;
      animal.x += animal.animation.direction * moveDistance;
      
      // 随机改变方向
      if (Math.random() < 0.04) {
        animal.animation.direction *= -1;
      }
    }
  }

  // 普通行走者
  updateWalker(animal, deltaTime) {
    if (animal.state === 'idle') {
      const moveDistance = animal.animation.speed * deltaTime * 0.03;
      animal.x += animal.animation.direction * moveDistance;
      
      // 随机改变方向
      if (Math.random() < 0.03) {
        animal.animation.direction *= -1;
      }
    }
  }

  // 游泳者（小丑鱼）
  updateSwimmer(animal, deltaTime) {
    if (animal.state === 'idle') {
      const moveDistance = animal.animation.speed * deltaTime * 0.04;
      animal.x += animal.animation.direction * moveDistance;
      
      // 上下游动
      animal.y = animal.targetY + Math.sin(animal.animation.frame * 0.02) * animal.behavior.swimDepth;
      
      // 随机改变方向
      if (Math.random() < 0.04) {
        animal.animation.direction *= -1;
      }
    }
  }

  // 快速游泳者（海豚）
  updateFastSwimmer(animal, deltaTime) {
    if (animal.state === 'idle') {
      const moveDistance = animal.animation.speed * deltaTime * 0.08 * animal.behavior.swimSpeed;
      animal.x += animal.animation.direction * moveDistance;
      
      // 波浪式游泳
      animal.y = animal.targetY + Math.sin(animal.animation.frame * 0.05) * 25;
      
      // 频繁改变方向
      if (Math.random() < 0.06) {
        animal.animation.direction *= -1;
      }
    }
  }

  // 触手移动者（章鱼）
  updateTentacleMover(animal, deltaTime) {
    if (animal.state === 'idle') {
      const moveDistance = animal.animation.speed * deltaTime * 0.02;
      animal.x += animal.animation.direction * moveDistance;
      
      // 触手波动效果
      animal.y = animal.targetY + Math.sin(animal.animation.frame * 0.03) * animal.behavior.tentacleWave;
      
      // 偶尔改变方向
      if (Math.random() < 0.02) {
        animal.animation.direction *= -1;
      }
    }
  }

  // 夜间飞行者（猫头鹰）
  updateNightFlyer(animal, deltaTime) {
    if (animal.state === 'idle') {
      const moveDistance = animal.animation.speed * deltaTime * 0.06;
      animal.x += animal.animation.direction * moveDistance;
      
      // 静默飞行高度
      animal.y = animal.targetY - animal.behavior.flyHeight + 
                 Math.sin(animal.animation.frame * 0.02) * 15;
      
      // 随机改变方向
      if (Math.random() < 0.05) {
        animal.animation.direction *= -1;
      }
    }
  }

  // 蝙蝠飞行者
  updateBatFlyer(animal, deltaTime) {
    if (animal.state === 'idle') {
      const moveDistance = animal.animation.speed * deltaTime * 0.1;
      
      // 之字形飞行
      if (animal.behavior.flyPattern === 'zigzag') {
        animal.x += animal.animation.direction * moveDistance;
        animal.y = animal.targetY - 30 + Math.sin(animal.animation.frame * 0.1) * 20;
      }
      
      // 非常频繁地改变方向
      if (Math.random() < 0.1) {
        animal.animation.direction *= -1;
      }
    }
  }

  // 潜行者（狼）
  updateProwler(animal, deltaTime) {
    if (animal.state === 'idle') {
      const moveDistance = animal.animation.speed * deltaTime * 0.025;
      animal.x += animal.animation.direction * moveDistance;
      
      // 潜行时的轻微起伏
      if (animal.behavior.stalkMode) {
        animal.y = animal.targetY + Math.sin(animal.animation.frame * 0.01) * 3;
      }
      
      // 谨慎地改变方向
      if (Math.random() < 0.025) {
        animal.animation.direction *= -1;
      }
    }
  }

  // === 新的丰富动物行为系统 ===

  // 觅食行走者（小熊）
  updateForagingWalker(animal, deltaTime) {
    if (animal.state === 'idle') {
      const behavior = animal.behavior;
      
      // 随机行为选择
      const action = Math.random();
      
      if (action < behavior.restChance * 0.01) {
        // 休息行为
        animal.state = 'resting';
        animal.restTimer = 2000 + Math.random() * 3000; // 2-5秒
      } else if (action < (behavior.restChance + behavior.foragingChance) * 0.01) {
        // 觅食行为
        animal.state = 'foraging';
        animal.foragingTimer = 1000 + Math.random() * 2000; // 1-3秒
      } else {
        // 正常移动
        const moveDistance = animal.animation.speed * deltaTime * 0.03;
        animal.x += animal.animation.direction * moveDistance;
        
        // 偶尔改变方向
        if (Math.random() < 0.02) {
          animal.animation.direction *= -1;
        }
      }
    } else if (animal.state === 'resting') {
      animal.restTimer -= deltaTime;
      if (animal.restTimer <= 0) {
        animal.state = 'idle';
      }
    } else if (animal.state === 'foraging') {
      // 觅食时的轻微移动
      animal.x += Math.sin(animal.animation.frame * 0.1) * 0.5;
      animal.foragingTimer -= deltaTime;
      if (animal.foragingTimer <= 0) {
        animal.state = 'idle';
      }
    }
  }

  // 警觉跳跃者（小兔）
  updateAlertHopper(animal, deltaTime) {
    if (animal.state === 'idle') {
      const behavior = animal.behavior;
      
      if (Math.random() < behavior.alertChance * 0.01) {
        // 警觉行为 - 环顾四周
        animal.state = 'alert';
        animal.alertTimer = 1000 + Math.random() * 2000;
      } else {
        // 跳跃移动
        const jumpDistance = animal.animation.speed * 12;
        animal.x += animal.animation.direction * jumpDistance;
        
        // 跳跃动画
        animal.y = animal.targetY - Math.abs(Math.sin(animal.animation.frame * 0.4)) * behavior.jumpHeight;
        
        // 随机改变方向
        if (Math.random() < 0.04) {
          animal.animation.direction *= -1;
        }
      }
    } else if (animal.state === 'alert') {
      // 警觉时停止移动，只是环顾
      animal.alertTimer -= deltaTime;
      if (animal.alertTimer <= 0) {
        animal.state = 'idle';
      }
    }
  }

  // 池塘跳跃者（青蛙）
  updatePondJumper(animal, deltaTime) {
    if (animal.state === 'idle') {
      const behavior = animal.behavior;
      
      if (Math.random() < behavior.pondSeekChance * 0.01) {
        // 寻找水源行为
        animal.state = 'seeking_water';
        animal.seekTimer = 3000 + Math.random() * 2000;
      } else {
        // 正常跳跃
        const jumpDistance = animal.animation.speed * 8;
        animal.x += animal.animation.direction * jumpDistance;
        
        // 跳跃高度动画
        animal.y = animal.targetY - Math.abs(Math.sin(animal.animation.frame * 0.25)) * behavior.jumpHeight;
        
        if (Math.random() < 0.03) {
          animal.animation.direction *= -1;
        }
      }
    } else if (animal.state === 'seeking_water') {
      // 寻找水源时的特殊移动模式
      const moveDistance = animal.animation.speed * deltaTime * 0.02;
      animal.x += animal.animation.direction * moveDistance;
      animal.seekTimer -= deltaTime;
      if (animal.seekTimer <= 0) {
        animal.state = 'idle';
      }
    }
  }

  // 树木攀爬者（松鼠）
  updateTreeClimber(animal, deltaTime) {
    if (animal.state === 'idle') {
      const behavior = animal.behavior;
      
      if (Math.random() < behavior.climbChance * 0.01) {
        // 攀爬行为
        animal.state = 'climbing';
        animal.climbTimer = 2000 + Math.random() * 3000;
        animal.climbDirection = Math.random() > 0.5 ? -1 : 1; // 上爬或下爬
      } else if (Math.random() < behavior.nutGatherChance * 0.01) {
        // 收集坚果行为
        animal.state = 'gathering';
        animal.gatherTimer = 1500 + Math.random() * 1000;
      } else {
        // 正常移动
        const moveDistance = animal.animation.speed * deltaTime * 0.05;
        animal.x += animal.animation.direction * moveDistance;
        
        if (Math.random() < 0.05) {
          animal.animation.direction *= -1;
        }
      }
    } else if (animal.state === 'climbing') {
      // 垂直攀爬
      const climbDistance = animal.animation.speed * deltaTime * 0.03;
      animal.y += animal.climbDirection * climbDistance;
      
      // 限制攀爬范围
      const h = this.canvas.height;
      if (animal.y < h * 0.2) animal.climbDirection = 1;
      if (animal.y > h * 0.8) animal.climbDirection = -1;
      
      animal.climbTimer -= deltaTime;
      if (animal.climbTimer <= 0) {
        animal.state = 'idle';
      }
    } else if (animal.state === 'gathering') {
      // 收集时的小幅度移动
      animal.x += Math.sin(animal.animation.frame * 0.2) * 1;
      animal.gatherTimer -= deltaTime;
      if (animal.gatherTimer <= 0) {
        animal.state = 'idle';
      }
    }
  }

  // 访花者（蝴蝶）
  updateFlowerVisitor(animal, deltaTime) {
    if (animal.state === 'idle') {
      const behavior = animal.behavior;
      
      if (Math.random() < behavior.flowerSeekChance * 0.01) {
        // 寻找花朵行为
        animal.state = 'seeking_flower';
        animal.seekTimer = 2000 + Math.random() * 3000;
      } else {
        // 优雅的飞行
        const moveDistance = animal.animation.speed * deltaTime * 0.06;
        animal.x += animal.animation.direction * moveDistance;
        
        // 波浪式飞行
        animal.y = animal.targetY - behavior.flyHeight + 
                   Math.sin(animal.animation.frame * 0.08) * behavior.flyHeight * 0.8;
        
        // 频繁改变方向，模拟蝴蝶飞行
        if (Math.random() < 0.08) {
          animal.animation.direction *= -1;
        }
      }
    } else if (animal.state === 'seeking_flower') {
      // 寻花时的螺旋飞行
      const spiralRadius = 15;
      const spiralSpeed = animal.animation.frame * 0.1;
      animal.x += Math.cos(spiralSpeed) * spiralRadius * deltaTime * 0.001;
      animal.y += Math.sin(spiralSpeed) * spiralRadius * deltaTime * 0.001;
      
      animal.seekTimer -= deltaTime;
      if (animal.seekTimer <= 0) {
        animal.state = 'idle';
      }
    }
  }

  // 小青蛙的跳动泡泡动画
  updateBouncingGreenBubble(bubble, age) {
    // 基础上升
    const baseY = bubble.startY - age * bubble.speed * 40;
    
    // 跳动效果：正弦波叠加
    bubble.bouncePhase += 0.3;
    const bounceOffset = Math.sin(bubble.bouncePhase) * 15;
    bubble.y = baseY + bounceOffset;
    
    // 左右摆动幅度更大
    bubble.x += Math.sin(age * 3 + bubble.wobbleOffset) * bubble.wobble;
  }

  // 小猫头鹰的发光月亮泡泡
  updateGlowingMoonBubble(bubble, age) {
    // 缓慢上升
    bubble.y = bubble.startY - age * bubble.speed * 25;
    
    // 轻微摆动
    bubble.x += Math.sin(age * 1.5 + bubble.wobbleOffset) * bubble.wobble;
    
    // 闪烁效果
    bubble.glowPhase += 0.1;
    const glow = 0.3 + Math.sin(bubble.glowPhase) * 0.2;
    bubble.glowIntensity = glow;
  }

  // 小狐狸的橙色拖尾泡泡
  updateOrangeTrailBubble(bubble, age) {
    // 正常上升
    bubble.y = bubble.startY - age * bubble.speed * 35;
    
    // 摆动
    bubble.x += Math.sin(age * 2.5 + bubble.wobbleOffset) * bubble.wobble;
    
    // 记录轨迹
    bubble.trail.push({ x: bubble.x, y: bubble.y, opacity: 0.5 });
    
    // 限制轨迹长度
    if (bubble.trail.length > 8) {
      bubble.trail.shift();
    }
    
    // 轨迹透明度衰减
    bubble.trail.forEach((point, index) => {
      point.opacity *= 0.9;
    });
  }

  // 小浣熊的轨道泡泡
  updateSilverOrbitBubble(bubble, age) {
    // 基础上升
    const baseY = bubble.startY - age * bubble.speed * 30;
    
    // 轨道运动
    bubble.orbitPhase += 0.15;
    bubble.x = bubble.centerX + Math.cos(bubble.orbitPhase) * bubble.orbitRadius;
    bubble.y = baseY + Math.sin(bubble.orbitPhase) * (bubble.orbitRadius * 0.3);
  }

  // 默认泡泡动画
  updateDefaultBubble(bubble, age) {
    // 基础上升
    bubble.y = bubble.startY - age * bubble.speed * 30;
    
    // 摆动
    if (bubble.wobble !== 0) {
      bubble.x += Math.sin(age * 2 + bubble.wobbleOffset) * bubble.wobble;
    }
  }

  // 更新特殊效果
  updateSpecialEffect(effect) {
    // 基础生命值衰减
    effect.life -= 0.02;
    
    // 根据效果类型更新特殊属性
    switch (effect.effectType) {
      case 'starfish':
        effect.rotation += effect.rotationSpeed;
        break;
      case 'star':
        effect.twinkle += effect.twinkleSpeed;
        break;
      case 'firefly':
        effect.glow += effect.glowSpeed;
        effect.x += effect.moveX;
        effect.y += effect.moveY;
        break;
      case 'nut':
        effect.wobble += 0.1;
        break;
      case 'shell':
        effect.phase += 0.05;
        break;
      default:
        // 默认淡出效果
        if (effect.color && effect.color.includes('rgba')) {
          effect.color = `rgba(255, 255, 255, ${effect.life})`;
        }
        break;
    }
  }

  // 渲染不同类型的泡泡
  renderBubble(bubble) {
    this.ctx.save();
    this.ctx.globalAlpha = bubble.opacity;

    // 根据泡泡类型应用特殊渲染
    switch (bubble.bubbleType) {
      case 'glowing_moon':
        this.renderGlowingMoonBubble(bubble);
        break;
      case 'orange_trail':
        this.renderOrangeTrailBubble(bubble);
        break;
      default:
        this.renderDefaultBubbleVisual(bubble);
        break;
    }

    this.ctx.restore();
  }

  // 渲染动物
  renderAnimal(animal) {
    this.ctx.save();
    this.ctx.globalAlpha = animal.alpha;
    
    // 动物位置
    const x = animal.x;
    const y = animal.y;
    const size = animal.size;
    
    // 根据状态添加特殊效果
    if (animal.state === 'interacting') {
      // 互动时的光环效果
      const glowRadius = size * 1.5;
      const glowGradient = this.ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
      glowGradient.addColorStop(0, 'rgba(255, 255, 0, 0.3)');
      glowGradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
      
      this.ctx.fillStyle = glowGradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // 动物阴影
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.beginPath();
    this.ctx.ellipse(x, y + size * 0.8, size * 0.8, size * 0.3, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 动物身体背景
    const bodyGradient = this.ctx.createRadialGradient(x, y - size * 0.2, 0, x, y, size);
    bodyGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    bodyGradient.addColorStop(0.7, 'rgba(200, 200, 200, 0.6)');
    bodyGradient.addColorStop(1, 'rgba(150, 150, 150, 0.4)');
    
    this.ctx.fillStyle = bodyGradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size * 0.9, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 渲染动物表情符号
    this.ctx.font = `${size * 1.2}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    // 动物摆动效果
    const wobble = Math.sin(animal.animation.frame * 0.5) * 2;
    
    // 根据移动方向翻转
    if (animal.animation.direction < 0) {
      this.ctx.save();
      this.ctx.scale(-1, 1);
      this.ctx.fillText(animal.emoji, -x + wobble, y - size * 0.1);
      this.ctx.restore();
    } else {
      this.ctx.fillText(animal.emoji, x + wobble, y - size * 0.1);
    }
    
    // 生命值指示器（可选）
    if (animal.life < 50) {
      const barWidth = size * 1.5;
      const barHeight = 4;
      const barY = y - size * 1.3;
      
      // 生命值背景
      this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      this.ctx.fillRect(x - barWidth / 2, barY, barWidth, barHeight);
      
      // 生命值前景
      this.ctx.fillStyle = animal.life > 25 ? 'rgba(255, 255, 0, 0.8)' : 'rgba(255, 0, 0, 0.8)';
      this.ctx.fillRect(x - barWidth / 2, barY, (barWidth * animal.life) / 100, barHeight);
    }
    
    // 状态指示（调试用）
    if (animal.state === 'appearing' || animal.state === 'disappearing') {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      this.ctx.font = '12px Arial';
      this.ctx.fillText(animal.state, x, y + size * 1.5);
    }
    
    this.ctx.restore();
  }

  // 发光月亮泡泡渲染
  renderGlowingMoonBubble(bubble) {
    // 外层发光效果
    if (bubble.glowIntensity) {
      const glowGradient = this.ctx.createRadialGradient(
        bubble.x, bubble.y, 0,
        bubble.x, bubble.y, bubble.radius * 2
      );
      glowGradient.addColorStop(0, `rgba(240, 248, 255, ${bubble.glowIntensity})`);
      glowGradient.addColorStop(1, 'rgba(240, 248, 255, 0)');
      
      this.ctx.fillStyle = glowGradient;
      this.ctx.beginPath();
      this.ctx.arc(bubble.x, bubble.y, bubble.radius * 2, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // 主体泡泡
    this.renderDefaultBubbleVisual(bubble);
  }

  // 橙色拖尾泡泡渲染
  renderOrangeTrailBubble(bubble) {
    // 渲染轨迹
    if (bubble.trail && bubble.trail.length > 0) {
      bubble.trail.forEach((point, index) => {
        if (point.opacity > 0.05) {
          this.ctx.save();
          this.ctx.globalAlpha = point.opacity;
          this.ctx.fillStyle = '#FFA500';
          this.ctx.beginPath();
          this.ctx.arc(point.x, point.y, bubble.radius * 0.3, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.restore();
        }
      });
    }
    
    // 主体泡泡
    this.renderDefaultBubbleVisual(bubble);
  }

  // 默认泡泡视觉效果
  renderDefaultBubbleVisual(bubble) {
    // 主体泡泡
    this.ctx.fillStyle = bubble.color;
    this.ctx.beginPath();
    this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 泡泡高光
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.beginPath();
    this.ctx.arc(
      bubble.x - bubble.radius * 0.3, 
      bubble.y - bubble.radius * 0.3, 
      bubble.radius * 0.3, 
      0, Math.PI * 2
    );
    this.ctx.fill();
  }

  // 渲染特殊效果
  renderSpecialEffect(effect) {
    this.ctx.save();
    this.ctx.globalAlpha = Math.max(0, effect.life);

    switch (effect.effectType) {
      case 'daisy_center':
        this.renderDaisyCenter(effect);
        break;
      case 'daisy_petal':
        this.renderDaisyPetal(effect);
        break;
      case 'carrot':
        this.renderCarrot(effect);
        break;
      case 'leaf':
        this.renderLeaf(effect);
        break;
      case 'starfish':
        this.renderStarfish(effect);
        break;
      case 'shell':
        this.renderShell(effect);
        break;
      case 'ink':
        this.renderInk(effect);
        break;
      case 'star':
        this.renderStar(effect);
        break;
      case 'firefly':
        this.renderFirefly(effect);
        break;
      case 'nut':
        this.renderNut(effect);
        break;
      default:
        this.renderDefaultEffect(effect);
        break;
    }

    this.ctx.restore();
  }

  // 雏菊花心渲染
  renderDaisyCenter(effect) {
    this.ctx.fillStyle = effect.color;
    this.ctx.beginPath();
    this.ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // 雏菊花瓣渲染
  renderDaisyPetal(effect) {
    this.ctx.fillStyle = effect.color;
    this.ctx.beginPath();
    this.ctx.ellipse(effect.x, effect.y, effect.radius, effect.radius * 0.6, effect.angle, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // 胡萝卜条渲染
  renderCarrot(effect) {
    this.ctx.save();
    this.ctx.translate(effect.x, effect.y);
    this.ctx.rotate(effect.angle);
    this.ctx.fillStyle = effect.color;
    this.ctx.fillRect(-effect.width/2, -effect.height/2, effect.width, effect.height);
    this.ctx.restore();
  }

  // 荷叶渲染
  renderLeaf(effect) {
    this.ctx.save();
    this.ctx.translate(effect.x, effect.y);
    this.ctx.rotate(effect.rotation);
    this.ctx.fillStyle = effect.color;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, effect.radius, effect.radius * 0.7, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 叶脉
    this.ctx.strokeStyle = '#228B22';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -effect.radius * 0.7);
    this.ctx.lineTo(0, effect.radius * 0.7);
    this.ctx.stroke();
    this.ctx.restore();
  }

  // 海星渲染
  renderStarfish(effect) {
    this.ctx.save();
    this.ctx.translate(effect.x, effect.y);
    this.ctx.rotate(effect.rotation);
    this.ctx.fillStyle = effect.color;
    
    // 绘制五角星
    this.ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5;
      const x = Math.cos(angle) * effect.radius;
      const y = Math.sin(angle) * effect.radius;
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  // 贝壳渲染
  renderShell(effect) {
    const scale = 1 + Math.sin(effect.phase) * 0.1;
    this.ctx.save();
    this.ctx.translate(effect.x, effect.y);
    this.ctx.scale(scale, scale);
    this.ctx.fillStyle = effect.color;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, effect.radius, 0, Math.PI);
    this.ctx.fill();
    
    // 贝壳纹理
    this.ctx.strokeStyle = '#DAA520';
    this.ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) {
      this.ctx.beginPath();
      this.ctx.arc(0, 0, effect.radius * (i/5), 0, Math.PI);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  // 墨滴渲染
  renderInk(effect) {
    this.ctx.fillStyle = effect.color;
    this.ctx.beginPath();
    this.ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // 星星渲染
  renderStar(effect) {
    const brightness = 0.5 + Math.sin(effect.twinkle) * 0.5;
    this.ctx.save();
    this.ctx.globalAlpha *= brightness;
    this.ctx.fillStyle = effect.color;
    this.ctx.translate(effect.x, effect.y);
    
    // 绘制六角星
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = Math.cos(angle) * effect.radius;
      const y = Math.sin(angle) * effect.radius;
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  // 萤火虫渲染
  renderFirefly(effect) {
    const glow = 0.5 + Math.sin(effect.glow) * 0.5;
    
    // 发光效果
    this.ctx.save();
    this.ctx.globalAlpha *= glow;
    const gradient = this.ctx.createRadialGradient(
      effect.x, effect.y, 0,
      effect.x, effect.y, effect.radius * 3
    );
    gradient.addColorStop(0, effect.color);
    gradient.addColorStop(1, 'rgba(173, 255, 47, 0)');
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(effect.x, effect.y, effect.radius * 3, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 主体
    this.ctx.fillStyle = effect.color;
    this.ctx.beginPath();
    this.ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  // 坚果渲染
  renderNut(effect) {
    const wobble = Math.sin(effect.wobble) * 2;
    this.ctx.save();
    this.ctx.translate(effect.x + wobble, effect.y);
    this.ctx.fillStyle = effect.color;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, effect.radius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 坚果纹理
    this.ctx.strokeStyle = '#654321';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(0, 0, effect.radius * 0.7, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.restore();
  }

  // 默认效果渲染
  renderDefaultEffect(effect) {
    this.ctx.fillStyle = effect.color;
    this.ctx.beginPath();
    this.ctx.arc(effect.x, effect.y, effect.radius || 5, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // 渲染场景背景
  renderSceneBackground() {
    switch (this.currentScene) {
      case 0:
        this.renderForestBackground();
        break;
      case 1:
        this.renderOceanBackground();
        break;
      case 2:
        this.renderNightBackground();
        break;
      default:
        this.renderDefaultBackground();
        break;
    }
  }

  // 神秘森林背景 - 茂密树林、斑驳光影、林间小径、野生动物
  renderForestBackground() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const time = Date.now() * 0.001;
    
    // 森林天空 - 透过树冠的天空
    const skyGradient = this.ctx.createLinearGradient(0, 0, 0, h * 0.3);
    skyGradient.addColorStop(0, '#4A90E2'); // 深蓝天空
    skyGradient.addColorStop(0.5, '#7BB3F0'); // 中蓝
    skyGradient.addColorStop(1, '#A8D0F0'); // 浅蓝
    this.ctx.fillStyle = skyGradient;
    this.ctx.fillRect(0, 0, w, h * 0.3);
    
    // 远景山脉 - 雾气缭绕
    this.renderForestMountains(time);
    
    // 背景树林 - 多层次
    this.renderBackgroundTrees(time);
    
    // 主要树木 - 高大茂密
    this.renderMainForestTrees(time);
    
    // 森林地面 - 落叶和苔藓
    this.renderForestFloor(time);
    
    // 林间光影 - 阳光透过树叶
    this.renderForestLightRays(time);
    
    // 前景植被 - 蕨类和灌木
    this.renderForestUndergrowth(time);
    
    // 森林生物 - 小鸟和松鼠
    this.renderForestCreatures(time);
    
    // 漂浮孢子和花粉
    this.renderForestParticles(time);
  }

  // 海底世界背景 - 深浅不一的蓝色海水、摇曳的水草、珊瑚礁、缓慢游动的小鱼群影子
  renderOceanBackground() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const time = Date.now() * 0.001;
    
    // 现实深海渐变 - 水下光线效果
    const oceanGradient = this.ctx.createLinearGradient(0, 0, 0, h);
    oceanGradient.addColorStop(0, '#0c1445'); // 极深蓝黑
    oceanGradient.addColorStop(0.15, '#1a237e'); // 深蓝紫
    oceanGradient.addColorStop(0.3, '#283593'); // 蓝紫
    oceanGradient.addColorStop(0.5, '#3949ab'); // 中蓝
    oceanGradient.addColorStop(0.7, '#5c6bc0'); // 浅蓝
    oceanGradient.addColorStop(0.85, '#7986cb'); // 更浅蓝
    oceanGradient.addColorStop(1, '#9fa8da'); // 最浅蓝
    this.ctx.fillStyle = oceanGradient;
    this.ctx.fillRect(0, 0, w, h);
    
    // 现实水下光束 - 从海面投射
    this.renderUnderwaterLightBeams(time);
    
    // 现实海底地形
    this.renderRealisticSeafloor(0, h * 0.8, w, h * 0.2);
    
    // 现实珊瑚礁群
    this.renderRealisticCoralReef(time);
    
    // 现实海草森林
    this.renderRealisticSeaweedForest(time);
    
    // 现实鱼群游动
    this.renderRealisticFishSchools(time);
    
    // 现实水流效果
    this.renderOceanCurrents(time);
    
    // 水下粒子效果
    this.renderUnderwaterParticles(time);
  }

  // 夜晚星空背景 - 深蓝色夜空、弯月、闪烁的星星、萤火虫光点
  renderNightBackground() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const time = Date.now() * 0.001;
    
    // 现实夜空渐变 - 深空效果
    const nightGradient = this.ctx.createLinearGradient(0, 0, 0, h);
    nightGradient.addColorStop(0, '#000814'); // 极深黑蓝
    nightGradient.addColorStop(0.2, '#001d3d'); // 深蓝黑
    nightGradient.addColorStop(0.4, '#003566'); // 深蓝
    nightGradient.addColorStop(0.6, '#0077b6'); // 中蓝
    nightGradient.addColorStop(0.8, '#00b4d8'); // 浅蓝
    nightGradient.addColorStop(1, '#90e0ef'); // 地平线淡蓝
    this.ctx.fillStyle = nightGradient;
    this.ctx.fillRect(0, 0, w, h);
    
    // 现实银河 - 宇宙尘埃效果
    this.renderRealisticMilkyWay(time);
    
    // 现实月亮光照
    this.renderRealisticMoonlight(w * 0.75, h * 0.25, time);
    
    // 现实山脉剪影 - 多层次深度
    this.renderRealisticNightMountains(time);
    
    // 现实星空
    this.renderRealisticStarfield(time);
    
    // 夜间雾气效果
    this.renderNightFog(time);
    
    // 萤火虫生物发光
    this.renderRealisticFireflies(time);
    
    // 月光反射效果
    this.renderMoonlightReflection(time);
  }

  // 默认背景
  renderDefaultBackground() {
    const currentSceneData = this.scenes[this.currentScene];
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, currentSceneData.colors[0]);
    gradient.addColorStop(1, currentSceneData.colors[1]);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render() {
    // 根据当前场景渲染背景
    this.renderSceneBackground();
    
    // 如果游戏未开始，显示开始界面
    if (!this.gameStarted) {
      this.renderStartScreen();
      return;
    }
    
    // 如果游戏已结束，显示结束界面
    if (this.gameStarted === false && this.gameTimer === null) {
      this.renderEndScreen();
      return;
    }
    
    // 渲染当前场景的动物
    const currentSceneAnimals = this.sceneAnimals[this.currentScene];
    currentSceneAnimals.forEach(animal => {
      this.renderAnimal(animal);
    });
    
    // 渲染特殊效果（互动效果等）
    currentSceneAnimals.forEach(animal => {
      if (animal.effects && animal.effects.length > 0) {
        animal.effects.forEach(effect => {
          this.renderSpecialEffect(effect);
        });
      }
    });
    
    // 显示当前角色（在圆形背景上）
    const characterX = this.canvas.width / 2;
    const characterY = this.canvas.height - 100;
    
    // 角色背景圆圈
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.beginPath();
    this.ctx.arc(characterX, characterY, 40, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 角色边框
    this.ctx.strokeStyle = '#4CAF50';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    
    // 角色表情
    this.ctx.font = '48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = '#333';
    const currentSceneCharacters = this.scenes[this.currentScene].characters;
    const currentCharacterData = currentSceneCharacters[this.currentCharacter];
    this.ctx.fillText(currentCharacterData.emoji, characterX, characterY);
    
    // 角色名称
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';
    this.ctx.fillStyle = '#333';
    this.ctx.fillText(currentCharacterData.name, characterX, characterY + 50);
    
    // 角色指示器（显示当前场景的所有角色）
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';
    const dotSpacing = 25;
    const startX = characterX - (currentSceneCharacters.length * dotSpacing) / 2 + dotSpacing / 2;
    
    currentSceneCharacters.forEach((char, index) => {
      const x = startX + index * dotSpacing;
      const y = characterY + 70;
      
      if (index === this.currentCharacter) {
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillText('●', x, y);
      } else {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.fillText('○', x, y);
      }
    });
    
    // 场景切换按钮（左上角）
    const currentSceneData = this.scenes[this.currentScene];
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.fillRect(10, 10, 60, 60);
    this.ctx.strokeStyle = '#4CAF50';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(10, 10, 60, 60);
    
    this.ctx.font = '30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = '#333';
    this.ctx.fillText(currentSceneData.emoji, 40, 40);
    
    // 场景名称
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
    this.ctx.fillStyle = '#555';
    this.ctx.fillText(currentSceneData.name, 80, 25);
    
    // 音乐开关按钮（右上角）
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.fillRect(this.canvas.width - 70, 10, 60, 60);
    this.ctx.strokeStyle = '#4CAF50';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(this.canvas.width - 70, 10, 60, 60);
    
    this.ctx.font = '30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = this.musicEnabled ? '#4CAF50' : '#999';
    this.ctx.fillText('🎵', this.canvas.width - 40, 40);
    
    // 显示游戏时间
    if (this.gameStarted && this.gameStartTime > 0) {
      const elapsed = Date.now() - this.gameStartTime;
      const remaining = Math.max(0, this.gameDuration - elapsed);
      const seconds = Math.ceil(remaining / 1000);
      
      this.ctx.font = '24px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'top';
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      this.ctx.fillText(`剩余时间: ${seconds}秒`, this.canvas.width / 2, 20);
    }
    
    // 显示说明文字 - 已移除
  }

  // 渲染开始界面
  renderStartScreen() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    // 游戏标题 - 向上移动更多
    this.ctx.font = 'bold 42px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    this.ctx.fillText('宝宝泡泡乐园', centerX, centerY - 150);
    
    // 游戏描述 - 调整位置
    this.ctx.font = '22px Arial';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.fillText('和小动物们一起吹泡泡吧！', centerX, centerY - 80);
    
    // 开始按钮 - 调整位置和大小
    const buttonX = centerX;
    const buttonY = centerY + 20;
    const buttonWidth = 180;
    const buttonHeight = 70;
    
    // 按钮背景 - 圆角矩形效果
    this.ctx.fillStyle = 'rgba(76, 175, 80, 0.9)';
    this.ctx.fillRect(buttonX - buttonWidth/2, buttonY - buttonHeight/2, buttonWidth, buttonHeight);
    
    // 按钮边框
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(buttonX - buttonWidth/2, buttonY - buttonHeight/2, buttonWidth, buttonHeight);
    
    // 按钮文字
    this.ctx.font = 'bold 28px Arial';
    this.ctx.fillStyle = 'white';
    this.ctx.fillText('开始游戏', buttonX, buttonY);
    
    // 游戏时长提示 - 向下移动
    this.ctx.font = '18px Arial';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.fillText('游戏时长：2分钟', centerX, centerY + 120);
    
    // 添加一些装饰性元素 - 统一间距
    this.ctx.font = '36px Arial';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    
    // 计算动物表情符号的统一间距
    const animalSpacing = 50; // 每个动物之间的间距
    const totalAnimals = 9;
    const startX = centerX - (totalAnimals - 1) * animalSpacing / 2;
    
    const animals = ['🐻', '🐰', '🐸', '🐠', '🐬', '🐙', '🦉', '🦊', '🦝'];
    
    for (let i = 0; i < animals.length; i++) {
      const x = startX + i * animalSpacing;
      this.ctx.fillText(animals[i], x, centerY - 200);
    }
  }

  // 渲染结束界面
  renderEndScreen() {
    // 半透明覆盖层
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 结束标题
    this.ctx.font = 'bold 48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    this.ctx.fillText('🎉 游戏结束 🎉', this.canvas.width / 2, this.canvas.height / 2 - 50);
    
    // 结束提示
    this.ctx.font = '24px Arial';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.fillText('感谢游戏！刷新页面可重新开始', this.canvas.width / 2, this.canvas.height / 2 + 20);
  }

  stop() {
    this.isRunning = false;
    this.stopBackgroundMusic(); // 停止背景音乐
    console.log('🛑 游戏停止');
  }

  // === 阳光草地场景元素 ===
  
  // 渲染白云
  renderClouds() {
    const clouds = [
      { x: this.canvas.width * 0.2, y: this.canvas.height * 0.2, size: 0.8 },
      { x: this.canvas.width * 0.6, y: this.canvas.height * 0.15, size: 1.0 },
      { x: this.canvas.width * 0.9, y: this.canvas.height * 0.25, size: 0.6 }
    ];

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    clouds.forEach(cloud => {
      this.renderCloud(cloud.x, cloud.y, cloud.size);
    });
  }

  renderCloud(x, y, size) {
    const baseRadius = 25 * size;
    // 绘制多个圆形组成云朵
    this.ctx.beginPath();
    this.ctx.arc(x - baseRadius, y, baseRadius * 0.8, 0, Math.PI * 2);
    this.ctx.arc(x, y - baseRadius * 0.3, baseRadius, 0, Math.PI * 2);
    this.ctx.arc(x + baseRadius, y, baseRadius * 0.8, 0, Math.PI * 2);
    this.ctx.arc(x + baseRadius * 0.5, y + baseRadius * 0.3, baseRadius * 0.6, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // 渲染山坡
  renderHills() {
    this.ctx.fillStyle = '#228B22';
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvas.height * 0.7);
    this.ctx.quadraticCurveTo(this.canvas.width * 0.3, this.canvas.height * 0.5, this.canvas.width * 0.6, this.canvas.height * 0.65);
    this.ctx.quadraticCurveTo(this.canvas.width * 0.8, this.canvas.height * 0.75, this.canvas.width, this.canvas.height * 0.6);
    this.ctx.lineTo(this.canvas.width, this.canvas.height);
    this.ctx.lineTo(0, this.canvas.height);
    this.ctx.closePath();
    this.ctx.fill();
  }

  // 渲染小野花
  renderFlowers() {
    const flowers = [
      { x: this.canvas.width * 0.15, y: this.canvas.height * 0.75, color: '#FFB6C1' },
      { x: this.canvas.width * 0.35, y: this.canvas.height * 0.8, color: '#FF69B4' },
      { x: this.canvas.width * 0.65, y: this.canvas.height * 0.78, color: '#FFB6C1' },
      { x: this.canvas.width * 0.85, y: this.canvas.height * 0.82, color: '#FF1493' }
    ];

    flowers.forEach(flower => {
      this.renderFlower(flower.x, flower.y, flower.color);
    });
  }

  renderFlower(x, y, color) {
    // 花朵
    this.ctx.fillStyle = color;
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      this.ctx.beginPath();
      this.ctx.ellipse(x + Math.cos(angle) * 8, y + Math.sin(angle) * 8, 6, 4, angle, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // 花心
    this.ctx.fillStyle = '#FFD700';
    this.ctx.beginPath();
    this.ctx.arc(x, y, 4, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // === 海底世界场景元素 ===
  
  // 渲染水草
  renderSeaweed() {
    const seaweeds = [
      { x: this.canvas.width * 0.1, height: this.canvas.height * 0.3 },
      { x: this.canvas.width * 0.25, height: this.canvas.height * 0.25 },
      { x: this.canvas.width * 0.7, height: this.canvas.height * 0.35 },
      { x: this.canvas.width * 0.9, height: this.canvas.height * 0.28 }
    ];

    this.ctx.strokeStyle = '#006400';
    this.ctx.lineWidth = 8;
    
    seaweeds.forEach((seaweed, index) => {
      const sway = Math.sin(Date.now() * 0.001 + index) * 10;
      this.ctx.beginPath();
      this.ctx.moveTo(seaweed.x, this.canvas.height);
      this.ctx.quadraticCurveTo(
        seaweed.x + sway, 
        this.canvas.height - seaweed.height * 0.5,
        seaweed.x + sway * 0.5, 
        this.canvas.height - seaweed.height
      );
      this.ctx.stroke();
    });
  }

  // 渲染珊瑚礁
  renderCoral() {
    const corals = [
      { x: this.canvas.width * 0.15, y: this.canvas.height * 0.75, color: '#FF6347' },
      { x: this.canvas.width * 0.4, y: this.canvas.height * 0.8, color: '#FF4500' },
      { x: this.canvas.width * 0.8, y: this.canvas.height * 0.78, color: '#FFB347' }
    ];

    corals.forEach(coral => {
      this.renderCoralPiece(coral.x, coral.y, coral.color);
    });
  }

  renderCoralPiece(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const radius = 15 + Math.sin(i) * 5;
      if (i === 0) {
        this.ctx.moveTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
      } else {
        this.ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
      }
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  // 渲染小鱼群影子
  renderFishShadows() {
    const time = Date.now() * 0.001;
    const fishCount = 8;
    
    this.ctx.fillStyle = 'rgba(0, 0, 139, 0.3)';
    
    for (let i = 0; i < fishCount; i++) {
      const x = (this.canvas.width * 0.3) + Math.sin(time + i * 0.5) * 200;
      const y = (this.canvas.height * 0.4) + Math.cos(time * 0.7 + i * 0.3) * 50;
      this.renderFishShadow(x, y);
    }
  }

  renderFishShadow(x, y) {
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, 12, 6, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 鱼尾
    this.ctx.beginPath();
    this.ctx.moveTo(x - 12, y);
    this.ctx.lineTo(x - 18, y - 4);
    this.ctx.lineTo(x - 18, y + 4);
    this.ctx.closePath();
    this.ctx.fill();
  }

  // 渲染水波效果
  renderWaterRipples() {
    const time = Date.now() * 0.002;
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.lineWidth = 2;
    
    for (let i = 0; i < 5; i++) {
      this.ctx.beginPath();
      const y = this.canvas.height * 0.2 + i * 50;
      this.ctx.moveTo(0, y);
      
      for (let x = 0; x <= this.canvas.width; x += 20) {
        const waveY = y + Math.sin((x * 0.01) + time + i * 0.5) * 5;
        this.ctx.lineTo(x, waveY);
      }
      this.ctx.stroke();
    }
  }

  // === 夜晚星空场景元素 ===
  
  // 渲染弯月
  renderMoon() {
    const moonX = this.canvas.width * 0.8;
    const moonY = this.canvas.height * 0.2;
    const moonRadius = 35;
    
    // 月亮主体
    this.ctx.fillStyle = '#F5F5DC';
    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 月亮阴影部分（弯月效果）
    this.ctx.fillStyle = '#483D8B';
    this.ctx.beginPath();
    this.ctx.arc(moonX + 10, moonY, moonRadius * 0.9, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 月亮光晕
    const moonGlow = this.ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonRadius * 2.5);
    moonGlow.addColorStop(0, 'rgba(245, 245, 220, 0.2)');
    moonGlow.addColorStop(1, 'rgba(245, 245, 220, 0)');
    this.ctx.fillStyle = moonGlow;
    this.ctx.fillRect(moonX - moonRadius * 2.5, moonY - moonRadius * 2.5, moonRadius * 5, moonRadius * 5);
  }

  // 渲染闪烁星星
  renderStars() {
    const stars = [
      { x: this.canvas.width * 0.1, y: this.canvas.height * 0.1 },
      { x: this.canvas.width * 0.3, y: this.canvas.height * 0.15 },
      { x: this.canvas.width * 0.5, y: this.canvas.height * 0.08 },
      { x: this.canvas.width * 0.2, y: this.canvas.height * 0.25 },
      { x: this.canvas.width * 0.6, y: this.canvas.height * 0.18 },
      { x: this.canvas.width * 0.9, y: this.canvas.height * 0.12 },
      { x: this.canvas.width * 0.15, y: this.canvas.height * 0.35 },
      { x: this.canvas.width * 0.75, y: this.canvas.height * 0.05 }
    ];

    const time = Date.now() * 0.003;
    
    stars.forEach((star, index) => {
      const twinkle = 0.5 + Math.sin(time + index * 0.7) * 0.5;
      this.ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
      this.renderStar(star.x, star.y, 8);
    });
  }

  renderStar(x, y, size) {
    this.ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const outerRadius = size;
      const innerRadius = size * 0.4;
      
      if (i === 0) {
        this.ctx.moveTo(x + Math.cos(angle) * outerRadius, y + Math.sin(angle) * outerRadius);
      } else {
        this.ctx.lineTo(x + Math.cos(angle) * outerRadius, y + Math.sin(angle) * outerRadius);
      }
      
      const innerAngle = angle + Math.PI / 5;
      this.ctx.lineTo(x + Math.cos(innerAngle) * innerRadius, y + Math.sin(innerAngle) * innerRadius);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }

  // 渲染萤火虫
  renderFireflies() {
    const time = Date.now() * 0.002;
    const fireflies = [
      { baseX: this.canvas.width * 0.2, baseY: this.canvas.height * 0.6 },
      { baseX: this.canvas.width * 0.4, baseY: this.canvas.height * 0.7 },
      { baseX: this.canvas.width * 0.6, baseY: this.canvas.height * 0.5 },
      { baseX: this.canvas.width * 0.8, baseY: this.canvas.height * 0.65 }
    ];

    fireflies.forEach((firefly, index) => {
      const x = firefly.baseX + Math.sin(time + index * 1.2) * 30;
      const y = firefly.baseY + Math.cos(time * 0.7 + index * 0.8) * 20;
      const glow = 0.3 + Math.sin(time * 2 + index) * 0.7;
      
      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 15);
      gradient.addColorStop(0, `rgba(173, 255, 47, ${glow})`);
      gradient.addColorStop(1, 'rgba(173, 255, 47, 0)');
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(x - 15, y - 15, 30, 30);
      
      this.ctx.fillStyle = '#ADFF2F';
      this.ctx.beginPath();
      this.ctx.arc(x, y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  // 渲染夜晚山脉轮廓
  renderNightMountains() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvas.height);
    this.ctx.lineTo(0, this.canvas.height * 0.8);
    this.ctx.quadraticCurveTo(this.canvas.width * 0.2, this.canvas.height * 0.6, this.canvas.width * 0.4, this.canvas.height * 0.7);
    this.ctx.quadraticCurveTo(this.canvas.width * 0.6, this.canvas.height * 0.8, this.canvas.width * 0.8, this.canvas.height * 0.65);
    this.ctx.quadraticCurveTo(this.canvas.width * 0.9, this.canvas.height * 0.6, this.canvas.width, this.canvas.height * 0.75);
    this.ctx.lineTo(this.canvas.width, this.canvas.height);
    this.ctx.closePath();
    this.ctx.fill();
  }

  // === 3D背景渲染辅助函数 ===
  
  // 3D云朵
  render3DCloud(x, y, size, opacity) {
    const layers = 3;
    for (let i = 0; i < layers; i++) {
      const layerSize = size * (1 - i * 0.2);
      const layerOpacity = opacity * (1 - i * 0.3);
      const offsetX = i * 8;
      const offsetY = i * 4;
      
      this.ctx.fillStyle = `rgba(255, 255, 255, ${layerOpacity})`;
      this.ctx.beginPath();
      this.ctx.arc(x + offsetX, y + offsetY, layerSize * 0.6, 0, Math.PI * 2);
      this.ctx.arc(x + offsetX + layerSize * 0.3, y + offsetY, layerSize * 0.4, 0, Math.PI * 2);
      this.ctx.arc(x + offsetX - layerSize * 0.2, y + offsetY, layerSize * 0.5, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // 3D草丛
  render3DGrass(x, y, height) {
    const grassCount = 5;
    for (let i = 0; i < grassCount; i++) {
      const grassX = x + (i - 2) * 3;
      const grassHeight = height * (0.8 + Math.random() * 0.4);
      const bend = Math.sin(Date.now() * 0.002 + i) * 3;
      
      // 草叶阴影
      this.ctx.strokeStyle = 'rgba(0, 100, 0, 0.3)';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(grassX + 1, y);
      this.ctx.quadraticCurveTo(grassX + bend + 1, y - grassHeight * 0.5, grassX + bend * 2 + 1, y - grassHeight);
      this.ctx.stroke();
      
      // 草叶主体
      this.ctx.strokeStyle = `hsl(${100 + Math.random() * 20}, 70%, ${40 + Math.random() * 20}%)`;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(grassX, y);
      this.ctx.quadraticCurveTo(grassX + bend, y - grassHeight * 0.5, grassX + bend * 2, y - grassHeight);
      this.ctx.stroke();
    }
  }

  // 3D花朵
  render3DFlower(x, y, color, size) {
    const time = Date.now() * 0.001;
    
    // 花朵阴影
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.beginPath();
    this.ctx.arc(x + 2, y + 2, size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 花瓣
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 + time * 0.5;
      const petalX = x + Math.cos(angle) * size * 0.6;
      const petalY = y + Math.sin(angle) * size * 0.6;
      
      const gradient = this.ctx.createRadialGradient(petalX, petalY, 0, petalX, petalY, size * 0.8);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.ellipse(petalX, petalY, size * 0.8, size * 0.4, angle, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // 花心
    this.ctx.fillStyle = '#FFD700';
    this.ctx.beginPath();
    this.ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // 蝴蝶
  renderButterfly(x, y, time) {
    const wingFlap = Math.sin(time * 8) * 0.3;
    
    // 蝴蝶身体
    this.ctx.fillStyle = '#8B4513';
    this.ctx.fillRect(x - 1, y - 6, 2, 12);
    
    // 左翅膀
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(wingFlap);
    this.ctx.fillStyle = 'rgba(255, 165, 0, 0.8)';
    this.ctx.beginPath();
    this.ctx.ellipse(-8, -3, 6, 4, 0, 0, Math.PI * 2);
    this.ctx.ellipse(-6, 2, 4, 3, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
    
    // 右翅膀
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(-wingFlap);
    this.ctx.fillStyle = 'rgba(255, 165, 0, 0.8)';
    this.ctx.beginPath();
    this.ctx.ellipse(8, -3, 6, 4, 0, 0, Math.PI * 2);
    this.ctx.ellipse(6, 2, 4, 3, 0, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  // 3D珊瑚
  render3DCoral(x, y, color, height) {
    const branches = 4;
    for (let i = 0; i < branches; i++) {
      const angle = (i * Math.PI * 2) / branches;
      const branchHeight = height * (0.7 + Math.random() * 0.6);
      const endX = x + Math.cos(angle) * branchHeight * 0.6;
      const endY = y - branchHeight;
      
      // 珊瑚分支阴影
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      this.ctx.lineWidth = 8;
      this.ctx.beginPath();
      this.ctx.moveTo(x + 2, y + 2);
      this.ctx.quadraticCurveTo(x + Math.cos(angle) * branchHeight * 0.3 + 2, y - branchHeight * 0.5 + 2, endX + 2, endY + 2);
      this.ctx.stroke();
      
      // 珊瑚分支主体
      const gradient = this.ctx.createLinearGradient(x, y, endX, endY);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
      
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 6;
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.quadraticCurveTo(x + Math.cos(angle) * branchHeight * 0.3, y - branchHeight * 0.5, endX, endY);
      this.ctx.stroke();
      
      // 珊瑚顶部
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(endX, endY, 4, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // 3D水草
  render3DSeaweed(x, y, height, sway) {
    const segments = 8;
    const segmentHeight = height / segments;
    
    for (let i = 0; i < segments; i++) {
      const segmentY = y - i * segmentHeight;
      const swayAmount = sway * (i / segments);
      const segmentX = x + swayAmount;
      
      // 水草阴影
      this.ctx.strokeStyle = 'rgba(0, 100, 0, 0.3)';
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.moveTo(segmentX + 1, segmentY + 1);
      this.ctx.lineTo(segmentX + swayAmount * 0.5 + 1, segmentY - segmentHeight + 1);
      this.ctx.stroke();
      
      // 水草主体
      const greenness = 150 - i * 10;
      this.ctx.strokeStyle = `hsl(120, 70%, ${greenness / 255 * 50}%)`;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(segmentX, segmentY);
      this.ctx.lineTo(segmentX + swayAmount * 0.5, segmentY - segmentHeight);
      this.ctx.stroke();
    }
  }

  // 鱼群
  renderFishSchool(centerX, centerY, time) {
    const fishCount = 8;
    for (let i = 0; i < fishCount; i++) {
      const angle = (i * Math.PI * 2) / fishCount + time;
      const radius = 40 + Math.sin(time + i) * 20;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius * 0.5;
      
      this.renderFish3D(x, y, angle, 0.6);
    }
  }

  // 单条鱼
  renderFish3D(x, y, angle, opacity) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(angle);
    this.ctx.globalAlpha = opacity;
    
    // 鱼身
    this.ctx.fillStyle = 'rgba(100, 150, 255, 0.8)';
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, 12, 6, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 鱼尾
    this.ctx.fillStyle = 'rgba(80, 120, 200, 0.8)';
    this.ctx.beginPath();
    this.ctx.moveTo(-12, 0);
    this.ctx.lineTo(-18, -4);
    this.ctx.lineTo(-18, 4);
    this.ctx.closePath();
    this.ctx.fill();
    
    this.ctx.restore();
  }

  // 3D气泡
  renderBubble3D(x, y, size) {
    // 气泡阴影
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.beginPath();
    this.ctx.arc(x + 1, y + 1, size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 气泡主体
    const gradient = this.ctx.createRadialGradient(x - size * 0.3, y - size * 0.3, 0, x, y, size);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.7, 'rgba(200, 220, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(100, 150, 255, 0.2)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 气泡高光
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    this.ctx.beginPath();
    this.ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.3, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // 水波纹
  renderWaveRipples(time, opacity) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    for (let i = 0; i < 3; i++) {
      const y = h * (0.2 + i * 0.3);
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      
      for (let x = 0; x <= w; x += 10) {
        const waveY = y + Math.sin(x * 0.02 + time + i) * 15;
        if (x === 0) this.ctx.moveTo(x, waveY);
        else this.ctx.lineTo(x, waveY);
      }
      this.ctx.stroke();
    }
  }

  // 闪烁星星
  renderTwinkleStar(x, y, size, twinkle) {
    // 星星光晕
    const glowSize = size * 3;
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, glowSize);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${twinkle * 0.5})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, glowSize, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 星星主体
    this.ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 星星十字光芒
    if (twinkle > 0.7) {
      this.ctx.strokeStyle = `rgba(255, 255, 255, ${twinkle * 0.8})`;
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(x - size * 2, y);
      this.ctx.lineTo(x + size * 2, y);
      this.ctx.moveTo(x, y - size * 2);
      this.ctx.lineTo(x, y + size * 2);
      this.ctx.stroke();
    }
  }

  // 3D萤火虫
  renderFirefly3D(x, y, glow) {
    // 萤火虫轨迹
    this.ctx.strokeStyle = `rgba(255, 255, 0, ${glow * 0.2})`;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 8, 0, Math.PI * 2);
    this.ctx.stroke();
    
    // 萤火虫光晕
    const glowGradient = this.ctx.createRadialGradient(x, y, 0, x, y, 20);
    glowGradient.addColorStop(0, `rgba(255, 255, 0, ${glow * 0.6})`);
    glowGradient.addColorStop(0.5, `rgba(255, 255, 0, ${glow * 0.3})`);
    glowGradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
    
    this.ctx.fillStyle = glowGradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 20, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 萤火虫身体
    this.ctx.fillStyle = `rgba(255, 255, 100, ${glow})`;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 3, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // === 现实风格3D渲染函数 ===
  
  // 现实风格山脉层次
  renderRealisticMountainLayer(x, y, width, height, baseColor, opacity, timeOffset) {
    const segments = 30;
    const segmentWidth = width / segments;
    
    // 创建山脉轮廓
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + height);
    
    for (let i = 0; i <= segments; i++) {
      const segX = x + i * segmentWidth;
      const noise1 = Math.sin(i * 0.3 + timeOffset) * 0.3;
      const noise2 = Math.sin(i * 0.1 + timeOffset * 0.5) * 0.5;
      const noise3 = Math.sin(i * 0.05 + timeOffset * 0.2) * 0.2;
      const mountainY = y + (noise1 + noise2 + noise3) * height * 0.4;
      this.ctx.lineTo(segX, mountainY);
    }
    
    this.ctx.lineTo(x + width, y + height);
    this.ctx.lineTo(x, y + height);
    this.ctx.closePath();
    
    // 创建山脉渐变（模拟光照）
    const gradient = this.ctx.createLinearGradient(x, y, x + width * 0.3, y + height);
    gradient.addColorStop(0, `${baseColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
    gradient.addColorStop(0.7, `${this.darkenColor(baseColor, 0.3)}${Math.floor(opacity * 0.8 * 255).toString(16).padStart(2, '0')}`);
    gradient.addColorStop(1, `${this.darkenColor(baseColor, 0.6)}${Math.floor(opacity * 0.6 * 255).toString(16).padStart(2, '0')}`);
    
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
  }

  // 现实风格草地纹理
  renderRealisticGrassField(x, y, width, height) {
    // 基础草地渐变
    const grassGradient = this.ctx.createLinearGradient(x, y, x, y + height);
    grassGradient.addColorStop(0, '#4a7c59');    // 深绿
    grassGradient.addColorStop(0.3, '#5d8f6a');  // 中绿
    grassGradient.addColorStop(0.7, '#6ba374');  // 浅绿
    grassGradient.addColorStop(1, '#7ab87f');    // 最浅绿
    
    this.ctx.fillStyle = grassGradient;
    this.ctx.fillRect(x, y, width, height);
    
    // 添加草地纹理细节
    this.ctx.globalAlpha = 0.3;
    for (let i = 0; i < width; i += 2) {
      for (let j = 0; j < height; j += 3) {
        const grassX = x + i + Math.random() * 2;
        const grassY = y + j + Math.random() * 3;
        const intensity = Math.random();
        
        this.ctx.fillStyle = intensity > 0.7 ? '#8bc490' : '#3f6b4c';
        this.ctx.fillRect(grassX, grassY, 1, 1);
      }
    }
    this.ctx.globalAlpha = 1;
  }

  // 现实风格太阳光照
  renderRealisticSun(x, y, time) {
    const sunRadius = 40;
    
    // 太阳核心
    const sunCoreGradient = this.ctx.createRadialGradient(x - 10, y - 10, 0, x, y, sunRadius);
    sunCoreGradient.addColorStop(0, '#fff8dc');
    sunCoreGradient.addColorStop(0.4, '#ffd700');
    sunCoreGradient.addColorStop(0.8, '#ffa500');
    sunCoreGradient.addColorStop(1, '#ff8c00');
    
    this.ctx.fillStyle = sunCoreGradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, sunRadius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 太阳光晕层次
    const glowLayers = [
      { radius: sunRadius * 1.5, opacity: 0.4, color: '#fff8dc' },
      { radius: sunRadius * 2, opacity: 0.2, color: '#ffd700' },
      { radius: sunRadius * 3, opacity: 0.1, color: '#ffa500' }
    ];
    
    glowLayers.forEach(layer => {
      const glowGradient = this.ctx.createRadialGradient(x, y, sunRadius, x, y, layer.radius);
      glowGradient.addColorStop(0, `rgba(255, 248, 220, ${layer.opacity})`);
      glowGradient.addColorStop(1, 'rgba(255, 248, 220, 0)');
      
      this.ctx.fillStyle = glowGradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, layer.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  // 现实风格云层
  renderRealisticClouds(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    const clouds = [
      { x: w * 0.1, y: h * 0.15, size: 80, density: 0.8, speed: 0.2 },
      { x: w * 0.3, y: h * 0.25, size: 60, density: 0.6, speed: 0.15 },
      { x: w * 0.6, y: h * 0.18, size: 90, density: 0.9, speed: 0.25 },
      { x: w * 0.8, y: h * 0.22, size: 70, density: 0.7, speed: 0.18 }
    ];
    
    clouds.forEach((cloud, index) => {
      const cloudX = cloud.x + Math.sin(time * cloud.speed + index) * 15;
      this.renderRealisticCloudVolume(cloudX, cloud.y, cloud.size, cloud.density);
    });
  }

  // 现实风格云朵体积感
  renderRealisticCloudVolume(x, y, size, density) {
    const layers = 5;
    
    for (let i = 0; i < layers; i++) {
      const layerSize = size * (1 - i * 0.15);
      const layerOpacity = density * (1 - i * 0.2);
      const offsetX = i * 6;
      const offsetY = i * 3;
      
      // 云朵阴影
      if (i === layers - 1) {
        this.ctx.fillStyle = `rgba(180, 180, 180, ${layerOpacity * 0.3})`;
        this.ctx.beginPath();
        this.ctx.arc(x + offsetX + 3, y + offsetY + 3, layerSize * 0.7, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      // 云朵主体
      const cloudGradient = this.ctx.createRadialGradient(
        x + offsetX - layerSize * 0.2, y + offsetY - layerSize * 0.2, 0,
        x + offsetX, y + offsetY, layerSize
      );
      cloudGradient.addColorStop(0, `rgba(255, 255, 255, ${layerOpacity})`);
      cloudGradient.addColorStop(0.7, `rgba(240, 240, 240, ${layerOpacity * 0.8})`);
      cloudGradient.addColorStop(1, `rgba(220, 220, 220, ${layerOpacity * 0.4})`);
      
      this.ctx.fillStyle = cloudGradient;
      this.ctx.beginPath();
      this.ctx.arc(x + offsetX, y + offsetY, layerSize * 0.7, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // 现实风格植被
  renderRealisticVegetation(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // 渲染树木剪影
    const trees = [
      { x: w * 0.05, y: h * 0.7, height: 80, width: 30 },
      { x: w * 0.15, y: h * 0.72, height: 60, width: 25 },
      { x: w * 0.85, y: h * 0.68, height: 90, width: 35 },
      { x: w * 0.92, y: h * 0.71, height: 70, width: 28 }
    ];
    
    trees.forEach(tree => {
      this.renderRealisticTree(tree.x, tree.y, tree.width, tree.height);
    });
    
    // 渲染前景草丛
    for (let i = 0; i < 25; i++) {
      const grassX = (w / 25) * i;
      const grassY = h * (0.85 + Math.sin(i * 0.5) * 0.05);
      this.renderRealisticGrassClump(grassX, grassY, time + i);
    }
  }

  // 现实风格树木
  renderRealisticTree(x, y, width, height) {
    // 树干
    const trunkGradient = this.ctx.createLinearGradient(x, y, x + width * 0.3, y);
    trunkGradient.addColorStop(0, '#8b4513');
    trunkGradient.addColorStop(0.5, '#a0522d');
    trunkGradient.addColorStop(1, '#654321');
    
    this.ctx.fillStyle = trunkGradient;
    this.ctx.fillRect(x + width * 0.4, y, width * 0.2, height * 0.4);
    
    // 树冠
    const crownGradient = this.ctx.createRadialGradient(
      x + width * 0.3, y - height * 0.3, 0,
      x + width * 0.5, y, width * 0.6
    );
    crownGradient.addColorStop(0, '#228b22');
    crownGradient.addColorStop(0.5, '#32cd32');
    crownGradient.addColorStop(1, '#006400');
    
    this.ctx.fillStyle = crownGradient;
    this.ctx.beginPath();
    this.ctx.arc(x + width * 0.5, y - height * 0.3, width * 0.6, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // 现实风格草丛
  renderRealisticGrassClump(x, y, time) {
    const grassCount = 8;
    
    for (let i = 0; i < grassCount; i++) {
      const grassX = x + (i - grassCount/2) * 2;
      const grassHeight = 12 + Math.random() * 8;
      const sway = Math.sin(time * 0.5 + i) * 2;
      
      this.ctx.strokeStyle = `hsl(${90 + Math.random() * 30}, 60%, ${30 + Math.random() * 20}%)`;
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(grassX, y);
      this.ctx.quadraticCurveTo(grassX + sway, y - grassHeight * 0.6, grassX + sway * 1.5, y - grassHeight);
      this.ctx.stroke();
    }
  }

  // 太阳光线效果
  renderSunRays(sunX, sunY, time) {
    const rayCount = 12;
    const rayLength = 200;
    
    this.ctx.save();
    this.ctx.translate(sunX, sunY);
    this.ctx.rotate(time * 0.1);
    
    for (let i = 0; i < rayCount; i++) {
      const angle = (i * Math.PI * 2) / rayCount;
      const opacity = 0.1 + Math.sin(time * 2 + i) * 0.05;
      
      this.ctx.strokeStyle = `rgba(255, 215, 0, ${opacity})`;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(Math.cos(angle) * rayLength, Math.sin(angle) * rayLength);
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }

  // 颜色加深工具函数
  darkenColor(hex, factor) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    const darkenedR = Math.floor(r * (1 - factor));
    const darkenedG = Math.floor(g * (1 - factor));
    const darkenedB = Math.floor(b * (1 - factor));
    
    return `#${darkenedR.toString(16).padStart(2, '0')}${darkenedG.toString(16).padStart(2, '0')}${darkenedB.toString(16).padStart(2, '0')}`;
  }

  // === 阳光明媚草地专用渲染函数 ===

  // 明亮山脉层
  renderBrightMountainLayer(x, y, width, height, baseColor, opacity, timeOffset) {
    const segments = 20;
    const segmentWidth = width / segments;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + height);
    
    for (let i = 0; i <= segments; i++) {
      const segX = x + i * segmentWidth;
      const noise1 = Math.sin(i * 0.2 + timeOffset) * 0.2;
      const noise2 = Math.sin(i * 0.08 + timeOffset * 0.7) * 0.3;
      const mountainY = y + (noise1 + noise2) * height * 0.4;
      this.ctx.lineTo(segX, mountainY);
    }
    
    this.ctx.lineTo(x + width, y + height);
    this.ctx.lineTo(x, y + height);
    this.ctx.closePath();
    
    // 明亮的山脉渐变
    const gradient = this.ctx.createLinearGradient(x, y, x + width * 0.3, y + height);
    gradient.addColorStop(0, baseColor);
    gradient.addColorStop(0.5, this.brightenColor(baseColor, 0.2));
    gradient.addColorStop(1, this.darkenColor(baseColor, 0.1));
    
    this.ctx.fillStyle = gradient;
    this.ctx.globalAlpha = opacity;
    this.ctx.fill();
    this.ctx.globalAlpha = 1;
  }

  // 明亮草地
  renderBrightGrassField(x, y, width, height) {
    // 鲜绿色草地基础
    const grassGradient = this.ctx.createLinearGradient(x, y, x, y + height);
    grassGradient.addColorStop(0, '#90EE90'); // 浅绿
    grassGradient.addColorStop(0.3, '#98FB98'); // 苍绿
    grassGradient.addColorStop(0.7, '#7CFC00'); // 草绿
    grassGradient.addColorStop(1, '#32CD32'); // 酸橙绿
    
    this.ctx.fillStyle = grassGradient;
    this.ctx.fillRect(x, y, width, height);
    
    // 草地光斑效果
    for (let i = 0; i < 15; i++) {
      const spotX = x + Math.random() * width;
      const spotY = y + Math.random() * height;
      const spotSize = 20 + Math.random() * 40;
      
      const spotGradient = this.ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, spotSize);
      spotGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
      spotGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      this.ctx.fillStyle = spotGradient;
      this.ctx.beginPath();
      this.ctx.arc(spotX, spotY, spotSize, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // 明亮太阳
  renderBrightSun(x, y, time) {
    const sunRadius = 50;
    
    // 太阳外层光晕 - 非常明亮
    const outerGlow = this.ctx.createRadialGradient(x, y, sunRadius, x, y, sunRadius * 4);
    outerGlow.addColorStop(0, 'rgba(255, 255, 0, 0.4)');
    outerGlow.addColorStop(0.3, 'rgba(255, 215, 0, 0.3)');
    outerGlow.addColorStop(0.6, 'rgba(255, 165, 0, 0.2)');
    outerGlow.addColorStop(1, 'rgba(255, 255, 0, 0)');
    
    this.ctx.fillStyle = outerGlow;
    this.ctx.beginPath();
    this.ctx.arc(x, y, sunRadius * 4, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 太阳内层光晕
    const innerGlow = this.ctx.createRadialGradient(x, y, sunRadius * 0.5, x, y, sunRadius * 2);
    innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    innerGlow.addColorStop(0.5, 'rgba(255, 255, 0, 0.6)');
    innerGlow.addColorStop(1, 'rgba(255, 215, 0, 0.2)');
    
    this.ctx.fillStyle = innerGlow;
    this.ctx.beginPath();
    this.ctx.arc(x, y, sunRadius * 2, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 太阳主体 - 明亮渐变
    const sunGradient = this.ctx.createRadialGradient(x - 15, y - 15, 0, x, y, sunRadius);
    sunGradient.addColorStop(0, '#FFFACD'); // 柠檬绸
    sunGradient.addColorStop(0.4, '#FFD700'); // 金色
    sunGradient.addColorStop(0.8, '#FFA500'); // 橙色
    sunGradient.addColorStop(1, '#FF8C00'); // 深橙
    
    this.ctx.fillStyle = sunGradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, sunRadius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 太阳光芒 - 动态旋转
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(time * 0.2);
    
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI * 2) / 16;
      const rayLength = 80 + Math.sin(time * 3 + i) * 20;
      
      this.ctx.strokeStyle = `rgba(255, 255, 0, ${0.6 + Math.sin(time * 2 + i) * 0.3})`;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(Math.cos(angle) * sunRadius, Math.sin(angle) * sunRadius);
      this.ctx.lineTo(Math.cos(angle) * rayLength, Math.sin(angle) * rayLength);
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }

  // 蓬松白云
  renderFluffyClouds(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    const clouds = [
      { x: w * 0.15, y: h * 0.12, size: 70, opacity: 0.95 },
      { x: w * 0.35, y: h * 0.18, size: 85, opacity: 0.9 },
      { x: w * 0.6, y: h * 0.15, size: 75, opacity: 0.92 },
      { x: w * 0.8, y: h * 0.2, size: 65, opacity: 0.88 }
    ];
    
    clouds.forEach((cloud, index) => {
      const cloudX = cloud.x + Math.sin(time * 0.1 + index) * 8;
      const cloudY = cloud.y + Math.sin(time * 0.05 + index) * 3;
      
      this.renderFluffyCloud(cloudX, cloudY, cloud.size, cloud.opacity);
    });
  }

  // 单朵蓬松云
  renderFluffyCloud(x, y, size, opacity) {
    // 云朵阴影
    this.ctx.fillStyle = `rgba(200, 200, 200, ${opacity * 0.2})`;
    this.ctx.beginPath();
    this.ctx.arc(x + 3, y + 3, size * 0.6, 0, Math.PI * 2);
    this.ctx.arc(x + size * 0.4 + 3, y + 3, size * 0.4, 0, Math.PI * 2);
    this.ctx.arc(x - size * 0.3 + 3, y + 3, size * 0.5, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 云朵主体 - 纯白
    this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
    this.ctx.arc(x + size * 0.4, y, size * 0.4, 0, Math.PI * 2);
    this.ctx.arc(x - size * 0.3, y, size * 0.5, 0, Math.PI * 2);
    this.ctx.arc(x + size * 0.1, y - size * 0.3, size * 0.35, 0, Math.PI * 2);
    this.ctx.arc(x - size * 0.1, y - size * 0.4, size * 0.3, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 云朵高光
    this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
    this.ctx.beginPath();
    this.ctx.arc(x - size * 0.2, y - size * 0.2, size * 0.25, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // 自然花园
  renderColorfulFlowerField(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // 参考照片的自然花朵颜色 - 柔和优雅
    const flowerTypes = [
      // 粉色玫瑰系列
      { colors: ['#F8BBD9', '#F48FB1', '#E91E63'], type: 'rose', weight: 0.25 },
      // 向日葵系列
      { colors: ['#FFD54F', '#FFC107', '#FF8F00'], type: 'sunflower', weight: 0.2 },
      // 薰衣草系列
      { colors: ['#E1BEE7', '#CE93D8', '#9C27B0'], type: 'lavender', weight: 0.15 },
      // 白色雏菊系列
      { colors: ['#FFFFFF', '#F5F5F5', '#EEEEEE'], type: 'daisy', weight: 0.2 },
      // 橙色万寿菊系列
      { colors: ['#FFCC80', '#FF9800', '#F57C00'], type: 'marigold', weight: 0.1 },
      // 蓝色勿忘我系列
      { colors: ['#BBDEFB', '#2196F3', '#1976D2'], type: 'forget-me-not', weight: 0.1 }
    ];
    
    // 渲染花园 - 分层次分布
    this.renderFlowerLayer(flowerTypes, time, w, h, 0.75, 0.2, 25); // 前景花朵
    this.renderFlowerLayer(flowerTypes, time, w, h, 0.7, 0.15, 20);  // 中景花朵
    this.renderFlowerLayer(flowerTypes, time, w, h, 0.68, 0.1, 15); // 背景花朵
  }

  // 花园分层渲染
  renderFlowerLayer(flowerTypes, time, w, h, startY, heightRange, count) {
    for (let i = 0; i < count; i++) {
      // 选择花朵类型（基于权重）
      const flowerType = this.selectFlowerType(flowerTypes, i);
      const flowerX = Math.random() * w;
      const flowerY = h * (startY + Math.random() * heightRange);
      const flowerSize = 6 + Math.random() * 12;
      const colorIndex = Math.floor(Math.random() * flowerType.colors.length);
      const flowerColor = flowerType.colors[colorIndex];
      // 极轻微的摆动 - 减少幅度和频率
      const sway = Math.sin(time * 0.1 + i) * 0.3;
      
      this.renderNaturalFlower(flowerX + sway, flowerY, flowerColor, flowerSize, flowerType.type, time + i);
    }
  }

  // 选择花朵类型
  selectFlowerType(flowerTypes, seed) {
    let random = (Math.sin(seed * 12.9898) * 43758.5453) % 1;
    if (random < 0) random += 1;
    
    let cumulative = 0;
    for (const type of flowerTypes) {
      cumulative += type.weight;
      if (random < cumulative) {
        return type;
      }
    }
    return flowerTypes[flowerTypes.length - 1];
  }

  // 自然风格花朵
  renderNaturalFlower(x, y, color, size, type, time) {
    // 花茎 - 更自然的绿色，几乎静态
    this.ctx.strokeStyle = '#4A7C59';
    this.ctx.lineWidth = Math.max(1, size * 0.1);
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + Math.sin(time * 0.02) * 0.5, y + 10 + size * 0.5);
    this.ctx.stroke();
    
    switch (type) {
      case 'rose':
        this.renderRose(x, y, color, size, time);
        break;
      case 'sunflower':
        this.renderSunflower(x, y, color, size, time);
        break;
      case 'lavender':
        this.renderLavender(x, y, color, size, time);
        break;
      case 'daisy':
        this.renderDaisy(x, y, color, size, time);
        break;
      case 'marigold':
        this.renderMarigold(x, y, color, size, time);
        break;
      case 'forget-me-not':
        this.renderForgetMeNot(x, y, color, size, time);
        break;
      default:
        this.renderSimpleFlower(x, y, color, size, time);
    }
  }

  // 玫瑰花
  renderRose(x, y, color, size, time) {
    // 多层花瓣，从外到内，几乎静态
    for (let layer = 0; layer < 3; layer++) {
      const layerSize = size * (1 - layer * 0.25);
      const petalCount = 8 - layer * 2;
      
      for (let i = 0; i < petalCount; i++) {
        const angle = (i * Math.PI * 2) / petalCount + time * 0.01 + layer * 0.3;
        const petalX = x + Math.cos(angle) * layerSize * 0.6;
        const petalY = y + Math.sin(angle) * layerSize * 0.6;
        
        const petalGradient = this.ctx.createRadialGradient(petalX, petalY, 0, petalX, petalY, layerSize * 0.8);
        petalGradient.addColorStop(0, this.brightenColor(color, 0.2));
        petalGradient.addColorStop(0.6, color);
        petalGradient.addColorStop(1, this.darkenColor(color, 0.3));
        
        this.ctx.fillStyle = petalGradient;
        this.ctx.beginPath();
        this.ctx.ellipse(petalX, petalY, layerSize * 0.7, layerSize * 0.4, angle, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  // 向日葵
  renderSunflower(x, y, color, size, time) {
    // 花瓣 - 细长型，静态
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI * 2) / 16;
      const petalX = x + Math.cos(angle) * size * 0.8;
      const petalY = y + Math.sin(angle) * size * 0.8;
      
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.ellipse(petalX, petalY, size * 0.6, size * 0.2, angle, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // 花心 - 深棕色
    const centerGradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 0.4);
    centerGradient.addColorStop(0, '#8D6E63');
    centerGradient.addColorStop(1, '#5D4037');
    
    this.ctx.fillStyle = centerGradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // 薰衣草
  renderLavender(x, y, color, size, time) {
    // 薰衣草穗状花序
    const spikes = 3;
    for (let s = 0; s < spikes; s++) {
      const spikeX = x + (s - 1) * size * 0.3;
      const spikeY = y - s * 2;
      
      for (let i = 0; i < 8; i++) {
        const flowerY = spikeY - i * size * 0.15;
        const flowerSize = size * (0.3 - i * 0.02);
        
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(spikeX, flowerY, flowerSize, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  // 雏菊
  renderDaisy(x, y, color, size, time) {
    // 白色花瓣，静态
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      const petalX = x + Math.cos(angle) * size * 0.7;
      const petalY = y + Math.sin(angle) * size * 0.7;
      
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.ellipse(petalX, petalY, size * 0.5, size * 0.15, angle, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // 黄色花心
    this.ctx.fillStyle = '#FDD835';
    this.ctx.beginPath();
    this.ctx.arc(x, y, size * 0.25, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // 万寿菊
  renderMarigold(x, y, color, size, time) {
    // 层叠花瓣，静态
    for (let layer = 0; layer < 2; layer++) {
      const layerSize = size * (1 - layer * 0.3);
      const petalCount = 10 - layer * 2;
      
      for (let i = 0; i < petalCount; i++) {
        const angle = (i * Math.PI * 2) / petalCount + layer * 0.2;
        const petalX = x + Math.cos(angle) * layerSize * 0.6;
        const petalY = y + Math.sin(angle) * layerSize * 0.6;
        
        const petalColor = layer === 0 ? color : this.darkenColor(color, 0.2);
        this.ctx.fillStyle = petalColor;
        this.ctx.beginPath();
        this.ctx.ellipse(petalX, petalY, layerSize * 0.6, layerSize * 0.3, angle, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  // 勿忘我
  renderForgetMeNot(x, y, color, size, time) {
    // 5瓣小花，静态
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const petalX = x + Math.cos(angle) * size * 0.5;
      const petalY = y + Math.sin(angle) * size * 0.5;
      
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(petalX, petalY, size * 0.4, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // 白色花心
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.arc(x, y, size * 0.2, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // 简单花朵（备用）
  renderSimpleFlower(x, y, color, size, time) {
    // 静态花朵
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const petalX = x + Math.cos(angle) * size * 0.7;
      const petalY = y + Math.sin(angle) * size * 0.7;
      
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.ellipse(petalX, petalY, size * 0.6, size * 0.3, angle, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.fillStyle = '#FDD835';
    this.ctx.beginPath();
    this.ctx.arc(x, y, size * 0.25, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // 蝴蝶飞舞
  renderButterflies(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    for (let i = 0; i < 5; i++) {
      const centerX = w * (0.2 + i * 0.15);
      const centerY = h * (0.5 + Math.sin(i) * 0.1);
      const pathTime = time * 0.8 + i;
      
      const butterflyX = centerX + Math.sin(pathTime) * 80;
      const butterflyY = centerY + Math.sin(pathTime * 1.5) * 40;
      
      this.renderBrightButterfly(butterflyX, butterflyY, time * 10 + i);
    }
  }

  // 明亮蝴蝶
  renderBrightButterfly(x, y, time) {
    const wingFlap = Math.sin(time) * 0.4;
    const butterflyColors = ['#FF69B4', '#FF1493', '#FFB6C1', '#FF6347', '#FFA500'];
    const color = butterflyColors[Math.floor(time * 0.1) % butterflyColors.length];
    
    // 蝴蝶身体
    this.ctx.fillStyle = '#8B4513';
    this.ctx.fillRect(x - 1, y - 8, 2, 16);
    
    // 左翅膀
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(wingFlap);
    
    const leftWingGradient = this.ctx.createRadialGradient(-6, -2, 0, -6, -2, 8);
    leftWingGradient.addColorStop(0, this.brightenColor(color, 0.4));
    leftWingGradient.addColorStop(0.7, color);
    leftWingGradient.addColorStop(1, this.darkenColor(color, 0.3));
    
    this.ctx.fillStyle = leftWingGradient;
    this.ctx.beginPath();
    this.ctx.ellipse(-8, -3, 7, 5, 0, 0, Math.PI * 2);
    this.ctx.ellipse(-6, 3, 5, 4, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
    
    // 右翅膀
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(-wingFlap);
    
    const rightWingGradient = this.ctx.createRadialGradient(6, -2, 0, 6, -2, 8);
    rightWingGradient.addColorStop(0, this.brightenColor(color, 0.4));
    rightWingGradient.addColorStop(0.7, color);
    rightWingGradient.addColorStop(1, this.darkenColor(color, 0.3));
    
    this.ctx.fillStyle = rightWingGradient;
    this.ctx.beginPath();
    this.ctx.ellipse(8, -3, 7, 5, 0, 0, Math.PI * 2);
    this.ctx.ellipse(6, 3, 5, 4, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }

  // 阳光洒落效果
  renderSunlightSparkles(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    for (let i = 0; i < 25; i++) {
      const sparkleX = Math.random() * w;
      const sparkleY = Math.random() * h * 0.8;
      const sparkleSize = 2 + Math.sin(time * 4 + i) * 2;
      const sparkleOpacity = 0.3 + Math.sin(time * 3 + i) * 0.4;
      
      if (sparkleOpacity > 0.5) {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${sparkleOpacity})`;
        this.ctx.beginPath();
        this.ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 十字光芒
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${sparkleOpacity * 0.8})`;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(sparkleX - sparkleSize * 2, sparkleY);
        this.ctx.lineTo(sparkleX + sparkleSize * 2, sparkleY);
        this.ctx.moveTo(sparkleX, sparkleY - sparkleSize * 2);
        this.ctx.lineTo(sparkleX, sparkleY + sparkleSize * 2);
        this.ctx.stroke();
      }
    }
  }

  // === 森林背景渲染函数 ===
  
  // 森林远山
  renderForestMountains(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // 三层山脉，越远越淡
    this.renderForestMountainLayer(0, h * 0.25, w, h * 0.15, '#2E5D31', 0.3, time * 0.05);
    this.renderForestMountainLayer(0, h * 0.35, w, h * 0.12, '#3E7B40', 0.5, time * 0.08);
    this.renderForestMountainLayer(0, h * 0.42, w, h * 0.1, '#4E8B50', 0.7, time * 0.1);
  }
  
  // 森林山层渲染
  renderForestMountainLayer(x, y, width, height, baseColor, opacity, timeOffset) {
    this.ctx.save();
    this.ctx.globalAlpha = opacity;
    
    const gradient = this.ctx.createLinearGradient(0, y, 0, y + height);
    gradient.addColorStop(0, baseColor);
    gradient.addColorStop(0.7, this.darkenColor(baseColor, 0.3));
    gradient.addColorStop(1, this.darkenColor(baseColor, 0.5));
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + height);
    
    for (let i = 0; i <= width; i += 5) {
      const noise = Math.sin(i * 0.01 + timeOffset) * height * 0.3;
      const mountainY = y + noise;
      this.ctx.lineTo(i, mountainY);
    }
    
    this.ctx.lineTo(width, y + height);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }
  
  // 背景树林
  renderBackgroundTrees(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // 远景小树林
    for (let i = 0; i < 20; i++) {
      const treeX = (i * w) / 19;
      const treeY = h * (0.45 + Math.sin(i) * 0.05);
      const treeHeight = h * (0.15 + Math.sin(i * 1.5) * 0.05);
      const treeWidth = treeHeight * 0.4;
      
      this.renderDistantTree(treeX, treeY, treeWidth, treeHeight, '#2D5A2F', 0.4);
    }
  }
  
  // 远景树木
  renderDistantTree(x, y, width, height, color, opacity) {
    this.ctx.save();
    this.ctx.globalAlpha = opacity;
    
    // 树干
    this.ctx.fillStyle = this.darkenColor(color, 0.4);
    this.ctx.fillRect(x - width * 0.1, y, width * 0.2, height * 0.3);
    
    // 树冠
    const gradient = this.ctx.createRadialGradient(x, y - height * 0.5, 0, x, y - height * 0.5, width);
    gradient.addColorStop(0, this.brightenColor(color, 0.2));
    gradient.addColorStop(0.7, color);
    gradient.addColorStop(1, this.darkenColor(color, 0.3));
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.ellipse(x, y - height * 0.5, width, height * 0.7, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }
  
  // 主要森林树木
  renderMainForestTrees(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // 大树
    const trees = [
      { x: w * 0.1, y: h * 0.6, size: 1.2, type: 'oak' },
      { x: w * 0.25, y: h * 0.65, size: 0.9, type: 'pine' },
      { x: w * 0.4, y: h * 0.62, size: 1.1, type: 'birch' },
      { x: w * 0.65, y: h * 0.68, size: 0.8, type: 'oak' },
      { x: w * 0.8, y: h * 0.63, size: 1.0, type: 'pine' },
      { x: w * 0.95, y: h * 0.66, size: 0.7, type: 'birch' }
    ];
    
    trees.forEach((tree, index) => {
      this.renderForestTree(tree.x, tree.y, tree.size, tree.type, time + index);
    });
  }
  
  // 森林树木渲染
  renderForestTree(x, y, size, type, time) {
    const baseHeight = this.canvas.height * 0.4 * size;
    const baseWidth = baseHeight * 0.3;
    
    switch (type) {
      case 'oak':
        this.renderOakTree(x, y, baseWidth, baseHeight, time);
        break;
      case 'pine':
        this.renderPineTree(x, y, baseWidth, baseHeight, time);
        break;
      case 'birch':
        this.renderBirchTree(x, y, baseWidth, baseHeight, time);
        break;
    }
  }
  
  // 橡树
  renderOakTree(x, y, width, height, time) {
    const sway = Math.sin(time * 0.5) * 2;
    
    // 树干
    const trunkGradient = this.ctx.createLinearGradient(x - width * 0.1, 0, x + width * 0.1, 0);
    trunkGradient.addColorStop(0, '#8B4513');
    trunkGradient.addColorStop(0.5, '#A0522D');
    trunkGradient.addColorStop(1, '#654321');
    
    this.ctx.fillStyle = trunkGradient;
    this.ctx.fillRect(x - width * 0.08 + sway * 0.3, y, width * 0.16, height * 0.4);
    
    // 树冠 - 多层次
    const crownLayers = [
      { y: -height * 0.7, w: width * 1.2, h: height * 0.5, color: '#228B22' },
      { y: -height * 0.5, w: width * 1.0, h: height * 0.4, color: '#32CD32' },
      { y: -height * 0.3, w: width * 0.8, h: height * 0.3, color: '#90EE90' }
    ];
    
    crownLayers.forEach((layer, i) => {
      const layerGradient = this.ctx.createRadialGradient(
        x + sway, y + layer.y, 0, 
        x + sway, y + layer.y, layer.w
      );
      layerGradient.addColorStop(0, this.brightenColor(layer.color, 0.3));
      layerGradient.addColorStop(0.7, layer.color);
      layerGradient.addColorStop(1, this.darkenColor(layer.color, 0.3));
      
      this.ctx.fillStyle = layerGradient;
      this.ctx.beginPath();
      this.ctx.ellipse(x + sway, y + layer.y, layer.w, layer.h, 0, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }
  
  // 松树
  renderPineTree(x, y, width, height, time) {
    const sway = Math.sin(time * 0.3) * 1;
    
    // 树干
    this.ctx.fillStyle = '#654321';
    this.ctx.fillRect(x - width * 0.06 + sway * 0.2, y, width * 0.12, height * 0.5);
    
    // 松树层次
    const layers = 5;
    for (let i = 0; i < layers; i++) {
      const layerY = y - height * (0.2 + i * 0.15);
      const layerWidth = width * (1.2 - i * 0.15);
      const layerHeight = height * 0.2;
      
      const gradient = this.ctx.createLinearGradient(0, layerY - layerHeight, 0, layerY);
      gradient.addColorStop(0, '#006400');
      gradient.addColorStop(0.5, '#228B22');
      gradient.addColorStop(1, '#2F4F2F');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.moveTo(x + sway, layerY - layerHeight);
      this.ctx.lineTo(x - layerWidth + sway * 0.5, layerY);
      this.ctx.lineTo(x + layerWidth + sway * 0.5, layerY);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }
  
  // 桦树
  renderBirchTree(x, y, width, height, time) {
    const sway = Math.sin(time * 0.4) * 1.5;
    
    // 白色树干带黑色斑点
    this.ctx.fillStyle = '#F5F5DC';
    this.ctx.fillRect(x - width * 0.05 + sway * 0.2, y, width * 0.1, height * 0.6);
    
    // 黑色斑点
    for (let i = 0; i < 8; i++) {
      const spotY = y + (i * height * 0.08);
      this.ctx.fillStyle = '#2F2F2F';
      this.ctx.fillRect(x - width * 0.03 + sway * 0.2, spotY, width * 0.06, height * 0.02);
    }
    
    // 细长的树冠
    const crownGradient = this.ctx.createLinearGradient(0, y - height * 0.8, 0, y - height * 0.2);
    crownGradient.addColorStop(0, '#ADFF2F');
    crownGradient.addColorStop(0.5, '#9ACD32');
    crownGradient.addColorStop(1, '#808000');
    
    this.ctx.fillStyle = crownGradient;
    this.ctx.beginPath();
    this.ctx.ellipse(x + sway, y - height * 0.5, width * 0.6, height * 0.6, 0, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  // 森林地面
  renderForestFloor(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // 基础地面
    const groundGradient = this.ctx.createLinearGradient(0, h * 0.7, 0, h);
    groundGradient.addColorStop(0, '#8B4513');
    groundGradient.addColorStop(0.3, '#A0522D');
    groundGradient.addColorStop(0.7, '#654321');
    groundGradient.addColorStop(1, '#4A4A4A');
    
    this.ctx.fillStyle = groundGradient;
    this.ctx.fillRect(0, h * 0.7, w, h * 0.3);
    
    // 落叶覆盖
    for (let i = 0; i < 50; i++) {
      const leafX = Math.random() * w;
      const leafY = h * (0.75 + Math.random() * 0.2);
      const leafSize = 3 + Math.random() * 5;
      const leafColor = ['#8B4513', '#CD853F', '#DAA520', '#B8860B'][Math.floor(Math.random() * 4)];
      
      this.ctx.fillStyle = leafColor;
      this.ctx.beginPath();
      this.ctx.ellipse(leafX, leafY, leafSize, leafSize * 0.6, Math.random() * Math.PI, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // 苔藓斑点 - 已移除
  }
  
  // 林间光影
  renderForestLightRays(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // 阳光透过树叶的光束
    for (let i = 0; i < 8; i++) {
      const rayX = w * (0.1 + i * 0.12);
      const rayTop = h * 0.1;
      const rayBottom = h * 0.8;
      const rayWidth = 20 + Math.sin(time + i) * 10;
      
      const rayGradient = this.ctx.createLinearGradient(rayX, rayTop, rayX, rayBottom);
      rayGradient.addColorStop(0, 'rgba(255, 255, 200, 0.1)');
      rayGradient.addColorStop(0.5, 'rgba(255, 255, 200, 0.3)');
      rayGradient.addColorStop(1, 'rgba(255, 255, 200, 0.05)');
      
      this.ctx.fillStyle = rayGradient;
      this.ctx.beginPath();
      this.ctx.moveTo(rayX - rayWidth * 0.3, rayTop);
      this.ctx.lineTo(rayX + rayWidth * 0.3, rayTop);
      this.ctx.lineTo(rayX + rayWidth, rayBottom);
      this.ctx.lineTo(rayX - rayWidth, rayBottom);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }
  
  // 前景植被
  renderForestUndergrowth(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // 蕨类植物
    for (let i = 0; i < 15; i++) {
      const fernX = w * (0.05 + i * 0.07);
      const fernY = h * 0.85;
      const fernHeight = 30 + Math.random() * 20;
      
      this.renderFern(fernX, fernY, fernHeight, time + i);
    }
    
    // 灌木丛
    for (let i = 0; i < 8; i++) {
      const bushX = w * (0.1 + i * 0.12);
      const bushY = h * (0.75 + Math.random() * 0.1);
      const bushSize = 20 + Math.random() * 15;
      
      this.renderBush(bushX, bushY, bushSize);
    }
  }
  
  // 蕨类植物
  renderFern(x, y, height, time) {
    const sway = Math.sin(time * 0.8) * 3;
    
    // 主茎
    this.ctx.strokeStyle = '#228B22';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + sway, y - height);
    this.ctx.stroke();
    
    // 叶片
    const leafCount = Math.floor(height / 8);
    for (let i = 0; i < leafCount; i++) {
      const leafY = y - (i * height / leafCount);
      const leafLength = height * 0.3 * (1 - i / leafCount);
      
      // 左侧叶片
      this.ctx.strokeStyle = '#32CD32';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(x + sway * (i / leafCount), leafY);
      this.ctx.lineTo(x - leafLength + sway * (i / leafCount), leafY - leafLength * 0.3);
      this.ctx.stroke();
      
      // 右侧叶片
      this.ctx.beginPath();
      this.ctx.moveTo(x + sway * (i / leafCount), leafY);
      this.ctx.lineTo(x + leafLength + sway * (i / leafCount), leafY - leafLength * 0.3);
      this.ctx.stroke();
    }
  }
  
  // 灌木丛
  renderBush(x, y, size) {
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, '#90EE90');
    gradient.addColorStop(0.6, '#228B22');
    gradient.addColorStop(1, '#006400');
    
    this.ctx.fillStyle = gradient;
    
    // 多个重叠的圆形组成灌木
    for (let i = 0; i < 5; i++) {
      const offsetX = (Math.random() - 0.5) * size * 0.6;
      const offsetY = (Math.random() - 0.5) * size * 0.4;
      const bushRadius = size * (0.6 + Math.random() * 0.4);
      
      this.ctx.beginPath();
      this.ctx.arc(x + offsetX, y + offsetY, bushRadius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
  
  // 森林生物
  renderForestCreatures(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // 飞鸟
    for (let i = 0; i < 3; i++) {
      const birdX = w * (0.2 + Math.sin(time * 0.5 + i) * 0.3);
      const birdY = h * (0.3 + Math.sin(time * 0.8 + i) * 0.1);
      
      this.renderBird(birdX, birdY, time * 5 + i);
    }
    
    // 松鼠（偶尔出现）
    if (Math.sin(time * 0.3) > 0.7) {
      const squirrelX = w * 0.7;
      const squirrelY = h * 0.6;
      this.renderSquirrel(squirrelX, squirrelY);
    }
  }
  
  // 小鸟
  renderBird(x, y, time) {
    const wingFlap = Math.sin(time) * 0.3;
    
    this.ctx.fillStyle = '#2F4F4F';
    
    // 身体
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, 4, 2, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 翅膀
    this.ctx.beginPath();
    this.ctx.ellipse(x - 2, y - 1, 3, 1, wingFlap, 0, Math.PI * 2);
    this.ctx.ellipse(x + 2, y - 1, 3, 1, -wingFlap, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  // 松鼠
  renderSquirrel(x, y) {
    this.ctx.fillStyle = '#8B4513';
    
    // 身体
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, 8, 6, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 尾巴
    this.ctx.beginPath();
    this.ctx.ellipse(x - 8, y - 3, 12, 4, -0.3, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 头部
    this.ctx.fillStyle = '#A0522D';
    this.ctx.beginPath();
    this.ctx.arc(x + 6, y - 2, 4, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  // 森林粒子效果
  renderForestParticles(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // 漂浮的花粉和孢子
    for (let i = 0; i < 30; i++) {
      const particleX = w * Math.random();
      const particleY = h * (0.3 + Math.random() * 0.5);
      const drift = Math.sin(time * 0.5 + i) * 20;
      const float = Math.sin(time * 0.8 + i * 1.5) * 10;
      
      const finalX = particleX + drift;
      const finalY = particleY + float;
      
      // 确保粒子在画面内
      if (finalX > 0 && finalX < w && finalY > 0 && finalY < h) {
        const opacity = 0.3 + Math.sin(time * 2 + i) * 0.2;
        this.ctx.fillStyle = `rgba(255, 255, 200, ${opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(finalX, finalY, 1 + Math.random(), 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  // 颜色变亮工具函数
  brightenColor(hex, factor) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    const brightenedR = Math.min(255, Math.floor(r + (255 - r) * factor));
    const brightenedG = Math.min(255, Math.floor(g + (255 - g) * factor));
    const brightenedB = Math.min(255, Math.floor(b + (255 - b) * factor));
    
    return `#${brightenedR.toString(16).padStart(2, '0')}${brightenedG.toString(16).padStart(2, '0')}${brightenedB.toString(16).padStart(2, '0')}`;
  }

  // === 海底世界现实风格渲染函数 ===

  // 现实风格水下光束
  renderUnderwaterLightBeams(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const beamCount = 6;
    
    for (let i = 0; i < beamCount; i++) {
      const x = (w / beamCount) * i + w * 0.1;
      const beamWidth = 40 + Math.sin(time + i) * 20;
      const intensity = 0.15 + Math.sin(time * 0.5 + i) * 0.05;
      
      const beamGradient = this.ctx.createLinearGradient(x, 0, x + beamWidth, h * 0.8);
      beamGradient.addColorStop(0, `rgba(135, 206, 250, ${intensity})`);
      beamGradient.addColorStop(0.3, `rgba(100, 149, 237, ${intensity * 0.8})`);
      beamGradient.addColorStop(0.7, `rgba(70, 130, 180, ${intensity * 0.6})`);
      beamGradient.addColorStop(1, `rgba(70, 130, 180, 0)`);
      
      this.ctx.fillStyle = beamGradient;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x + beamWidth * 0.3, 0);
      this.ctx.lineTo(x + beamWidth * 0.8, h * 0.8);
      this.ctx.lineTo(x + beamWidth * 0.2, h * 0.8);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }

  // 现实风格海底地形
  renderRealisticSeafloor(x, y, width, height) {
    // 海底沙地基础
    const sandGradient = this.ctx.createLinearGradient(x, y, x, y + height);
    sandGradient.addColorStop(0, '#c2b280');
    sandGradient.addColorStop(0.5, '#deb887');
    sandGradient.addColorStop(1, '#f4a460');
    
    this.ctx.fillStyle = sandGradient;
    this.ctx.fillRect(x, y, width, height);
    
    // 沙丘和地形起伏
    const hillCount = 8;
    for (let i = 0; i < hillCount; i++) {
      const hillX = (width / hillCount) * i;
      const hillWidth = width / hillCount + 20;
      const hillHeight = 15 + Math.random() * 25;
      
      const hillGradient = this.ctx.createRadialGradient(
        hillX + hillWidth * 0.5, y - hillHeight * 0.3, 0,
        hillX + hillWidth * 0.5, y, hillWidth * 0.7
      );
      hillGradient.addColorStop(0, '#deb887');
      hillGradient.addColorStop(0.7, '#cd853f');
      hillGradient.addColorStop(1, '#a0522d');
      
      this.ctx.fillStyle = hillGradient;
      this.ctx.beginPath();
      this.ctx.ellipse(hillX + hillWidth * 0.5, y, hillWidth * 0.7, hillHeight, 0, 0, Math.PI);
      this.ctx.fill();
    }
    
    // 海底纹理细节
    this.ctx.globalAlpha = 0.3;
    for (let i = 0; i < width; i += 3) {
      for (let j = 0; j < height; j += 4) {
        if (Math.random() > 0.7) {
          this.ctx.fillStyle = Math.random() > 0.5 ? '#f5deb3' : '#d2b48c';
          this.ctx.fillRect(x + i, y + j, 1, 1);
        }
      }
    }
    this.ctx.globalAlpha = 1;
  }

  // 现实风格珊瑚礁群
  renderRealisticCoralReef(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    const corals = [
      { x: w * 0.1, y: h * 0.7, type: 'branch', color: '#ff6b6b', size: 60 },
      { x: w * 0.2, y: h * 0.75, type: 'fan', color: '#4ecdc4', size: 45 },
      { x: w * 0.35, y: h * 0.68, type: 'brain', color: '#ffe66d', size: 70 },
      { x: w * 0.5, y: h * 0.73, type: 'tube', color: '#ff8b94', size: 55 },
      { x: w * 0.65, y: h * 0.71, type: 'plate', color: '#95e1d3', size: 65 },
      { x: w * 0.8, y: h * 0.74, type: 'branch', color: '#a8e6cf', size: 50 }
    ];
    
    corals.forEach(coral => {
      this.renderRealisticCoral(coral.x, coral.y, coral.type, coral.color, coral.size, time);
    });
  }

  // 现实风格单个珊瑚
  renderRealisticCoral(x, y, type, color, size, time) {
    const sway = Math.sin(time * 0.3) * 2;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    switch (type) {
      case 'branch':
        this.renderBranchCoral(0, 0, color, size, sway);
        break;
      case 'fan':
        this.renderFanCoral(0, 0, color, size, sway);
        break;
      case 'brain':
        this.renderBrainCoral(0, 0, color, size);
        break;
      case 'tube':
        this.renderTubeCoral(0, 0, color, size, sway);
        break;
      case 'plate':
        this.renderPlateCoral(0, 0, color, size);
        break;
    }
    
    this.ctx.restore();
  }

  // 分支状珊瑚
  renderBranchCoral(x, y, color, size, sway) {
    const branches = 5;
    for (let i = 0; i < branches; i++) {
      const angle = (i * Math.PI * 0.4) - Math.PI * 0.2 + sway * 0.1;
      const branchLength = size * (0.6 + Math.random() * 0.4);
      
      const gradient = this.ctx.createLinearGradient(x, y, 
        x + Math.sin(angle) * branchLength, 
        y - Math.cos(angle) * branchLength);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, this.darkenColor(color, 0.4));
      
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 6 - i;
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + Math.sin(angle) * branchLength, y - Math.cos(angle) * branchLength);
      this.ctx.stroke();
    }
  }

  // 扇形珊瑚
  renderFanCoral(x, y, color, size, sway) {
    this.ctx.rotate(sway * 0.05);
    
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y - size, size);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.7, this.darkenColor(color, 0.3));
    gradient.addColorStop(1, this.darkenColor(color, 0.6));
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.arc(x, y, size, -Math.PI * 0.7, -Math.PI * 0.3);
    this.ctx.closePath();
    this.ctx.fill();
  }

  // 脑珊瑚
  renderBrainCoral(x, y, color, size) {
    const gradient = this.ctx.createRadialGradient(x - size * 0.2, y - size * 0.2, 0, x, y, size);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.6, this.darkenColor(color, 0.2));
    gradient.addColorStop(1, this.darkenColor(color, 0.5));
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, size, size * 0.6, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 脑纹理
    this.ctx.strokeStyle = this.darkenColor(color, 0.4);
    this.ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.ellipse(x, y, size * (0.8 - i * 0.2), size * (0.5 - i * 0.15), 0, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }

  // 管状珊瑚
  renderTubeCoral(x, y, color, size, sway) {
    const tubes = 4;
    for (let i = 0; i < tubes; i++) {
      const tubeX = x + (i - tubes/2) * 8;
      const tubeHeight = size * (0.7 + Math.random() * 0.6);
      const tubeWidth = 6 + Math.random() * 4;
      
      const gradient = this.ctx.createLinearGradient(tubeX, y, tubeX, y - tubeHeight);
      gradient.addColorStop(0, this.darkenColor(color, 0.3));
      gradient.addColorStop(0.7, color);
      gradient.addColorStop(1, this.darkenColor(color, 0.1));
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(tubeX - tubeWidth/2 + sway, y - tubeHeight, tubeWidth, tubeHeight);
      
      // 管口
      this.ctx.fillStyle = this.darkenColor(color, 0.4);
      this.ctx.beginPath();
      this.ctx.ellipse(tubeX + sway, y - tubeHeight, tubeWidth/2, tubeWidth/4, 0, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // 板状珊瑚
  renderPlateCoral(x, y, color, size) {
    const plates = 3;
    for (let i = 0; i < plates; i++) {
      const plateY = y - i * 15;
      const plateSize = size * (1 - i * 0.2);
      
      const gradient = this.ctx.createRadialGradient(x, plateY, 0, x, plateY, plateSize);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.8, this.darkenColor(color, 0.3));
      gradient.addColorStop(1, this.darkenColor(color, 0.6));
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.ellipse(x, plateY, plateSize, plateSize * 0.2, 0, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // 现实风格海草森林
  renderRealisticSeaweedForest(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    for (let i = 0; i < 15; i++) {
      const seaweedX = (w / 15) * i + Math.random() * 30;
      const seaweedHeight = 40 + Math.random() * 60;
      const sway = Math.sin(time * 0.4 + i * 0.3) * 15;
      
      this.renderRealisticSeaweed(seaweedX, h * 0.8, seaweedHeight, sway);
    }
  }

  // 现实风格单株海草
  renderRealisticSeaweed(x, y, height, sway) {
    const segments = 12;
    const segmentHeight = height / segments;
    
    for (let i = 0; i < segments; i++) {
      const segmentY = y - i * segmentHeight;
      const swayAmount = sway * (i / segments) * (i / segments); // 二次方程使顶部摆动更大
      const segmentX = x + swayAmount;
      
      const width = 4 - (i / segments) * 2; // 向上变细
      const opacity = 0.8 - (i / segments) * 0.3;
      
      // 海草阴影
      this.ctx.fillStyle = `rgba(0, 80, 0, ${opacity * 0.3})`;
      this.ctx.fillRect(segmentX + 1, segmentY + 1, width, segmentHeight);
      
      // 海草主体
      const greenShade = 100 + i * 3;
      this.ctx.fillStyle = `hsla(120, 70%, ${greenShade / 255 * 30}%, ${opacity})`;
      this.ctx.fillRect(segmentX, segmentY, width, segmentHeight);
      
      // 海草高光
      this.ctx.fillStyle = `hsla(120, 50%, ${greenShade / 255 * 50}%, ${opacity * 0.5})`;
      this.ctx.fillRect(segmentX, segmentY, 1, segmentHeight);
    }
  }

  // 现实风格鱼群
  renderRealisticFishSchools(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // 大鱼群
    this.renderRealisticFishSchool(w * 0.3 + Math.sin(time * 0.3) * 100, h * 0.4, 12, 'large', time);
    // 中鱼群
    this.renderRealisticFishSchool(w * 0.7 + Math.sin(time * 0.5) * 80, h * 0.6, 8, 'medium', time + 2);
    // 小鱼群
    this.renderRealisticFishSchool(w * 0.5 + Math.sin(time * 0.4) * 60, h * 0.3, 15, 'small', time + 1);
  }

  // 现实风格单个鱼群
  renderRealisticFishSchool(centerX, centerY, fishCount, size, time) {
    const schoolRadius = size === 'large' ? 60 : size === 'medium' ? 40 : 30;
    const fishSize = size === 'large' ? 12 : size === 'medium' ? 8 : 5;
    
    for (let i = 0; i < fishCount; i++) {
      const angle = (i * Math.PI * 2) / fishCount + time * 0.5;
      const radius = schoolRadius + Math.sin(time * 2 + i) * 15;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius * 0.6;
      
      this.renderRealisticFish(x, y, angle + Math.PI/2, fishSize, 0.7);
    }
  }

  // 现实风格单条鱼
  renderRealisticFish(x, y, angle, size, opacity) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(angle);
    this.ctx.globalAlpha = opacity;
    
    // 鱼身渐变
    const fishGradient = this.ctx.createLinearGradient(-size, 0, size, 0);
    fishGradient.addColorStop(0, 'rgba(70, 130, 180, 0.8)');
    fishGradient.addColorStop(0.5, 'rgba(100, 149, 237, 0.9)');
    fishGradient.addColorStop(1, 'rgba(135, 206, 250, 0.7)');
    
    // 鱼身
    this.ctx.fillStyle = fishGradient;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, size, size * 0.6, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 鱼尾
    this.ctx.fillStyle = 'rgba(70, 130, 180, 0.8)';
    this.ctx.beginPath();
    this.ctx.moveTo(-size, 0);
    this.ctx.lineTo(-size * 1.5, -size * 0.4);
    this.ctx.lineTo(-size * 1.5, size * 0.4);
    this.ctx.closePath();
    this.ctx.fill();
    
    // 鱼鳍
    this.ctx.fillStyle = 'rgba(100, 149, 237, 0.6)';
    this.ctx.beginPath();
    this.ctx.ellipse(0, -size * 0.3, size * 0.3, size * 0.2, -0.3, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }

  // 现实风格洋流效果
  renderOceanCurrents(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    for (let i = 0; i < 4; i++) {
      const currentY = h * (0.2 + i * 0.2);
      const waveLength = w / 8;
      
      this.ctx.strokeStyle = `rgba(100, 149, 237, ${0.15 - i * 0.03})`;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      
      for (let x = 0; x <= w; x += 5) {
        const waveY = currentY + Math.sin(x / waveLength + time + i) * 10;
        if (x === 0) this.ctx.moveTo(x, waveY);
        else this.ctx.lineTo(x, waveY);
      }
      this.ctx.stroke();
    }
  }

  // 水下粒子效果
  renderUnderwaterParticles(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      const x = (w / particleCount) * i + Math.sin(time + i) * 20;
      const y = (h * 0.9) - ((time * 15 + i * 20) % (h * 0.9));
      const size = 1 + Math.sin(time * 2 + i) * 1;
      const opacity = 0.3 + Math.sin(time * 3 + i) * 0.2;
      
      this.ctx.fillStyle = `rgba(200, 220, 255, ${opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // === 夜晚星空现实风格渲染函数 ===

  // 现实风格银河
  renderRealisticMilkyWay(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // 银河带主体
    const galaxyGradient = this.ctx.createLinearGradient(w * 0.1, h * 0.1, w * 0.9, h * 0.6);
    galaxyGradient.addColorStop(0, 'rgba(240, 240, 255, 0)');
    galaxyGradient.addColorStop(0.2, 'rgba(200, 200, 255, 0.15)');
    galaxyGradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.25)');
    galaxyGradient.addColorStop(0.6, 'rgba(200, 200, 255, 0.15)');
    galaxyGradient.addColorStop(1, 'rgba(240, 240, 255, 0)');
    
    this.ctx.fillStyle = galaxyGradient;
    this.ctx.fillRect(0, 0, w, h * 0.7);
    
    // 银河尘埃云
    for (let i = 0; i < 8; i++) {
      const cloudX = w * (0.2 + i * 0.1) + Math.sin(time * 0.1 + i) * 30;
      const cloudY = h * (0.15 + i * 0.06) + Math.cos(time * 0.05 + i) * 20;
      const cloudSize = 40 + Math.sin(time + i) * 15;
      
      const dustGradient = this.ctx.createRadialGradient(cloudX, cloudY, 0, cloudX, cloudY, cloudSize);
      dustGradient.addColorStop(0, 'rgba(180, 180, 220, 0.2)');
      dustGradient.addColorStop(0.7, 'rgba(160, 160, 200, 0.1)');
      dustGradient.addColorStop(1, 'rgba(180, 180, 220, 0)');
      
      this.ctx.fillStyle = dustGradient;
      this.ctx.beginPath();
      this.ctx.arc(cloudX, cloudY, cloudSize, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  // 现实风格月光照射
  renderRealisticMoonlight(moonX, moonY, time) {
    const moonRadius = 45;
    const moonPhase = Math.sin(time * 0.1) * 0.3; // 月相变化
    
    // 月球表面纹理
    const moonSurfaceGradient = this.ctx.createRadialGradient(
      moonX - 15, moonY - 15, 0, 
      moonX, moonY, moonRadius
    );
    moonSurfaceGradient.addColorStop(0, '#f5f5dc');
    moonSurfaceGradient.addColorStop(0.4, '#e6e6fa');
    moonSurfaceGradient.addColorStop(0.7, '#d3d3d3');
    moonSurfaceGradient.addColorStop(1, '#a9a9a9');
    
    // 月球阴影（月相效果）
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    this.ctx.clip();
    
    // 月球表面
    this.ctx.fillStyle = moonSurfaceGradient;
    this.ctx.beginPath();
    this.ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 月相阴影
    if (moonPhase > 0) {
      this.ctx.fillStyle = `rgba(0, 0, 0, ${moonPhase * 0.7})`;
      this.ctx.beginPath();
      this.ctx.arc(moonX + moonPhase * moonRadius, moonY, moonRadius, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.restore();
    
    // 月球环形山细节
    const craters = [
      { x: moonX - 12, y: moonY - 8, size: 6 },
      { x: moonX + 10, y: moonY + 5, size: 4 },
      { x: moonX - 5, y: moonY + 12, size: 3 },
      { x: moonX + 18, y: moonY - 10, size: 5 }
    ];
    
    craters.forEach(crater => {
      const craterGradient = this.ctx.createRadialGradient(
        crater.x, crater.y, 0,
        crater.x, crater.y, crater.size
      );
      craterGradient.addColorStop(0, 'rgba(105, 105, 105, 0.8)');
      craterGradient.addColorStop(1, 'rgba(169, 169, 169, 0.3)');
      
      this.ctx.fillStyle = craterGradient;
      this.ctx.beginPath();
      this.ctx.arc(crater.x, crater.y, crater.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    // 月光光晕层次
    const glowLayers = [
      { radius: moonRadius * 1.8, opacity: 0.3 },
      { radius: moonRadius * 2.5, opacity: 0.2 },
      { radius: moonRadius * 3.5, opacity: 0.1 },
      { radius: moonRadius * 5, opacity: 0.05 }
    ];
    
    glowLayers.forEach(layer => {
      const glowGradient = this.ctx.createRadialGradient(moonX, moonY, moonRadius, moonX, moonY, layer.radius);
      glowGradient.addColorStop(0, `rgba(245, 245, 220, ${layer.opacity})`);
      glowGradient.addColorStop(1, 'rgba(245, 245, 220, 0)');
      
      this.ctx.fillStyle = glowGradient;
      this.ctx.beginPath();
      this.ctx.arc(moonX, moonY, layer.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  // 现实风格夜晚山脉
  renderRealisticNightMountains(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // 远山层（最暗）
    this.renderNightMountainLayer(0, h * 0.5, w, h * 0.3, 'rgba(15, 25, 45, 0.9)', time * 0.05);
    // 中山层
    this.renderNightMountainLayer(0, h * 0.65, w, h * 0.25, 'rgba(25, 35, 60, 0.8)', time * 0.08);
    // 近山层（最亮）
    this.renderNightMountainLayer(0, h * 0.75, w, h * 0.25, 'rgba(40, 50, 80, 0.9)', time * 0.1);
  }

  // 夜晚山脉层
  renderNightMountainLayer(x, y, width, height, color, timeOffset) {
    const segments = 25;
    const segmentWidth = width / segments;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + height);
    
    for (let i = 0; i <= segments; i++) {
      const segX = x + i * segmentWidth;
      const noise1 = Math.sin(i * 0.2 + timeOffset) * 0.4;
      const noise2 = Math.sin(i * 0.08 + timeOffset * 0.7) * 0.6;
      const noise3 = Math.sin(i * 0.04 + timeOffset * 0.3) * 0.3;
      const mountainY = y + (noise1 + noise2 + noise3) * height * 0.5;
      this.ctx.lineTo(segX, mountainY);
    }
    
    this.ctx.lineTo(x + width, y + height);
    this.ctx.lineTo(x, y + height);
    this.ctx.closePath();
    
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  // 现实风格星空
  renderRealisticStarfield(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // 主要星星（明亮的）
    const brightStars = 25;
    for (let i = 0; i < brightStars; i++) {
      const x = (i * 137.5) % w; // 黄金比例分布
      const y = (i * 85.3) % (h * 0.7);
      const twinkle = Math.sin(time * 2 + i) * 0.4 + 0.6;
      const size = 1.5 + twinkle * 1.5;
      
      this.renderRealisticStar(x, y, size, twinkle, 'bright');
    }
    
    // 中等星星
    const mediumStars = 40;
    for (let i = 0; i < mediumStars; i++) {
      const x = ((i + 50) * 137.5) % w;
      const y = ((i + 50) * 85.3) % (h * 0.8);
      const twinkle = Math.sin(time * 1.5 + i) * 0.3 + 0.5;
      const size = 1 + twinkle * 1;
      
      this.renderRealisticStar(x, y, size, twinkle, 'medium');
    }
    
    // 暗淡星星（背景）
    const dimStars = 60;
    for (let i = 0; i < dimStars; i++) {
      const x = ((i + 100) * 137.5) % w;
      const y = ((i + 100) * 85.3) % (h * 0.9);
      const twinkle = Math.sin(time * 1 + i) * 0.2 + 0.3;
      const size = 0.5 + twinkle * 0.5;
      
      this.renderRealisticStar(x, y, size, twinkle, 'dim');
    }
  }

  // 现实风格单颗星星
  renderRealisticStar(x, y, size, twinkle, brightness) {
    let color, opacity, glowSize;
    
    switch (brightness) {
      case 'bright':
        color = 'rgba(255, 255, 255, ';
        opacity = twinkle;
        glowSize = size * 4;
        break;
      case 'medium':
        color = 'rgba(220, 220, 255, ';
        opacity = twinkle * 0.8;
        glowSize = size * 3;
        break;
      case 'dim':
        color = 'rgba(200, 200, 240, ';
        opacity = twinkle * 0.6;
        glowSize = size * 2;
        break;
    }
    
    // 星星光晕
    const glowGradient = this.ctx.createRadialGradient(x, y, 0, x, y, glowSize);
    glowGradient.addColorStop(0, color + (opacity * 0.4) + ')');
    glowGradient.addColorStop(1, color + '0)');
    
    this.ctx.fillStyle = glowGradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, glowSize, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 星星核心
    this.ctx.fillStyle = color + opacity + ')';
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 明亮星星的十字光芒
    if (brightness === 'bright' && twinkle > 0.8) {
      this.ctx.strokeStyle = color + (opacity * 0.6) + ')';
      this.ctx.lineWidth = 0.5;
      this.ctx.beginPath();
      this.ctx.moveTo(x - size * 3, y);
      this.ctx.lineTo(x + size * 3, y);
      this.ctx.moveTo(x, y - size * 3);
      this.ctx.lineTo(x, y + size * 3);
      this.ctx.stroke();
    }
  }

  // 夜间雾气效果
  renderNightFog(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // 多层雾气
    for (let layer = 0; layer < 4; layer++) {
      const fogY = h * (0.7 + layer * 0.05);
      const fogHeight = 40 - layer * 8;
      const opacity = 0.15 - layer * 0.03;
      const speed = 0.1 + layer * 0.02;
      
      // 雾气波动
      this.ctx.beginPath();
      this.ctx.moveTo(0, fogY + fogHeight);
      
      for (let x = 0; x <= w; x += 20) {
        const waveY = fogY + Math.sin(x * 0.01 + time * speed + layer) * 8;
        this.ctx.lineTo(x, waveY);
      }
      
      this.ctx.lineTo(w, fogY + fogHeight);
      this.ctx.lineTo(0, fogY + fogHeight);
      this.ctx.closePath();
      
      const fogGradient = this.ctx.createLinearGradient(0, fogY, 0, fogY + fogHeight);
      fogGradient.addColorStop(0, `rgba(200, 200, 255, ${opacity})`);
      fogGradient.addColorStop(1, `rgba(200, 200, 255, 0)`);
      
      this.ctx.fillStyle = fogGradient;
      this.ctx.fill();
    }
  }

  // 现实风格萤火虫
  renderRealisticFireflies(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const fireflyCount = 12;
    
    for (let i = 0; i < fireflyCount; i++) {
      // 萤火虫飞行路径（8字形）
      const centerX = w * (0.2 + (i % 3) * 0.3);
      const centerY = h * (0.6 + Math.sin(i) * 0.1);
      const pathTime = time * 0.3 + i;
      
      const x = centerX + Math.sin(pathTime) * 60;
      const y = centerY + Math.sin(pathTime * 2) * 30;
      
      // 发光强度变化
      const glowIntensity = Math.sin(time * 4 + i * 2) * 0.4 + 0.6;
      
      this.renderRealisticFirefly(x, y, glowIntensity);
    }
  }

  // 现实风格单只萤火虫
  renderRealisticFirefly(x, y, glow) {
    // 萤火虫轨迹
    this.ctx.strokeStyle = `rgba(255, 255, 100, ${glow * 0.1})`;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 12, 0, Math.PI * 2);
    this.ctx.stroke();
    
    // 萤火虫光晕（多层）
    const glowLayers = [
      { radius: 15, opacity: glow * 0.4 },
      { radius: 25, opacity: glow * 0.2 },
      { radius: 35, opacity: glow * 0.1 }
    ];
    
    glowLayers.forEach(layer => {
      const glowGradient = this.ctx.createRadialGradient(x, y, 0, x, y, layer.radius);
      glowGradient.addColorStop(0, `rgba(255, 255, 100, ${layer.opacity})`);
      glowGradient.addColorStop(0.7, `rgba(255, 255, 0, ${layer.opacity * 0.5})`);
      glowGradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
      
      this.ctx.fillStyle = glowGradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, layer.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    // 萤火虫身体
    this.ctx.fillStyle = `rgba(100, 100, 50, ${glow * 0.8})`;
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, 2, 4, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 发光器官
    this.ctx.fillStyle = `rgba(255, 255, 150, ${glow})`;
    this.ctx.beginPath();
    this.ctx.arc(x, y + 1, 1.5, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // 月光反射效果
  renderMoonlightReflection(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // 月光在地面的反射
    const reflectionGradient = this.ctx.createLinearGradient(w * 0.6, h * 0.8, w * 0.9, h);
    reflectionGradient.addColorStop(0, 'rgba(245, 245, 220, 0.1)');
    reflectionGradient.addColorStop(0.5, 'rgba(245, 245, 220, 0.05)');
    reflectionGradient.addColorStop(1, 'rgba(245, 245, 220, 0)');
    
    this.ctx.fillStyle = reflectionGradient;
    this.ctx.fillRect(w * 0.6, h * 0.8, w * 0.4, h * 0.2);
    
    // 月光在雾气中的散射
    for (let i = 0; i < 3; i++) {
      const scatterX = w * (0.7 + i * 0.05) + Math.sin(time + i) * 10;
      const scatterY = h * (0.3 + i * 0.1);
      const scatterSize = 80 + i * 20;
      
      const scatterGradient = this.ctx.createRadialGradient(scatterX, scatterY, 0, scatterX, scatterY, scatterSize);
      scatterGradient.addColorStop(0, 'rgba(245, 245, 220, 0.08)');
      scatterGradient.addColorStop(1, 'rgba(245, 245, 220, 0)');
      
      this.ctx.fillStyle = scatterGradient;
      this.ctx.beginPath();
      this.ctx.arc(scatterX, scatterY, scatterSize, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
  console.log('📋 DOM加载完成，开始初始化...');
  
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) {
    console.error('❌ 找不到游戏画布！');
    return;
  }
  
  try {
    const game = new SimpleGame(canvas);
    game.init();
    game.start();
    
    // 隐藏加载界面
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
      loadingEl.style.display = 'none';
    }
    
    console.log('🎉 调试版本启动成功！');
  } catch (error) {
    console.error('❌ 调试版本启动失败:', error);
  }
});

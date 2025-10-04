/**
 * 音频管理器
 * 负责音效、背景音乐和语音的播放管理
 */

import { AudioGenerator } from './AudioGenerator.js';

export class AudioManager {
  constructor() {
    this.isEnabled = true;
    this.musicEnabled = true;
    this.soundEnabled = true;
    
    // 音频池
    this.audioPool = new Map();
    this.backgroundMusic = null;
    this.currentMusicTrack = null;
    
    // 音量设置
    this.masterVolume = 1.0;
    this.musicVolume = 0.7;
    this.soundVolume = 0.8;
    
    // Web Audio API支持
    this.audioContext = null;
    this.hasWebAudioSupport = false;
    
    // 音频生成器
    this.audioGenerator = new AudioGenerator();
    
    this.initAudioContext();
  }

  /**
   * 初始化音频上下文
   */
  async initAudioContext() {
    try {
      // 尝试初始化Web Audio API
      if (window.AudioContext || window.webkitAudioContext) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContextClass();
        this.hasWebAudioSupport = true;
        console.log('Web Audio API 支持已启用');
      }
    } catch (error) {
      console.warn('Web Audio API 初始化失败，使用HTML5 Audio:', error);
      this.hasWebAudioSupport = false;
    }
  }

  /**
   * 初始化音频系统
   */
  async init() {
    // 预加载一些基础音效（如果有的话）
    const basicSounds = [
      // 'audio/sfx/bubble_pop.ogg',
      // 'audio/sfx/encouragement.ogg',
      // 可以后续添加更多音效
    ];

    // 现在先创建占位符音频
    this.createPlaceholderSounds();
    
    console.log('音频管理器初始化完成');
  }

  /**
   * 创建游戏音效
   */
  createPlaceholderSounds() {
    // 为每个角色生成泡泡爆裂音效
    const characters = ['bear', 'rabbit', 'frog', 'clownfish', 'dolphin', 'octopus', 'owl', 'fox', 'raccoon'];
    
    characters.forEach(character => {
      const bubblePopSound = this.audioGenerator.generateBubblePopSound(character);
      this.audioPool.set(`bubble_pop_${character}`, bubblePopSound);
    });
    
    // UI音效
    this.audioPool.set('ui_click', this.audioGenerator.generateUISound('click'));
    this.audioPool.set('character_switch', this.audioGenerator.generateUISound('switch'));
    this.audioPool.set('scene_switch', this.audioGenerator.generateUISound('switch'));
    
    // 鼓励音效
    this.audioPool.set('encouragement_base', this.audioGenerator.generateUISound('encouragement'));
    
    console.log('游戏音效生成完成');
  }

  /**
   * 创建静音音频对象
   */
  createSilentAudio() {
    const audio = new Audio();
    audio.volume = 0;
    
    // 重写播放方法，避免错误
    const originalPlay = audio.play.bind(audio);
    audio.play = () => {
      try {
        return originalPlay();
      } catch (error) {
        return Promise.resolve();
      }
    };
    
    return audio;
  }

  /**
   * 播放音效
   * @param {string} soundId - 音效ID
   * @param {number} volume - 音量 (0-1)
   * @param {string} characterType - 角色类型（用于泡泡爆裂音效）
   */
  playSound(soundId, volume = 1.0, characterType = null) {
    if (!this.isEnabled || !this.soundEnabled) {
      return;
    }

    // 确保音频上下文已启动
    this.audioGenerator.ensureAudioContext();

    let audio;
    
    // 根据音效类型获取对应的音频
    if (soundId === 'bubble_pop' && characterType) {
      audio = this.audioPool.get(`bubble_pop_${characterType}`);
    } else {
      audio = this.audioPool.get(soundId);
    }
    
    if (!audio) {
      console.warn(`音效不存在: ${soundId}`);
      return;
    }

    try {
      // 克隆音频对象以支持同时播放多个实例
      const audioClone = audio.cloneNode();
      audioClone.volume = Math.min(volume * this.soundVolume * this.masterVolume, 1.0);
      
      // 播放完成后清理
      audioClone.addEventListener('ended', () => {
        audioClone.remove();
      });

      audioClone.play().catch(error => {
        console.warn(`音效播放失败: ${soundId}`, error);
      });
      
    } catch (error) {
      console.warn(`音效播放出错: ${soundId}`, error);
    }
  }

  /**
   * 播放背景音乐
   * @param {string} sceneId - 场景ID
   */
  playBackgroundMusic(sceneId) {
    if (!this.isEnabled || !this.musicEnabled) {
      return;
    }

    // 停止当前背景音乐
    this.stopBackgroundMusic();

    // 根据场景选择音乐
    const musicTrack = this.getMusicForScene(sceneId);
    if (!musicTrack) {
      console.warn(`场景 "${sceneId}" 没有对应的背景音乐`);
      return;
    }

    try {
      this.backgroundMusic = musicTrack;
      this.backgroundMusic.volume = this.musicVolume * this.masterVolume;
      this.backgroundMusic.loop = true;
      this.currentMusicTrack = sceneId;

      this.backgroundMusic.play().catch(error => {
        console.warn(`背景音乐播放失败: ${sceneId}`, error);
      });

      console.log(`播放背景音乐: ${sceneId}`);
      
    } catch (error) {
      console.warn(`背景音乐播放出错: ${sceneId}`, error);
    }
  }

  /**
   * 根据场景获取背景音乐
   * @param {string} sceneId - 场景ID
   */
  getMusicForScene(sceneId) {
    // 生成对应场景的背景音乐
    const sceneTypeMap = {
      'grassland': 'grassland',
      'ocean': 'ocean', 
      'night': 'night'
    };
    
    const sceneType = sceneTypeMap[sceneId] || 'grassland';
    const backgroundMusic = this.audioGenerator.generateBackgroundMusic(sceneType);
    
    return backgroundMusic;
  }

  /**
   * 停止背景音乐
   */
  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.backgroundMusic = null;
      this.currentMusicTrack = null;
    }
  }

  /**
   * 播放鼓励语音
   */
  playEncouragement() {
    const encouragementTexts = [
      '真棒！',
      '好厉害！', 
      '好漂亮的泡泡！',
      '继续加油！',
      '你做得很好！',
      '太有趣了！'
    ];
    
    const randomText = encouragementTexts[
      Math.floor(Math.random() * encouragementTexts.length)
    ];
    
    // 生成语音鼓励音效
    const voiceAudio = this.audioGenerator.generateVoiceEncouragement(randomText);
    
    if (voiceAudio && this.isEnabled && this.soundEnabled) {
      try {
        voiceAudio.volume = this.soundVolume * this.masterVolume * 0.8;
        voiceAudio.play().catch(error => {
          console.warn('鼓励语音播放失败:', error);
          // 备用方案：播放基础鼓励音效
          this.playSound('encouragement_base');
        });
      } catch (error) {
        console.warn('鼓励语音播放出错:', error);
        this.playSound('encouragement_base');
      }
    }
    
    console.log(`🎉 ${randomText}`);
    return randomText; // 返回文字供UI显示
  }

  /**
   * 设置主音量
   * @param {number} volume - 音量 (0-1)
   */
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    
    // 更新当前播放的背景音乐音量
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.musicVolume * this.masterVolume;
    }
  }

  /**
   * 设置音乐音量
   * @param {number} volume - 音量 (0-1)
   */
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.musicVolume * this.masterVolume;
    }
  }

  /**
   * 设置音效音量
   * @param {number} volume - 音量 (0-1)
   */
  setSoundVolume(volume) {
    this.soundVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * 切换音乐开关
   */
  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    
    if (!this.musicEnabled && this.backgroundMusic) {
      this.backgroundMusic.pause();
    } else if (this.musicEnabled && this.backgroundMusic) {
      this.backgroundMusic.play();
    }
    
    return this.musicEnabled;
  }

  /**
   * 切换音效开关
   */
  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    return this.soundEnabled;
  }

  /**
   * 获取音频设置
   */
  getSettings() {
    return {
      masterVolume: this.masterVolume,
      musicVolume: this.musicVolume,
      soundVolume: this.soundVolume,
      musicEnabled: this.musicEnabled,
      soundEnabled: this.soundEnabled
    };
  }

  /**
   * 更新音频管理器
   * @param {number} deltaTime - 帧时间
   */
  update(deltaTime) {
    // 可以在这里处理音频淡入淡出等效果
    // 目前保持简单
  }

  /**
   * 销毁音频管理器
   */
  destroy() {
    // 停止所有音频
    this.stopBackgroundMusic();
    
    // 清理音频池
    this.audioPool.forEach(audio => {
      audio.pause();
      audio.src = '';
    });
    this.audioPool.clear();
    
    // 关闭音频上下文
    if (this.audioContext && this.audioContext.close) {
      this.audioContext.close();
    }
    
    console.log('音频管理器已销毁');
  }
}

/**
 * 音频生成器
 * 使用Web Audio API动态生成音效，参考经典游戏音效设计
 */

export class AudioGenerator {
  constructor() {
    this.audioContext = null;
    this.init();
  }

  /**
   * 初始化音频上下文
   */
  async init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log('音频生成器初始化成功');
    } catch (error) {
      console.warn('Web Audio API不可用，将使用静音模式');
    }
  }

  /**
   * 确保音频上下文已启动（需要用户交互）
   */
  async ensureAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /**
   * 生成泡泡爆裂音效
   * 参考：经典泡泡龙游戏的爆裂音效
   * @param {string} characterType - 角色类型
   */
  generateBubblePopSound(characterType) {
    if (!this.audioContext) return this.createSilentAudio();

    const duration = 0.3;
    const sampleRate = this.audioContext.sampleRate;
    const frameCount = sampleRate * duration;
    const audioBuffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
    const channelData = audioBuffer.getChannelData(0);

    // 根据角色类型生成不同的音效参数
    const soundParams = this.getBubblePopParams(characterType);

    for (let i = 0; i < frameCount; i++) {
      const t = i / sampleRate;
      
      // 基础频率衰减
      const decay = Math.exp(-t * soundParams.decay);
      
      // 多层正弦波合成
      let sample = 0;
      soundParams.frequencies.forEach((freq, index) => {
        const amplitude = soundParams.amplitudes[index] || 0.5;
        sample += Math.sin(2 * Math.PI * freq * t) * amplitude * decay;
      });
      
      // 添加噪音增加真实感
      sample += (Math.random() * 2 - 1) * soundParams.noise * decay;
      
      // 应用包络
      const envelope = this.applyEnvelope(t, duration, soundParams.attack, soundParams.release);
      channelData[i] = sample * envelope * 0.3; // 降低音量
    }

    return this.createAudioFromBuffer(audioBuffer);
  }

  /**
   * 获取泡泡爆裂音效参数
   */
  getBubblePopParams(characterType) {
    const params = {
      // 小熊：温和的低频爆裂声
      bear: {
        frequencies: [200, 400, 800],
        amplitudes: [0.8, 0.5, 0.3],
        decay: 8,
        noise: 0.1,
        attack: 0.01,
        release: 0.25
      },
      // 小兔：清脆的中频连续爆裂声
      rabbit: {
        frequencies: [400, 800, 1200, 1600],
        amplitudes: [0.6, 0.8, 0.6, 0.4],
        decay: 12,
        noise: 0.05,
        attack: 0.005,
        release: 0.15
      },
      // 小青蛙：跳跃式的中低频音效
      frog: {
        frequencies: [150, 300, 600],
        amplitudes: [0.9, 0.7, 0.4],
        decay: 6,
        noise: 0.2,
        attack: 0.02,
        release: 0.2
      },
      // 小丑鱼：清澈的高频水泡声
      clownfish: {
        frequencies: [800, 1200, 1800],
        amplitudes: [0.7, 0.9, 0.5],
        decay: 10,
        noise: 0.03,
        attack: 0.01,
        release: 0.2
      },
      // 海豚：流畅的中高频音效
      dolphin: {
        frequencies: [600, 1000, 1400, 2000],
        amplitudes: [0.6, 0.8, 0.7, 0.4],
        decay: 8,
        noise: 0.02,
        attack: 0.008,
        release: 0.18
      },
      // 章鱼：多层次的复合音效
      octopus: {
        frequencies: [250, 500, 1000, 1500],
        amplitudes: [0.8, 0.7, 0.6, 0.5],
        decay: 15,
        noise: 0.15,
        attack: 0.015,
        release: 0.3
      },
      // 猫头鹰：神秘的低频音效
      owl: {
        frequencies: [180, 360, 720],
        amplitudes: [0.9, 0.6, 0.4],
        decay: 5,
        noise: 0.08,
        attack: 0.03,
        release: 0.25
      },
      // 狐狸：温暖的中频音效
      fox: {
        frequencies: [300, 600, 1200],
        amplitudes: [0.8, 0.7, 0.5],
        decay: 7,
        noise: 0.1,
        attack: 0.02,
        release: 0.22
      },
      // 浣熊：金属感的高频音效
      raccoon: {
        frequencies: [500, 1000, 2000, 3000],
        amplitudes: [0.7, 0.8, 0.6, 0.3],
        decay: 12,
        noise: 0.05,
        attack: 0.01,
        release: 0.15
      }
    };

    return params[characterType] || params.bear;
  }

  /**
   * 生成背景音乐
   * 参考：经典儿童游戏的循环背景音乐
   */
  generateBackgroundMusic(sceneType) {
    if (!this.audioContext) return this.createSilentAudio();

    const duration = 8; // 8秒循环
    const sampleRate = this.audioContext.sampleRate;
    const frameCount = sampleRate * duration;
    const audioBuffer = this.audioContext.createBuffer(2, frameCount, sampleRate); // 立体声

    const musicParams = this.getBackgroundMusicParams(sceneType);
    
    // 生成主旋律和和声
    for (let channel = 0; channel < 2; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;
        let sample = 0;
        
        // 主旋律
        musicParams.melody.forEach((note, index) => {
          const noteTime = (index * duration / musicParams.melody.length);
          const noteEnd = ((index + 1) * duration / musicParams.melody.length);
          
          if (t >= noteTime && t < noteEnd) {
            const noteProgress = (t - noteTime) / (noteEnd - noteTime);
            const envelope = Math.sin(noteProgress * Math.PI) * 0.3;
            sample += Math.sin(2 * Math.PI * note * t) * envelope;
          }
        });
        
        // 和声（仅在右声道或添加延迟）
        if (channel === 1) {
          musicParams.harmony.forEach((note, index) => {
            const noteTime = (index * duration / musicParams.harmony.length);
            const noteEnd = ((index + 1) * duration / musicParams.harmony.length);
            
            if (t >= noteTime && t < noteEnd) {
              const noteProgress = (t - noteTime) / (noteEnd - noteTime);
              const envelope = Math.sin(noteProgress * Math.PI) * 0.2;
              sample += Math.sin(2 * Math.PI * note * t) * envelope;
            }
          });
        }
        
        // 轻微的混响效果
        if (i > 0.1 * sampleRate) {
          sample += channelData[i - Math.floor(0.1 * sampleRate)] * 0.1;
        }
        
        channelData[i] = sample * 0.15; // 较低的音量
      }
    }

    const audio = this.createAudioFromBuffer(audioBuffer);
    audio.loop = true;
    return audio;
  }

  /**
   * 获取背景音乐参数
   */
  getBackgroundMusicParams(sceneType) {
    // 音符频率表（简化版）
    const notes = {
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77
    };

    const musicParams = {
      grassland: {
        // 欢快的大调旋律：C-E-G-E-F-D-G-C
        melody: [notes.C4, notes.E4, notes.G4, notes.E4, notes.F4, notes.D4, notes.G4, notes.C5],
        harmony: [notes.C4, notes.C4, notes.E4, notes.C4, notes.D4, notes.B4, notes.D5, notes.E4]
      },
      ocean: {
        // 流动的海洋旋律：A-C-E-G-F-E-D-C
        melody: [notes.A4, notes.C5, notes.E5, notes.G5, notes.F5, notes.E5, notes.D5, notes.C5],
        harmony: [notes.F4, notes.A4, notes.C5, notes.E5, notes.D5, notes.C5, notes.B4, notes.A4]
      },
      night: {
        // 宁静的夜晚旋律：F-A-C-F-E-D-C-A
        melody: [notes.F4, notes.A4, notes.C5, notes.F5, notes.E5, notes.D5, notes.C5, notes.A4],
        harmony: [notes.D4, notes.F4, notes.A4, notes.D5, notes.C5, notes.B4, notes.A4, notes.F4]
      }
    };

    return musicParams[sceneType] || musicParams.grassland;
  }

  /**
   * 生成UI音效
   * 参考：经典游戏的按钮点击和切换音效
   */
  generateUISound(type) {
    if (!this.audioContext) return this.createSilentAudio();

    const duration = 0.2;
    const sampleRate = this.audioContext.sampleRate;
    const frameCount = sampleRate * duration;
    const audioBuffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
    const channelData = audioBuffer.getChannelData(0);

    const uiParams = {
      click: { frequency: 800, decay: 15 }, // 清脆的点击声
      switch: { frequency: 600, decay: 8 }, // 温和的切换声
      encouragement: { frequency: 440, decay: 5 } // 温暖的鼓励声
    };

    const params = uiParams[type] || uiParams.click;

    for (let i = 0; i < frameCount; i++) {
      const t = i / sampleRate;
      const decay = Math.exp(-t * params.decay);
      const envelope = this.applyEnvelope(t, duration, 0.01, 0.15);
      
      // 简单的正弦波 + 泛音
      let sample = Math.sin(2 * Math.PI * params.frequency * t) * 0.7;
      sample += Math.sin(2 * Math.PI * params.frequency * 2 * t) * 0.3;
      
      channelData[i] = sample * decay * envelope * 0.4;
    }

    return this.createAudioFromBuffer(audioBuffer);
  }

  /**
   * 生成语音鼓励音效
   * 使用音调变化模拟语音韵律
   */
  generateVoiceEncouragement(message) {
    if (!this.audioContext) return this.createSilentAudio();

    const duration = 1.5;
    const sampleRate = this.audioContext.sampleRate;
    const frameCount = sampleRate * duration;
    const audioBuffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
    const channelData = audioBuffer.getChannelData(0);

    // 模拟语音的音调变化
    const voiceParams = {
      '真棒！': [300, 400, 350],
      '好厉害！': [280, 350, 400, 300],
      '好漂亮的泡泡！': [320, 380, 350, 400, 300, 280],
      '继续加油！': [300, 350, 400, 320],
      '你做得很好！': [280, 320, 380, 350, 300],
      '太有趣了！': [350, 400, 380, 320]
    };

    const frequencies = voiceParams[message] || [300, 350, 400];
    const segmentDuration = duration / frequencies.length;

    for (let i = 0; i < frameCount; i++) {
      const t = i / sampleRate;
      const segmentIndex = Math.floor(t / segmentDuration);
      const segmentProgress = (t % segmentDuration) / segmentDuration;
      
      if (segmentIndex < frequencies.length) {
        const frequency = frequencies[segmentIndex];
        const nextFreq = frequencies[segmentIndex + 1] || frequency;
        
        // 在音段之间插值以获得平滑过渡
        const currentFreq = frequency + (nextFreq - frequency) * segmentProgress;
        
        // 生成类似语音的复合波形
        let sample = 0;
        sample += Math.sin(2 * Math.PI * currentFreq * t) * 0.6;
        sample += Math.sin(2 * Math.PI * currentFreq * 2 * t) * 0.3;
        sample += Math.sin(2 * Math.PI * currentFreq * 3 * t) * 0.1;
        
        // 添加轻微的调制以模拟声音纹理
        sample *= (1 + Math.sin(2 * Math.PI * 10 * t) * 0.1);
        
        // 应用包络
        const envelope = this.applyEnvelope(t, duration, 0.05, 0.3);
        channelData[i] = sample * envelope * 0.25;
      }
    }

    return this.createAudioFromBuffer(audioBuffer);
  }

  /**
   * 应用音频包络
   */
  applyEnvelope(time, duration, attack, release) {
    if (time < attack) {
      return time / attack;
    } else if (time > duration - release) {
      return (duration - time) / release;
    }
    return 1;
  }

  /**
   * 从音频缓冲区创建音频元素
   */
  createAudioFromBuffer(audioBuffer) {
    if (!this.audioContext) return this.createSilentAudio();

    // 将AudioBuffer转换为WAV格式的Blob
    const wavArrayBuffer = this.audioBufferToWav(audioBuffer);
    const blob = new Blob([wavArrayBuffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    
    const audio = new Audio(url);
    
    // 清理URL以避免内存泄漏
    audio.addEventListener('ended', () => {
      URL.revokeObjectURL(url);
    });
    
    return audio;
  }

  /**
   * 将AudioBuffer转换为WAV格式
   */
  audioBufferToWav(buffer) {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);

    // WAV文件头
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numberOfChannels * 2, true);

    // 音频数据
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return arrayBuffer;
  }

  /**
   * 创建静音音频（兼容模式）
   */
  createSilentAudio() {
    const audio = new Audio();
    audio.volume = 0;
    audio.play = () => Promise.resolve();
    audio.pause = () => {};
    return audio;
  }
}

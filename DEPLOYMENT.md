# 🚀 《宝宝泡泡乐园》部署指南

## 📋 部署清单

### 必要资源替换
在实际部署前，需要替换以下占位符文件为真实资源：

#### 1. PWA图标文件
- `public/pwa-192x192.png` - 192×192 PNG图标
- `public/pwa-512x512.png` - 512×512 PNG图标  
- `public/apple-touch-icon.png` - 180×180 PNG苹果设备图标
- `public/favicon.svg` - 网站图标（已有基础版本）

#### 2. 分享图片
- `public/share-image.png` - 1200×630 PNG分享卡片图片

#### 3. 音频资源（可选）
如需添加真实音效，在以下目录创建音频文件：
- `public/audio/bgm/` - 背景音乐
- `public/audio/sfx/` - 音效文件

## 🌐 部署平台选择

### 推荐平台（免费）

#### 1. Netlify（推荐）
```bash
# 1. 构建项目
npm run build

# 2. 上传 dist 目录到 Netlify
# 或者连接 Git 仓库自动部署
```

**优势**：
- 支持PWA
- 自动HTTPS
- 全球CDN
- 简单部署

#### 2. Vercel
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

#### 3. GitHub Pages
```bash
# 1. 修改 vite.config.js 设置正确的 base
export default defineConfig({
  base: '/your-repo-name/',
  // ... 其他配置
})

# 2. 构建并部署
npm run build
# 将 dist 目录内容推送到 gh-pages 分支
```

### 商业平台

#### 1. 阿里云OSS + CDN
#### 2. 腾讯云COS + CDN  
#### 3. 七牛云存储

## ⚙️ 构建配置

### 生产环境优化

#### vite.config.js 优化设置
```javascript
export default defineConfig({
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['gsap'],
          'polyfills': ['src/utils/polyfills.js']
        }
      }
    }
  }
})
```

### PWA配置检查

确保 `vite.config.js` 中的PWA配置正确：
```javascript
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: '宝宝泡泡乐园',
    short_name: '泡泡乐园',
    description: '专为2-4岁宝宝设计的泡泡游戏',
    theme_color: '#FF8C42',
    background_color: '#87CEEB',
    display: 'fullscreen',
    orientation: 'landscape',
    start_url: '/',
    // 确保图标文件存在
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: 'pwa-512x512.png', 
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }
})
```

## 🔍 部署前检查

### 1. 功能测试
- [ ] 三个场景都能正常切换
- [ ] 九个角色都能正常工作
- [ ] 泡泡生成和戳破功能正常
- [ ] 移动端横屏提示正常显示
- [ ] PWA安装功能正常

### 2. 性能测试
```bash
# 使用 Lighthouse 检查
npm run build
npm run preview
# 然后在浏览器中打开 DevTools > Lighthouse
```

目标指标：
- Performance: >85分
- PWA: >90分  
- Accessibility: >90分

### 3. 移动端测试
- [ ] iOS Safari 测试
- [ ] Android Chrome 测试
- [ ] 微信内置浏览器测试
- [ ] 横屏/竖屏切换测试

## 📱 微信分享优化

### 1. 域名配置
在微信公众号后台配置业务域名和JS接口安全域名

### 2. 分享配置
```javascript
// 在 index.html 中添加微信SDK（如需要）
<script src="https://res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>
```

### 3. 分享信息
确保以下meta标签正确设置：
```html
<meta property="og:title" content="宝宝泡泡乐园 - 让小朋友爱上的泡泡游戏">
<meta property="og:description" content="专为2-4岁宝宝设计，安全无广告，横屏体验更佳">
<meta property="og:image" content="/share-image.png">
```

## 🚨 常见问题

### 1. PWA无法安装
- 检查manifest.json配置
- 确保HTTPS部署
- 验证图标文件存在

### 2. 移动端显示异常
- 检查viewport设置
- 验证安全区域CSS变量
- 测试不同设备尺寸

### 3. 微信中无法正常运行
- 检查触控事件兼容性
- 验证audio播放权限
- 测试微信X5内核兼容性

### 4. 性能问题
- 启用资源压缩
- 检查图片资源大小
- 优化Canvas渲染频率

## 📊 监控和分析

### 推荐工具
1. **Google Analytics** - 用户行为分析
2. **Sentry** - 错误监控
3. **PageSpeed Insights** - 性能监控

### 基础监控代码
```javascript
// 在 main.js 中添加
if (import.meta.env.PROD) {
  // 错误监控
  window.addEventListener('error', (e) => {
    console.error('游戏错误:', e.error);
    // 发送到监控服务
  });
  
  // 性能监控
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('页面加载时间:', perfData.loadEventEnd - perfData.fetchStart);
    }, 0);
  });
}
```

## 🎯 部署成功验证

部署完成后，访问以下链接验证：

1. **主页面**: `https://your-domain.com`
2. **PWA测试**: 检查浏览器地址栏的安装提示
3. **移动端测试**: 在移动设备上访问
4. **微信测试**: 在微信中打开链接
5. **分享测试**: 分享到朋友圈查看卡片效果

---

🎉 **部署成功后，小朋友们就可以开始愉快地玩泡泡游戏了！**

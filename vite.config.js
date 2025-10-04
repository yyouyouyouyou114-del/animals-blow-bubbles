import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: '宝宝泡泡乐园',
        short_name: '泡泡乐园',
        description: '专为2-4岁宝宝设计的泡泡游戏，安全无广告，横屏体验更佳',
        theme_color: '#FF8C42',
        background_color: '#87CEEB',
        display: 'fullscreen',
        orientation: 'landscape',
        start_url: '/',
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
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,ogg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts'
            }
          }
        ]
      }
    })
  ],
  build: {
    target: 'es2015',
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          'utils': ['src/utils/polyfills.js']
        }
      }
    }
  },
  server: {
    host: true,
    port: 3000
  }
});

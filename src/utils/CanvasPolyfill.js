/**
 * Canvas 兼容性补丁
 * 为不支持某些Canvas方法的浏览器提供兼容性支持
 */

/**
 * 添加roundRect方法的polyfill
 */
export function applyCanvasPolyfills() {
  // roundRect polyfill
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radii) {
      // 简化版本：如果不支持圆角，就画普通矩形
      this.rect(x, y, width, height);
    };
  }

  console.log('Canvas 兼容性补丁已应用');
}

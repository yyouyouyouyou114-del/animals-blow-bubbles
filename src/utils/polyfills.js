/**
 * 兼容性补丁
 * 为旧版浏览器提供现代API的支持
 */

// requestAnimationFrame polyfill
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function(callback) {
    return window.setTimeout(callback, 1000 / 60);
  };
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = function(id) {
    window.clearTimeout(id);
  };
}

// performance.now polyfill
if (!window.performance || !window.performance.now) {
  window.performance = window.performance || {};
  window.performance.now = function() {
    return Date.now();
  };
}

// Map polyfill (简化版，用于IE11)
if (!window.Map) {
  window.Map = class Map {
    constructor() {
      this._keys = [];
      this._values = [];
    }
    
    set(key, value) {
      const index = this._keys.indexOf(key);
      if (index >= 0) {
        this._values[index] = value;
      } else {
        this._keys.push(key);
        this._values.push(value);
      }
      return this;
    }
    
    get(key) {
      const index = this._keys.indexOf(key);
      return index >= 0 ? this._values[index] : undefined;
    }
    
    has(key) {
      return this._keys.indexOf(key) >= 0;
    }
    
    delete(key) {
      const index = this._keys.indexOf(key);
      if (index >= 0) {
        this._keys.splice(index, 1);
        this._values.splice(index, 1);
        return true;
      }
      return false;
    }
    
    clear() {
      this._keys.length = 0;
      this._values.length = 0;
    }
    
    get size() {
      return this._keys.length;
    }
  };
}

// 触控事件支持检测
window.HAS_TOUCH_SUPPORT = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

console.log('Polyfills loaded, touch support:', window.HAS_TOUCH_SUPPORT);

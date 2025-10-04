/**
 * 测试文件 - 用于调试基础功能
 */

console.log('测试文件加载成功');

// 测试Canvas基础功能
function testCanvas() {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) {
    console.error('找不到Canvas元素');
    return;
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('无法获取Canvas上下文');
    return;
  }
  
  // 设置Canvas尺寸
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // 绘制简单测试图形
  ctx.fillStyle = '#FF8C42';
  ctx.fillRect(50, 50, 100, 100);
  
  ctx.fillStyle = '#87CEEB';
  ctx.beginPath();
  ctx.arc(200, 150, 50, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#333';
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Canvas 测试成功！', canvas.width / 2, canvas.height / 2);
  
  console.log('Canvas 测试成功');
}

// 页面加载完成后运行测试
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM 加载完成');
  testCanvas();
});

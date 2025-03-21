<template>
  <!-- canvas画布 -->
  <canvas id="myCanvas"></canvas>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  const canvas = document.querySelector("#myCanvas");
  const ctx = canvas.getContext("2d");

  // 设置画布尺寸
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // 点的属性
  const dotRadius = 1;
  const dotColor = "rgba(255, 255, 255, 1)";
  const lineThreshold = 200; // 调整距离阈值

  // 点类
  class Dot {
    /**
     * 点类
     * @param {number} x x坐标
     * @param {number} y y坐标
     */
    constructor(x, y) {
      this.x = x;
      this.y = y;
      // 点的速度
      this.vx = Math.random() - 0.5;
      this.vy = Math.random() - 0.5;
    }

    /**
     * 绘制点
     */
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();
    }

    /**
     * 更新点位置
     */
    update() {
      this.x += this.vx;
      this.y += this.vy;

      // 边界检测
      if (this.x < 0 || this.x > canvas.width) {
        this.vx *= -1;
      }

      if (this.y < 0 || this.y > canvas.height) {
        this.vy *= -1;
      }
    }

    /**
     * 连接点
     * @param {Dot} otherDot 另一个点
     */
    connect(otherDot) {
      const distance = Math.sqrt(Math.pow(otherDot.x - this.x, 2) + Math.pow(otherDot.y - this.y, 2));

      // 根据距离阈值判断是否绘制线条
      if (distance < lineThreshold) {
        const opacity = 1 - distance / lineThreshold;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(otherDot.x, otherDot.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.stroke();
      }
    }
  }

  // 点数组
  const dots = [];

  // 初始化点
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const dot = new Dot(x, y);
    dots.push(dot);
  }

  /**
   * 动画函数
   */
  function animate() {
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 设置背景颜色为黑色
    ctx.fillStyle = "#000000";
    // 绘制填充整个 canvas 的矩形
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 更新点位置并绘制线条
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      dot.draw();
      dot.update();

      // 与其他点连接
      for (let j = i + 1; j < dots.length; j++) {
        const otherDot = dots[j];
        dot.connect(otherDot);
      }
    }

    // 请求下一帧动画
    requestAnimationFrame(animate);
  }

  animate();
});
</script>

<style lang="scss" scoped>
#myCanvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

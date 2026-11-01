let reportAnimated = false;
function animatePersonality() {
  if (reportAnimated) return; reportAnimated = true;
  document.querySelectorAll('.stat').forEach((stat, index) => {
    const value = Number(stat.dataset.value);
    const label = stat.querySelector('.stat-top b');
    const bar = stat.querySelector('.meter i');
    const visualWidth = value === 0 ? 2 : Math.min(value / 10, 100);
    setTimeout(() => {
      bar.style.width = visualWidth + '%';
      const start = performance.now(), duration = 1150;
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        label.textContent = Math.round(value * (1 - Math.pow(1-p, 3))) + '%';
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, index * 130);
  });
}

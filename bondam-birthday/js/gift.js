function openBirthdayGift() {
  const scene = document.getElementById('gift');
  const box = document.getElementById('giftBox');
  const reveal = document.getElementById('giftReveal');
  if (scene.classList.contains('opened')) return;
  scene.classList.add('opened');
  AudioManager.play('gift');
  box.animate([{transform:'rotate(0) scale(1)'},{transform:'rotate(-9deg) scale(1.08)'},{transform:'rotate(9deg) scale(1.08)'},{transform:'rotate(0) scale(.96)'}],{duration:650});
  setTimeout(() => { reveal.classList.add('show'); confettiBurst(150); reveal.scrollIntoView({behavior:'smooth',block:'center'}); }, 550);
}

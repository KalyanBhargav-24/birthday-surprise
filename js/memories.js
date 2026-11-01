// Memory captions and image filenames can be edited directly in index.html.
document.querySelectorAll('.polaroid').forEach(card => {
  card.addEventListener('click', () => {
    card.animate([{transform:getComputedStyle(card).transform},{transform:'translateY(-12px) rotate(0deg) scale(1.07)'},{transform:getComputedStyle(card).transform}],{duration:450});
  });
});

const buttons = document.querySelectorAll('.menu-option');
const description = document.querySelector('.description-area');

buttons.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = (x / rect.width - 0.5) * 10; // de -5° a +5°
    const rotateX = (0.5 - y / rect.height) * 10;

    btn.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg)';
    description.style.opacity = 0;
  });

  btn.addEventListener('mouseenter', () => {
    description.textContent = btn.dataset.desc;
    description.style.opacity = 1;
  });
});

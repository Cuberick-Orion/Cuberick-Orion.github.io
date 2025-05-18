document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('toggle-button');
  const label = button?.querySelector('.label');
  const arrow = button?.querySelector('.arrow');
  const content = document.getElementById('collapsible-content');

  if (!button || !label || !arrow || !content) {
    console.error("Collapse script: Required elements not found.");
    return;
  }

  button.addEventListener('click', () => {
    content.classList.toggle('open');
    const isOpen = content.classList.contains('open');

    label.textContent = isOpen ? 'Click to Collapse' : 'Click to Expand';
    arrow.textContent = isOpen ? '▲' : '▼';
  });
});
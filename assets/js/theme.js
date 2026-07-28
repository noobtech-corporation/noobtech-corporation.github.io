document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.querySelector('.theme-toggle');

  if (!toggleBtn) return;

  // Sync button state on load
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  toggleBtn.setAttribute('aria-pressed', currentTheme === 'dark');

  toggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

    // Apply attribute to <html> tag
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Save preference to browser storage
    try {
      localStorage.setItem('noobtech-theme', newTheme);
    } catch (e) {
      console.warn('Unable to save theme preference to localStorage.');
    }

    // Accessibility state update
    toggleBtn.setAttribute('aria-pressed', newTheme === 'dark');
  });
});

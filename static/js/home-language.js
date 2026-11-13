const switchLink = document.querySelector('.language-switch');
const preferenceKey = 'homepage-language';

function preserveSection() {
  const target = new URL(switchLink.getAttribute('href'), location.href);
  target.hash = location.hash;
  switchLink.href = target.href;
}

preserveSection();
window.addEventListener('hashchange', preserveSection);

switchLink.addEventListener('click', () => {
  try {
    localStorage.setItem(preferenceKey, switchLink.hreflang);
  } catch {
    // The link still works when browser storage is disabled.
  }
});

if (document.documentElement.lang === 'zh-CN' && location.pathname.endsWith('/')) {
  try {
    if (localStorage.getItem(preferenceKey) === 'en') {
      location.replace(switchLink.href);
    }
  } catch {
    // Keep the default language when browser storage is unavailable.
  }
}

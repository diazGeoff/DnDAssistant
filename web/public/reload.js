// --- Hot content reload (file watcher) ---
const evtSource = new EventSource('/events');
evtSource.onmessage = () => softNavigate(location.href, false);

// --- Client-side navigation (preserves chat across pages) ---
async function softNavigate(url, pushState = true) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const newMain = doc.querySelector('main');
    if (newMain) {
      document.querySelector('main').innerHTML = newMain.innerHTML;
    }

    // Update title
    const newTitle = doc.querySelector('title');
    if (newTitle) document.title = newTitle.textContent;

    // Update URL without full reload
    if (pushState) {
      history.pushState(null, '', url);
    }

    // Re-bind internal links in new content
    bindInternalLinks(document.querySelector('main'));

    // Scroll to top on navigation (not on file-watcher reload)
    if (pushState) window.scrollTo(0, 0);
  } catch (e) {
    // Fallback to full navigation if fetch fails
    location.href = url;
  }
}

function bindInternalLinks(root) {
  root.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    // Only intercept local links (not external, not anchors-only, not new-tab)
    if (!href || href.startsWith('http') || href.startsWith('#') || a.target === '_blank') return;
    a.addEventListener('click', (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey) return; // respect modifier keys
      e.preventDefault();
      softNavigate(href);
    });
  });
}

// Bind nav links
document.querySelectorAll('nav a[href]').forEach(a => {
  a.addEventListener('click', (e) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    softNavigate(a.getAttribute('href'));
  });
});

// Bind links already in main content
bindInternalLinks(document.querySelector('main'));

// Handle browser back/forward
window.addEventListener('popstate', () => softNavigate(location.href, false));

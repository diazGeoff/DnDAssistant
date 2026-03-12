const express = require('express');
const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');
const { marked } = require('marked');
const chokidar = require('chokidar');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, '..');

// --- SSE for auto-reload ---
const sseClients = new Set();

app.get('/events', (req, res) => {
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
  res.flushHeaders();
  sseClients.add(res);
  req.on('close', () => sseClients.delete(res));
});

function broadcastReload() {
  for (const client of sseClients) {
    client.write('data: reload\n\n');
  }
}

chokidar.watch([path.join(ROOT, 'campaigns'), path.join(ROOT, 'characters')], {
  ignoreInitial: true,
  ignored: /(^|[\/\\])\../,
}).on('all', () => broadcastReload());

// --- Static files ---
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/files/campaigns', express.static(path.join(ROOT, 'campaigns')));
app.use('/files/characters', express.static(path.join(ROOT, 'characters')));

// --- Helpers ---
function readTemplate(name) {
  return fs.readFileSync(path.join(__dirname, 'views', name), 'utf8');
}

const layout = () => readTemplate('layout.html');

function renderMarkdown(mdContent, basePath) {
  const renderer = new marked.Renderer();

  const originalLink = renderer.link;
  renderer.link = function ({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    if (href && href.endsWith('.md')) {
      // Rewrite .md links to app routes
      if (href.startsWith('sessions/session-')) {
        const num = href.match(/session-(\d+)\.md/);
        if (num) href = `/sessions/${num[1]}`;
      } else if (href.includes('characters/') && href.includes('profile.md')) {
        const name = href.match(/characters\/([^/]+)\/profile\.md/);
        if (name) href = `/characters/${name[1]}`;
      }
    } else if (href && !href.startsWith('http') && !href.startsWith('/') && !href.startsWith('#')) {
      // Rewrite relative paths (images, maps) to static paths
      href = `/files/${basePath}/${href}`;
    }
    const titleAttr = title ? ` title="${title}"` : '';
    return `<a href="${href}"${titleAttr}>${text}</a>`;
  };

  const originalImage = renderer.image;
  renderer.image = function ({ href, title, text }) {
    if (href && !href.startsWith('http') && !href.startsWith('/')) {
      href = `/files/${basePath}/${href}`;
    }
    const titleAttr = title ? ` title="${title}"` : '';
    return `<img src="${href}" alt="${text || ''}"${titleAttr} loading="lazy">`;
  };

  return marked(mdContent, { renderer, gfm: true });
}

function renderPage(title, contentHtml) {
  return layout()
    .replace('{{title}}', title)
    .replace('{{content}}', contentHtml);
}

function findCampaigns() {
  const campaignsDir = path.join(ROOT, 'campaigns');
  if (!fs.existsSync(campaignsDir)) return [];
  return fs.readdirSync(campaignsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
}

function findCharacters() {
  const charsDir = path.join(ROOT, 'characters');
  if (!fs.existsSync(charsDir)) return [];
  return fs.readdirSync(charsDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && fs.existsSync(path.join(charsDir, d.name, 'profile.md')))
    .map(d => d.name);
}

// --- Routes ---

// Campaign overview (default to first campaign)
app.get('/', (req, res) => {
  const campaigns = findCampaigns();
  if (campaigns.length === 0) return res.send(renderPage('No Campaigns', '<p>No campaigns found.</p>'));
  res.redirect(`/campaign/${campaigns[0]}`);
});

app.get('/campaign/:name', (req, res) => {
  const campaignPath = path.join(ROOT, 'campaigns', req.params.name, 'campaign.md');
  if (!fs.existsSync(campaignPath)) return res.status(404).send(renderPage('Not Found', '<p>Campaign not found.</p>'));

  const md = fs.readFileSync(campaignPath, 'utf8');
  const html = renderMarkdown(md, `campaigns/${req.params.name}`);
  res.send(renderPage(req.params.name.replace(/-/g, ' '), `<article class="campaign">${html}</article>`));
});

// Sessions list
app.get('/sessions', (req, res) => {
  const campaigns = findCampaigns();
  if (campaigns.length === 0) return res.send(renderPage('Sessions', '<p>No campaigns found.</p>'));

  const campaign = campaigns[0];
  const sessionsDir = path.join(ROOT, 'campaigns', campaign, 'sessions');
  if (!fs.existsSync(sessionsDir)) return res.send(renderPage('Sessions', '<p>No sessions found.</p>'));

  const files = fs.readdirSync(sessionsDir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse();

  let listHtml = '<h1>Sessions</h1><ul class="session-list">';
  for (const file of files) {
    const num = file.match(/session-(\d+)/)?.[1] || file;
    const md = fs.readFileSync(path.join(sessionsDir, file), 'utf8');
    // Extract date and location from blockquote metadata
    const dateMatch = md.match(/\*\*Date:\*\*\s*(.+)/);
    const locMatch = md.match(/\*\*Location:\*\*\s*(.+)/);
    const date = dateMatch ? dateMatch[1].trim() : '';
    const location = locMatch ? locMatch[1].trim() : '';
    const meta = [date, location].filter(Boolean).join(' — ');

    listHtml += `<li><a href="/sessions/${num}"><strong>Session ${num}</strong>${meta ? `<span class="meta">${meta}</span>` : ''}</a></li>`;
  }
  listHtml += '</ul>';

  res.send(renderPage('Sessions', listHtml));
});

// Single session
app.get('/sessions/:id', (req, res) => {
  const campaigns = findCampaigns();
  if (campaigns.length === 0) return res.status(404).send(renderPage('Not Found', '<p>No campaigns found.</p>'));

  const campaign = campaigns[0];
  const paddedId = req.params.id.padStart(2, '0');
  const sessionPath = path.join(ROOT, 'campaigns', campaign, 'sessions', `session-${paddedId}.md`);
  if (!fs.existsSync(sessionPath)) return res.status(404).send(renderPage('Not Found', '<p>Session not found.</p>'));

  const md = fs.readFileSync(sessionPath, 'utf8');
  const html = renderMarkdown(md, `campaigns/${campaign}`);
  res.send(renderPage(`Session ${paddedId}`, `<article class="session">${html}</article>`));
});

// Characters list
app.get('/characters', (req, res) => {
  const chars = findCharacters();
  if (chars.length === 0) return res.send(renderPage('Characters', '<p>No characters found.</p>'));

  let listHtml = '<h1>Characters</h1><ul class="character-list">';
  for (const name of chars) {
    const md = fs.readFileSync(path.join(ROOT, 'characters', name, 'profile.md'), 'utf8');
    // Extract metadata from blockquote header
    const raceMatch = md.match(/\*\*Race:\*\*\s*(.+)/);
    const classMatch = md.match(/\*\*Class:\*\*\s*(.+)/);
    const race = raceMatch ? raceMatch[1].trim() : '';
    const cls = classMatch ? classMatch[1].trim() : '';
    const displayName = name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    listHtml += `<li><a href="/characters/${name}"><strong>${displayName}</strong><span class="meta">${[race, cls].filter(Boolean).join(' — ')}</span></a></li>`;
  }
  listHtml += '</ul>';

  res.send(renderPage('Characters', listHtml));
});

// Single character
app.get('/characters/:name', (req, res) => {
  const profilePath = path.join(ROOT, 'characters', req.params.name, 'profile.md');
  if (!fs.existsSync(profilePath)) return res.status(404).send(renderPage('Not Found', '<p>Character not found.</p>'));

  const md = fs.readFileSync(profilePath, 'utf8');
  const html = renderMarkdown(md, `characters/${req.params.name}`);
  res.send(renderPage(req.params.name.replace(/-/g, ' '), `<article class="character">${html}</article>`));
});

// Map gallery
app.get('/maps', (req, res) => {
  const campaigns = findCampaigns();
  if (campaigns.length === 0) return res.send(renderPage('Maps', '<p>No campaigns found.</p>'));

  const campaign = campaigns[0];
  const mapsDir = path.join(ROOT, 'campaigns', campaign, 'maps');
  if (!fs.existsSync(mapsDir)) return res.send(renderPage('Maps', '<p>No maps found.</p>'));

  const imageExts = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'];
  const files = fs.readdirSync(mapsDir).filter(f => imageExts.includes(path.extname(f).toLowerCase()));

  let galleryHtml = '<h1>Maps</h1><div class="map-gallery">';
  for (const file of files) {
    const label = file.replace(/[-_]/g, ' ').replace(/\.\w+$/, '');
    galleryHtml += `<div class="map-card">
      <a href="/files/campaigns/${campaign}/maps/${file}" target="_blank">
        <img src="/files/campaigns/${campaign}/maps/${file}" alt="${label}" loading="lazy">
      </a>
      <span class="map-label">${label}</span>
    </div>`;
  }
  galleryHtml += '</div>';

  res.send(renderPage('Maps', galleryHtml));
});

// --- Chat API ---
const CONFIG_PATH = path.join(__dirname, 'config.json');
const systemPromptCache = new Map();

function readConfig() {
  if (!fs.existsSync(CONFIG_PATH)) return { activeCampaign: '' };
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
}

function writeConfig(config) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n');
}

function assembleSystemPrompt(campaignName) {
  let prompt = '';

  // CLAUDE.md system instructions
  const claudeMd = path.join(ROOT, 'CLAUDE.md');
  if (fs.existsSync(claudeMd)) {
    prompt += fs.readFileSync(claudeMd, 'utf8');
  }

  // Active campaign file
  if (campaignName) {
    const campaignMd = path.join(ROOT, 'campaigns', campaignName, 'campaign.md');
    if (fs.existsSync(campaignMd)) {
      prompt += `\n\n--- Campaign: ${campaignName} ---\n\n`;
      prompt += fs.readFileSync(campaignMd, 'utf8');
    }

    // Session notes for active campaign
    const sessionsDir = path.join(ROOT, 'campaigns', campaignName, 'sessions');
    if (fs.existsSync(sessionsDir)) {
      const sessionFiles = fs.readdirSync(sessionsDir).filter(f => f.endsWith('.md')).sort();
      for (const sf of sessionFiles) {
        prompt += `\n\n--- ${sf} ---\n\n`;
        prompt += fs.readFileSync(path.join(sessionsDir, sf), 'utf8');
      }
    }
  }

  // All character profiles
  const chars = findCharacters();
  for (const name of chars) {
    const profilePath = path.join(ROOT, 'characters', name, 'profile.md');
    prompt += `\n\n--- Character: ${name} ---\n\n`;
    prompt += fs.readFileSync(profilePath, 'utf8');
  }

  return prompt;
}

app.get('/api/campaigns', (req, res) => {
  res.json(findCampaigns());
});

app.get('/api/config', (req, res) => {
  res.json(readConfig());
});

app.post('/api/config', (req, res) => {
  const config = readConfig();
  if (req.body.activeCampaign !== undefined) {
    config.activeCampaign = req.body.activeCampaign;
  }
  writeConfig(config);
  res.json(config);
});

app.post('/api/chat', async (req, res) => {
  const { messages, sessionId, model } = req.body;
  const config = readConfig();
  const campaignName = config.activeCampaign;

  // Cache system prompt per session
  if (!systemPromptCache.has(sessionId)) {
    systemPromptCache.set(sessionId, assembleSystemPrompt(campaignName));
  }

  const apiMessages = [
    { role: 'system', content: systemPromptCache.get(sessionId) },
    ...messages,
  ];

  try {
    const response = await fetch('http://localhost:3456/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4',
        messages: apiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-System-Prompt-Size', String(systemPromptCache.get(sessionId).length));

    Readable.fromWeb(response.body).pipe(res);
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach Claude API proxy. Is claude-max-api-proxy running?' });
  }
});

app.listen(PORT, () => {
  console.log(`D&D Game Assistant running at http://localhost:${PORT}`);
});

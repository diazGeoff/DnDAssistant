(function () {
  'use strict';

  const MAX_CONTEXT_TOKENS = 200000; // Claude Sonnet 4 context window
  const CHARS_PER_TOKEN = 4; // rough estimate

  let sessionId = null;
  let messages = [];
  let isStreaming = false;
  let activeCampaign = '';
  let selectedModel = 'claude-sonnet-4';
  let systemPromptChars = 0;

  // --- DOM Setup ---
  function createChatUI() {
    // Chat bubble
    const bubble = document.createElement('button');
    bubble.className = 'chat-bubble';
    bubble.innerHTML = '&#x1f3b2;'; // dice emoji
    bubble.title = 'Open D&D Chat';
    bubble.addEventListener('click', openChat);

    // Chat panel
    const panel = document.createElement('div');
    panel.className = 'chat-panel';
    panel.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-left">
          <span class="chat-header-title">D&D Assistant</span>
          <select class="chat-campaign-select"></select>
        </div>
        <div class="chat-header-right">
          <select class="chat-model-select">
            <option value="claude-sonnet-4">Sonnet</option>
            <option value="claude-opus-4">Opus</option>
          </select>
          <span class="chat-context" title="Estimated context usage">0%</span>
          <button class="chat-new" title="New session">&#x21bb;</button>
          <button class="chat-minimize" title="Minimize">&minus;</button>
        </div>
      </div>
      <div class="chat-messages"></div>
      <div class="chat-input-area">
        <textarea class="chat-input" placeholder="Ask about rules, characters, lore..." rows="1"></textarea>
        <button class="chat-send">Send</button>
      </div>
    `;

    document.body.appendChild(bubble);
    document.body.appendChild(panel);

    // Event listeners
    panel.querySelector('.chat-minimize').addEventListener('click', minimizeChat);
    panel.querySelector('.chat-new').addEventListener('click', resetSession);
    panel.querySelector('.chat-send').addEventListener('click', handleSend);

    const input = panel.querySelector('.chat-input');
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });

    // Auto-resize textarea
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 100) + 'px';
    });

    // Campaign selector
    const select = panel.querySelector('.chat-campaign-select');
    select.addEventListener('change', (e) => {
      changeCampaign(e.target.value);
    });

    // Model selector
    const modelSelect = panel.querySelector('.chat-model-select');
    modelSelect.addEventListener('change', (e) => {
      selectedModel = e.target.value;
    });

    loadCampaigns();
  }

  async function loadCampaigns() {
    try {
      const [campaignsRes, configRes] = await Promise.all([
        fetch('/api/campaigns'),
        fetch('/api/config'),
      ]);
      const campaigns = await campaignsRes.json();
      const config = await configRes.json();
      activeCampaign = config.activeCampaign || '';

      const select = document.querySelector('.chat-campaign-select');
      select.innerHTML = '';
      for (const name of campaigns) {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name.replace(/-/g, ' ');
        if (name === activeCampaign) opt.selected = true;
        select.appendChild(opt);
      }
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    }
  }

  async function changeCampaign(name) {
    activeCampaign = name;
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeCampaign: name }),
      });
    } catch (err) {
      console.error('Failed to update config:', err);
    }
    // Reset session with new campaign context
    resetSession();
  }

  function openChat() {
    document.querySelector('.chat-bubble').classList.add('hidden');
    document.querySelector('.chat-panel').classList.add('open');
    // Only start a new session if there isn't one already
    if (!sessionId) {
      resetSession();
    }
    document.querySelector('.chat-input').focus();
  }

  function minimizeChat() {
    document.querySelector('.chat-panel').classList.remove('open');
    document.querySelector('.chat-bubble').classList.remove('hidden');
    // Session stays alive — clicking bubble will restore it
  }

  function resetSession() {
    sessionId = crypto.randomUUID();
    messages = [];
    systemPromptChars = 0;
    const messagesEl = document.querySelector('.chat-messages');
    messagesEl.innerHTML = '';
    appendMessage('assistant', 'New session started. How can I help?');
    updateContextDisplay();
  }

  // --- Context tracking ---
  function estimateTokens(text) {
    return Math.ceil(text.length / CHARS_PER_TOKEN);
  }

  function getContextUsage() {
    const systemTokens = estimateTokens(' '.repeat(systemPromptChars));
    let messageTokens = 0;
    for (const msg of messages) {
      messageTokens += estimateTokens(msg.content);
    }
    return ((systemTokens + messageTokens) / MAX_CONTEXT_TOKENS) * 100;
  }

  function updateContextDisplay() {
    const pct = Math.round(getContextUsage());
    const el = document.querySelector('.chat-context');
    el.textContent = `${pct}%`;

    // Color coding
    if (pct >= 80) {
      el.classList.add('critical');
      el.classList.remove('warning');
    } else if (pct >= 60) {
      el.classList.add('warning');
      el.classList.remove('critical');
    } else {
      el.classList.remove('warning', 'critical');
    }
  }

  // --- Messaging ---
  function appendMessage(role, content) {
    const messagesEl = document.querySelector('.chat-messages');
    const msg = document.createElement('div');
    msg.className = `chat-message ${role}`;
    msg.textContent = content;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return msg;
  }

  async function handleSend() {
    const input = document.querySelector('.chat-input');
    const text = input.value.trim();
    if (!text || isStreaming) return;

    input.value = '';
    input.style.height = 'auto';

    // Add user message
    appendMessage('user', text);
    messages.push({ role: 'user', content: text });
    updateContextDisplay();

    // Send to API
    isStreaming = true;
    document.querySelector('.chat-send').disabled = true;

    const assistantMsg = appendMessage('assistant', '');
    let fullContent = '';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, sessionId, model: selectedModel }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Unknown error' }));
        assistantMsg.className = 'chat-message error';
        assistantMsg.textContent = err.error || 'Failed to get response';
        return;
      }

      // Grab system prompt size from header if available
      const promptSize = response.headers.get('X-System-Prompt-Size');
      if (promptSize) {
        systemPromptChars = parseInt(promptSize, 10);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE lines
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep incomplete line in buffer

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;

          const data = trimmed.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              fullContent += delta;
              assistantMsg.textContent = fullContent;
              document.querySelector('.chat-messages').scrollTop =
                document.querySelector('.chat-messages').scrollHeight;
            }
          } catch (e) {
            // Skip unparseable chunks
          }
        }
      }

      // Save assistant response to history
      if (fullContent) {
        messages.push({ role: 'assistant', content: fullContent });
        updateContextDisplay();
      }
    } catch (err) {
      assistantMsg.className = 'chat-message error';
      assistantMsg.textContent = 'Connection failed. Is the API proxy running?';
    } finally {
      isStreaming = false;
      document.querySelector('.chat-send').disabled = false;
      document.querySelector('.chat-input').focus();
    }
  }

  // --- Init ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatUI);
  } else {
    createChatUI();
  }
})();

(function() {
  const openBtn = document.getElementById('chat-open-btn');
  const chatWindow = document.getElementById('chat-window');
  const bodyEl = document.getElementById('chat-body');
  const inputEl = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');

  const CONFIG = {
    host: 'https://<your-azure-endpoint>.openai.azure.com/openai/deployments/<deployment-id>/chat/completions?api-version=2023-05-15',
    apiKey: '<YOUR_AZURE_API_KEY>',
    welcomeMessage: 'Hello – how can I help you today with NHS services?',
    inactiveMsg: 'Sorry, the chatbot is currently unavailable. Please try again later.'
  };

  function appendBubble(text, cls) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${cls}`;
    bubble.textContent = text;
    bodyEl.appendChild(bubble);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function showBot(text) { appendBubble(text, 'bot'); }
  function showUser(text) { appendBubble(text, 'user'); }

  async function sendMessage(text) {
    showUser(text);
    inputEl.value = '';
    try {
      const response = await fetch(CONFIG.host, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': CONFIG.apiKey
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a helpful NHS Covid advisor.' },
            { role: 'user', content: text }
          ]
        })
      });
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content;
      showBot(reply || CONFIG.inactiveMsg);
    } catch (err) {
      showBot(CONFIG.inactiveMsg);
      console.error('Chat error:', err);
    }
  }

  openBtn.addEventListener('click', () => {
    const isOpen = chatWindow.classList.toggle('open');
    if (isOpen) showBot(CONFIG.welcomeMessage);
    openBtn.setAttribute('aria-expanded', isOpen);
    if (isOpen) inputEl.focus();
  });

  sendBtn.addEventListener('click', () => {
    const val = inputEl.value.trim();
    if (val) sendMessage(val);
  });

  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && inputEl.value.trim()) {
      sendMessage(inputEl.value.trim());
    }
  });
})();
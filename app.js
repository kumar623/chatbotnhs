const openBtn = document.getElementById('chat-open-btn');
const chatWindow = document.getElementById('chat-window');
const bodyEl = document.getElementById('chat-body');
const inputEl = document.getElementById('chat-input');
const sendBtn = document.getElementById('chat-send-btn');

const CONFIG = {
  // Replace Rasa endpoint with Azure AI endpoint
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
    const res = await fetch(CONFIG.host, {
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
    const data = await res.json();
    // Azure OpenAI returns a list of choices
    const reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    showBot(reply || CONFIG.inactiveMsg);
  } catch (e) {
    showBot(CONFIG.inactiveMsg);
    console.error(e);
  }
}
,
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    data.forEach(msg => showBot(msg.text));
  } catch (e) {
    showBot(CONFIG.inactiveMsg);
    console.error(e);
  }
}

openBtn.addEventListener('click', () => {
  chatWindow.classList.toggle('open');
  if (chatWindow.classList.contains('open')) showBot(CONFIG.welcomeMessage);
});
sendBtn.addEventListener('click', () => {
  const val = inputEl.value.trim();
  if (val) sendMessage(val);
});
inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter' && inputEl.value.trim()) sendMessage(inputEl.value.trim());
});

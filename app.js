const chatWindow = document.getElementById('chat-window');
const chatForm   = document.getElementById('chat-form');
const chatInput  = document.getElementById('chat-input');

// Replace with your deployed backend URL
const API_URL = 'https://YOUR_BACKEND_URL/api/chat';

function appendMessage(text, sender) {
  const div = document.createElement('div');
  div.className = `message ${sender}`;
  div.textContent = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

chatForm.addEventListener('submit', async e => {
  e.preventDefault();
  const question = chatInput.value.trim();
  if (!question) return;
  appendMessage(question, 'user');
  chatInput.value = '';

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ question })
    });
    const { answer } = await res.json();
    appendMessage(answer, 'bot');
  } catch (err) {
    appendMessage('⚠️ Error connecting to chat service.', 'bot');
    console.error(err);
  }
});

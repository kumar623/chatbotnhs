(function() {
  const openBtn = document.getElementById('chat-open-btn');
  const closeBtn = document.getElementById('chat-close-btn');
  const chatWindow = document.getElementById('chat-window');
  const bodyEl = document.getElementById('chat-body');
  const inputEl = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');

  const DUMMY_TOPICS = ['Vaccination', 'Book Appointment', 'Symptoms Checker', 'Find GP'];

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function appendBubble(text, cls) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${cls}`;
    const msg = document.createElement('span');
    msg.textContent = text;
    bubble.appendChild(msg);
    const timestamp = document.createElement('span');
    timestamp.className = 'timestamp';
    timestamp.textContent = formatTime(new Date());
    bubble.appendChild(timestamp);
    bodyEl.appendChild(bubble);
    bodyEl.scrollTop = bodyEl.scrollHeight;
    return bubble;
  }

  function showBot(text) { appendBubble(text, 'bot'); }
  function showUser(text) { appendBubble(text, 'user'); }

  function showQuickReplies(options) {
    const container = document.createElement('div');
    container.className = 'quick-replies';
    options.forEach(opt => {
      const chip = document.createElement('button');
      chip.className = 'quick-reply';
      chip.textContent = opt;
      chip.onclick = () => {
        showUser(opt);
        container.remove();
        handleMessage(opt, true);
      };
      container.appendChild(chip);
    });
    bodyEl.appendChild(container);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function handleMessage(text, isQuick = false) {
    let response = '';
    switch (text) {
      case 'Vaccination':
        response = 'You can book your COVID-19 vaccination at your local GP. Would you like help finding clinics?';
        break;
      case 'Book Appointment':
        response = 'Sure, what kind of appointment do you need? GP, Dentist, or Therapist?';
        break;
      case 'Symptoms Checker':
        response = 'Please describe your symptoms briefly, and I can suggest next steps.';
        break;
      case 'Find GP':
        response = 'You can find registered GPs via the NHS website: https://www.nhs.uk/service-search';
        break;
      default:
        response = 'I\'m sorry, I can only show demo responses right now.';
    }
    const typing = appendBubble('NHS Health Assistant is typing...', 'typing');
    setTimeout(() => {
      typing.remove();
      showBot(response);
      if (!isQuick) showQuickReplies(DUMMY_TOPICS);
    }, Math.random() * 2000 + 1000);
  }

  function trapFocus(e) {
    const focusable = chatWindow.querySelectorAll('button, input');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault(); last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    }
  }

  function openChat() {
    chatWindow.classList.add('open');
    showBot('Welcome to NHS Health Assistant! How can I help you today?');
    showQuickReplies(DUMMY_TOPICS);
    inputEl.focus();
    document.addEventListener('keydown', trapFocus);
  }

  function closeChat() {
    chatWindow.classList.remove('open');
    openBtn.focus();
    document.removeEventListener('keydown', trapFocus);
  }

  openBtn.addEventListener('click', () => {
    openChat();
  });
  closeBtn.addEventListener('click', closeChat);

  sendBtn.addEventListener('click', () => {
    const val = inputEl.value.trim();
    if (val) {
      inputEl.value = '';
      showUser(val);
      handleMessage(val);
    }
  });

  inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' && inputEl.value.trim()) {
      const val = inputEl.value.trim();
      inputEl.value = '';
      showUser(val);
      handleMessage(val);
    }
  });
})();

(function() {
  const openBtn = document.getElementById('chat-open-btn');
  const chatWindow = document.getElementById('chat-window');
  const bodyEl = document.getElementById('chat-body');
  const inputEl = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');

  const DUMMY_TOPICS = ['Vaccination', 'Book Appointment', 'Symptoms Checker', 'Find GP'];

  function appendBubble(text, cls) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${cls}`;
    bubble.textContent = text;
    bodyEl.appendChild(bubble);
    bodyEl.scrollTop = bodyEl.scrollHeight;
    return bubble;
  }

  function showBot(text) {
    appendBubble(text, 'bot');
  }
  function showUser(text) {
    appendBubble(text, 'user');
  }

  function showQuickReplies(options) {
    const container = document.createElement('div');
    container.className = 'quick-replies';
    options.forEach(opt => {
      const chip = document.createElement('div');
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
    // Dummy responses for demo
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
        response = 'I'm sorry, I can only show demo responses right now.';
    }
    // Typing indicator demo
    const typing = appendBubble('NHS Health Assistant is typing...', 'typing');
    const delay = Math.random() * 2000 + 1000;
    setTimeout(() => {
      typing.remove();
      showBot(response);
      // After initial welcome, show quick replies
      if (!isQuick) showQuickReplies(DUMMY_TOPICS);
    }, delay);
  }

  openBtn.addEventListener('click', () => {
    const isOpen = chatWindow.classList.toggle('open');
    if (isOpen) {
      showBot('Welcome to NHS Health Assistant! How can I help you today?');
      showQuickReplies(DUMMY_TOPICS);
      inputEl.focus();
    }
    openBtn.setAttribute('aria-expanded', isOpen);
  });

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
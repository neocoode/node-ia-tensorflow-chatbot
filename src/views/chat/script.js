const chatContainer = document.getElementById('chatContainer');
const chatForm = document.getElementById('chatForm');
const trainButton = document.getElementById('trainButton');
const sendButton = document.getElementById('sendButton');
let isSending = false;

trainButton.addEventListener('click', function () {
  window.location.href = '/train';
});

function toggleSendIcon() {
  if (isSending) {
    sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
  } else {
    sendButton.innerHTML = '<i class="fas fa-stop"></i>';
  }
  isSending = !isSending;
}

chatForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const pergunta = document.getElementById('pergunta').value;
  if (!pergunta) return;

  addWordByWord(pergunta, 'user-message');

  document.getElementById('pergunta').value = '';
  toggleSendIcon();

  try {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pergunta }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let buffer = '';

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      const lines = buffer.split('\n');
      buffer = lines.pop(); // Preservar qualquer fragmento de JSON incompleto no buffer

      lines.forEach((line) => {
        if (line.startsWith('data: ')) {
          try {
            const parsedData = JSON.parse(line.replace('data: ', '').trim());

            const botMessageDiv = document.createElement('div');
            botMessageDiv.classList.add('message', 'bot-message');
            chatContainer.appendChild(botMessageDiv);

            if (parsedData.type === 'resume') {
              addWordByWord(`Resumo: ${parsedData.text}`, 'bot-message', botMessageDiv);
            } else if (parsedData.type === 'response') {
              addWordByWord(`* ${parsedData.text}`, 'bot-message', botMessageDiv);
            } else if (parsedData.type === 'link') {
              const linkDiv = document.createElement('div');
              linkDiv.classList.add('message', 'bot-message');
              linkDiv.innerHTML = `<a href="${parsedData.url}" target="_blank">${parsedData.text}</a>`;
              chatContainer.appendChild(linkDiv);
            }

            // Scroll automático para a última mensagem
            chatContainer.scrollTop = chatContainer.scrollHeight;
          } catch (error) {
            console.error('Erro ao processar o JSON:', error);
          }
        }
      });
    }
  } catch (error) {
    console.error('Erro ao enviar a mensagem:', error);
  } finally {
    toggleSendIcon();
  }
});

function addWordByWord(text, className, element) {
  const words = text.split(' ');
  element = element || document.createElement('div');
  element.classList.add('message', className);
  chatContainer.appendChild(element);

  words.forEach((word, index) => {
    setTimeout(() => {
      const wordSpan = document.createElement('span');
      wordSpan.classList.add('word');
      wordSpan.textContent = word;
      element.appendChild(wordSpan);
    }, index * 100);
  });
}

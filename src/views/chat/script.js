const chatContainer = document.getElementById('chatContainer');
const chatForm = document.getElementById('chatForm');
const trainButton = document.getElementById('trainButton');
const sendButton = document.getElementById('sendButton');
let isSending = false; // Controla se está enviando ou não

trainButton.addEventListener('click', function () {
  window.location.href = '/train'; // Redireciona para a página de treinamento
});

chatForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const pergunta = document.getElementById('pergunta').value;
  if (!pergunta) return;

  // Adicionar a pergunta do usuário no chat palavra por palavra
  addWordByWord(pergunta, 'user-message');

  // Limpar o campo de input
  document.getElementById('pergunta').value = '';

  // Alterar o ícone para o modo de envio
  toggleSendIcon();

  // Simular envio da mensagem e permitir o cancelamento
  const controller = new AbortController(); // Controla o abortamento da requisição
  const { signal } = controller;
  const botMessageDiv = document.createElement('div');

  try {
    const response = await fetch('/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pergunta }),
      signal: signal,
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const botMessage = '';

    // Criar um novo bloco de mensagem para o chatbot
    botMessageDiv.classList.add('message', 'bot-message');
    chatContainer.appendChild(botMessageDiv);

    // Ler o stream palavra por palavra
    let wordIndex = 0;
    const delayBetweenWords = 0.05;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const textChunk = decoder.decode(value);

      // Quebrar o texto em palavras e exibi-las uma a uma
      const words = textChunk.split(' ');
      words.forEach((word) => {
        const wordSpan = document.createElement('span');
        wordSpan.classList.add('word');
        wordSpan.style.animationDelay = `${wordIndex * delayBetweenWords}s`;
        wordSpan.textContent = word;
        botMessageDiv.appendChild(wordSpan);
        wordIndex++;
      });

      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      botMessageDiv.innerText = 'Envio cancelado.';
    } else {
      botMessageDiv.innerText = 'Erro no envio da mensagem.';
    }
  } finally {
    toggleSendIcon();
  }
});

function addWordByWord(message, messageType) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', messageType);
  chatContainer.appendChild(messageDiv);

  const words = message.split(' ');
  words.forEach((word, index) => {
    const wordSpan = document.createElement('span');
    wordSpan.classList.add('word');
    wordSpan.style.animationDelay = `${index * 0.05}s`;
    wordSpan.textContent = word;
    messageDiv.appendChild(wordSpan);
  });

  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function toggleSendIcon() {
  isSending = !isSending;

  if (isSending) {
    sendButton.innerHTML = '<i class="fas fa-square"></i>';
    sendButton.classList.add('icon-square');
  } else {
    sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
    sendButton.classList.remove('icon-square');
  }
}

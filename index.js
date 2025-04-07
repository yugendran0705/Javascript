const chatWindow = document.getElementById('chatWindow');
const messageInput = document.getElementById('messageInput');


const botResponses = [
    "Hey, that's cool!",
    "Tell me more!",
    "Interesting...",
    "Got it!",
    "Nice one!"
];


function addMessage(text, isSent) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isSent ? 'sent' : 'received');

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messageDiv.innerHTML = `
                <div>${text}</div>
                <div class="timestamp">${time}</div>
            `;

    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}


function sendMessage() {
    const text = messageInput.value.trim();
    if (text) {
        addMessage(text, true);
        messageInput.value = '';
        simulateBotResponse();
    }
}


function simulateBotResponse() {
    setTimeout(() => {
        const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
        addMessage(randomResponse, false);
    }, 1000);
}


messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

addMessage("Hello! How can I help you today?", false);
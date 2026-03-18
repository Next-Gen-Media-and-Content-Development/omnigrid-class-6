//// Website khulne ke 2 second baad Anya ek message degi
window.onload = () => {
    setTimeout(() => {
        const welcomePopup = document.createElement('div');
        welcomePopup.innerHTML = "<b>Anya:</b> Konnichiwa! Mujhse baat karne ke liye yahan click karein! ✨";
        welcomePopup.style = `
            position: fixed;
            bottom: 110px;
            right: 20px;
            background: #e94560;
            color: white;
            padding: 10px 15px;
            border-radius: 10px;
            font-family: 'Jost', sans-serif;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 2500;
            animation: float 3s infinite;
        `;
        document.body.appendChild(welcomePopup);

        // 5 second baad ye popup apne aap hat jayega
        setTimeout(() => {
            welcomePopup.remove();
        }, 6000);
    }, 2000);
}; --- CHATBOT LOGIC ---

const openChatBtn = document.getElementById('open-chat-btn');
const closeChatBtn = document.getElementById('close-chat');
const chatbotContainer = document.getElementById('chatbot-container');
const chatbotMessages = document.getElementById('chatbot-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// 1. Toggle Chat Window
openChatBtn.addEventListener('click', () => {
    chatbotContainer.classList.toggle('chatbot-hidden');
    // Say hello when opened
    if (!chatbotContainer.classList.contains('chatbot-hidden')) {
        addMessage('bot', "Konnichiwa! I'm Anya. What would you like to explore today? Type a subject like 'science' or try 'quiz'!");
    }
});

closeChatBtn.addEventListener('click', () => {
    chatbotContainer.classList.add('chatbot-hidden');
});

// 2. Send Message on Click/Enter
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// 3. Main Send Function
function sendMessage() {
    const text = userInput.value.trim();
    if (text === "") return;

    addMessage('user', text); // Add student message
    userInput.value = ""; // Clear input

    // Simulate thinking and give answer
    setTimeout(() => {
        getBotResponse(text);
    }, 800);
}

// 4. Function to Add a Message Bubble
function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.innerHTML = text; // User innerHTML so we can use <br> or <a> tags in responses
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Auto-scroll to bottom
}

// 5. Bot Knowledge Base & Response Logic
function getBotResponse(userText) {
    const text = userText.toLowerCase().trim(); // Make it easy to match

    // --- YOUR SMART-BOT LIBRARY ---
    // Update these responses with REAL information or links.
    
    // TRIVIA / CHITCHAT
    if (text.includes('hello') || text.includes('hi')) {
        addMessage('bot', 'Hi there, fellow explorer! Ready for your quest?');
    } else if (text.includes('who are you') || text.includes('companion')) {
        addMessage('bot', "I'm Anya, your Class 6 AI Companion! I know everything about your subjects and can guide you. Ask me about a topic!");
    } else if (text.includes('anime')) {
        addMessage('bot', 'Aha! A fellow anime fan? Let\'s use our "Nendo" (study energy) to conquer these subjects!');
    
    // SCIENCE QUESTIONS
    } else if (text.includes('science')) {
        if (text.includes('quiz')) {
            addMessage('bot', "Ooh, a Science challenge! Check out the general quiz section, or go direct to your <a href='science_chapters.html'>Science Hub</a> to see quizzes per chapter!");
        } else if (text.includes('syllabus') || text.includes('chapters')) {
            addMessage('bot', "In Class 6 Science, you'll learn about:<br>- Food & Nutrients<br>- Materials & Sorting<br>- Light & Shadows<br>- Electricity & Circuits<br>Go to your <a href='science_chapters.html'>Science Hub</a> to start learning!");
        } else if (text.includes('light') || text.includes('shadow')) {
            addMessage('bot', "Light travels fast and creates shadows! Go to <a href='science_ch4.html'>Chapter 4</a> to see a cool simulation!");
        } else {
            addMessage('bot', "Awesome choice! We've got chapters on food, materials, light, and more! Click <a href='science_chapters.html'>Science Hub</a> to begin!");
        }

    // MATHS QUESTIONS
    } else if (text.includes('maths') || text.includes('mathematics')) {
        if (text.includes('algebra')) {
            addMessage('bot', "Algebra is the secret language of maths! <a href='maths_chapters.html#algebra'>Start Chapter 8</a> to see letters become numbers!");
        } else if (text.includes('integers')) {
            addMessage('bot', "Integers are positive AND negative numbers! Think of temperature or a lift going to the basement. Check <a href='maths_ch6.html'>Chapter 6</a>.");
        } else {
            addMessage('bot', "Ready to master numbers? Check your <a href='maths_chapters.html'>Maths Hub</a> for integers, fractions, geometry, and more!");
        }

    // SST QUESTIONS
    } else if (text.includes('sst') || text.includes('social studies')) {
        if (text.includes('history')) {
            addMessage('bot', "Did you know that in ancient India, there were massive kingdoms called Mahajanapadas? Go to <a href='sst_chapters.html#history'>Chapter 6</a> to explore!");
        } else if (text.includes('map') || text.includes('geography')) {
            addMessage('bot', "Mapping is essential! Our <a href='sst_chapters.html#geography'>Geography page</a> has some great interactive maps to check out.");
        } else {
            addMessage('bot', "Time travel through history, explore the globe in geography, and understand our world! Start your <a href='sst_chapters.html'>SST Adventure</a>.");
        }

    // GENERAL QUIZ / HELP
    } else if (text.includes('quiz')) {
        addMessage('bot', "Ready for a test? We have subject-specific quizzes and a general 'Mega-Quiz' challenge. Which subject do you want to quiz for?");
    } else if (text.includes('help')) {
        addMessage('bot', "Anya reporting for duty! Try asking: 'SST History', 'Maths Algebra', 'What is Science Chapter 1?', or 'Start a Science quiz'!");

    // UNKNOWN / FALLBACK
    } else {
        addMessage('bot', "Anya is puzzled... that sounds like a complex quest! Can you rephrase or try asking about a specific subject (Science, Maths, SST, English) or the 'Quiz'?");
    }
}

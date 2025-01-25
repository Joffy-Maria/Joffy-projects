const chatbotButton = document.getElementById("chatbot-button");
const chatWindow = document.getElementById("chat-window");
const closeChat = document.getElementById("close-chat");
const chatInput = document.getElementById("chat-input");
const chatBody = document.getElementById("chat-body");
const sendBtn = document.getElementById("send-btn");

// Open and close chatbot
chatbotButton.addEventListener("click", () => {
    chatWindow.style.display = "block";
    chatbotButton.style.display = "none";
});

closeChat.addEventListener("click", () => {
    chatWindow.style.display = "none";
    chatbotButton.style.display = "block";
});

// Fetch AI response
async function getAIResponse(userMessage) {
    const apiKey = "AIzaSyCg3glcXrZU-38frvMad4fpeeItA_ty8tw"; // Replace with your OpenAI API key
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=GEMINI_API_KEY";

    const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "gemini-1.5-flash", // Use the appropriate model
            messages: [{ role: "user", content: userMessage }],
        }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

// Send message and display response
sendBtn.addEventListener("click", async () => {
    const userMessage = chatInput.value.trim();
    if (userMessage) {
        // Add user message to chat body
        const userDiv = document.createElement("div");
        userDiv.className = "user-message";
        userDiv.textContent = userMessage;
        chatBody.appendChild(userDiv);

        chatInput.value = "";

        // Show a loading message
        const loadingDiv = document.createElement("div");
        loadingDiv.className = "bot-message";
        loadingDiv.textContent = "Thinking...";
        chatBody.appendChild(loadingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;

        // Get AI response
        try {
            const botReply = await getAIResponse(userMessage);
            loadingDiv.textContent = botReply;
        } catch (error) {
            loadingDiv.textContent = "Sorry, I couldn't connect to the AI service.";
            console.error("Error connecting to OpenAI:", error);
        }

        // Scroll chat to the bottom
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    async function fetchTicker(symbol) {
        const response = await fetch(`http://localhost:000/api/ticker?symbol=${symbol}`);
        const data = await response.json();
        return data;
    }
    
    async function placeTrade(order) {
        const response = await fetch("http://localhost:5000/api/trade", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order),
        });
        const data = await response.json();
        return data;
    }
    
});

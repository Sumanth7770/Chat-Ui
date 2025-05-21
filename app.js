// ========== DOM ELEMENTS ==========
const input = document.querySelector(".chat-input input");
const sendBtn = document.querySelector(".send-btn");
const messagesContainer = document.getElementById("messages");
const themeToggleBtn = document.getElementById("theme-toggle");
const typingIndicator = document.getElementById("typing-indicator");
const body = document.body;

// ========== INITIALIZATION ==========
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  body.classList.add("dark");
  themeToggleBtn.textContent = "☀️";
}

// ========== UTILITIES ==========
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function createMessage(text, type = "sent") {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", type);

  const messageText = document.createElement("p");
  messageText.textContent = text;

  const timeStamp = document.createElement("span");
  timeStamp.classList.add("msg-time");
  timeStamp.textContent = getCurrentTime();

  // Reaction badge display
  const reactionBadge = document.createElement("div");
  reactionBadge.classList.add("reaction-badge");

  // Reaction options on hover
  const reactionsDiv = document.createElement("div");
  reactionsDiv.classList.add("reactions");

  const emojis = ["👍", "😂", "❤️"];
  emojis.forEach((emoji) => {
    const btn = document.createElement("span");
    btn.textContent = emoji;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      reactionBadge.textContent = emoji;
      reactionsDiv.style.display = "none";
    });
    reactionsDiv.appendChild(btn);
  });

  // Append everything to message
  messageDiv.appendChild(messageText);
  messageDiv.appendChild(timeStamp);
  messageDiv.appendChild(reactionsDiv);
  messageDiv.appendChild(reactionBadge);

  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}



// ========== TYPING INDICATOR ==========
function showTypingIndicator() {
  typingIndicator.classList.remove("hidden");
}

function hideTypingIndicator() {
  typingIndicator.classList.add("hidden");
}

// ========== SEND MESSAGE ==========
sendBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (text !== "") {
    createMessage(text, "sent");
    input.value = "";

    // Show typing indicator
    showTypingIndicator();

    // Simulate delay before reply
    setTimeout(() => {
      hideTypingIndicator();
      createMessage("Auto-reply: Got it!", "received");
    }, 1500);
  }
});

// Enter key to send
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

// ========== THEME TOGGLE ==========
themeToggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");

  localStorage.setItem("theme", isDark ? "dark" : "light");
  themeToggleBtn.textContent = isDark ? "☀️" : "🌙";
});

// ========== SEARCH FUNCTIONALITY ==========
const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const allMessages = document.querySelectorAll(".message");

  allMessages.forEach((msg) => {
    const text = msg.querySelector("p")?.textContent.toLowerCase() || "";
    if (text.includes(query)) {
      msg.style.display = "block";
    } else {
      msg.style.display = "none";
    }
  });
});
// ========== CONTEXT MENU ==========
const contextMenu = document.getElementById("context-menu");
let currentMessage = null;

// Show context menu
messagesContainer.addEventListener("contextmenu", (e) => {
  const message = e.target.closest(".message");
  if (message) {
    e.preventDefault();
    currentMessage = message;

    contextMenu.style.top = `${e.clientY}px`;
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.classList.remove("hidden");
  } else {
    contextMenu.classList.add("hidden");
  }
});

// Hide menu on outside click
document.addEventListener("click", (e) => {
  if (!e.target.closest("#context-menu")) {
    contextMenu.classList.add("hidden");
  }
});

// COPY
document.getElementById("copy-msg").addEventListener("click", () => {
  const text = currentMessage?.querySelector("p")?.textContent || "";
  navigator.clipboard.writeText(text);
  contextMenu.classList.add("hidden");
  alert("Message copied!");
});

// DELETE
document.getElementById("delete-msg").addEventListener("click", () => {
  if (currentMessage) currentMessage.remove();
  contextMenu.classList.add("hidden");
});

// FORWARD (just clone it to the end as a sent message)
document.getElementById("forward-msg").addEventListener("click", () => {
  if (currentMessage) {
    const text = currentMessage.querySelector("p").textContent;
    createMessage(text, "sent");
  }
  contextMenu.classList.add("hidden");
});

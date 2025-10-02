// content.js

console.log("📩 Gmail AI Quick Reply content script загружен");

function insertReplyButton() {
  // Ищем тулбар Gmail
  const toolbar = document.querySelector("div[aria-label='Toolbar']");
  if (!toolbar) return;

  // Проверяем, нет ли уже кнопки
  if (document.getElementById("ai-reply-btn")) return;

  // Создаем кнопку
  const btn = document.createElement("button");
  btn.id = "ai-reply-btn";
  btn.innerText = "✨ AI Reply";
  btn.style.marginLeft = "8px";
  btn.style.padding = "6px 12px";
  btn.style.border = "none";
  btn.style.background = "#1a73e8";
  btn.style.color = "white";
  btn.style.borderRadius = "4px";
  btn.style.cursor = "pointer";

  btn.onclick = async () => {
    const emailBody = getEmailBody();
    if (!emailBody) {
      alert("Не удалось найти текст письма ❌");
      return;
    }

    btn.innerText = "⌛ Generating...";
    const reply = await getAIReply(emailBody);
    btn.innerText = "✨ AI Reply";

    if (reply) {
      insertReplyText(reply);
    } else {
      alert("Ошибка при генерации ответа ⚠️");
    }
  };

  toolbar.appendChild(btn);
}

function getEmailBody() {
  const emailElement = document.querySelector(".a3s"); // Gmail класс для тела письма
  return emailElement ? emailElement.innerText : "";
}

async function getAIReply(prompt) {
  try {
    const response = await fetch("https://gmail-ai-server.onrender.com/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: prompt })
    });

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("Ошибка при запросе к серверу:", error);
    return null;
  }
}

function insertReplyText(text) {
  const replyBox = document.querySelector("[aria-label='Message Body']");
  if (replyBox) {
    replyBox.innerText = text;
    replyBox.focus();
  } else {
    alert("Не удалось найти поле для ответа ⚠️");
  }
}

// Наблюдатель, чтобы кнопка появлялась при открытии письма
const observer = new MutationObserver(() => insertReplyButton());
observer.observe(document.body, { childList: true, subtree: true });

// content.js

document.addEventListener("DOMContentLoaded", function () {
    const verifyForm = document.getElementById("verify-form");
    const emailInput = document.getElementById("email");
    const statusDiv = document.getElementById("status");

    if (verifyForm) {
        verifyForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const email = emailInput.value.trim();

            statusDiv.textContent = "⏳ Проверяем подписку...";
            statusDiv.style.color = "#333";

            try {
                const response = await fetch("https://payoneer-server.onrender.com/verify", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (data.success) {
                    statusDiv.textContent = "✅ Подписка подтверждена!";
                    statusDiv.style.color = "green";
                } else {
                    statusDiv.textContent = "❌ Ошибка проверки: " + (data.error || "Подписка не найдена");
                    statusDiv.style.color = "red";
                }
            } catch (err) {
                statusDiv.textContent = "⚠️ Сервер недоступен. Попробуйте позже.";
                statusDiv.style.color = "orange";
            }
        });
    }
});

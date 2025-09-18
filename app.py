from flask import Flask, request, jsonify
import openai
import os

app = Flask(__name__)

# Получаем API-ключ из переменных окружения
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route("/")
def home():
    return "Gmail AI Quick Reply Server is running!"

@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an assistant that writes professional email replies."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=300
        )

        ai_reply = response["choices"][0]["message"]["content"].strip()
        return jsonify({"reply": ai_reply})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

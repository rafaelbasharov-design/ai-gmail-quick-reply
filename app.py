from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "✅ Gmail AI Server is running (stub mode)."

# Заглушка вместо реальной проверки
@app.route("/verify", methods=["POST"])
def verify():
    data = request.json
    email = data.get("email")
    
    # Пока просто подтверждаем для любого email
    return jsonify({"success": True, "email": email})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

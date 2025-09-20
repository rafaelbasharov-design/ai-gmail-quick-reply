import os
from flask import Flask, request, jsonify
import stripe
from flask_cors import CORS  # добавляем CORS

app = Flask(__name__)
CORS(app)  # разрешаем кросс-доменные запросы

# Загружаем ключи из переменных окружения
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
PRICE_ID = os.getenv("STRIPE_PRICE_ID")


@app.route("/")
def home():
    return "✅ Gmail AI Server is running with Stripe integration and CORS enabled!"


@app.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
            line_items=[{
                "price": PRICE_ID,
                "quantity": 1,
            }],
            success_url="https://gmail-ai-server.onrender.com/success",
            cancel_url="https://gmail-ai-server.onrender.com/cancel",
        )
        return jsonify({"url": session.url})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/success")
def success():
    return "🎉 Оплата прошла успешно! Подписка активирована."


@app.route("/cancel")
def cancel():
    return "❌ Оплата отменена. Попробуйте снова."


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

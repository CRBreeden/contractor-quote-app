from flask import jsonify

def get_ai_summary(ticker):
    return {
        "ticker": ticker,
        "pros": ["Strong RSI", "Positive MACD crossover"],
        "cons": ["Low volume", "Earnings report soon"],
        "buy_price": 134.50,
        "sell_price": 150.00,
        "expected_return": "11.5%",
        "confidence": "High"
    }

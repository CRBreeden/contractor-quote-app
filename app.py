from flask import Flask, render_template
from app.screen import screen_tickers_from_csv

app = Flask(__name__)

@app.route('/')
def home():
    try:
        results = screen_tickers_from_csv("tickers.csv")
        results = sorted(results, key=lambda x: x["score"], reverse=True)
        buys = [r for r in results if r["signal"] == "buy"]
        sells = [r for r in results if r["signal"] == "sell"]
        return render_template("results.html", buys=buys, sells=sells)
    except Exception as e:
        return f" Error: {e}"

if __name__ == '__main__':
    app.run(debug=True)

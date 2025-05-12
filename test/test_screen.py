from app.screen import screen_tickers_from_csv

results = screen_tickers_from_csv("tickers.csv")

for r in results:
    print(f"{r['ticker']} → {r['signal']}")
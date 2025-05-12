from app.screen import screen_tickers_from_csv
import pandas as pd

# Load and screen tickers
results = screen_tickers_from_csv("tickers.csv")

if results:
    # Sort all results by score (highest to lowest)
    results = sorted(results, key=lambda x: x["score"], reverse=True)

    # Separate into buy and sell lists
    buys = [r for r in results if r["signal"] == "buy"]
    sells = [r for r in results if r["signal"] == "sell"]

    print("\n Buy Signals:")
    for stock in buys:
        print(f"{stock['ticker']:6} → BUY  (Score: {stock['score']})")

    print("\n Sell Signals:")
    for stock in sells:
        print(f"{stock['ticker']:6} → SELL (Score: {stock['score']})")

    # Save full sorted list to CSV
    output_path = "screen_results.csv"
    pd.DataFrame(results).to_csv(output_path, index=False)
    print(f"\n Results saved to {output_path}")

else:
    print("No 'buy' or 'sell' signals were found.")
    print("No results saved.")

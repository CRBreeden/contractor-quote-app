import pandas as pd
from .options import get_stock_history
from .signals import generate_signals  # assuming generate_signals is in signals.py

def load_tickers_from_csv(file_path):
    try:
        df = pd.read_csv(file_path)
        return df["ticker"].dropna().tolist()
    except Exception as e:
        print(f"Failed to load tickers: {e}")
        return []

def screen_tickers_from_csv(file_path):
    tickers = load_tickers_from_csv(file_path)
    results = []

    for ticker in tickers:
        try:
            df = get_stock_history(ticker)
            signal = generate_signals(df)
            if signal in ["buy", "sell"]:
                results.append({"ticker": ticker, "signal": signal})
        except Exception as e:
            print(f"Error with {ticker}: {e}")

    return results
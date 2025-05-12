import pandas as pd
from .options import get_stock_history
from ta.momentum import RSIIndicator
from ta.trend import MACD, SMAIndicator
from ta.trend import SMAIndicator

from ta.trend import SMAIndicator

from ta.momentum import RSIIndicator
from ta.trend import MACD, EMAIndicator
from ta.volatility import BollingerBands
from ta.volume import OnBalanceVolumeIndicator

def generate_signals(df):
    from ta.momentum import RSIIndicator
    from ta.trend import MACD, EMAIndicator
    from ta.volatility import BollingerBands
    from ta.volume import OnBalanceVolumeIndicator

    df = df.copy()
    df.dropna(inplace=True)

    # Indicators
    df["RSI"] = RSIIndicator(close=df["Close"]).rsi()
    macd = MACD(close=df["Close"])
    df["MACD"] = macd.macd()
    df["MACD_Signal"] = macd.macd_signal()

    df["EMA_9"] = EMAIndicator(close=df["Close"], window=9).ema_indicator()
    df["EMA_21"] = EMAIndicator(close=df["Close"], window=21).ema_indicator()

    bb = BollingerBands(close=df["Close"])
    df["BB_High"] = bb.bollinger_hband()
    df["BB_Low"] = bb.bollinger_lband()

    df["OBV"] = OnBalanceVolumeIndicator(close=df["Close"], volume=df["Volume"]).on_balance_volume()

    df.dropna(inplace=True)
    latest = df.iloc[-1]
    previous = df.iloc[-2]

    score = 0

    # Scoring Logic
    if latest["RSI"] < 30: score += 2
    elif latest["RSI"] < 50: score += 1
    elif latest["RSI"] > 70: score -= 1

    if previous["MACD"] < previous["MACD_Signal"] and latest["MACD"] > latest["MACD_Signal"]:
        score += 2
    elif previous["MACD"] > previous["MACD_Signal"] and latest["MACD"] < latest["MACD_Signal"]:
        score -= 2

    if previous["EMA_9"] < previous["EMA_21"] and latest["EMA_9"] > latest["EMA_21"]:
        score += 2
    elif previous["EMA_9"] > previous["EMA_21"] and latest["EMA_9"] < latest["EMA_21"]:
        score -= 2

    if latest["Close"] > latest["BB_High"]: score += 1
    elif latest["Close"] < latest["BB_Low"]: score -= 1

    if latest["OBV"] > previous["OBV"]: score += 1
    else: score -= 1

    signal = "buy" if score >= 3 else "sell" if score <= -3 else "wait"

    return {
        "signal": signal,
        "score": score,
        "RSI": latest["RSI"],
        "MACD": latest["MACD"],
        "MACD_Signal": latest["MACD_Signal"],
        "EMA_9": latest["EMA_9"],
        "EMA_21": latest["EMA_21"],
        "BB_High": latest["BB_High"],
        "BB_Low": latest["BB_Low"],
        "OBV": latest["OBV"]
    }

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
            result = generate_signals(df)  # this returns a dict: {"signal": "buy", "score": 5}

            if result["signal"] in ["buy", "sell"]:
                results.append({
                    "ticker": ticker,
                    "signal": result["signal"],
                    "score": result["score"],
                    "RSI": result["RSI"],
                    "MACD": result["MACD"],
                    "MACD_Signal": result["MACD_Signal"],
                    "EMA_9": result["EMA_9"],
                    "EMA_21": result["EMA_21"],
                    "BB_High": result["BB_High"],
                    "BB_Low": result["BB_Low"],
                    "OBV": result["OBV"]
                })


        except Exception as e:
            print(f"Error with {ticker}: {e}")

    return results
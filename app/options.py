# Fetch stock + option data using yfinance
import yfinance as yf
import pandas as pd
from datetime import date
#make logic for finding out if it is a weekend or not
today = date.today()
ticker = "AAPL"

def get_stock_history(ticker):
    stock = yf.Ticker(ticker)
    hist = stock.history(period="6mo")
    return hist

# stock1 = get_stock_history(ticker)
# stock1.to_csv("APPL")

def get_options_chain(ticker):
    stock = yf.Ticker(ticker)
    exp_date = stock.options[0]
    chain = stock.option_chain(exp_date)
    return chain.calls, chain.puts

calls, puts = get_options_chain(ticker)

calls.to_csv("calls.csv")
puts.to_csv("puts.csv")
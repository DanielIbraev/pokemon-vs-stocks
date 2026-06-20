from typing import Optional
import yfinance as yf
import pandas as pd


def get_stock_prices(ticker: str, start: str, end: str) -> Optional[pd.DataFrame]:
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(start=start, end=end, interval="1mo")
        if hist.empty:
            return None
        hist = hist.reset_index()
        hist = hist.rename(columns={"Date": "date", "Close": "price"})
        hist["date"] = pd.to_datetime(hist["date"]).dt.tz_localize(None)
        return hist[["date", "price"]]
    except Exception:
        return None


def get_earliest_date(ticker: str) -> Optional[str]:
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="max", interval="1mo")
        if hist.empty:
            return None
        return str(hist.index[0].date())
    except Exception:
        return None

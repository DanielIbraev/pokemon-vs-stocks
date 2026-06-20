from typing import Optional
import requests
import pandas as pd
from datetime import datetime


def _fetch_yahoo_chart(ticker: str, period1: int, period2: int, interval: str = "1mo") -> Optional[dict]:
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}"
    params = {
        "period1": period1,
        "period2": period2,
        "interval": interval,
        "includePrePost": "false",
    }
    headers = {"User-Agent": "Mozilla/5.0"}
    resp = requests.get(url, params=params, headers=headers, timeout=10)
    if resp.status_code != 200:
        return None
    data = resp.json()
    result = data.get("chart", {}).get("result")
    if not result:
        return None
    return result[0]


def get_stock_prices(ticker: str, start: str, end: str) -> Optional[pd.DataFrame]:
    p1 = int(datetime.strptime(start, "%Y-%m-%d").timestamp())
    p2 = int(datetime.strptime(end, "%Y-%m-%d").timestamp())
    chart = _fetch_yahoo_chart(ticker, p1, p2)
    if chart is None:
        return None

    timestamps = chart.get("timestamp", [])
    closes = chart.get("indicators", {}).get("quote", [{}])[0].get("close", [])
    if not timestamps or not closes:
        return None

    df = pd.DataFrame({
        "date": pd.to_datetime(timestamps, unit="s").normalize(),
        "price": closes,
    })
    df = df.dropna(subset=["price"])
    return df


def get_earliest_date(ticker: str) -> Optional[str]:
    now = int(datetime.now().timestamp())
    chart = _fetch_yahoo_chart(ticker, 0, now, interval="1mo")
    if chart is None:
        return None
    timestamps = chart.get("timestamp", [])
    if not timestamps:
        return None
    return datetime.utcfromtimestamp(timestamps[0]).strftime("%Y-%m-%d")

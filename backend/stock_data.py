from typing import Optional
import requests
import pandas as pd
import os
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

TWELVEDATA_KEY = os.environ.get("TWELVEDATA_API_KEY", "")


def _try_yahoo(ticker, start, end):
    try:
        url = f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}"
        params = {
            "period1": int(datetime.strptime(start, "%Y-%m-%d").timestamp()),
            "period2": int(datetime.strptime(end, "%Y-%m-%d").timestamp()),
            "interval": "1mo",
        }
        resp = requests.get(url, params=params, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
        if resp.status_code != 200:
            return None
        data = resp.json()
        result = data.get("chart", {}).get("result")
        if not result:
            return None
        timestamps = result[0].get("timestamp", [])
        closes = result[0].get("indicators", {}).get("quote", [{}])[0].get("close", [])
        if not timestamps or not closes:
            return None
        df = pd.DataFrame({
            "date": pd.to_datetime(timestamps, unit="s").normalize(),
            "price": closes,
        })
        return df.dropna(subset=["price"])
    except Exception as e:
        logger.debug(f"Yahoo failed for {ticker}: {e}")
        return None


def _try_twelvedata(ticker, start, end):
    if not TWELVEDATA_KEY:
        return None
    try:
        resp = requests.get(f"https://api.twelvedata.com/time_series", params={
            "symbol": ticker,
            "interval": "1month",
            "start_date": start,
            "end_date": end,
            "apikey": TWELVEDATA_KEY,
            "format": "JSON",
            "outputsize": 5000,
        }, timeout=15)
        if resp.status_code != 200:
            return None
        data = resp.json()
        if data.get("status") == "error" or "values" not in data:
            logger.error(f"Twelve Data error: {data.get('message', '')}")
            return None
        values = data["values"]
        df = pd.DataFrame(values)
        df["date"] = pd.to_datetime(df["datetime"])
        df["price"] = df["close"].astype(float)
        return df[["date", "price"]].sort_values("date").reset_index(drop=True)
    except Exception as e:
        logger.debug(f"Twelve Data failed for {ticker}: {e}")
        return None


def get_stock_prices(ticker: str, start: str, end: str) -> Optional[pd.DataFrame]:
    logger.info(f"Fetching {ticker} from {start} to {end}")

    df = _try_yahoo(ticker, start, end)
    if df is not None and not df.empty:
        logger.info(f"Yahoo returned {len(df)} records for {ticker}")
        return df

    df = _try_twelvedata(ticker, start, end)
    if df is not None and not df.empty:
        logger.info(f"Twelve Data returned {len(df)} records for {ticker}")
        return df

    logger.error(f"All sources failed for {ticker}")
    return None

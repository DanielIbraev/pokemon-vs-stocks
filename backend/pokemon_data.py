import pandas as pd
import numpy as np
from datetime import datetime

CHARIZARD_PRICES = [
    ("1999-01-01", 20),
    ("2000-06-01", 30),
    ("2002-01-01", 50),
    ("2004-01-01", 80),
    ("2006-01-01", 500),
    ("2008-01-01", 400),
    ("2010-01-01", 600),
    ("2012-01-01", 1000),
    ("2014-01-01", 2000),
    ("2016-01-01", 5000),
    ("2017-06-01", 8000),
    ("2019-01-01", 12000),
    ("2020-01-01", 30000),
    ("2020-10-01", 80000),
    ("2021-03-01", 420000),
    ("2021-10-01", 350000),
    ("2022-06-01", 300000),
    ("2023-01-01", 250000),
    ("2023-06-01", 220000),
    ("2024-01-01", 200000),
    ("2024-06-01", 230000),
    ("2025-01-01", 250000),
    ("2025-06-01", 260000),
]

EARLIEST_DATE = "1999-01-01"


def get_charizard_prices(start: str, end: str) -> pd.DataFrame:
    dates = [pd.Timestamp(d) for d, _ in CHARIZARD_PRICES]
    prices = [p for _, p in CHARIZARD_PRICES]

    date_range = pd.date_range(start=max(pd.Timestamp(start), pd.Timestamp(EARLIEST_DATE)),
                                end=min(pd.Timestamp(end), pd.Timestamp(CHARIZARD_PRICES[-1][0])),
                                freq="MS")

    interpolated = np.interp(
        [d.timestamp() for d in date_range],
        [d.timestamp() for d in dates],
        prices
    )

    return pd.DataFrame({"date": date_range, "price": interpolated})

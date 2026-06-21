import pandas as pd
import numpy as np

CPI_DATA = [
    ("1999-01-01", 164.3), ("2000-01-01", 168.8), ("2001-01-01", 175.1),
    ("2002-01-01", 177.1), ("2003-01-01", 181.7), ("2004-01-01", 185.2),
    ("2005-01-01", 190.7), ("2006-01-01", 198.3), ("2007-01-01", 202.4),
    ("2008-01-01", 211.1), ("2009-01-01", 211.1), ("2010-01-01", 216.7),
    ("2011-01-01", 220.2), ("2012-01-01", 226.7), ("2013-01-01", 230.3),
    ("2014-01-01", 233.9), ("2015-01-01", 233.7), ("2016-01-01", 236.9),
    ("2017-01-01", 242.8), ("2018-01-01", 247.9), ("2019-01-01", 251.2),
    ("2020-01-01", 257.9), ("2021-01-01", 261.6), ("2022-01-01", 281.1),
    ("2023-01-01", 299.2), ("2024-01-01", 308.4), ("2025-01-01", 315.5),
    ("2025-06-01", 318.0),
]


def get_cpi_series():
    dates = [pd.Timestamp(d) for d, _ in CPI_DATA]
    values = [v for _, v in CPI_DATA]
    return dates, values


def adjust_for_inflation(series, date_key="date"):
    cpi_dates, cpi_values = get_cpi_series()
    latest_cpi = cpi_values[-1]

    adjusted = []
    for point in series:
        dt = pd.Timestamp(point[date_key])
        cpi_at_date = np.interp(
            dt.timestamp(),
            [d.timestamp() for d in cpi_dates],
            cpi_values
        )
        factor = latest_cpi / cpi_at_date
        adj_point = {date_key: point[date_key]}
        for k, v in point.items():
            if k != date_key and isinstance(v, (int, float)):
                adj_point[k] = round(v * factor, 2)
        adjusted.append(adj_point)
    return adjusted

import numpy as np
import random


def run_monte_carlo(series, keys, num_simulations=500):
    if len(series) < 3:
        return None

    all_returns = {}
    for key in keys:
        values = [p[key] for p in series]
        returns = []
        for i in range(1, len(values)):
            if values[i - 1] > 0:
                returns.append(values[i] / values[i - 1])
            else:
                returns.append(1.0)
        all_returns[key] = returns

    num_periods = len(series) - 1
    results = {key: [] for key in keys}

    for _ in range(num_simulations):
        for key in keys:
            start_val = series[0][key]
            path = [start_val]
            indices = [random.randint(0, len(all_returns[key]) - 1) for _ in range(num_periods)]
            for idx in indices:
                path.append(path[-1] * all_returns[key][idx])
            results[key].append(path)

    percentiles = {}
    for key in keys:
        sims = np.array(results[key])
        percentiles[key] = {
            "p5": [round(float(v), 2) for v in np.percentile(sims, 5, axis=0)],
            "p25": [round(float(v), 2) for v in np.percentile(sims, 25, axis=0)],
            "p50": [round(float(v), 2) for v in np.percentile(sims, 50, axis=0)],
            "p75": [round(float(v), 2) for v in np.percentile(sims, 75, axis=0)],
            "p95": [round(float(v), 2) for v in np.percentile(sims, 95, axis=0)],
        }

    dates = [p["date"] for p in series]

    return {
        "dates": dates,
        "percentiles": percentiles,
    }

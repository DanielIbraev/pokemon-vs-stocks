import axios from 'axios'

export async function runBacktest({ tickers, amount, start, end, dca }) {
  const res = await axios.get('/api/backtest', {
    params: {
      tickers: tickers.join(','),
      amount,
      start,
      end,
      dca: dca || undefined,
    },
  })
  return res.data
}

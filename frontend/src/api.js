import axios from 'axios'

export async function runBacktest({ tickers, amount, start, end, dca, pokemon }) {
  const res = await axios.get('/api/backtest', {
    params: {
      tickers: tickers.join(','),
      amount,
      start,
      end,
      dca: dca || undefined,
      pokemon: pokemon || 'charizard',
    },
  })
  return res.data
}
